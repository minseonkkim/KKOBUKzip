export interface AuctionItemDataType {
  id: number;
  turtleId: number | null;
  title: string;
  minBid: number;
  nowBid: number | null;
  winningBid: number | null;
  sellerId: number; // 판매자 아이디
  buyerId: number | null; //현재 입찰 회원
  startTime: Date;
  endTime: Date | null;
  content: string;
  progress: "BEFORE_AUCTION" | "DURING_AUCTION" | "NO_BID" | "SUCCESSFUL_BID"; // 1: 경매전 2: 경매중, 유찰, 낙찰
  tags: string[];
  images: string[];
  turtleInfo: {
    id: number;
    gender: string;
    weight: number;
    userId: number;
  };
}
