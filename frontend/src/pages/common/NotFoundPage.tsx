// src/NotFoundPage.js
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import DinoGame from "react-chrome-dino-ts";
import "react-chrome-dino-ts/index.css";
import Turtle from "../../assets/NotFoundPage_Turtle.gif";
import React, { useState, useEffect } from "react";
import TurtleWalk from "../../assets/turtle_walk.gif";
import Coral1 from "../../assets/NotFound/coral.png";
import Coral2 from "../../assets/NotFound/coral2.png";
import Coral3 from "../../assets/NotFound/coral3.png";
import Seaweed from "../../assets/NotFound/seaweed.png";
import Seaweed2 from "../../assets/NotFound/seaweed2.png";

function NotFoundPage() {
  const [obstacles, setObstacles] = useState<{ left: number; height: number; passed: boolean; type: string; img: string }[]>([]);
  const [jumpStage, setJumpStage] = useState(0); // 점프 단계를 추적
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false); // 게임 시작 여부 상태 추가
  const [score, setScore] = useState(0); // 점수 상태 추가
  const [speed, setSpeed] = useState(10); // 장애물 속도 상태 추가 (초기 속도 설정)
  const [lastSpeedIncrease, setLastSpeedIncrease] = useState(0); // 마지막 속도 증가를 추적

  // 장애물 모양들
  const obstacleTypes = [
    { type: "coral1", img: Coral1 },
    { type: "coral2", img: Coral2 },
    { type: "coral3", img: Coral3 },
    { type: "seaweed", img: Seaweed },
    { type: "seaweed2", img: Seaweed2 },
  ];

  useEffect(() => {
    if (!isGameStarted || isGameOver) return; // 게임이 시작되지 않았거나 종료되었을 때는 실행하지 않음

    // 점수에 따라 속도 증가 (10의 배수일 때만 한 번 증가)
    if (score > 0 && score % 10 === 0 && score !== lastSpeedIncrease) {
      setSpeed((prevSpeed) => prevSpeed + 1); // 점수가 10 증가할 때마다 속도를 1씩 증가시킴
      setLastSpeedIncrease(score); // 마지막 속도 증가 시점을 업데이트
    }

    const interval = setInterval(() => {
      setObstacles((prev) => {
        const updatedObstacles = prev
          .map((obstacle) => ({ ...obstacle, left: obstacle.left - speed })) // 장애물 속도에 따라 이동
          .filter((obstacle) => obstacle.left > -50);

        // 새로운 장애물 생성 로직
        if (
          Math.random() < 0.03 &&
          (updatedObstacles.length === 0 ||
            updatedObstacles[updatedObstacles.length - 1].left < 600)
        ) {
          // 새로 생성되는 장애물 간격 조정 (이전 장애물과 겹치지 않도록 설정)
          const randomObstacle =
            obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)]; // 랜덤으로 장애물 타입 선택
          updatedObstacles.push({
            left: 800,
            height: 30 + Math.random() * 20, // 장애물 높이 조정
            passed: false, // 처음엔 뛰어넘지 않은 상태로 설정
            type: randomObstacle.type, // 장애물의 타입 설정
            img: randomObstacle.img, // 이미지 설정
          });
        }

        return updatedObstacles;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isGameStarted, isGameOver, score, speed, lastSpeedIncrease]);

  // 점프 핸들러 및 게임 시작 핸들러
  useEffect(() => {
    const handleKeyUp = (e: any) => {
      if (!isGameStarted && e.code === "Space") {
        setIsGameStarted(true); // 게임 시작
        return;
      }

      if (isGameStarted && e.code === "Space" && jumpStage < 2) {
        setJumpStage((prev) => prev + 1); // 점프 단계를 증가

        // 점프가 끝난 후 공중에 머무르기
        setTimeout(() => {
          setTimeout(() => setJumpStage(0), 200); // 공중에서 머무는 시간 설정 (0.3초)
        }, 300); // 점프 애니메이션 지속 시간 (0.3초)
      }
    };
    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, [jumpStage, isGameStarted]);

  // 충돌 감지 및 점수 증가
  useEffect(() => {
    const checkCollision = () => {
      setObstacles((prev) =>
        prev.map((obstacle) => {
          // 충돌 감지 범위 수정
          const turtleLeft = 50; // 거북이의 위치 (left: 10 + 거북이의 가로 길이)
          const turtleWidth = 40; // 거북이의 너비
          const obstacleWidth = 40; // 장애물의 너비 (모든 장애물 크기가 동일하다고 가정)

          // 정확한 충돌 범위 계산
          const isObstacleInRange =
            obstacle.left < turtleLeft + turtleWidth && // 거북이의 오른쪽 끝보다 장애물이 왼쪽에 있고
            obstacle.left + obstacleWidth > turtleLeft; // 거북이의 왼쪽 끝보다 장애물이 오른쪽에 있을 때
          const isTurtleLow = jumpStage === 0;
          const isCollision = isObstacleInRange && isTurtleLow;

          // 충돌 감지
          if (isCollision) {
            setIsGameOver(true);
          }

          // 장애물 통과 점수 증가
          if (!obstacle.passed && obstacle.left < 10 && !isCollision) {
            setScore((prevScore) => prevScore + 1);
            return { ...obstacle, passed: true }; // 점수를 증가시키고 장애물을 통과한 것으로 표시
          }

          return obstacle;
        })
      );
    };

    if (isGameStarted) {
      const collisionInterval = setInterval(checkCollision, 50);
      return () => clearInterval(collisionInterval);
    }
  }, [obstacles, jumpStage, isGameStarted]);

  // 게임 재시작 핸들러
  const handleRestart = () => {
    setIsGameStarted(false); // 게임 시작 상태 초기화
    setIsGameOver(false);
    setScore(0);
    setObstacles([]);
    setJumpStage(0);
    setSpeed(10); // 속도 초기화
    setLastSpeedIncrease(0); // 마지막 속도 증가 시점을 초기화
  };

  return (
    <>
      <div className="w-full h-screen bg-[#0099cc] flex flex-col items-center justify-center py-6">
        {/* 게임 설명 추가 */}
        <div className="text-center text-white text-lg mb-8">
          <p className="font-dnf-bitbit text-[38px] mb-5">404</p>
          <p>꼬북이가 바닷속에서 길을 잃었어요!</p>
          <p>스페이스바를 눌러 장애물을 피하고 점수를 올려보세요!</p>
        </div>
        <div className="relative w-[800px] h-[200px] bg-[#048cdc] border-4 border-blue-400 overflow-hidden">
          <div
            className={`absolute bottom-0 left-10 transition-transform duration-300 ${
              jumpStage === 1
                ? "translate-y-[-70px]" // 첫 번째 점프 높이
                : jumpStage === 2
                ? "translate-y-[-140px]" // 두 번째 점프 높이
                : ""
            }`}
          >
            <img src={TurtleWalk} className="w-[60px] h-auto" alt="Turtle" />
          </div>
          {obstacles.map((obstacle, index) => (
            <img
              key={index}
              src={obstacle.img}
              alt={obstacle.type}
              className="absolute"
              style={{
                left: `${obstacle.left}px`,
                bottom: "0px",
                width: "40px",
                height: "auto",
              }}
            />
          ))}

          {!isGameStarted && !isGameOver && (
            <div className="absolute text-center text-white text-2xl font-stardust blink"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}>
              Press Spacebar to Start
            </div>
          )}
        
        {isGameOver ? (
          <div className="absolute text-center"
          style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}>
            <div className="text-2xl text-white mb-4 font-dnf-bitbit">
              Game Over! Your Score: {score}
            </div>
            <button
              onClick={handleRestart}
              className="font-stardust font-bold text-[20px] px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Restart
            </button>
          </div>
        ) : (
          isGameStarted && (
            <div className="absolute top-4 left-4 text-white text-xl font-stardust">
              Score: {score}
            </div>
          )
        )}
        </div>
        {/* 홈으로 돌아가기 버튼 추가 */}
        <Link
          to="/"
          className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <FaHome className="inline mr-2" />
          홈으로 돌아가기
        </Link>
      </div>
      <style>{`
        .blink {
          animation: blink-animation 1s steps(5, start) infinite;
        }

        @keyframes blink-animation {
          to {
            visibility: hidden;
          }
        }
      `}</style>
    </>
  );
}

export default NotFoundPage;
