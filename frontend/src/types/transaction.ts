// {
//   transactionId: 3,
//   sellerId: 1,
//   sellerName: "Test User",
//   turtleId: 1,
//   scientificName: "Test Turtle",
//   sellerAddress: "djfiomaocpeidkgd",
//   price: 150.0,
//   createDate: "2024-09-26T15:32:56",
//   weight: 10.0,
//   content: "이 거래는 아주 특별한 거북이에 관한 것입니다.",
//   transactionTag: [],
//   transactionImage: [],
//   progress: "SAIL",
// }

export interface TransactionItemDataType {
  auctionFlag: boolean;
  title: string;
  transactionId: number;
  documentHash: string | null;
  sellerId: number;
  sellerUuid: string;
  sellerName: string;
  turtleId: number;
  turtleUuid: string;
  scientificName: string;
  sellerAddress: string;
  price: number;
  createDate: string;
  weight: number;
  content: string;
  transactionTag: string[];
  transactionImage: string[];
  progress: string;
}

//  turtle : {
//   transactionId: 16,
//   sellerId: 1,
//   sellerName: "Test User",
//   turtleId: 1,
//   scientificName: "Test Turtle",
//   price: 150.0,
//   createDate: "2024-09-27T11:54:16.577634",
//   weight: 10,
//   content: "이 거래는 아주 특별한 거북이에 관한 것입니다.",
//   transactionTag: ["거북이", "애완동물", "특별한 거래"],
//   transactionImage: [
//     "https://s11p21c107-ssafy-special-project.s3.amazonaws.com/transaction/481ed7de-c95e-4be3-8e6e-41a0498fd082_%EC%97%90%ED%9C%B4.png",
//     "https://s11p21c107-ssafy-special-project.s3.amazonaws.com/transaction/e59a528a-b6a9-4d8d-8f9b-95444ba0ace8_Theme%3D3D.png",
//   ],
//   progress: "COMPLETED",
// };

export interface TransactionItemDetailType {
  title: string;
  transactionId: number;
  sellerId: number;
  sellerUuid: string;
  sellerName: string;
  sellerAddress: string;
  sellerNickname: string;
  sellerImageUrl: string;
  turtleId: number;
  turtleUuid: string;
  scientificName: string;
  price: number;
  createDate: string;
  weight: number;
  content: string;
  transactionTag: string[];
  transactionImage: string[];
  progress: string;
}
