import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const grantDoc = driver({
  showProgress: true,
  steps: [
    {
      element: "#grantContainer > div:nth-child(1)",
      popover: {
        title: "양도인 정보 작성",
        description: "개체를 판매하고자 하는 양도인의 정보를 입력해 주세요. '신청인 정보 불러오기' 버튼을 토글하여 현재 로그인한 신청인의 정보를 불러올 수 있습니다.",
        side: "bottom",
        align: "start"
      }
    },
    {
      element: "#grantContainer > div:nth-child(2)",
      popover: {
        title: "양수인 정보 확인",
        description: "~~~~~~~~~~",
        side: "bottom",
        align: "start"
      }
    },
    {
      element: "#grantContainer > div:nth-child(3)",
      popover: {
        title: "개체 정보 확인",
        description: "~~~~~~~~~~",
        side: "bottom",
        align: "start"
      }
    },
    {
      element: "#grantContainer > div:nth-child(4)",
      popover: {
        title: "구비 서류 작성",
        description: "~~~~~~~~~~",
        side: "bottom",
        align: "start"
      }
    },
  ]
});