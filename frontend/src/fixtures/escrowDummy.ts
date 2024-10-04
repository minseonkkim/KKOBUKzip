export const EscrowDummy = {
  status: "200",
  data: {
    data: {
      cnt: 1,
      transactions: [
        {
          transactionId: 1,
          sellerId: 1,
          sellerUUID: "testUser1234",
          sellerName: "Test User",
          turtleId: 1,
          turtleUUID: "testTurtle1",
          scientificName: "Test Turtle",
          sellerAddress: "0xE888521ddaF45D452F3734B5f1aafe651dca12AD",
          price: 100000.0,
          createDate: "2023-05-01T12:00:00",
          weight: 10.0,
          content: "이 거래는 아주 특별한 거북이에 관한 것입니다.",
          transactionTag: ["거래", "직거래"],
          transactionImage: [],
          progress: "SAIL"
        }
      ],
      current_page: 0
    },
    message: "거래 목록 조회 성공"
  }
}