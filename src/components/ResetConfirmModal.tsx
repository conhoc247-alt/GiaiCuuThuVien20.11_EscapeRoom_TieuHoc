import React from 'react';
import { RotateCcw, X, AlertTriangle } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-[3500] p-4 animate-pop">
      <div className="bg-gradient-to-b from-[#00203F] to-[#001020] border-2 border-rose-500 rounded-3xl max-w-md w-full p-6 shadow-[0_0_40px_rgba(244,63,94,0.4)] relative text-[#FFFFE3] text-center">
        {/* Close button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-rose-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Warning Icon */}
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 shadow-[0_0_20px_#f43f5e] animate-bounce">
            <AlertTriangle className="w-8 h-8" />
          </div>
        </div>

        <h2 className="text-xl font-black text-rose-400 uppercase tracking-wider mb-2">
          CHƠI LẠI TỪ ĐẦU?
        </h2>

        <p className="text-xs text-rose-100/90 leading-relaxed mb-6 px-2">
          Bạn có chắc chắn muốn xóa toàn bộ tiến độ, điểm số, các Mảnh Sáng Tri Thức và tấm thiệp đã thu thập để bắt đầu lại chuyến phiêu lưu không?
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="flex-1 py-2.5 bg-slate-800 text-slate-200 font-bold text-xs rounded-full hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Hủy Bỏ
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onConfirmReset();
              onClose();
            }}
            className="flex-1 py-2.5 bg-rose-600 text-white font-black text-xs rounded-full hover:bg-rose-500 transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ĐỒNG Ý CHƠI LẠI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
