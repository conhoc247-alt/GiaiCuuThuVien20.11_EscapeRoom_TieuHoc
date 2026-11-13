import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/audio';

export interface StoryPanelProps {
  /** Tiêu đề bối cảnh phòng, ví dụ: "BỐI CẢNH PHÒNG LỊCH SỬ" */
  title: string;
  /** Danh sách các đoạn lời dẫn xuất hiện lần lượt từng đoạn */
  lines: string[];
  /** Gọi khi người chơi đã đọc và nhấn TIẾP TỤC hết tất cả các đoạn lời dẫn */
  onComplete: () => void;
  /** Cờ bật/tắt hiển thị */
  isVisible?: boolean;
  /** Biểu tượng bên trái hộp thoại (mặc định: 📖) */
  icon?: string;
}

export const StoryPanel: React.FC<StoryPanelProps> = ({
  title,
  lines,
  onComplete,
  isVisible = true,
  icon = '📖',
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [typedText, setTypedText] = useState<string>('');
  const [isTypingFinished, setIsTypingFinished] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentLine = lines[currentIndex] || '';

  useEffect(() => {
    if (!isVisible || isCompleted || !currentLine) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setTypedText('');
    setIsTypingFinished(false);

    let charIndex = 0;
    intervalRef.current = setInterval(() => {
      if (charIndex < currentLine.length) {
        setTypedText(currentLine.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTypingFinished(true);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 20);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [currentIndex, currentLine, isVisible, isCompleted]);

  if (!isVisible || isCompleted || lines.length === 0) return null;

  const handleSkipTyping = () => {
    if (!isTypingFinished) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setTypedText(currentLine);
      setIsTypingFinished(true);
    }
  };

  const handleNextLine = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();

    if (!isTypingFinished) {
      handleSkipTyping();
      return;
    }

    if (currentIndex < lines.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      onComplete();
    }
  };

  return (
    <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 z-30 w-[96%] max-w-4xl shrink-0 pointer-events-auto animate-pop">
      <div
        onClick={handleSkipTyping}
        className="bg-gradient-to-r from-[#001730]/95 via-[#002855]/95 to-[#001730]/95 text-[#FFFFE3] border-2 border-[#FFD700] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3.5 shadow-[0_6px_30px_rgba(0,0,0,0.85)] backdrop-blur-md flex flex-row items-center justify-between gap-2.5 sm:gap-4 transition-all cursor-pointer min-h-[60px] sm:min-h-[76px]"
      >
        <div className="flex items-center gap-2.5 sm:gap-3.5 flex-1 min-w-0">
          {/* Biểu tượng quyển sách cổ tròn viền vàng kim */}
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#3E1F08] border-2 border-[#FFD700] flex items-center justify-center text-amber-200 shrink-0 text-base sm:text-xl shadow-[0_0_12px_rgba(255,215,0,0.45)]">
            {icon}
          </div>

          {/* Nội dung tiêu đề & lời dẫn (giữ nguyên đầy đủ dấu tiếng Việt) */}
          <div className="flex-1 pr-1 min-w-0">
            <span className="text-[11px] sm:text-xs font-black text-[#FFD700] uppercase tracking-wider block leading-normal py-0.5">
              {title}
            </span>
            <p className="text-[11px] sm:text-xs md:text-sm font-medium text-[#FFFFE3] leading-relaxed">
              {typedText}
              {!isTypingFinished && (
                <span className="animate-pulse inline-block ml-1 text-[#FFD700]">▌</span>
              )}
            </p>
          </div>
        </div>

        {/* Nút TIẾP TỤC bên phải */}
        <div className="shrink-0">
          {isTypingFinished ? (
            <button
              onClick={handleNextLine}
              className="px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 text-[#00203F] font-black text-[11px] sm:text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,215,0,0.6)] flex items-center gap-1 cursor-pointer uppercase tracking-wide whitespace-nowrap"
            >
              <span>TIẾP TỤC</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-[9px] sm:text-[10px] text-amber-300/80 italic font-semibold whitespace-nowrap">
              (Nhấp để phát nhanh)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
