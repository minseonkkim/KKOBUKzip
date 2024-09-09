// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./TurtleDocumentation.sol";

/**
 * @title TurtleEscrow
 * @author 서규범
 * @notice 이 컨트랙트는 거북이 거래 에스크로 서비스를 제공합니다.
 */
contract TurtleEscrow is Ownable, ReentrancyGuard {
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

    // 거래 정보를 저장하는 구조체
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

    /**
     * @dev 거래 생성 이벤트
     * @param transactionId 거래 ID
     * @param buyer 구매자 주소
     * @param seller 판매자 주소
     * @param amount 거래 금액
     */
    event TransactionCreated(uint256 indexed transactionId, address buyer, address seller, uint256 amount);
    /**
     * @dev 자금 잠금 이벤트
     * @param transactionId 거래 ID
     */
    event FundsLocked(uint256 indexed transactionId);
    /**
     * @dev 자금 해제 이벤트
     * @param transactionId 거래 ID
     */
    event FundsReleased(uint256 indexed transactionId);
    /**
     * @dev 자금 환불 이벤트
     * @param transactionId 거래 ID
     */
    event FundsRefunded(uint256 indexed transactionId);

    /**
     * @dev 생성자: 중재자 주소와 사용할 ERC20 토큰 주소 설정
     * @param _token 사용할 ERC20 토큰 주소
     * @param _turtleDocumentation TurtleDocumentation 컨트랙트 주소
     */
    constructor(address _token, address _turtleDocumentation) {
        require(_token != address(0) && _turtleDocumentation != address(0), "Invalid address");
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
     * @notice CEI 패턴 적용(Checks-Effects-Interactions)
     * - Checks: 거래 상태 및 거래 조건 확인
     * - Effects: 거래 상태 업데이트
     * - Interactions: 토큰 전송
     *   => 재진입(reentrancy) 공격과 같은 보안 취약점을 방지하고 코드의 일관성을 유지하는 데 도움을 줌
     */
    function releaseFunds(uint256 _transactionId) external nonReentrant {
        Transaction storage transaction = transactions[_transactionId];
        require(msg.sender == transaction.buyer || msg.sender == arbiter, "Unauthorized");
        require(transaction.state == State.Locked, "Invalid state");

        transaction.state = State.Released;
        bool success = token.transfer(transaction.seller, transaction.amount);
        require(success, "Token transfer failed");

        emit FundsReleased(_transactionId);
    }

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
