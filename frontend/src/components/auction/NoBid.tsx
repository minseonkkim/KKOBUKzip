import React, { useState, useEffect } from "react";
import NoImageColor from "../../assets/no_image_color.webp";

function NoBid() {

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {

  }, []);

  return (
    <div className="w-[48%] h-[675px] bg-[#EAF5DD] rounded-[20px] flex flex-col justify-start items-center">
     <div className="flex flex-col items-center justify-center h-full">
          <img src={NoImageColor} className="w-[190px] h-[190px] object-cover" draggable="false" alt="turtle image"/>
          <div className="font-bold text-[31px] text-center mt-[48px]">
            이번 경매는 유찰되었습니다. <br/>다음 기회를 노려보세요!
        </div>
        </div>
    </div>
  );
}

export default NoBid;
