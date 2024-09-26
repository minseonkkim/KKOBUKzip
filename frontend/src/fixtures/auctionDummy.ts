import { AuctionItemDataType } from "../types/auction";

export const AuctionResponseDummuy = {
  status: "200",
  data: {
    auction: {
      id: 1,
      turtleId: 2,
      title: "페닐슐라쿠터",
      minBid: 20000.0,
      nowBid: null,
      winningBid: null,
      sellerId: 1,
      buyerId: null,
      startTime: new Date("2028-10-01T12:00:00"),
      endTime: null,
      content: `이 붉은귀거북은 활발하고 건강한 상태로, 밝고 선명한
          붉은색 귀 무늬가 특징입니다. 현재까지 특별한 질병 없이 건강하게
          자라왔으며, 균형 잡힌 사료와 신선한 채소로 영양 관리가 잘 되어
          있습니다. 특히 수영을 좋아하며, 물속에서의 활동이 활발해 관찰하는
          재미가 큽니다. 이 거북이는 비교적 온순한 성격을 가지고 있어 손을 자주
          타지는 않지만, 스트레스를 주지 않는 선에서 손길을 허용하는 편입니다.
          호기심이 많아 주변 환경에 대한 관심을 보이는 등, 관상용으로도 매력적인
          개체입니다. This is a test auction description.!!!!`,
      progress: "BEFORE_AUCTION" as
        | "BEFORE_AUCTION"
        | "DURING_AUCTION"
        | "NO_BID"
        | "SUCCESSFUL_BID",
      tags: ["암컷", "베이비"],
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
