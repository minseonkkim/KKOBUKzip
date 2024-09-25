const TurtleDocumentation = artifacts.require("TurtleDocumentation");
const truffleAssert = require("truffle-assertions");

contract("TurtleDocumentation", (accounts) => {
  const owner = accounts[0];
  const applicant = accounts[1];
  const turtleId = "turtle-003";

  // 배포된 계약 주소를 입력합니다. (Ganache에서 배포된 주소)
  const deployedAddress = "0x275b279353A759A660503aD6292be0D6746E9B3b"; // 실제 배포된 계약 주소로 변경하세요.

  let turtleDocInstance;

  before(async () => {
    // 이미 배포된 계약 인스턴스를 불러옵니다.
    turtleDocInstance = await TurtleDocumentation.at(deployedAddress);
  });

  it("should register a multiplication document", async () => {
    // 거북이를 등록한 후, 인공증식 서류를 등록합니다.
    // await turtleDocInstance.registerTurtle(turtleId, applicant, { from: owner });

    console.log("11111111111111111111111111111111111111111111");

    // 인공증식 서류 등록
    const tx = await turtleDocInstance.registerTurtleMultiplicationDocument(
      turtleId,
      applicant,
      5, // 개체 수
      "Area A", // 지역
      "Research", // 목적
      "Location A", // 위치
      "turtle-001", // 아버지 ID
      "turtle-002", // 어머니 ID
      "Location Specification", // 위치 명세
      "Method A", // 증식 방법
      "Shelter Specification", // 보호소 명세
      { from: applicant }
    );

    console.log("22222222222222222222222222222222222222222222");

    // 이벤트가 발생했는지 확인하고 출력합니다.
    truffleAssert.eventEmitted(tx, "TurtleMultiplication", (ev) => {
      console.log("TurtleMultiplication Event:", ev);
      return ev.turtleId === turtleId && ev.applicant === applicant;
    });

    // 추가로 서류 데이터가 제대로 저장되었는지 확인할 수 있습니다.
    const documentHash = web3.utils.keccak256(turtleId + applicant);
    const multiplicationDoc = await turtleDocInstance.searchTutleMultiplicationDocument(turtleId, documentHash);

    // 저장된 데이터를 검증합니다.
    assert.equal(multiplicationDoc.applicant, applicant, "Applicant should be correctly recorded.");
    assert.equal(multiplicationDoc.count, 5, "Count should be correctly recorded.");
    assert.equal(multiplicationDoc.area, "Area A", "Area should be correctly recorded.");
  });
});
