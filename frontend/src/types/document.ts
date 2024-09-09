interface TurtleData {
  turtleUUID: string;
  count: number;
  purpose?: string;
}

// 양수인 문서
export interface AssigneeDocumentDataType {
  name: string;
  phoneNumber: string;
  address: string;
}

export interface AssigneeDocData extends TurtleData {
  transferReason: string;
  assignee?: AssigneeDocumentDataType;
}

export interface AssigneeFetchData {
  docType: "양수신청서";
  applicant: string;
  detail: AssigneeDocData;
}

// 양도인 문서
export interface GrantorFetchData {
  docType: "양도신청서";
  applicant: "sadfk3ld-3b7d-8012-9bdd-2b0182lscb6d";
  detail: {
    granter: AssigneeDocumentDataType;
    turtleUUID: string;
    aquisition: string;
    motherUUID: string;
    fatherUUID: string;
  };
}

// 인공증식 문서
export interface BreedDocumentDataType {
  scientificName: "Malaclemys terrapin";
  area: string;
  count: 1;
  purpose: "연구" | "학술" | "애완" | "상업";
  registerDate: Date | null;
  motherUUID: string;
  fatherUUID: string;
  location: string;
}

export interface BreedFetchData {
  data: {
    detail: BreedDocumentDataType;
    docType: "인공증식증명서";
    applicant: string;
  };
  locationSpecification: "--사진--"; // 로직 작성하고 이미지데이터로 변경할 것
  multiplicationMethod: "--사진--"; // 로직 작성하고 이미지데이터로 변경할 것
  shelterSpecification: "--사진--"; // 로직 작성하고 이미지데이터로 변경할 것
}

// 폐사 문서
export interface DeathDocumentDataType extends TurtleData {
  shelter: string;
  deathReason: string;
  plan: string;
  registerDate: string;
}

export interface DeathFetchData {
  data: {
    detail: DeathDocumentDataType;
    docType: "폐사질병서류";
    applicant: string;
  };
  deathImage: "--사진--";
  diagnosis: "--사진--";
}

// admin document list
export interface AdminDocsListDataType {
  docType: "인공증식증명서" | "양수신고서" | "양도신고서" | "폐사질병신고서";
  scientificName: string;
  name: string;
  email: string;
  registerDate: string;
  turtleUUID: string;
  documentHash: string;
}

// 신청인 정보
export interface ApplicantInfo {
  name: string; // 성명
  nationality: string; // 국적
  phoneNumber: string; // 전화번호
  birthDate: string; // 생년월일
  email: string; // 이메일
  address: string; // 주소
}
