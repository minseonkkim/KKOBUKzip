export interface AuctionItemDataType {
  id: number;
  turtle_id: number;
  title: string;
  min_bid: number;
  winning_bid: number;
  buyer_id: number; //현재 입찰 회원
  start_time: Date;
  content: string;
  progress: number; // 1: 경매전 2: 경매중, 유찰, 낙찰
  end_time: Date;
  tags: string[];
  images: string[];
}
