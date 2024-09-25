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

/*
{
	"data": {
	  "title": "Test Auction2",
	  "content": "This is a test auction description.!!!!",
	  "minBid": 20000,
	  "startTime": "2028-10-01T12:00:00",
	  "userId": 1,
	  "turtleId": 2
	},
	"images": ["경로1","경로2"]
}
  create interface for auction data
  */

export interface AuctionData {
  title: string;
  content: string;
  minBid: number;
  startTime: string;
  userId: number;
  turtleId: number;
  // images: File[];
}
