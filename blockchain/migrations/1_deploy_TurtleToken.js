const TurtleToken = artifacts.require("TurtleToken");

module.exports = async function (deployer) {
  // web3.utils.toWei를 사용하여 큰 숫자 처리
  const initialSupply = web3.utils.toWei("1000000000", "ether"); // 1,000,000,000 TURT (18자리 소수점 사용)
  const exchangeRate = web3.utils.toWei("5000000", "ether"); // 5,000,000 TURT / 1 ETH

  // TurtleToken 배포
  await deployer.deploy(TurtleToken, initialSupply, exchangeRate);
  const turtleTokenInstance = await TurtleToken.deployed();

  console.log("===========================================================");
  console.log("===========================================================");
  console.log("TurtleToken deployed at address:", turtleTokenInstance.address);
};
