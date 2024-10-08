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
  scientificName: string;
  content: string;
  progress: "BEFORE_AUCTION" | "DURING_AUCTION" | "NO_BID" | "SUCCESSFUL_BID"; // 1: 경매전 2: 경매중, 유찰, 낙찰
  remainingTime: number;
  tags: string[];
  images: string[];
  turtleInfo: {
    id: number;
    gender: string;
    weight: number;
    userId: number;
    scientificName: string;
  };
  userInfo: {
    email: string;
    name: string;
    nickname: string;
    profileImage: string;
    userId: number;
  };
}

export interface AuctionData {
  title: string;
  content: string;
  minBid: number;
  startTime: string;
  userId: number;
  turtleId: number;
  // images: File[];
}

export interface AuctionListDataType {
  auctionPhotos: string[];
  auctionProgress: string;
  auctionTag: string[] | null;
  buyerId: number | null;
  content: string;
  createDate: string | null;
  endTime: string;
  auctionImage: string[];
  auctionId: number;
  lastModifiedDate: string | null;
  midBid: number;
  nowBid: number;
  sellerAddress: string;
  startTime: number;
  title: string;
  turtleId: number;
  userId: number;
  weight: number;
  scientificName: string;
  winningBid: number | null;
}