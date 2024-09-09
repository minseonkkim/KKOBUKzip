import { ApplicantInfo } from "../types/document";

// 유저 더미데이터
export const applicant: ApplicantInfo = {
  name: "김싸피",
  nationality: "내국인",
  phoneNumber: "010-3333-3333",
  birthDate: "2024-01-02",
  email: "ssafy@ssafy.com",
  address: "광주광역시 하남산단6번로 107",
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
