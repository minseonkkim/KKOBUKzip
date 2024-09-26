const TurtleEscrow = artifacts.require("TurtleEscrow");
require('dotenv').config()

module.exports = async function (deployer) {
  // TurtleEscrow 배포
  await deployer.deploy(process.env.TURTLE_TOKEN_ADDRESS);
  const turtleEscrowInstance = await TurtleEscrow.deployed();

  console.log("===========================================================");
  console.log("===========================================================");
  console.log("TurtleEscrow deployed at address:", turtleEscrowInstance.address);
};
