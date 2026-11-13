import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { ROBOT_NORMAL_DATA_URL } from '../utils/assets';

export interface LumiSpeechProps {
  /** Danh sách các câu thoại của Lumi xuất hiện lần lượt từng đoạn */
  lines: string[];
  /** Gọi khi người chơi hoàn thành câu thoại cuối cùng và Lumi tự hủy (biến mất) */
  onComplete: () => void;
  /** Cờ bật/tắt hiển thị */
  isVisible?: boolean;
  /** Tên nhân vật hiển thị trong bong bóng chat */
  speakerName?: string;
}

export const LumiSpeech: React.FC<LumiSpeechProps> = ({
  lines,
  onComplete,
  isVisible = true,
  speakerName = 'LUMI – NGƯỜI GÁC THƯ VIỆN',
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [typedText, setTypedText] = useState<string>('');
  const [isTypingFinished, setIsTypingFinished] = useState<boolean>(false);
  const [slideState, setSlideState] = useState<'entering' | 'entered' | 'exiting' | 'destroyed'>(
    'entering'
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentLine = lines[currentIndex] || '';

  // Hiệu ứng trượt xuất hiện từ góc phải màn hình khi mở LumiSpeech
  useEffect(() => {
    if (!isVisible) return;
    setSlideState('entering');
    const enterTimer = setTimeout(() => {
      setSlideState('entered');
    }, 40);
    return () => clearTimeout(enterTimer);
  }, [isVisible]);

  // Hiệu ứng gõ chữ từng đoạn thoại (chỉ chạy khi chuyển sang câu thoại mới)
  useEffect(() => {
    if (!isVisible || !currentLine) {
      return;
    }

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
  }, [currentIndex, currentLine, isVisible]);

  if (!isVisible || slideState === 'destroyed' || lines.length === 0) return null;

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
      // Hết chuỗi lời thoại -> Trượt ra góc phải và tự hủy (biến mất hoàn toàn)
      setSlideState('exiting');
      setTimeout(() => {
        setSlideState('destroyed');
        onComplete();
      }, 280);
    }
  };

  const slideTransformClass =
    slideState === 'entered'
      ? 'translate-x-0 opacity-100'
      : 'translate-x-28 opacity-0';

  return (
    <div
      className={`fixed right-3 sm:right-6 md:right-8 bottom-[76px] sm:bottom-[88px] md:bottom-[96px] z-30 flex flex-col items-end gap-2.5 pointer-events-none transition-all duration-300 ease-out ${slideTransformClass}`}
    >
      {/* Bong bóng chat hiển thị phía trên đầu nhân vật Lumi */}
      <div
        onClick={handleSkipTyping}
        className="pointer-events-auto relative w-[250px] xs:w-[290px] sm:w-[350px] md:w-[390px] bg-[#001833]/95 text-[#FFFFE3] border-2 border-[#ADEFD1] rounded-2xl p-3 sm:p-4 shadow-[0_10px_35px_rgba(0,0,0,0.9)] backdrop-blur-md cursor-pointer mb-1 animate-pop"
      >
        {/* Đuôi bong bóng chat ở đáy trỏ thẳng xuống đỉnh đầu robot Lumi */}
        <div
          className="
            absolute right-7 sm:right-9 -bottom-[11px] w-0 h-0
            border-x-[10px] border-x-transparent
            border-t-[11px] border-t-[#ADEFD1]
          "
        />
        <div
          className="
            absolute right-[29px] sm:right-[37px] -bottom-[8px] w-0 h-0
            border-x-[9px] border-x-transparent
            border-t-[10px] border-t-[#001833]
          "
        />

        <div className="mb-1">
          <span className="text-[10px] sm:text-xs font-black text-[#FFD700] uppercase tracking-wider block leading-normal py-0.5">
            {speakerName}
          </span>
        </div>

        <p className="text-xs sm:text-sm font-medium text-[#FFFFE3] leading-relaxed mb-3">
          “{typedText}”
          {!isTypingFinished && (
            <span className="animate-pulse inline-block ml-1 text-[#ADEFD1]">▌</span>
          )}
        </p>

        <div className="flex items-center justify-end">
          {isTypingFinished ? (
            <button
              onClick={handleNextLine}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 text-[#00203F] font-black text-[11px] sm:text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_14px_rgba(255,215,0,0.55)] flex items-center gap-1 cursor-pointer uppercase tracking-wide"
            >
              <span>TIẾP TỤC</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-[10px] text-[#ADEFD1]/80 italic font-semibold">
              (Nhấp để phát nhanh...)
            </span>
          )}
        </div>
      </div>

      {/* Nhân vật Robot Lumi cố định ở góc phải màn hình (bên dưới bong bóng chat) */}
      <div
        onClick={handleSkipTyping}
        className="pointer-events-auto group relative flex flex-col items-center shrink-0 cursor-pointer mr-2 sm:mr-3"
        title="Lumi - Người Gác Thư Viện"
      >
        <div className="relative w-14 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(173,239,209,0.35)_0%,_transparent_70%)] animate-pulse" />
          <img
            src={ROBOT_NORMAL_DATA_URL}
            alt="Lumi - Người Gác Thư Viện"
            className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(173,239,209,0.7)]"
          />
        </div>
      </div>
    </div>
  );
};
