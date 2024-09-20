// {
//   transactionId: 1,
//   category: "turtle",
//   title: "멋진 거북이 분양합니다.",
//   thumbnail: "http://dkfdsfsd",
//   turtle: {
//     turtleId: 1,
//     scientific_name: "페닐슐라쿠터",
//   },
//   seller: {
//     sellerId: 1,
//     sellerName: "김거북주인",
//   },
//   price: 10000,
//   createDate: "2024-09-03",
//   transaction_tag: ["암컷", "성체", "경매", "직거래"],
//   progress: "거래가능",
// };

export interface TransactionItemDataType {
  transactionId: number;
  category: string;
  title: string;
  thumbnail: string;
  turtle: {
    turtleId: number;
    scientific_name: string;
  };
  seller: {
    sellerId: number;
    sellerName: string;
  };
  price: number;
  createDate: string;
  transaction_tag: string[];
  progress: string;
}
