// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./TurtleDocumentation.sol";

// TurtleEscrow 컨트랙트: ERC20 토큰을 사용한 거북이 거래 에스크로 서비스 제공
contract TurtleEscrow is Ownable, ReentrancyGuard, TurtleDocumentation {
    // 거래 상태를 나타내는 열거형
    enum State {
        Created,
        Locked,
        Released,
        Refunded
    }

    // 거래 정보를 저장하는 구조체
    struct Transaction {
        address buyer; // 구매자 주소
        address seller; // 판매자 주소
        uint256 amount; // 거래 금액
        State state; // 현재 거래 상태
        uint256 createdAt; // 거래 생성 시간
        uint256 lockPeriod; // 잠금 기간
    }

    // 거래 ID에 따른 거래 정보 매핑
    mapping(uint256 => Transaction) public transactions;
    // 총 거래 수
    uint256 public transactionCount;

    // 중재자 주소
    address public arbiter;
    // 기본 잠금 기간 (7일)
    uint256 public constant LOCK_PERIOD = 7 days;
    // 사용할 ERC20 토큰
    IERC20 public token;
    // TurtleDocumentation 컨트랙트 참조
    TurtleDocumentation public turtleDocumentation;

    // 이벤트 정의
    event TransactionCreated(uint256 indexed transactionId, address buyer, address seller, uint256 amount);
    event FundsLocked(uint256 indexed transactionId);
    event FundsReleased(uint256 indexed transactionId);
    event FundsRefunded(uint256 indexed transactionId);

    /**
     * @dev 생성자: 중재자 주소와 사용할 ERC20 토큰 주소 설정
     * @param _token 사용할 ERC20 토큰 주소
     * @param _turtleDocumentation TurtleDocumentation 컨트랙트 주소
     */
    constructor(address _token, address _turtleDocumentation) {
        token = IERC20(_token);
        turtleDocumentation = TurtleDocumentation(_turtleDocumentation);
        arbiter = turtleDocumentation.owner();
    }

    /**
     * @dev 새로운 거래 생성
     * @param _seller 판매자 주소
     * @param _amount 거래 금액
     * @return 생성된 거래 ID
     */
    // 새로운 거래 생성
    function createTransaction(address _seller, uint256 _amount) external returns (uint256) {
        // 구매자로부터 토큰 전송
        require(token.transferFrom(msg.sender, address(this), _amount), "Token transfer failed");

        uint256 transactionId = transactionCount++;
        transactions[transactionId] = Transaction({buyer: msg.sender, seller: _seller, amount: _amount, state: State.Created, createdAt: block.timestamp, lockPeriod: LOCK_PERIOD});

        emit TransactionCreated(transactionId, msg.sender, _seller, _amount);
        return transactionId;
    }

    /**
     * @dev 자금 잠금
     * @param _transactionId 거래 ID
     */
    function lockFunds(uint256 _transactionId) external {
        Transaction storage transaction = transactions[_transactionId];
        require(msg.sender == transaction.buyer, "Only buyer can lock funds");
        require(transaction.state == State.Created, "Invalid state");

        transaction.state = State.Locked;
        emit FundsLocked(_transactionId);
    }

    /**
     * @dev 자금 해제 (판매자에게 전송)
     * @param _transactionId 거래 ID
     */
    function releaseFunds(uint256 _transactionId) external nonReentrant {
        Transaction storage transaction = transactions[_transactionId];
        require(msg.sender == transaction.buyer || msg.sender == arbiter, "Unauthorized");
        require(transaction.state == State.Locked, "Invalid state");

        transaction.state = State.Released;
        require(token.transfer(transaction.seller, transaction.amount), "Token transfer failed");

        emit FundsReleased(_transactionId);
    }

    // 환불 (구매자에게 반환)
    /**
     * @dev 환불 (구매자에게 반환)
     * @param _transactionId 거래 ID
     */
    function refund(uint256 _transactionId) external nonReentrant {
        Transaction storage transaction = transactions[_transactionId];
        require(msg.sender == transaction.seller || msg.sender == arbiter, "Unauthorized");
        require(transaction.state == State.Locked, "Invalid state");
        require(block.timestamp >= transaction.createdAt + transaction.lockPeriod, "Lock period not expired");

        transaction.state = State.Refunded;
        require(token.transfer(transaction.buyer, transaction.amount), "Token transfer failed");

        emit FundsRefunded(_transactionId);
    }

    /**
     * @dev 거래 세부 정보 조회
     * @param _transactionId 거래 ID
     * @return 구매자 주소, 판매자 주소, 거래 금액, 거래 상태, 거래 생성 시간, 잠금 기간
     */
    function getTransactionDetails(uint256 _transactionId) external view returns (address, address, uint256, State, uint256, uint256) {
        Transaction storage transaction = transactions[_transactionId];
        return (transaction.buyer, transaction.seller, transaction.amount, transaction.state, transaction.createdAt, transaction.lockPeriod);
    }

    /**
     * @dev 중재자 주소 변경 (onlyOwner 제한)
     * @param _newArbiter 새로운 중재자 주소
     */
    function setArbiter(address _newArbiter) external onlyOwner {
        arbiter = _newArbiter;
    }

    /**
     * @dev 잠금 기간 업데이트
     * @param _transactionId 거래 ID
     * @param _newLockPeriod 새로운 잠금 기간
     */
    function updateLockPeriod(uint256 _transactionId, uint256 _newLockPeriod) external {
        Transaction storage transaction = transactions[_transactionId];
        require(msg.sender == transaction.buyer || msg.sender == transaction.seller, "Unauthorized");
        require(transaction.state == State.Locked, "Invalid state");
        transaction.lockPeriod = _newLockPeriod;
    }
}
