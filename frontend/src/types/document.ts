interface TurtleData {
  turtleUUID: string;
  count: number;
  purpose?: string;
}

// 양수인 문서
export interface AssignDocumentDataType {
  name: string;
  phoneNumber: string;
  address: string;
}

export interface AssigneeDocDataType extends TurtleData {
  transferReason: string;
  assignee?: AssignDocumentDataType;
}

export interface AssigneeFetchData {
  docType: "양수신청서";
  applicant: string;
  detail: AssigneeDocDataType;
}

// 양도인 문서
export interface GrantorFetchData {
  docType: "양도신청서";
  applicant: string;
  detail: {
    granter: AssignDocumentDataType; // 동일 형식
    turtleUUID: string;
    aquisition: string;
    motherUUID: string;
    fatherUUID: string;
  };
}

type purposeType = "연구" | "학술" | "애완" | "상업";

// 인공증식 문서
export interface BreedDocumentDataType {
  scientificName: "Malaclemys terrapin";
  area: string;
  count: 1;
  purpose: purposeType;
  registerDate: Date | null;
  motherUUID: string;
  fatherUUID: string;
  location: string;
  name: string;
  birth: Date | null;
  weight: number;
  gender: string;
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

export type docType =
  | "인공증식증명서"
  | "양수신고서"
  | "양도신고서"
  | "폐사질병신고서";
type AdminDocType = "인공증식증명서" | "양도양수확인서" | "폐사질병신고서";

// admin document list
export interface AdminDocsListDataType {
  docType: AdminDocType;
  scientificName: string;
  name: string;
  email: string;
  registerDate: string;
  turtleUUID: string;
  documentHash: string;
}

// 신청인 정보
export interface ApplicantInfoType {
  name: string; // 성명
  foreignFlag: boolean; // 국적
  phonenumber: string; // 전화번호
  birth: string; // 생년월일
  email: string; // 이메일
  address: string; // 주소
}

interface baseAdminDocumentType {
  docType: string;
  turtleUUID: string;
  documentHash: string;
  applicant: ApplicantInfoType;
  detail: object;
}

// 완성된 인공증식 문서 양식
export interface AdminBreedDocumentDataType extends baseAdminDocumentType {
  docType: "인공증식증명서";
  detail: {
    scientificName: "Malaclemys terrapin";
    area: string;
    count: number;
    purpose: purposeType;
    registerDate: string;
    motherUUID: string;
    motherAquisition: string;
    fatherUUID: string;
    fatherAquisition: string;
    locationSpecification: string;
    multiplicationMethod: string;
    shelterSpecification: string;
  };
}

// 완성된 양수/양도 문서 양식
export interface AdminAssignDocumentDataType extends baseAdminDocumentType {
  docType: "양도양수확인서";
  assignee: AssignDocumentDataType;
  grantor: AssignDocumentDataType;
  detail: {
    scientificName: "Malaclemys terrapin";
    count: number;
    registerDate: string;
    transferReason: string;
    aquisition: string;
    motherUUID: string;
    motherAquisition: string;
    fatherUUID: string;
    fatherAquisition: string;
  };
}

// 완성된 폐사 문서 양식
export interface AdminDeathDocumentDataType extends baseAdminDocumentType {
  docType: "폐사질병서류";
  detail: {
    scientificName: "Malaclemys terrapin";
    shelter: string;
    count: number;
    registerDate: string;
    deathReason: string;
    plan: string;
    deathImage: string;
    diagnosis: string;
  };
}
