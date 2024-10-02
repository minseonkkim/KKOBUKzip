import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const assignDoc = driver({
  showProgress: true,
  steps: [
    {
      element: "#container > div:nth-child(1)",
      popover: {
        title: "양수인 정보 작성",
        description: "개체를 양육하고자 하는 양수인의 정보를 입력해 주세요. '신청인 정보 불러오기' 버튼을 토글하여 현재 로그인한 신청인의 정보를 불러올 수 있습니다.",
        side: "bottom",
        align: "start"
      }
    },
    {
      element: "#container > div:nth-child(2)",
      popover: {
        title: "개체 정보 작성",
        description: "~~~~~~~~~~",
        side: "bottom",
        align: "start"
      }
    },
  ]
});