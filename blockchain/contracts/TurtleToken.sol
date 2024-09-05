// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TurtleToken is ERC20, ERC20Permit, Ownable, ReentrancyGuard {
    // - 1 ETH당 TURT 토큰 수 (18자리 소수점)
    uint256 public exchangeRate;

    // - 이벤트 정의
    // - 토큰 구매 시 발생
    event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokenAmount);
    // - 토큰 판매 시 발생
    event TokensSold(address indexed seller, uint256 tokenAmount, uint256 ethAmount);

    // - 생성자: 컨트랙트 배포 시 초기 설정
    // - 매개변수:
    //   - initialSupply: 초기 토큰 공급량
    //   - _exchangeRate: 초기 환율 설정
    constructor(uint256 initialSupply, uint256 _exchangeRate) ERC20("TurtleToken", "TURT") ERC20Permit("TurtleToken") Ownable(msg.sender) {
        _mint(address(this), initialSupply);
        exchangeRate = _exchangeRate;
    }

    // - ETH를 TURT로 환전하는 함수
    // - payable: ETH를 받을 수 있음
    // - nonReentrant: 재진입 공격 방지
    function buyTokens() public payable nonReentrant {
        require(msg.value > 0, "Must send ETH to exchange");
        // - 환전할 토큰 양 계산 (18자리 소수점 고려)
        uint256 tokenAmount = (msg.value * exchangeRate) / 1e18;
        require(balanceOf(address(this)) >= tokenAmount, "Insufficient token balance in contract");

        // - 토큰 전송
        _transfer(address(this), msg.sender, tokenAmount);
        // - 이벤트 발생
        emit TokensPurchased(msg.sender, msg.value, tokenAmount);
    }

    // - TURT를 ETH로 환전하는 함수
    // - 매개변수:
    //   - tokenAmount: 판매할 토큰 양
    function sellTokens(uint256 tokenAmount) public nonReentrant {
        require(tokenAmount > 0, "Must sell a positive amount of tokens");
        require(balanceOf(msg.sender) >= tokenAmount, "Insufficient token balance");

        // - 환전할 ETH 양 계산 (18자리 소수점 고려)
        uint256 ethAmount = (tokenAmount * 1e18) / exchangeRate;
        require(address(this).balance >= ethAmount, "Insufficient ETH balance in contract");

        // - 토큰 전송
        _transfer(msg.sender, address(this), tokenAmount);
        // - ETH 전송
        payable(msg.sender).transfer(ethAmount);

        // - 이벤트 발생
        emit TokensSold(msg.sender, tokenAmount, ethAmount);
    }

    // - 관리자용 토큰 발행 함수
    // - onlyOwner: 오직 컨트랙트 소유자만 호출 가능
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // - 환율 설정 함수 (관리자 전용)
    // - 매개변수:
    //   - newRate: 새로운 환율
    function setExchangeRate(uint256 newRate) public onlyOwner {
        exchangeRate = newRate;
    }

    // - 컨트랙트의 ETH 출금 (관리자 전용)
    function withdrawEth() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        payable(owner()).transfer(balance);
    }
}
