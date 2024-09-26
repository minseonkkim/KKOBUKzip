// src/NotFoundPage.js
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import "react-chrome-dino-ts/index.css";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid'; // 고유 ID 생성 라이브러리
import TurtleWalk from "../../assets/NotFound/turtle_walk.gif";
import Coral1 from "../../assets/NotFound/coral.webp";
import Coral2 from "../../assets/NotFound/coral2.webp";
import Coral3 from "../../assets/NotFound/coral3.webp";
import Seaweed from "../../assets/NotFound/seaweed.webp";
import Seaweed2 from "../../assets/NotFound/seaweed2.webp";
import Shark from "../../assets/NotFound/shark.webp";
import { Helmet } from "react-helmet-async";

type ObstacleType = {
  id: string;
  left: number;
  height: number;
  passed: boolean;
  type: string;
  img: string;
};

type SharkType = {
  left: number;
  height: number;
  img: string;
};

function NotFoundPage() {
  const [obstacles, setObstacles] = useState<ObstacleType[]>([]);
  const [sharkObstacles, setSharkObstacles] = useState<SharkType[]>([]);
  const [jumpStage, setJumpStage] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(9);
  const [lastSpeedIncrease, setLastSpeedIncrease] = useState(0);

  const obstacleTypes = [
    { type: "coral1", img: Coral1 },
    { type: "coral2", img: Coral2 },
    { type: "coral3", img: Coral3 },
    { type: "seaweed", img: Seaweed },
    { type: "seaweed2", img: Seaweed2 },
  ];

  useEffect(() => {
    if (!isGameStarted || isGameOver) return;

    if (score > 0 && score % 10 === 0 && score !== lastSpeedIncrease) {
      setSpeed((prevSpeed) => prevSpeed + 4);
      setLastSpeedIncrease(score);
    }

    const interval = setInterval(() => {
      setObstacles((prev: ObstacleType[]) => {
        const updatedObstacles = prev
          .map((obstacle) => ({ ...obstacle, left: obstacle.left - speed }))
          .filter((obstacle) => obstacle.left > -50);

        if (
          Math.random() < 0.03 &&
          (updatedObstacles.length === 0 ||
            updatedObstacles[updatedObstacles.length - 1].left < 600)
        ) {
          const randomObstacle =
            obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
          updatedObstacles.push({
            id: uuidv4(),
            left: 800,
            height: 30 + Math.random() * 20,
            passed: false,
            type: randomObstacle.type,
            img: randomObstacle.img,
          });
        }

        return updatedObstacles;
      });

      setSharkObstacles((prev: SharkType[]) => {
        const updatedShark = prev
          .map((shark) => ({ ...shark, left: shark.left - speed }))
          .filter((shark) => shark.left > -50);

        if (
          Math.random() < 0.02 &&
          (updatedShark.length === 0 ||
            updatedShark[updatedShark.length - 1].left < 600)
        ) {
          updatedShark.push({
            left: 800,
            height: 90 + Math.random() * 40,
            img: Shark,
          });
        }

        return updatedShark;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isGameStarted, isGameOver, score, speed, lastSpeedIncrease]);

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        handleJump();
      }
    };

    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, [jumpStage, isGameStarted, isGameOver]);

  const handleJump = () => {
    if (!isGameStarted) {
      setIsGameStarted(true);
      setIsGameOver(false);
      setScore(0);
      setObstacles([]);
      setSharkObstacles([]);
      setSpeed(13);
      setJumpStage(0);
      setLastSpeedIncrease(0);
      return;
    }

    if (isGameOver) {
      setIsGameOver(false);
      setIsGameStarted(true);
      setScore(0);
      setObstacles([]);
      setSharkObstacles([]);
      setSpeed(10);
      setJumpStage(0);
      setLastSpeedIncrease(0);
      return;
    }

    if (jumpStage < 2) {
      setJumpStage((prev) => prev + 1);

      setTimeout(() => {
        setTimeout(() => setJumpStage(0), 250);
      }, 250);
    }
  };

  useEffect(() => {
    const checkCollision = () => {
      setObstacles((prev) =>
        prev.map((obstacle) => {
          const turtleLeft = 20;
          const turtleWidth = 60;
          const obstacleWidth = 40;

          const isObstacleInRange =
            obstacle.left < turtleLeft + turtleWidth &&
            obstacle.left + obstacleWidth > turtleLeft;
          const isTurtleLow = jumpStage === 0;
          const isCollision = isObstacleInRange && isTurtleLow;

          if (isCollision) {
            setIsGameOver(true);
            return obstacle;
          }

          if (!obstacle.passed && obstacle.left + obstacleWidth / 2 < turtleLeft) {
            setScore((prevScore) => prevScore + 1);
            return { ...obstacle, passed: true };
          }

          return obstacle;
        })
      );

      sharkObstacles.forEach((shark) => {
        const turtleLeft = 40;
        const turtleWidth = 60;
        const turtleHeight = jumpStage === 1 ? 70 : jumpStage === 2 ? 140 : 0;
        const turtleTop = turtleHeight + 20;

        const sharkLeft = shark.left;
        const sharkWidth = 40;
        const sharkHeight = shark.height;

        const isSharkInRange =
          sharkLeft < turtleLeft + turtleWidth && sharkLeft + sharkWidth > turtleLeft;
        const isSharkAtSameHeight = turtleTop >= sharkHeight;

        const isCollision = isSharkInRange && isSharkAtSameHeight;

        if (isCollision) {
          setIsGameOver(true);
        }
      });
    };

    if (isGameStarted) {
      const collisionInterval = setInterval(checkCollision, 50);
      return () => clearInterval(collisionInterval);
    }
  }, [obstacles, sharkObstacles, jumpStage, isGameStarted]);

  return (
    <>
      <Helmet>
        <title>404</title>
      </Helmet>
      <div
        className="w-full h-screen bg-[#0099cc] flex flex-col items-center justify-center py-7"
        onClick={handleJump}
      >
        <div className="text-center text-white mb-7 md:mb-10">
          <p className="font-dnf-bitbit text-[60px] md:text-[75px] md-3 md:mb-5">404</p>
          <p className="mx-10 text-[18px] md:text-[22px]">꼬북이가 바닷속에서 길을 잃었어요 o(TヘTo) <br/>장애물을 피하고 점수를 올려보세요!!</p>
        </div>
        <div className="relative border-4 border-blue-400 w-[90%] max-w-[1200px] h-[200px] sm:h-[300px] bg-[#048cdc] border-6 border-blue-400 overflow-hidden">
          <div
            className={`absolute bottom-0 left-[20px] transition-transform duration-200 ${
              jumpStage === 1
                ? "translate-y-[-50px] sm:translate-y-[-105px]"
                : jumpStage === 2
                ? "translate-y-[-100px] sm:translate-y-[-210px]"
                : ""
            }`}
          >
            <img src={TurtleWalk} loading="lazy" draggable="false" className="w-[60px] sm:w-[90px] h-auto" alt="Turtle" />
          </div>
          {obstacles.map((obstacle, index) => (
            <img
              draggable="false"
              key={index}
              src={obstacle.img}
              alt={obstacle.type}
              className="absolute"
              loading="lazy"
              style={{
                left: `${obstacle.left * 1.5}px`,
                bottom: "0px",
                width: "40px",
                height: "auto",
              }}
            />
          ))}
          {sharkObstacles.map((shark, index) => (
            <img
              draggable="false"
              key={index}
              src={shark.img}
              alt="Shark"
              className="absolute"
              loading="lazy"
              style={{
                left: `${shark.left * 1.5}px`,
                bottom: `${shark.height * 1.5}px`,
                width: "40px",
                height: "auto",
              }}
            />
          ))}

          {!isGameStarted && !isGameOver && (
            <div
              className="absolute text-center text-white text-2xl sm:text-3xl font-stardust blink"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              Press Spacebar to Start
            </div>
          )}

          {isGameOver && (
            <div
              className="absolute text-center"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="text-2xl sm:text-3xl text-white mb-6 font-dnf-bitbit">
                Game Over! Your Score: {score}
              </div>
              <div className="text-white text-xl md:text-3xl font-stardust blink">
                Press Spacebar to Restart
              </div>
            </div>
          )}

          {isGameStarted && !isGameOver && (
            <div className="absolute top-6 left-6 text-white text-xl sm:text-2xl font-stardust">
              Score: {score}
            </div>
          )}
        </div>
        <Link
          to="/"
          className="cursor-pointer text-[16px] sm:text-[20px] mt-6 sm:mt-12 px-6 sm:px-9 py-3 sm:py-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <FaHome className="inline mr-2 sm:mr-3" />
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
