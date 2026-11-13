import React, { useState } from 'react';
import { BookOpen, Sparkles, X, Lightbulb } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface LumiGuideProps {
  message?: string;
  hintText?: string;
  onUseHint?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const LumiGuide: React.FC<LumiGuideProps> = ({
  message = "Hãy khám phá các đồ vật lấp lánh trong căn phòng để giải mã manh mối!",
  hintText,
  onUseHint,
  isOpen,
  onClose,
}) => {
  const [showHint, setShowHint] = useState(false);

  if (!isOpen) return null;

  const handleRequestHint = () => {
    soundManager.playSparkle();
    setShowHint(true);
    if (onUseHint) {
      onUseHint();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[2000] p-4 animate-pop">
      <div className="bg-gradient-to-b from-[#00203F] to-[#00152B] border-2 border-[#ADEFD1] rounded-2xl max-w-lg w-full p-5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative text-[#FFFFE3]">
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-3 right-3 text-[#ADEFD1] hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          {/* Lumi Character Avatar */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FFD700] to-[#ADEFD1] p-0.5 shadow-[0_0_20px_rgba(255,215,0,0.6)] animate-float">
              <div className="w-full h-full bg-[#00203F] rounded-[14px] flex flex-col items-center justify-center text-[#FFD700]">
                <BookOpen className="w-8 h-8" />
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#ADEFD1] mt-0.5">LUMI</span>
              </div>
            </div>
            <Sparkles className="w-5 h-5 text-[#FFD700] absolute -top-2 -right-2 animate-spin" />
          </div>

          {/* Dialogue Speech Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-[#FFD700] flex items-center gap-1.5">
                <span>Lumi - Sách Phép Thuật</span>
              </h3>
            </div>

            <div className="bg-[#001020] border border-[#ADEFD1]/30 rounded-xl p-3 text-sm text-[#FFFFE3] leading-relaxed shadow-inner my-2">
              {message}
            </div>

            {/* Hint Section */}
            {hintText && (
              <div className="mt-3">
                {!showHint ? (
                  <button
                    onClick={handleRequestHint}
                    className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#ADEFD1] text-[#00203F] font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    <Lightbulb className="w-4 h-4 fill-[#00203F]" />
                    <span>Xem Gợi Ý Từ Lumi (-15 Điểm)</span>
                  </button>
                ) : (
                  <div className="bg-amber-950/80 border border-[#FFD700] text-[#FFD700] p-3 rounded-xl text-xs leading-relaxed animate-fadeIn">
                    <div className="font-bold flex items-center gap-1 mb-1">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Gợi ý mở khóa:</span>
                    </div>
                    {hintText}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
