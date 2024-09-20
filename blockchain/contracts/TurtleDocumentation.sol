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
        bytes32 beforeDocumentHash;
        bytes32 currentDocumentHash;
        bool exists;
    }

    // 거북이 정보 (거북이 UUID => 거북이 정보)
    mapping(string => Turtle) private turtles;
    // 거북이 소유자 정보 (소유자 UUID => 거북이 UUID 배열)
    mapping(string => string[]) private ownerToTurtleIds;

    // event 모음
    event TurtleRegistered(string indexed turtleId, string indexed applicant);
    event TurtleMultiplication(string indexed turtleId, string indexed applicant, bytes32 indexed documentHash);
    event TurtleTransferred(string indexed turtleId, string grantApplicant, string assignApplicant, bytes32 indexed documentHash);
    event TurtleDeath(string indexed turtleId, string indexed applicant, bytes32 indexed documentHash);
    event TurtleOwnerChanged(string indexed turtleId, string indexed oldOwner, string indexed newOwner);
    event CurrentTurtleDocument(string indexed turtleId, bytes32 indexed documentHash);

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
        bytes32 _documentHash,
        uint8 _count,
        string memory _area,
        string memory _purpose,
        string memory _location,
        string memory _fatherId,
        string memory _motherId,
        string memory _locationSpecification,
        string memory _multiplicationMethod,
        string memory _shelterSpecification
    ) public returns (bytes32) {
        require(!turtles[_turtleId].exists, "Turtle already registered");
        if (!turtles[_turtleId].exists) {
            Turtle storage newTurtle = turtles[_turtleId];
            newTurtle.multiplicationDoc[_documentHash].applicant = _applicant;
            newTurtle.multiplicationDoc[_documentHash].count = _count;
            newTurtle.multiplicationDoc[_documentHash].area = _area;
            newTurtle.multiplicationDoc[_documentHash].purpose = _purpose;
            newTurtle.multiplicationDoc[_documentHash].location = _location;
            newTurtle.multiplicationDoc[_documentHash].fatherId = _fatherId;
            newTurtle.multiplicationDoc[_documentHash].motherId = _motherId;
            newTurtle.multiplicationDoc[_documentHash].locationSpecification = _locationSpecification;
            newTurtle.multiplicationDoc[_documentHash].multiplicationMethod = _multiplicationMethod;
            newTurtle.multiplicationDoc[_documentHash].shelterSpecification = _shelterSpecification;
        } else {
            turtles[_turtleId].multiplicationDoc[_documentHash].applicant = _applicant;
            turtles[_turtleId].multiplicationDoc[_documentHash].count = _count;
            turtles[_turtleId].multiplicationDoc[_documentHash].area = _area;
            turtles[_turtleId].multiplicationDoc[_documentHash].purpose = _purpose;
            turtles[_turtleId].multiplicationDoc[_documentHash].location = _location;
            turtles[_turtleId].multiplicationDoc[_documentHash].fatherId = _fatherId;
            turtles[_turtleId].multiplicationDoc[_documentHash].motherId = _motherId;
            turtles[_turtleId].multiplicationDoc[_documentHash].locationSpecification = _locationSpecification;
            turtles[_turtleId].multiplicationDoc[_documentHash].multiplicationMethod = _multiplicationMethod;
            turtles[_turtleId].multiplicationDoc[_documentHash].shelterSpecification = _shelterSpecification;
        }
        emit TurtleMultiplication(_turtleId, _applicant, _documentHash);

        return _documentHash;
    }

    // 거북이 인공증식 서류 조회
    function searchTutleMultiplicationDocument(string memory _turtleId, bytes32 _documentHash) public view returns (Multiplication memory) {
        return turtles[_turtleId].multiplicationDoc[_documentHash];
    }

    // 거북이 양수 서류 등록
    function registerTurtleAssigneeDocument(
        string memory _turtleId,
        string memory _applicant,
        bytes32 _documentHash,
        string memory _assigneeId,
        uint8 _count,
        string memory _transferReason,
        string memory _purpose
    ) public returns (bytes32) {
        turtles[_turtleId].transferDocs[_documentHash].assignApplicant = _applicant;
        turtles[_turtleId].transferDocs[_documentHash].assigneeId = _assigneeId;
        turtles[_turtleId].transferDocs[_documentHash].count = _count;
        turtles[_turtleId].transferDocs[_documentHash].transferReason = _transferReason;
        turtles[_turtleId].transferDocs[_documentHash].purpose = _purpose;

        emit TurtleTransferred(_turtleId, _applicant, _assigneeId, _documentHash);

        return _documentHash;
    }

    // 거북이 양도 서류 등록
    function registerTurtleGrantorDocument(
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
    function registerTurtleDeathDocument(
        string memory _turtleId,
        string memory _applicant,
        bytes32 _documentHash,
        string memory _shelter,
        uint8 _count,
        string memory _deathReason,
        string memory _plan,
        string memory _deathImage,
        string memory _diagnosis
    ) public returns (bytes32) {
        turtles[_turtleId].deathDoc[_documentHash].applicant = _applicant;
        turtles[_turtleId].deathDoc[_documentHash].shelter = _shelter;
        turtles[_turtleId].deathDoc[_documentHash].count = _count;
        turtles[_turtleId].deathDoc[_documentHash].deathReason = _deathReason;
        turtles[_turtleId].deathDoc[_documentHash].plan = _plan;
        turtles[_turtleId].deathDoc[_documentHash].deathImage = _deathImage;
        turtles[_turtleId].deathDoc[_documentHash].diagnosis = _diagnosis;

        emit TurtleDeath(_turtleId, _applicant, _documentHash);

        return _documentHash;
    }

    // 거북이 폐사질병 서류 조회
    function searchTurtleDeathDocument(string memory _turtleId, bytes32 _documentHash) public view returns (Death memory) {
        return turtles[_turtleId].deathDoc[_documentHash];
    }

    // 거북이 소유자 변경
    function changeTurtleOwner(string memory _turtleId, string memory _oldOwner, string memory _newOwner) public {
        require(turtles[_turtleId].exists, "Turtle does not exist");
        require(ownerToTurtleIds[_oldOwner].length > 0, "Old owner does not own any turtles");

        // 이전 소유자가 소유한 거북이 중 해당 거북이가 있는지 확인
        bool found = false;
        for (uint256 i = 0; i < ownerToTurtleIds[_oldOwner].length; i++) {
            if (keccak256(abi.encodePacked(ownerToTurtleIds[_oldOwner][i])) == keccak256(abi.encodePacked(_turtleId))) {
                found = true;
                break;
            }
        }
        require(found, "Old owner does not own this turtle");

        // 이전 소유자가 소유한 거북이 배열에서 해당 거북이 제거
        string[] storage oldOwnerTurtles = ownerToTurtleIds[_oldOwner];
        for (uint256 i = 0; i < oldOwnerTurtles.length; i++) {
            if (keccak256(abi.encodePacked(oldOwnerTurtles[i])) == keccak256(abi.encodePacked(_turtleId))) {
                oldOwnerTurtles[i] = oldOwnerTurtles[oldOwnerTurtles.length - 1];
                oldOwnerTurtles.pop();
            }
        }

        // 새로운 소유자가 소유한 거북이 배열에 해당 거북이 추가
        ownerToTurtleIds[_newOwner].push(_turtleId);

        emit TurtleOwnerChanged(_turtleId, _oldOwner, _newOwner);
    }

    // 서류 검수자 함수 영역
    // 인공증식 서류 승인
    function approveMultiplicationDocByReviewer(string memory _turtleId, bytes32 _documentHash) public returns (bytes32) {
        turtles[_turtleId].beforeDocumentHash = _documentHash;
        turtles[_turtleId].currentDocumentHash = _documentHash;

        return _documentHash;
    }

    // 양도양수 서류 승인
    function approveTransferDocByReviewer(string memory _turtleId, bytes32 _documentHash) public returns (bytes32) {
        turtles[_turtleId].beforeDocumentHash = turtles[_turtleId].currentDocumentHash;
        turtles[_turtleId].currentDocumentHash = _documentHash;

        return _documentHash;
    }

    // 가장 최근 서류 조회(양도 및 양수 기록이 없는 경우에는 인공증식 서류 해시값 반환)
    function searchCurrentDocumentHash(string memory _turtleId) public view returns (bytes32) {
        return turtles[_turtleId].currentDocumentHash;
    }
}
