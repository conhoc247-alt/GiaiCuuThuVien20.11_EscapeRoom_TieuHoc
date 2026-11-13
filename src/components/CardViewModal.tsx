import React from 'react';
import { X, Heart, Sparkles, Award } from 'lucide-react';
import { TeacherCard } from '../types/game';
import { soundManager } from '../utils/audio';

interface CardViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: TeacherCard | null;
}

export const CardViewModal: React.FC<CardViewModalProps> = ({
  isOpen,
  onClose,
  card,
}) => {
  if (!isOpen || !card) return null;

  const themeStyles = {
    flower: {
      bg: 'bg-gradient-to-b from-[#FFF5F7] via-[#FFE4E6] to-[#FECDD3]',
      text: 'text-rose-950',
      border: 'border-rose-300',
      accent: 'text-rose-600',
      icon: 'fa-flower-tulip',
    },
    book: {
      bg: 'bg-gradient-to-b from-[#F0FDFA] via-[#CCFBF1] to-[#99F6E4]',
      text: 'text-teal-950',
      border: 'border-teal-400',
      accent: 'text-teal-700',
      icon: 'fa-book-bookmark',
    },
    star: {
      bg: 'bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]',
      text: 'text-amber-950',
      border: 'border-amber-400',
      accent: 'text-amber-700',
      icon: 'fa-star-shooting',
    },
  }[card.theme];

  return (
    <div className="fixed top-0 bottom-[50px] sm:bottom-[62px] left-0 right-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-pop">
      <div className="bg-[#00203F] border-2 border-[#FFD700] rounded-3xl max-w-lg w-full max-h-full overflow-y-auto p-4 sm:p-6 shadow-[0_15px_50px_rgba(0,0,0,0.9)] relative text-[#FFFFE3]">
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-[#ADEFD1] hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors z-20"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-4">
          <h2 className="text-lg font-extrabold text-[#FFD700] uppercase tracking-wider flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
            <span>Tấm Thiệp Tri Ân Thầy Cô</span>
          </h2>
          <p className="text-xs text-[#ADEFD1] italic">Được tạo ngày: {card.createdAt}</p>
        </div>

        {/* Card Design Frame */}
        <div className={`p-6 rounded-2xl border-4 ${themeStyles.border} ${themeStyles.bg} ${themeStyles.text} shadow-2xl relative overflow-hidden text-center my-2`}>
          <div className="absolute top-2 left-2 text-2xl opacity-20 text-rose-500">
            <i className="fa-solid fa-heart"></i>
          </div>
          <div className="absolute bottom-2 right-2 text-2xl opacity-20 text-rose-500">
            <i className="fa-solid fa-[#FFD700] fa-heart"></i>
          </div>

          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-white/80 shadow-md flex items-center justify-center text-rose-500 text-xl border border-rose-200">
              <Heart className="w-7 h-7 fill-rose-500 text-rose-500" />
            </div>
          </div>

          <h3 className="text-lg font-extrabold mb-3 text-rose-900 border-b border-rose-300/60 pb-2">
            Kính gửi: {card.teacherName}
          </h3>

          <div className="text-sm italic leading-relaxed my-4 px-2 font-medium">
            "{card.message}"
          </div>

          <div className="pt-4 border-t border-rose-300/60 flex items-center justify-between text-xs font-bold text-rose-900">
            <span>20/11 - Ngày Nhà Giáo Việt Nam</span>
            <span>Học sinh: {card.studentName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
