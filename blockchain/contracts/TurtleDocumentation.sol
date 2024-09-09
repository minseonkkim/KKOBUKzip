// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TurtleDocumentation is Ownable {
    // 인공증식 서류
    struct Multiplication {
        // 기본 정보
        string applicant;
        // 허가 정보
        uint8 count;
        string area;
        string purpose;
        string location;
        // 구비 서류
        string fatherId;
        string motherId;
        string locationSpecification;
        string multiplicationMethod;
        string shelterSpecification;
    }

    // 양도양수 서류
    struct Transfer {
        // 기본 정보
        string grantApplicant;
        string assignApplicant;
        // 양도, 양수인 정보
        string grantorId;
        string assigneeId;
        // 개체 정보
        uint8 count;
        string transferReason;
        string purpose;
        // 구비 서류
        string aquisition;
        string fatherId;
        string motherId;
    }

    // 질병,폐사 서류
    struct Death {
        // 기본 정보
        string applicant;
        // 사육 장소
        string shelter;
        // 생물 정보
        uint8 count;
        string deathReason;
        string plan;
        // 구비 서류
        string deathImage;
        string diagnosis;
    }

    struct Turtle {
        mapping(bytes32 => Multiplication) multiplicationDoc;
        mapping(bytes32 => Transfer) transferDocs;
        mapping(bytes32 => Death) deathDoc;
        bool exists;
    }

    // 거북이 정보 (거북이 UUID => 거북이 정보)
    mapping(string => Turtle) private turtles;
    // 거북이 소유자 정보 (소유자 UUID => 거북이 UUID 배열)
    mapping(string => string[]) private ownerToTurtleIds;

    // event 모음
    event TurtleRegistered(string turtleId, string applicant);
    event TurtleMultiplication(string turtleId, string applicant, bytes32 documentHash);
    event TurtleTransferred(string turtleId, string grantApplicant, string assignApplicant, bytes32 docuemntHash);
    event TurtleDeath(string turtleId, string applicant, bytes32 documentHash);

    // (관리자용) 거북이 추가
    function registerTurtle(string memory _turtleId, string memory _applicant) public onlyOwner {
        require(!turtles[_turtleId].exists, "Turtle already registered");

        Turtle storage newTurtle = turtles[_turtleId];
        newTurtle.exists = true;
        ownerToTurtleIds[_applicant].push(_turtleId);

        emit TurtleRegistered(_turtleId, _applicant);
    }

    // 거북이 인공증식 서류 등록
    function registerTurtleMultiplicationDocument(
        string memory _turtleId,
        string memory _applicant,
        uint8 _count,
        string memory _purpose,
        string memory _location,
        string memory _fatherId,
        string memory _motherId,
        string memory _locationSpecification,
        string memory _multiplicationMethod,
        string memory _shelterSpecification
    ) public returns (bytes32) {
        require(!turtles[_turtleId].exists, "Turtle already registered");

        bytes32 documentHash = keccak256(abi.encodePacked(_turtleId, _applicant, block.timestamp));

        Turtle storage newTurtle = turtles[_turtleId];
        newTurtle.multiplicationDoc[documentHash].applicant = _applicant;
        newTurtle.multiplicationDoc[documentHash].count = _count;
        newTurtle.multiplicationDoc[documentHash].purpose = _purpose;
        newTurtle.multiplicationDoc[documentHash].location = _location;
        newTurtle.multiplicationDoc[documentHash].fatherId = _fatherId;
        newTurtle.multiplicationDoc[documentHash].motherId = _motherId;
        newTurtle.multiplicationDoc[documentHash].locationSpecification = _locationSpecification;
        newTurtle.multiplicationDoc[documentHash].multiplicationMethod = _multiplicationMethod;
        newTurtle.multiplicationDoc[documentHash].shelterSpecification = _shelterSpecification;

        emit TurtleMultiplication(_turtleId, _applicant, documentHash);

        return documentHash;
    }

    // 거북이 인공증식 서류 조회
    function searchTutleMultiplicationDocument(string memory _turtleId, bytes32 _documentHash) public view returns (Multiplication memory) {
        return turtles[_turtleId].multiplicationDoc[_documentHash];
    }

    // 거북이 양수 서류 등록
    function turtleAssigneeDocument(
        string memory _turtleId,
        string memory _applicant,
        string memory _assigneeId,
        uint8 _count,
        string memory _transferReason,
        string memory purpose
    ) public returns (bytes32) {
        bytes32 documentHash = keccak256(abi.encodePacked(_turtleId, _applicant, block.timestamp));

        turtles[_turtleId].transferDocs[documentHash].assignApplicant = _applicant;
        turtles[_turtleId].transferDocs[documentHash].assigneeId = _assigneeId;
        turtles[_turtleId].transferDocs[documentHash].count = _count;
        turtles[_turtleId].transferDocs[documentHash].transferReason = _transferReason;
        turtles[_turtleId].transferDocs[documentHash].purpose = purpose;

        emit TurtleTransferred(_turtleId, _applicant, _assigneeId, documentHash);

        return documentHash;
    }

    // 거북이 양도 서류 등록
    function turtleGrantorDocument(
        string memory _turtleId,
        string memory _applicant,
        bytes32 _documentHash,
        string memory _grantorId,
        string memory _aquisition,
        string memory _fatherId,
        string memory _motherId
    ) public returns (bytes32) {
        turtles[_turtleId].transferDocs[_documentHash].grantApplicant = _applicant;
        turtles[_turtleId].transferDocs[_documentHash].grantorId = _grantorId;
        turtles[_turtleId].transferDocs[_documentHash].aquisition = _aquisition;
        turtles[_turtleId].transferDocs[_documentHash].fatherId = _fatherId;
        turtles[_turtleId].transferDocs[_documentHash].motherId = _motherId;

        emit TurtleTransferred(_turtleId, _applicant, _grantorId, _documentHash);

        return _documentHash;
    }

    // 거북이 양도양수 서류 조회
    function searchTurtleTransferDocument(string memory _turtleId, bytes32 _documentHash) public view returns (Transfer memory) {
        return turtles[_turtleId].transferDocs[_documentHash];
    }

    // 거북이 폐사질병 서류 등록
    function registerTurtlerDeathDocument(
        string memory _turtleId,
        string memory _applicant,
        string memory _shelter,
        uint8 _count,
        string memory _deathReason,
        string memory _plan,
        string memory _deathImage,
        string memory _diagnosis
    ) public returns (bytes32) {
        bytes32 documentHash = keccak256(abi.encodePacked(_turtleId, _applicant, block.timestamp));

        turtles[_turtleId].deathDoc[documentHash].applicant = _applicant;
        turtles[_turtleId].deathDoc[documentHash].shelter = _shelter;
        turtles[_turtleId].deathDoc[documentHash].count = _count;
        turtles[_turtleId].deathDoc[documentHash].deathReason = _deathReason;
        turtles[_turtleId].deathDoc[documentHash].plan = _plan;
        turtles[_turtleId].deathDoc[documentHash].deathImage = _deathImage;
        turtles[_turtleId].deathDoc[documentHash].diagnosis = _diagnosis;

        emit TurtleDeath(_turtleId, _applicant, documentHash);

        return documentHash;
    }

    // 거북이 폐사질병 서류 조회
    function searchTurtleDeathDocument(string memory _turtleId, bytes32 _documentHash) public view returns (Death memory) {
        return turtles[_turtleId].deathDoc[_documentHash];
    }
}
