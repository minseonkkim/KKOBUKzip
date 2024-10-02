// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface ITurtleDocumentation {
    function changeTurtleOwner(string memory _turtleId, string memory _oldOwner, string memory _newOwner) external;
}

using SafeERC20 for IERC20;

/**
 * @title TurtleEscrow
 * @author 서규범
 * @notice 이 컨트랙트는 거북이 거래 에스크로 서비스를 제공합니다.
 */
contract TurtleEscrow is Ownable {
    /**
     * @dev 거래 상태를 나타내는 열거형
     * @notice 거래 상태는 다음과 같이 정의됩니다.
     * - Created: 거래가 생성된 상태
     * - Locked: 거래가 잠금된 상태
     * - Released: 거래가 해제된 상태
     * - Refunded: 거래가 환불된 상태
     */
    enum State {
        Created,
        Locked,
        Released,
        Refunded
    }

    /**
     * @dev 거래 정보를 저장하는 구조체
     * @param buyer 구매자 주소
     * @param seller 판매자 주소
     * @param amount 거래 금액
     * @param state 현재 거래 상태
     * @param createdAt 거래 생성 시간
     * @param lockPeriod 잠금 기간
     */
    struct Transaction {
        string turtleId; // 거북이 ID
        string buyerId;  // 구매자 ID
        string sellerId;  // 판매자 Id
        address buyer; // 구매자 주소
        address seller; // 판매자 주소
        uint256 amount; // 거래 금액
        State state; // 현재 거래 상태
        uint256 createdAt; // 거래 생성 시간
        uint256 lockPeriod; // 잠금 기간
    }

    mapping(uint256 => Transaction) public auctionTransactions; // 경매 거래 ID에 따른 경매 거래 정보 매핑
    mapping(uint256 => Transaction) public normalTransactions; // 일반 거래 ID에 따른 일반 거래 정보 매핑

    address public arbiter; // 중재자 주소
    uint256 public constant LOCK_PERIOD = 7 days; // 기본 잠금 기간 (7일)
    IERC20 public token; // 사용할 ERC20 토큰
    ITurtleDocumentation public turtleDocumentation; // TurtleDocumentation 컨트랙트 인터페이스

    /**
     * @dev 이벤트 모음
     */
    // event TransactionCreated(uint256 indexed transactionId, address buyer, address seller, uint256 amount);
    // event FundsLocked(uint256 indexed transactionId);
    // event FundsReleased(uint256 indexed transactionId);
    // event FundsRefunded(uint256 indexed transactionId);

    /**
     * @dev 생성자: 중재자 주소와 사용할 ERC20 토큰 주소 설정
     * @param _token 사용할 ERC20 토큰 주소
     */
    constructor(address _token) {
        require(_token != address(0), "Invalid address");
        token = IERC20(_token);
        arbiter = msg.sender;
    }

     /**
     * @dev TurtleDocumentation 컨트랙트 주소 설정
     * @param _turtleDocumentationAddress TurtleDocumentation 컨트랙트 주소
     */
    function setTurtleDocumentationAddress(address _turtleDocumentationAddress) external onlyOwner {
        require(_turtleDocumentationAddress != address(0), "Invalid address");
        turtleDocumentation = ITurtleDocumentation(_turtleDocumentationAddress);
    }

    /**
     * @dev 새로운 거래 생성
     * @param _isAuction 경매 여부
     * @param _seller 판매자 주소
     * @param _amount 거래 금액
     * @return 거래 ID
     * @notice CEI 패턴 적용(Checks-Effects-Interactions)
     * - Checks: 입력 값 검증 먼저 수행
     * - Effects: 거래 정보 상태에 저장
     * - Interactions: 토큰 전송
     */
    // 새로운 거래 생성
    function createTransaction(bool _isAuction, uint256 _transactionId, address _seller, uint256 _amount, string memory _turtleId, string memory _buyerId, string memory _sellerId) external returns (bool, uint256) {
        // Check
        require(_seller != address(0), "Invalid seller address");
        require(_amount > 0, "Invalid amount! Amount must be greater than 0");
        // require(transactions[_transactionId].buyer == address(0), "Transaction ID already exists")

        // Effects
        uint256 convertedAmount = _amount * 1e18;
        if (_isAuction) {
            auctionTransactions[_transactionId] = Transaction({turtleId: _turtleId, buyerId: _buyerId, sellerId: _sellerId, buyer: msg.sender, seller: _seller, amount: convertedAmount, state: State.Created, createdAt: block.timestamp, lockPeriod: LOCK_PERIOD});
        } else {
            normalTransactions[_transactionId] = Transaction({turtleId: _turtleId, buyerId: _buyerId, sellerId: _sellerId, buyer: msg.sender, seller: _seller, amount: convertedAmount, state: State.Created, createdAt: block.timestamp, lockPeriod: LOCK_PERIOD});
        }

        // Interactions
        require(token.transferFrom(msg.sender, address(this), convertedAmount), "Token transfer failed");  // 변경 이전 코드
        // emit TransactionCreated(_transactionId, msg.sender, _seller, convertedAmount);

        lockFunds(_isAuction, _transactionId);  // 자금 잠금 동시에 진행

        return (_isAuction, _transactionId);
    }

    /**
     * @dev 자금 잠금
     * @param _isAuction 경매 여부
     * @param _transactionId 거래 ID
     */
    function lockFunds(bool _isAuction, uint256 _transactionId) internal {
        Transaction storage transaction = _isAuction ? auctionTransactions[_transactionId] : normalTransactions[_transactionId];
        require(msg.sender == transaction.buyer, "Only buyer can lock funds");
        require(transaction.state == State.Created, "Invalid state");

        transaction.state = State.Locked;
        // emit FundsLocked(_transactionId);
    }

    /**
     * @dev 자금 해제 (판매자에게 전송)
     * @param _isAuction 경매 여부
     * @param _transactionId 거래 ID
     * @return 경매 여부, 거래 ID
     * @notice CEI 패턴 적용(Checks-Effects-Interactions)
     * - Checks: 권한 및 상태 확인 수행
     * - Effects: 거래 상태 업데이트
     * - Interactions: 토큰 전송
     */
    function releaseFunds(bool _isAuction, uint256 _transactionId) external returns (bool, uint256) {
        // Checks
        Transaction storage transaction = _isAuction ? auctionTransactions[_transactionId] : normalTransactions[_transactionId];
        require(msg.sender == transaction.buyer || msg.sender == arbiter, "Unauthorized");
        require(transaction.state == State.Locked, "Invalid state");

        // Effects
        transaction.state = State.Released;

        // Interactions
        bool success = token.transfer(transaction.seller, transaction.amount);
        require(success, "Token transfer failed");

        // emit FundsReleased(_transactionId);

        // Call changeTurtleOwner function of TurtleDocumentation contract
        turtleDocumentation.changeTurtleOwner(transaction.turtleId, transaction.sellerId, transaction.buyerId);

        return (_isAuction, _transactionId);
    }

    /**
     * @dev 환불 (구매자에게 반환)
     * @param _isAuction 경매 여부
     * @param _transactionId 거래 ID
     * @return 경매 여부, 거래 ID
     * @notice CEI 패턴 적용(Checks-Effects-Interactions)
     * - Checks: 권한, 상태, 잠금 기간 확인 수행
     * - Effects: 거래 상태 업데이트
     * - Interactions: 토큰 전송
     */
    function refund(bool _isAuction, uint256 _transactionId) external returns (bool, uint256) {
        // Checks
        Transaction storage transaction = _isAuction ? auctionTransactions[_transactionId] : normalTransactions[_transactionId];
        require(msg.sender == transaction.seller || msg.sender == arbiter, "Unauthorized");
        require(transaction.state == State.Locked, "Invalid state");
        require(block.timestamp >= transaction.createdAt + transaction.lockPeriod || msg.sender == arbiter, "Lock period not expired");

        // Effects
        transaction.state = State.Refunded;

        // Interactions
        require(token.transfer(transaction.buyer, transaction.amount), "Token transfer failed");

        // emit FundsRefunded(_transactionId);
        return (_isAuction, _transactionId);
    }

    /**
     * @dev 거래 세부 정보 조회
     * @param _isAuction 경매 여부
     * @param _transactionId 거래 ID
     * @return 구매자 주소, 판매자 주소, 거래 금액, 거래 상태, 거래 생성 시간, 잠금 기간, 거북이 ID
     */
    function getTransactionDetails(bool _isAuction, uint256 _transactionId) external view returns (address, address, uint256, State, uint256, uint256) {
        Transaction memory transaction = _isAuction ? auctionTransactions[_transactionId] : normalTransactions[_transactionId];
        return (transaction.buyer, transaction.seller, transaction.amount, transaction.state, transaction.createdAt, transaction.lockPeriod);
    }

    /**
     * @dev 중재자 주소 변경
     * @param _newArbiter 새로운 중재자 주소
     */
    function setArbiter(address _newArbiter) external onlyOwner {
        arbiter = _newArbiter;
    }

    /**
     * @dev 잠금 기간 업데이트
     * @param _isAuction 경매 여부
     * @param _transactionId 거래 ID
     * @param _newLockPeriod 새로운 잠금 기간
     * @return 경매 여부, 거래 ID
     */
    function updateLockPeriod(bool _isAuction, uint256 _transactionId, uint256 _newLockPeriod) external returns (bool, uint256) {

        Transaction storage transaction = _isAuction ? auctionTransactions[_transactionId] : normalTransactions[_transactionId];
        require(msg.sender == arbiter, "Only arbiter can update lock period");
        transaction.lockPeriod = _newLockPeriod;

        return (_isAuction, _transactionId);
    }
}
