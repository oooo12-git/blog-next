"use client";

import React, { useState } from "react";

interface ProblemAnswerProps {
  problem: string;
  correctAnswer: string;
}

const ProblemAnswer: React.FC<ProblemAnswerProps> = ({
  problem,
  correctAnswer,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrectAnswerVisible, setIsCorrectAnswerVisible] = useState(false);

  const handleRevealClick = () => {
    if (userAnswer.trim() !== "") {
      setIsCorrectAnswerVisible(true);
    } else {
      alert("먼저 답을 입력해주세요.");
    }
  };

  const isCorrect =
    userAnswer.replace(/\s+/g, "").toLowerCase() ===
    correctAnswer.replace(/\s+/g, "").toLowerCase();

  return (
    <div className="my-10 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <table className="w-full text-sm">
        <tbody>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="w-1/6 min-w-[80px] bg-gray-50 p-3 font-semibold dark:bg-gray-700/50 dark:text-white">
              문제
            </td>
            <td className="p-3 whitespace-pre-wrap dark:text-white">
              {problem}
            </td>
          </tr>

          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="w-1/6 min-w-[80px] bg-gray-50 p-3 font-semibold dark:bg-gray-700/50 dark:text-white">
              답
            </td>
            <td className="p-2">
              <textarea
                value={userAnswer}
                onChange={(e) => {
                  setUserAnswer(e.target.value);
                  // 자동으로 높이 조절
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                placeholder="답을 입력해야 연습이됩니다!"
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-base text-black focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 resize-none overflow-hidden min-h-[38px]"
                disabled={isCorrectAnswerVisible}
                rows={1}
              />
            </td>
          </tr>

          <tr>
            <td className="w-1/6 min-w-[80px] bg-gray-50 p-3 font-semibold dark:bg-gray-700/50 dark:text-white">
              정답
            </td>
            <td
              className={`p-3 ${
                !isCorrectAnswerVisible
                  ? "cursor-pointer text-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600/50"
                  : ""
              }`}
              onClick={!isCorrectAnswerVisible ? handleRevealClick : undefined}
            >
              {isCorrectAnswerVisible ? (
                <span
                  className={
                    isCorrect
                      ? "font-bold text-blue-600 dark:text-blue-400 whitespace-pre-wrap"
                      : "font-bold text-red-600 dark:text-red-400 whitespace-pre-wrap"
                  }
                >
                  {correctAnswer}
                </span>
              ) : (
                "정답 확인하기"
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProblemAnswer;
