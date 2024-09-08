// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TurtleDocumentation is Ownable {
    using Counters for Counters.Counter;

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
        Counters.Counter transferCount;
        bool exists;
    }

    // 거북이 정보 (거북이 UUID => 거북이 정보)
    mapping(string => Turtle) private turtles;
    // 거북이 소유자 정보 (소유자 UUID => 거북이 UUID 배열)
    mapping(string => string[]) private ownerToTurtleIds;

    // event 모음
    event TurtleRegistered(string turtleId, string applicant);
    event TurtleMultiplication(string turtleId, string applicant, bytes32 turtleHash);
    event TurtleTransferred(string turtleId, string grantApplicant, string assignApplicant, bytes32 turtleHash);
    event TurtleDeath(string turtleId, string applicant, bytes32 turtleHash);

    // (관리자용) 거북이 추가
    function registerTurtle(string memory _turtleId, string memory _applicant) public {
        require(!turtles[_turtleId].exists, "Turtle already registered");

        Turtle storage newTurtle = turtles[_turtleId];
        newTurtle.exists = true;
        ownerToTurtleIds[_applicant].push(_turtleId);

        emit TurtleRegistered(_turtleId, _applicant);
    }

    // 거북이 인공증식 서류 등록
    function registerTutleMultiplicationDocument(
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

        bytes32 turtleHash = keccak256(abi.encodePacked(_turtleId, _applicant, block.timestamp));

        Turtle storage newTurtle = turtles[_turtleId];
        newTurtle.multiplicationDoc[turtleHash].applicant = _applicant;
        newTurtle.multiplicationDoc[turtleHash].count = _count;
        newTurtle.multiplicationDoc[turtleHash].purpose = _purpose;
        newTurtle.multiplicationDoc[turtleHash].location = _location;
        newTurtle.multiplicationDoc[turtleHash].fatherId = _fatherId;
        newTurtle.multiplicationDoc[turtleHash].motherId = _motherId;
        newTurtle.multiplicationDoc[turtleHash].locationSpecification = _locationSpecification;
        newTurtle.multiplicationDoc[turtleHash].multiplicationMethod = _multiplicationMethod;
        newTurtle.multiplicationDoc[turtleHash].shelterSpecification = _shelterSpecification;

        emit TurtleMultiplication(_turtleId, _applicant, turtleHash);

        return turtleHash;
    }

    // 거북이 인공증식 서류 조회
    function searchTutleMultiplicationDocument(string memory _turtleId, bytes32 _hash) public view returns (Multiplication memory) {
        return turtles[_turtleId].multiplicationDoc[_hash];
    }
}
