// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TurtleDocumentation is Ownable {
    using Counters for Counters.Counter;

    // 인공증식 서류
    struct Reproduction {
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
        string turtleId;
        Reproduction reproductionDoc;
        mapping(string => Transfer) transferDocs;
        Death deathDoc;
        Counters.Counter transferCount;
    }

    mapping(string => Turtle) private ownerToTurtle;
}
