import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../../types/game';
import { soundManager } from '../../utils/audio';

interface RawPracticeQuestion {
  id: number;
  type: 'mcq' | 'tf' | 'input';
  question: string;
  options?: string[]; // raw options without A., B.
  correctText?: string;
  correct?: any;
  subQuestions?: { text: string; correct: boolean }[];
  explanation: string;
}

const RAW_PRACTICE_DATA: RawPracticeQuestion[] = [
  {
    id: 1,
    type: 'mcq',
    question: 'Kết quả của phép tính 25 + 17 là bao nhiêu?',
    options: ['32', '42', '52', '40'],
    correctText: '42',
    explanation: 'Đáp án đúng là: 42',
  },
  {
    id: 2,
    type: 'mcq',
    question: 'Hình nào dưới đây có 4 cạnh bằng nhau?',
    options: ['Hình tròn', 'Hình chữ nhật', 'Hình vuông', 'Hình tam giác'],
    correctText: 'Hình vuông',
    explanation: 'Đáp án đúng là: Hình vuông',
  },
  {
    id: 3,
    type: 'mcq',
    question: 'Một tuần lễ có bao nhiêu ngày?',
    options: ['5 ngày', '6 ngày', '7 ngày', '8 ngày'],
    correctText: '7 ngày',
    explanation: 'Đáp án đúng là: 7 ngày',
  },
  {
    id: 4,
    type: 'tf',
    question: 'Chọn Đúng hoặc Sai cho các câu sau:',
    subQuestions: [
      { text: 'A. Số 15 lớn hơn số 20.', correct: false },
      { text: 'B. 5 x 4 = 20.', correct: true },
      { text: 'C. Một ngày có 24 giờ.', correct: true },
      { text: 'D. Hình tròn có 4 góc.', correct: false },
    ],
    explanation: 'B và C đúng. A sai (15 nhỏ hơn 20), D sai (Hình tròn không có góc).',
  },
  {
    id: 5,
    type: 'input',
    question: 'Điền số thích hợp: 8 x 5 = ?',
    correct: '40',
    explanation: 'Đáp án đúng là 40.',
  },
];

const buildShuffledPracticeQuiz = (): QuizQuestion[] => {
  const letters = ['A', 'B', 'C', 'D'];
  return RAW_PRACTICE_DATA.map((q) => {
    if (q.type === 'mcq' && q.options) {
      const opts = [...q.options];
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
      }
      const displayOpts = opts.map((optText, idx) => `${letters[idx]}. ${optText}`);
      const correctIdx = opts.findIndex((optText) => optText === q.correctText);
      return {
        id: q.id,
        type: 'mcq',
        question: q.question,
        options: displayOpts,
        correct: correctIdx >= 0 ? correctIdx : 0,
        explanation: q.explanation,
      };
    }
    return {
      id: q.id,
      type: q.type,
      question: q.question,
      subQuestions: q.subQuestions,
      correct: q.correct,
      explanation: q.explanation,
    };
  });
};

