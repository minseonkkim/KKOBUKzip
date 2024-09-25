import { AuctionItemDataType } from "../types/auction";

export const AuctionResponseDummuy = {
  status: "200",
  data: {
    auction: {
      id: 1,
      turtleId: 2,
      title: "Test Auction2",
      minBid: 20000.0,
      nowBid: null,
      winningBid: null,
      sellerId: 1,
      buyerId: null,
      startTime: new Date("2028-10-01T12:00:00"),
      endTime: null,
      content: "This is a test auction description.!!!!",
      progress: "BEFORE_AUCTION" as
        | "BEFORE_AUCTION"
        | "DURING_AUCTION"
        | "NO_BID"
        | "SUCCESSFUL_BID",
      tags: [],
      images: [
        "https://cdn.newspenguin.com/news/photo/202305/14170_44246_307.jpg",
        "https://cdn.thereport.co.kr/news/photo/201904/355_266_4155.jpg",
      ],
      turtleInfo: {
        id: 1,
        gender: "FEMALE",
        weight: 12.5,
        userId: 1,
      },
    },
  },
  message: "경매 조회에 성공했습니다",
};
