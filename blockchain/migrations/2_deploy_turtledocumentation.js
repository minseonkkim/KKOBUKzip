const TurtleDocumentaion = artifacts.require("TurtleDocumentation");

module.exports = async function (deployer) {
  // TurtleToken 배포
  await deployer.deploy();
  const turtleDocumentaionInstance = await TurtleDocumentaion.deployed();

  console.log("===========================================================");
  console.log("===========================================================");
  console.log("TurtleDocumentation deployed at address:", turtleDocumentaionInstance.address);
};