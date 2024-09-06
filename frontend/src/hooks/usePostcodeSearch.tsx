import { useState } from "react";

interface PostcodeData {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
  bname: string;
  buildingName: string;
  apartment: string;
  autoRoadAddress?: string;
  autoJibunAddress?: string;
}

export const usePostcodeSearch = () => {
  const [postcodeData, setPostcodeData] = useState<PostcodeData | null>(null);
  const [guideText, setGuideText] = useState<string>("");

  const loadPostcodeSearch = () => {
    new (window as any).daum.Postcode({
      oncomplete: (data: PostcodeData) => {
        const roadAddr = data.roadAddress;
        let extraRoadAddr = "";

        if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
          extraRoadAddr += data.bname;
        }
        if (data.buildingName !== "" && data.apartment === "Y") {
          extraRoadAddr +=
            extraRoadAddr !== "" ? ", " + data.buildingName : data.buildingName;
        }
        if (extraRoadAddr !== "") {
          extraRoadAddr = " (" + extraRoadAddr + ")";
        }

        setPostcodeData({
          zonecode: data.zonecode,
          roadAddress: roadAddr,
          jibunAddress: data.jibunAddress,
          bname: data.bname,
          buildingName: data.buildingName,
          apartment: data.apartment,
          autoRoadAddress: data.autoRoadAddress,
          autoJibunAddress: data.autoJibunAddress,
        });

        if (data.autoRoadAddress) {
          setGuideText(
            "(예상 도로명 주소 : " + data.autoRoadAddress + extraRoadAddr + ")"
          );
        } else if (data.autoJibunAddress) {
          setGuideText("(예상 지번 주소 : " + data.autoJibunAddress + ")");
        } else {
          setGuideText("");
        }
      },
    }).open();
  };

  return { postcodeData, guideText, loadPostcodeSearch };
};
