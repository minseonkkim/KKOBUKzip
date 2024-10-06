import {
  ApplicantInfoType,
  AdminBreedDocumentDataType,
  AdminAssignDocumentDataType,
  AdminDeathDocumentDataType,
} from "../types/document";

// 유저 더미데이터
export const applicant: ApplicantInfoType = {
  name: "김싸피",
  foreignFlag: true,
  phonenumber: "010-3333-3333",
  birth: "2024-01-02",
  email: "ssafy@ssafy.com",
  address: "광주광역시 하남산단6번로 107",
  detailedAddress: "광주광역시 하남산단6번로 107",
};

// admin - 서류 조회 더미데이터
const documents = [
  {
    docType: "인공증식증명서",
    scientificName: "Malaclemys terrapin",
    name: "김싸피",
    email: "ssafy@ssafy.com",
    registerDate: "2024-08-20",
    turtleUUID: "e4eaaaf2-d142-11e1-b3e4-080027620cdd",
    documentHash: "0x1231824910237124",
  },
  {
    docType: "양도양수확인서",
    scientificName: "Malaclemys terrapin",
    name: "김싸피",
    email: "ssafy@ssafy.com",
    registerDate: "2024-08-20",
    turtleUUID: "d271c7d8-3f7b-4d4e-8a9e-d60f896b84cb",
    documentHash: "0x1231824910237124",
  },
  {
    docType: "폐사질병신고서",
    scientificName: "Malaclemys terrapin",
    name: "김싸피",
    email: "ssafy@ssafy.com",
    registerDate: "2024-08-20",
    turtleUUID: "e7c5d4e4-2b55-4d4f-8d53-7d98c6c2a30a",
    documentHash: "0x1231824910237124",
  },
];

export const generateRandomData = (n: number) => {
  const randomData = [];
  for (let i = 0; i < n; i++) {
    const randomItem = documents[Math.floor(Math.random() * documents.length)];
    randomData.push({ ...randomItem, turtleUUID: crypto.randomUUID() });
  }
  return randomData;
};

// 관리자가 조회한 인공증식증명서 데이터
export const adminBreedResultdata: AdminBreedDocumentDataType = {
  docType: "인공증식증명서",
  turtleUUID: "e4eaaaf2-d142-11e1-b3e4-080027620cdd",
  documentHash: "0x1231824910237124",
  applicant: {
    name: "김싸피",
    foreignFlag: true,
    phonenumber: "010-1234-5678",
    email: "ssafy@ssafy.com",
    birth: "2000-01-01",
    address: "광주광역시 하남산단로6 133",
    detailedAddress: "광주광역시 하남산단6번로 107",
  },
  detail: {
    scientificName: "Malaclemys terrapin",
    area: "150X60X80",
    count: 1,
    purpose: "연구",
    registerDate: "2024-08-20",
    motherUUID: "d271c7d8-3f7b-4d4e-8a9e-d60f896b84cb",
    motherAquisition: "0x123469451035610",
    fatherUUID: "e7c5d4e4-2b55-4d4f-8d53-7d98c6c2a30a",
    fatherAquisition: "0x1231824910237124",
    locationSpecification: "--S3주소--",
    multiplicationMethod: "--S3주소--",
    shelterSpecification: "--S3주소--",
  },
};

// 관리자가 조회한 양도양수확인서 데이터
export const adminAssignGrantData: AdminAssignDocumentDataType = {
  docType: "양도양수확인서",
  turtleUUID: "e4eaaaf2-d142-11e1-b3e4-080027620cdd",
  documentHash: "0x1231824910237124",
  applicant: {
    name: "김싸피",
    foreignFlag: true,
    phonenumber: "010-1234-5678",
    email: "ssafy@ssafy.com",
    birth: "2000-01-01",
    address: "광주광역시 하남산단로6 133",
    detailedAddress: "광주광역시 하남산단6번로 107",
  },
  assignee: {
    name: "김싸피",
    phoneNumber: "010-1234-5678",
    address: "광주광역시 하남산단로6 133",
  },
  grantor: {
    name: "김거북",
    phoneNumber: "010-1111-1111",
    address: "광주광역시 광산구 장신로 98",
  },
  detail: {
    scientificName: "Malaclemys terrapin",
    count: 1,
    registerDate: "2024-08-20",
    transferReason: "개인거래",
    aquisition: "0x1238801732341294",
    motherUUID: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    motherAquisition: "0x123469451035610",
    fatherUUID: "sadfk3ld-3b7d-8012-9bdd-2b0182lscb6d",
    fatherAquisition: "0x1231824910237124",
  },
};

// 관리자가 조회한 폐사질병서류 데이터
export const adminDeathData: AdminDeathDocumentDataType = {
  docType: "폐사질병서류",
  turtleUUID: "e4eaaaf2-d142-11e1-b3e4-080027620cdd",
  documentHash: "0x1231824910237124",
  applicant: {
    name: "김싸피",
    foreignFlag: true,
    phonenumber: "010-1234-5678",
    email: "ssafy@ssafy.com",
    birth: "2000-01-01",
    address: "광주광역시 하남산단로6 133",
    detailedAddress: "광주광역시 하남산단6번로 107",
  },
  detail: {
    scientificName: "Malaclemys terrapin",
    shelter: "집안",
    count: 1,
    registerDate: "2024-08-20",
    deathReason: "자연사",
    plan: "연구기증",
    deathImage: "--S3주소--",
    diagnosis: "--S3주소--",
  },
};
