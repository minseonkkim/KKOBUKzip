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
  transactionId: number;
  sellerId: number;
  sellerName: string;
  turtleId: number;
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
