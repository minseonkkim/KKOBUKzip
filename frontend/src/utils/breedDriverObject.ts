import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const breedDoc = driver({
  showProgress: true,
  steps: [
    {
      element: "#breedContainer > div:nth-child(1)",
      popover: {
        title: "허가 정보",
        description: "신청인의 증식 개체가 서식할 장소에 대한 정보를 입력해 주세요.",
        side: "bottom",
        align: "start"
      }
    },
    {
      element: "#breedContainer > div:nth-child(2)",
      popover: {
        title: "개체 정보",
        description: "증식 개체의 별명과 출생일, 성별 그리고 무게를 작성해 주세요. 해당 내용을 바탕으로 \"나의 거북이\" 페이지에 정보가 등록됩니다.",
        side: "bottom",
        align: "start"
      }
    },
    {
      element: "#breedContainer > div:nth-child(3) > div > div:nth-child(1)",
      popover: {
        title: "인공증식하려는 국제적 멸종위기종 부모 개체의 고유번호",
        description: "사용자의 \"나의 거북이\"에 등록된 정보를 바탕으로 부모 개체를 조회하여 등록해 주세요.",
        side: "bottom",
        align: "start"
      }
    },
    {
      element: "#breedContainer > div:nth-child(3) > div > div:nth-child(2)",
      popover: {
        title: "인공증식 시설의 명세서",
        description: "이 서류는 ~~~~~",
        side: "bottom",
        align: "start"
      }
    },
    {
      element: "#breedContainer > div:nth-child(3) > div > div:nth-child(3)",
      popover: {
        title: "인공증식의 방법",
        description: "이 서류는 ~~~~~",
        side: "bottom",
        align: "start"
      }
    },
    {
      element: "#breedContainer > div:nth-child(3) > div > div:nth-child(4)",
      popover: {
        title: "보호시설 명세서",
        description: "이 서류는 ~~~~~",
        side: "bottom",
        align: "start"
      }
    },
  ]
});

// export const assignDoc = driver({
//   showProgress: true,
//   steps: [
//     {
//       element: "#container > div:nth-child(1)",
//       popover: {
//         title: "양수인 정보 작성",
//         description: "개체를 양육하고자 하는 양수인의 정보를 입력해 주세요. '신청인 정보 불러오기' 버튼을 토글하여 현재 로그인한 신청인의 정보를 불러올 수 있습니다.",
//         side: "bottom",
//         align: "start"
//       }
//     },
//     {
//       element: "#container > div:nth-child(2)",
//       popover: {
//         title: "개체 정보 작성",
//         description: "~~~~~~~~~~",
//         side: "bottom",
//         align: "start"
//       }
//     },
//   ]
// })