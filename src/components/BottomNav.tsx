import React from 'react';
import { Backpack } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface BottomNavProps {
  onGoHome: () => void;
  onOpenMap: () => void;
  onOpenHeartModal: () => void;
  onOpenInventory: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onOpenResetConfirm?: () => void;
  onQuickComplete?: () => void;
  shardsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  onGoHome,
  onOpenMap,
  onOpenInventory,
  onQuickComplete,
  shardsCount = 0,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full h-[46px] sm:h-[56px] md:h-[60px] bg-[#00203F] border-t border-[#ADEFD1]/30 flex items-center justify-between z-[100] px-1.5 sm:px-3 md:px-4 shadow-2xl">
      {/* LOGO BÊN TRÁI */}
      <div className="nav-logo">
        <i className="fa-solid fa-landmark"></i>
        <span>History Games</span>
      </div>

      {/* Nav Tabs Container - 3 main center buttons */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3 flex-grow">
        {/* Nút 1: Escape Room (Home) */}
        <button
          onClick={() => {
            soundManager.playClick();
            onGoHome();
          }}
          className="px-2 sm:px-4 md:px-5 py-1 sm:py-1.5 md:py-2 rounded-full font-black text-[11px] sm:text-xs md:text-sm transition-all duration-300 text-center flex items-center justify-center gap-1 sm:gap-1.5 border-2 bg-[#ADEFD1] text-[#00203F] border-[#ADEFD1] shadow-[0_0_12px_rgba(173,239,209,0.4)] hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          title="Về Trang Chủ Escape Room"
        >
          <span className="text-xs sm:text-sm md:text-base leading-none">🏠</span>
          <span>Escape Room</span>
        </button>

        {/* Nút 2: Bản đồ */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenMap();
          }}
          className="px-2 sm:px-4 md:px-5 py-1 sm:py-1.5 md:py-2 rounded-full font-black text-[11px] sm:text-xs md:text-sm transition-all duration-300 text-center flex items-center justify-center gap-1 sm:gap-1.5 border-2 bg-[#FFFFE3] text-[#00203F] border-transparent hover:bg-white hover:scale-105 active:scale-95 shadow-md cursor-pointer whitespace-nowrap"
          title="Bản đồ 5 căn phòng"
        >
          <span className="text-xs sm:text-sm md:text-base leading-none">🗺️</span>
          <span>Bản đồ</span>
        </button>
      </div>

      {/* Right Actions (Túi đồ & Test nhanh) */}
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
        {/* Quick Test 5 Rooms Button */}
        {onQuickComplete && shardsCount < 5 && (
          <button
            onClick={() => {
              soundManager.playSparkle();
              onQuickComplete();
            }}
            className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400 text-amber-200 rounded-full text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm whitespace-nowrap"
            title="Nút Test 5 phòng"
          >
            <span className="text-amber-400">⚡</span>
            <span className="hidden xs:inline">Test</span>
          </button>
        )}

        {/* Backpack / Túi đồ */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenInventory();
          }}
          className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-[#00152B] border border-[#ADEFD1]/50 hover:border-[#ADEFD1] text-[#FFFFE3] rounded-full transition-all flex items-center gap-1 text-[11px] sm:text-xs font-bold cursor-pointer shadow-sm"
          title="Mở túi đồ"
        >
          <Backpack className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFD700]" />
          <span className="hidden sm:inline">Túi đồ</span>
        </button>
      </div>
    </nav>
  );
};
