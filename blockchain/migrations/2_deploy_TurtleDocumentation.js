const TurtleDocumentation = artifacts.require("TurtleDocumentation");

module.exports = async function (deployer) {
  await deployer.deploy(TurtleDocumentation);
  const turtleDocumentaionInstance = await TurtleDocumentation.deployed();

  console.log("===========================================================");
  console.log("===========================================================");
  console.log("TurtleDocumentation deployed at address:", turtleDocumentaionInstance.address);
};
