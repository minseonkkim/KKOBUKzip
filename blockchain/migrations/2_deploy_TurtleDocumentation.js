const TurtleDocumentation = artifacts.require("TurtleDocumentation");

module.exports = async function (deployer) {
  // web3.utils.toWei를 사용하여 큰 숫자 처리
  const initialSupply = web3.utils.toWei("1000000000", "ether"); // 1,000,000,000 TURT (18자리 소수점 사용)
  const exchangeRate = web3.utils.toWei("3000000", "ether"); // 3,000,000 TURT / 1 ETH

  await deployer.deploy(TurtleDocumentation, initialSupply, exchangeRate);
  const turtleTokenInstance = await TurtleDocumentation.deployed();

  console.log("===========================================================");
  console.log("===========================================================");
  console.log("TurtleToken deployed at address:", turtleTokenInstance.address);
};
