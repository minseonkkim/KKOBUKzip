import React, { useState, useEffect } from "react";

function NoBid() {
  const messages = [
    "거북이의 역량과 잠재력에도 불구하고,",
    "아쉽게도 이번 경매건은 유찰되었습니다.",
    "귀 거북이의 건승을 기원합니다.",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false); // 텍스트 사라지기
      setTimeout(() => {
        setCurrentMessageIndex(
          (prevIndex) => (prevIndex + 1) % messages.length
        );
        setFadeIn(true); // 텍스트 나타나기
      }, 800); // 사라지는 시간과 일치
    }, 4000); // 4초마다 메시지 변경

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[48%] h-[675px] bg-gradient-to-r from-[#EAF5DD] to-[#D1EFD1] rounded-[20px] flex flex-col justify-center items-center shadow-xl p-8 transition-transform transform hover:scale-105 active:scale-95">
      <style>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes fade-out {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .fade-in {
          animation: fade-in 0.8s ease-in-out;
        }

        .fade-out {
          animation: fade-out 0.8s ease-in-out;
        }

        .text-shadow {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
      `}</style>
      <div className="text-center">
        <h2
          className={`text-3xl font-bold mb-4 ${
            fadeIn ? "fade-in" : "fade-out"
          } text-[#FF6347] text-shadow`}
        >
          {messages[0]}
        </h2>
        <p
          className={`text-xl mb-4 ${
            fadeIn ? "fade-in" : "fade-out"
          } text-[#4682B4] text-shadow`}
        >
          {messages[1]}
        </p>
        <p
          className={`text-xl ${
            fadeIn ? "fade-in" : "fade-out"
          } text-[#3CB371] text-shadow`}
        >
          {messages[2]}
        </p>
      </div>
      <div className="absolute bottom-4 w-full flex justify-center">
        <div className="bg-yellow-400 hover:bg-yellow-500 transition-colors duration-300 text-white font-semibold py-2 px-4 rounded shadow-lg active:scale-95">
          다음 기회를 기대하세요!
        </div>
      </div>
    </div>
  );
}

export default NoBid;
