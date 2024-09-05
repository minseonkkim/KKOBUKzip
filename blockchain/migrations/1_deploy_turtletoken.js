const TurtleToken = artifacts.require("TurtleToken");

module.exports = async function (deployer) {
  await deployer.deploy(TurtleToken, 1000000, 1000); // 두 번째 인자: initialSupply, 세 번째 인자: _exchangeRate
  const turtleTokenInstance = await TurtleToken.deployed();

  console.log("===========================================================");
  console.log("===========================================================");
  console.log("TurtleToken deployed at address:", turtleTokenInstance.address);
};