export const PracticeQuizTab: React.FC = () => {
  const [quizData, setQuizData] = useState<QuizQuestion[]>(() => buildShuffledPracticeQuiz());

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any[]>(new Array(5).fill(null));
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [currentTFSelection, setCurrentTFSelection] = useState<Record<number, boolean>>({});
  const [inputVal, setInputVal] = useState('');
  const [popupInfo, setPopupInfo] = useState<{ show: boolean; type: 'correct' | 'wrong' | 'warn'; msg: string } | null>(null);

  const isQuestionCorrect = (index: number) => {
    const ans = userAnswers[index];
    const data = quizData[index];
    if (ans === null || ans === undefined) return false;

    if (data.type === 'mcq') {
      return ans === data.correct;
    } else if (data.type === 'input') {
      return String(ans).trim() === String(data.correct).trim();
    } else if (data.type === 'tf') {
      let allCorrect = true;
      data.subQuestions?.forEach((sub, idx) => {
        if (ans[idx] !== sub.correct) allCorrect = false;
      });
      return allCorrect;
    }
    return false;
  };

  const showPopup = (type: 'correct' | 'wrong' | 'warn', message?: string) => {
    if (type === 'correct') {
      soundManager.playCorrect();
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    } else if (type === 'wrong') {
      soundManager.playWrong();
    } else {
      soundManager.playClick();
    }

    setPopupInfo({
      show: true,
      type,
      msg: message || (type === 'correct' ? 'Chính xác!' : type === 'wrong' ? 'Sai mất rồi!' : 'Vui lòng chọn đáp án!'),
    });

    setTimeout(() => {
      setPopupInfo(null);
      if (isAnswered && currentQuestion === 4 && type !== 'warn') {
        setTimeout(() => {
          const correctCount = score / 2 + (type === 'correct' ? 1 : 0);
          window.parent.postMessage(
            {
              answerTrue: correctCount, // Cái này là câu trả lời đúng
              totalQuestion: 5, // Cái này là số câu hỏi
              command: 'submit_result', //Không được đổi
            },
            '*'
          );
          setShowResultScreen(true);
        }, 500);
      }
    }, 1500);
  };

  const handleMCQSelect = (idx: number) => {
    const nextAnswers = [...userAnswers];
    nextAnswers[currentQuestion] = idx;
    setUserAnswers(nextAnswers);

    const isCorrect = idx === quizData[currentQuestion].correct;
    if (isCorrect) setScore((prev) => prev + 2);

    setIsAnswered(true);
    showPopup(isCorrect ? 'correct' : 'wrong');
  };

  const handleTFSelect = (rowIdx: number, val: boolean) => {
    if (isAnswered || isReviewing) return;
    setCurrentTFSelection((prev) => ({ ...prev, [rowIdx]: val }));
    soundManager.playClick();
  };

  const checkTF = () => {
    if (Object.keys(currentTFSelection).length < 4) {
      showPopup('warn', 'Vui lòng chọn hết các ý!');
      return;
    }

    const nextAnswers = [...userAnswers];
    nextAnswers[currentQuestion] = { ...currentTFSelection };
    setUserAnswers(nextAnswers);

    const data = quizData[currentQuestion];
    let correctCount = 0;
    data.subQuestions?.forEach((sub, idx) => {
      if (currentTFSelection[idx] === sub.correct) correctCount++;
    });

    const isAllCorrect = correctCount === 4;
    if (isAllCorrect) setScore((prev) => prev + 2);

    setIsAnswered(true);
    showPopup(isAllCorrect ? 'correct' : 'wrong');
  };

  const handleKeypadPress = (val: string) => {
    soundManager.playClick();
    if (val === 'clear') {
      setInputVal((prev) => prev.slice(0, -1));
    } else if (inputVal.length < 15) {
      setInputVal((prev) => prev + val);
    }
  };

  const checkInput = () => {
    const val = inputVal.trim();
    if (!val) {
      showPopup('warn', 'Bạn chưa nhập đáp án!');
      return;
    }

    const nextAnswers = [...userAnswers];
    nextAnswers[currentQuestion] = val;
    setUserAnswers(nextAnswers);

    const isCorrect = val === quizData[currentQuestion].correct;
    if (isCorrect) setScore((prev) => prev + 2);

    setIsAnswered(true);
    showPopup(isCorrect ? 'correct' : 'wrong');
  };

  const nextQuestion = () => {
    if (currentQuestion < 4) {
      setCurrentQuestion((prev) => prev + 1);
      setIsAnswered(false);
      setCurrentTFSelection({});
      setInputVal('');
    } else {
      const correctCount = score / 2;
      window.parent.postMessage(
        {
          answerTrue: correctCount, // Cái này là câu trả lời đúng
          totalQuestion: 5, // Cái này là số câu hỏi
          command: 'submit_result', //Không được đổi
        },
        '*'
      );
      setShowResultScreen(true);
    }
  };

  const resetQuiz = () => {
    setQuizData(buildShuffledPracticeQuiz());
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswers(new Array(5).fill(null));
    setIsReviewing(false);
    setIsAnswered(false);
    setCurrentTFSelection({});
    setInputVal('');
    setShowResultScreen(false);
  };

  const startReviewMode = () => {
    setIsReviewing(true);
    setCurrentQuestion(0);
    setShowResultScreen(false);
  };

  const currentData = quizData[currentQuestion];
  const disableInteraction = isReviewing || (isAnswered && userAnswers[currentQuestion] !== null);

  return (
    <div className="w-full h-full bg-white text-[#00203F] overflow-y-auto p-4 md:p-6 rounded-3xl relative">
      {/* POPUP MODAL */}
      {popupInfo && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000] p-4 animate-pop">
          <div className="bg-white p-6 rounded-2xl text-center min-w-[280px] shadow-2xl">
            <i
              className={`text-5xl mb-3 block ${
                popupInfo.type === 'correct'
                  ? 'fa-solid fa-circle-check text-[#28a745]'
                  : popupInfo.type === 'wrong'
                  ? 'fa-solid fa-circle-xmark text-[#dc3545]'
                  : 'fa-solid fa-triangle-exclamation text-[#ffc107]'
              }`}
            ></i>
            <div className="text-xl font-bold text-slate-800">{popupInfo.msg}</div>
          </div>
        </div>
      )}

      {/* Main Quiz Container */}
      {!showResultScreen ? (
        <div className="max-w-3xl mx-auto flex flex-col items-center pb-20">
          {/* Question Nav Circles */}
          <div className="flex gap-3 my-4">
            {[0, 1, 2, 3, 4].map((i) => {
              const isActive = i === currentQuestion;
              const hasAnswered = userAnswers[i] !== null;
              const isCorrect = hasAnswered && isQuestionCorrect(i);

              let circleClass = 'w-11 h-11 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-all ';
              if (isActive) {
                circleClass += 'bg-[#4FC3F7] text-[#00203F] border-[#4FC3F7] scale-110 shadow-lg';
              } else if (hasAnswered) {
                circleClass += isCorrect
                  ? 'bg-[#28a745] text-white border-[#28a745]'
                  : 'bg-[#dc3545] text-white border-[#dc3545]';
              } else {
                circleClass += 'bg-[#00203F] text-white border-[#00203F]';
              }

              return (
                <button
                  key={i}
                  disabled={!isReviewing}
                  onClick={() => {
                    setCurrentQuestion(i);
                    setIsAnswered(true);
                  }}
                  className={circleClass}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* Question Title */}
          <div className="text-xl md:text-2xl font-bold text-[#00203F] text-center my-4">
            Câu {currentQuestion + 1}: {currentData.question}
          </div>

          {/* MCQ Question View */}
          {currentData.type === 'mcq' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full my-4">
              {currentData.options?.map((opt, idx) => {
                let btnStyle = 'bg-[#00203F] text-white border-[#00203F] hover:bg-[#003366]';

                if (disableInteraction) {
                  if (idx === currentData.correct) {
                    btnStyle = 'bg-[#28a745] text-white border-[#28a745]';
                  } else if (userAnswers[currentQuestion] === idx) {
                    btnStyle = 'bg-[#dc3545] text-white border-[#dc3545]';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={disableInteraction}
                    onClick={() => handleMCQSelect(idx)}
                    className={`p-4 rounded-xl border-2 font-bold text-base min-h-[70px] shadow-md transition-transform cursor-pointer ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* True/False Question View */}
          {currentData.type === 'tf' && (
            <div className="flex flex-col gap-3 w-full max-w-2xl my-4">
              {currentData.subQuestions?.map((sub, idx) => {
                const userChoice = currentTFSelection[idx];

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-[#00203F] text-white p-4 rounded-xl shadow-md"
                  >
                    <span className="font-bold text-sm sm:text-base flex-1 mr-4 text-left">
                      {sub.text}
                    </span>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleTFSelect(idx, true)}
                        className={`w-11 h-11 rounded-full border-2 font-bold text-base flex items-center justify-center transition-colors ${
                          userChoice === true
                            ? 'bg-[#FFD700] text-[#00203F] border-[#FFD700]'
                            : 'border-white text-white hover:bg-white/10'
                        }`}
                      >
                        Đ
                      </button>
                      <button
                        onClick={() => handleTFSelect(idx, false)}
                        className={`w-11 h-11 rounded-full border-2 font-bold text-base flex items-center justify-center transition-colors ${
                          userChoice === false
                            ? 'bg-[#FFD700] text-[#00203F] border-[#FFD700]'
                            : 'border-white text-white hover:bg-white/10'
                        }`}
                      >
                        S
                      </button>
                    </div>
                  </div>
                );
              })}

              {!disableInteraction && (
                <div className="text-center mt-4">
                  <button
                    onClick={checkTF}
                    className="px-8 py-3 bg-[#00203F] text-white font-bold rounded-full text-base shadow-md hover:bg-[#003366]"
                  >
                    Kiểm tra
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Input Question View */}
          {currentData.type === 'input' && (
            <div className="flex flex-col items-center w-full my-4">
              <input
                type="text"
                readOnly
                value={disableInteraction ? userAnswers[currentQuestion] || '' : inputVal}
                className="w-72 p-4 text-3xl font-black text-center bg-[#00203F] text-white border-4 border-[#00203F] rounded-2xl mb-4"
              />

              {!disableInteraction && (
                <>
                  <div className="grid grid-cols-4 gap-2.5 max-w-sm w-full mb-4">
                    {['1', '2', '3', '+', '4', '5', '6', '-', '7', '8', '9', 'x', '0', '>', '<', 'DEL'].map(
                      (key) => (
                        <button
                          key={key}
                          onClick={() => handleKeypadPress(key === 'DEL' ? 'clear' : key)}
                          className={`p-3 rounded-xl font-bold text-lg shadow-md cursor-pointer ${
                            key === 'DEL'
                              ? 'bg-[#dc3545] text-white'
                              : 'bg-[#00203F] text-white hover:bg-[#003366]'
                          }`}
                        >
                          {key}
                        </button>
                      )
                    )}
                  </div>
                  <button
                    onClick={checkInput}
                    className="px-10 py-3 bg-[#28a745] text-white font-bold rounded-full text-lg shadow-lg hover:brightness-110"
                  >
                    Trả lời
                  </button>
                </>
              )}
            </div>
          )}

          {/* Feedback Explanation Area */}
          {disableInteraction && (
            <div className="mt-6 flex flex-col items-center w-full text-center">
              <div className="text-lg font-bold text-[#28a745] mb-4">
                {currentData.explanation}
              </div>
              {!isReviewing && currentQuestion < 4 && (
                <button
                  onClick={nextQuestion}
                  className="px-8 py-3 bg-[#FFD700] text-[#00203F] font-extrabold text-lg rounded-full shadow-lg hover:bg-amber-300 transition-transform active:scale-95"
                >
                  Câu tiếp theo
                </button>
              )}
              {isReviewing && (
                <button
                  onClick={resetQuiz}
                  className="px-8 py-3 bg-[#00203F] text-white font-bold text-base rounded-full shadow-lg"
                >
                  Thử lại bài tập
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Result Screen View */
        <div className="fixed inset-0 bg-white/95 flex items-center justify-center z-[1500] p-4">
          <div className="bg-white border-4 border-[#00203F] rounded-[35px] p-8 max-w-md w-full text-center shadow-2xl flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-[#00203F] flex flex-col items-center justify-center mb-6 shadow-xl">
              <div className="text-5xl font-black text-[#FFD700] leading-none">{score}</div>
              <span className="text-xs text-white uppercase font-bold tracking-wider mt-1">ĐIỂM</span>
            </div>

            <h3
              className={`text-xl font-bold mb-2 ${
                score >= 10 ? 'text-[#28a745]' : score >= 6 ? 'text-amber-600' : 'text-[#dc3545]'
              }`}
            >
              {score >= 10
                ? 'Tuyệt vời! Bạn rất giỏi 🏆'
                : score >= 6
                ? 'Khá lắm! Cố gắng thêm chút nữa ✌️'
                : 'Rất tiếc! Bạn cần ôn tập lại nhé 📚'}
            </h3>

            <div className="text-base font-bold text-[#00203F] mb-6">
              Số câu đúng: {score / 2}/5
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={startReviewMode}
                className="flex-1 py-3 bg-[#00203F] text-white font-bold rounded-full text-sm hover:bg-[#003366]"
              >
                Xem lại bài làm
              </button>
              <button
                onClick={resetQuiz}
                className="flex-1 py-3 bg-[#FFD700] text-[#00203F] font-bold rounded-full text-sm hover:bg-amber-300"
              >
                Làm lại bài tập
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
