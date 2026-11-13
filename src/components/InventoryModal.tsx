import React, { useState } from 'react';
import { X, Backpack, Sparkles, Key, Heart, BookOpen, Lock, CheckCircle2, Calendar } from 'lucide-react';
import { InventoryItem, TeacherCard, KEY_CLUES_DATA, KeyClueInfo } from '../types/game';
import { soundManager } from '../utils/audio';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  collectedLetters: string[];
  collectedShards: number[];
  savedCard: TeacherCard | null;
  onViewCard: () => void;
}

export const CrystalBronzeBookKeySvg: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="inv-crystal-aura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ADEFD1" stopOpacity="0.8" />
        <stop offset="60%" stopColor="#4FC3F7" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#00203F" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="inv-bronze-gold-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFE3" />
        <stop offset="40%" stopColor="#ADEFD1" />
        <stop offset="80%" stopColor="#4FC3F7" />
        <stop offset="100%" stopColor="#00355E" />
      </linearGradient>
      <linearGradient id="inv-crystal-gem" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#ADEFD1" />
        <stop offset="100%" stopColor="#4FC3F7" />
      </linearGradient>
      <filter id="inv-key-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <circle cx="100" cy="100" r="88" fill="url(#inv-crystal-aura)" />
    <g filter="url(#inv-key-glow)">
      <rect x="93" y="88" width="14" height="86" rx="6" fill="url(#inv-bronze-gold-body)" stroke="#FFFFE3" strokeWidth="1.5" />
      <path d="M 100,94 L 100,168" stroke="#FFFFE3" strokeWidth="1.8" strokeDasharray="5 4" />
      <circle cx="100" cy="115" r="3" fill="#ffffff" />
      <circle cx="100" cy="135" r="3" fill="#ffffff" />
      <circle cx="100" cy="155" r="3" fill="#ffffff" />
      <path
        d="M 107,138 L 128,138 L 128,148 L 116,148 L 116,156 L 132,156 L 132,168 L 107,168 Z"
        fill="url(#inv-bronze-gold-body)"
        stroke="#FFFFE3"
        strokeWidth="1.2"
      />
      <circle cx="100" cy="58" r="36" fill="#001833" stroke="url(#inv-bronze-gold-body)" strokeWidth="5" />
      <circle cx="100" cy="58" r="29" fill="none" stroke="#ADEFD1" strokeWidth="1.2" strokeDasharray="4 3" />
      <polygon points="100,14 106,24 100,29 94,24" fill="url(#inv-crystal-gem)" />
      <polygon points="144,58 134,64 129,58 134,52" fill="url(#inv-crystal-gem)" />
      <polygon points="56,58 66,64 71,58 66,52" fill="url(#inv-crystal-gem)" />
      <g transform="translate(100, 58)">
        <path d="M -18,-10 Q -9,-14 0,-8 L 0,12 Q -9,6 -18,10 Z" fill="url(#inv-crystal-gem)" stroke="#FFFFE3" strokeWidth="1.5" />
        <path d="M 18,-10 Q 9,-14 0,-8 L 0,12 Q 9,6 18,10 Z" fill="url(#inv-crystal-gem)" stroke="#FFFFE3" strokeWidth="1.5" />
        <line x1="0" y1="-9" x2="0" y2="12" stroke="#00203F" strokeWidth="2" />
        <line x1="-13" y1="-4" x2="-4" y2="-2" stroke="#00203F" strokeWidth="1.2" />
        <line x1="-13" y1="1" x2="-4" y2="3" stroke="#00203F" strokeWidth="1.2" />
        <line x1="4" y1="-2" x2="13" y2="-4" stroke="#00203F" strokeWidth="1.2" />
        <line x1="4" y1="3" x2="13" y2="1" stroke="#00203F" strokeWidth="1.2" />
      </g>
    </g>
  </svg>
);

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  inventory,
  collectedShards,
  savedCard,
  onViewCard,
}) => {
  const [selectedClueLetter, setSelectedClueLetter] = useState<KeyClueInfo | null>(null);
  const [inspectedCalendar, setInspectedCalendar] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 bottom-[60px] left-0 right-0 bg-black/85 backdrop-blur-xs flex items-center justify-center z-40 p-4 overflow-hidden">
      {selectedClueLetter ? (
        /* CLUE LETTER DETAIL VIEW (ĐỒNG BỘ CHỦ ĐỀ GAME - ĐÃ BỎ NÚT NHẬN CHÌA KHÓA VÀO TÚI ĐỒ) */
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => {
            soundManager.playClick();
            setSelectedClueLetter(null);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-md w-full p-6 text-center shadow-[0_0_50px_rgba(0,0,0,0.95)] text-white relative animate-pop"
          >
            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedClueLetter(null);
              }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#002447] border border-[#ADEFD1] text-[#ADEFD1] hover:text-[#001833] hover:bg-[#ADEFD1] flex items-center justify-center transition-all cursor-pointer shadow-md"
              title="Đóng manh mối"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-[#002447] border-2 border-[#ADEFD1] flex items-center justify-center shadow-[0_0_25px_rgba(173,239,209,0.3)]">
              <CrystalBronzeBookKeySvg className="w-18 h-18" />
            </div>

            <h3 className="text-xl font-black text-white uppercase tracking-wider mb-1">
              {selectedClueLetter.title}
            </h3>
            <p className="text-[11px] font-bold text-[#ADEFD1] uppercase tracking-widest mb-4">
              {selectedClueLetter.subtitle}
            </p>

            <div className="bg-[#002447] text-white p-4 rounded-2xl border border-[#ADEFD1]/60 shadow-inner text-left">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#FFD700] uppercase mb-2">
                <span>📜</span>
                <span>{selectedClueLetter.roomHeader}</span>
              </div>
              <p className="text-xs sm:text-sm font-bold leading-relaxed text-[#FFFFE3]">
                “{selectedClueLetter.fullLetter}”
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-4xl w-full max-h-[86vh] flex flex-col p-5 sm:p-6 shadow-2xl relative text-[#FFFFE3] animate-pop">
          {/* Close button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#002447] border border-[#ADEFD1] text-[#ADEFD1] hover:text-[#001833] hover:bg-[#ADEFD1] flex items-center justify-center transition-all z-10 cursor-pointer"
            title="Đóng túi đồ"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 pb-3 border-b border-[#ADEFD1]/30">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#002447] border border-[#ADEFD1] flex items-center justify-center text-[#ADEFD1] shadow-md shrink-0">
              <Backpack className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFD700]" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-xl font-black text-white uppercase tracking-wider truncate">
                TÚI ĐỒ HÀNH TRANG
              </h2>
              <p className="text-[11px] sm:text-xs text-[#ADEFD1] mt-0.5 truncate">
                Kho lưu trữ 5 chìa khóa manh mối và toàn bộ vật phẩm thu thập trong hành trình
              </p>
            </div>
          </div>

          {/* Main Content Area: 2 Columns */}
          <div className="flex-1 min-h-0 overflow-y-auto pt-3 pr-1 sm:pr-2 space-y-4 md:space-y-0 md:grid md:grid-cols-12 md:gap-4 custom-scrollbar">
            {/* Column 1: 5 Clue Keys on Stone Pedestal (7 columns) */}
            <div className="md:col-span-7 flex flex-col bg-[#002447]/65 border border-[#ADEFD1]/40 p-3.5 sm:p-4 rounded-2xl shadow-inner min-h-0">
              <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#ADEFD1]/25 shrink-0">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-[#FFD700] uppercase tracking-wide">
                  <Key className="w-4 h-4 text-[#FFD700]" />
                  <span>5 CHÌA KHÓA BÍ MẬT & MANH MỐI ({collectedShards.length}/5)</span>
                </div>
                <span className="text-[10px] text-[#ADEFD1] font-semibold">
                  (Nhấp để đọc thư 📜)
                </span>
              </div>

              <div className="space-y-2 overflow-y-auto pr-1 flex-1 custom-scrollbar">
                {KEY_CLUES_DATA.map((item, idx) => {
                  const isCollected = collectedShards.includes(item.keyNumber);
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        if (isCollected) {
                          soundManager.playSparkle();
                          setSelectedClueLetter(item);
                        } else {
                          soundManager.playWrong();
                        }
                      }}
                      className={`p-2.5 sm:p-3 rounded-xl text-xs flex items-center justify-between gap-3 border transition-all ${
                        isCollected
                          ? 'bg-[#001833] border-[#ADEFD1]/70 text-[#FFFFE3] shadow-sm cursor-pointer hover:border-[#FFD700] hover:bg-[#002447]'
                          : 'bg-[#001020]/60 border-[#ADEFD1]/20 text-slate-400 opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                          isCollected
                            ? 'bg-[#002447] border-[#ADEFD1] shadow-[0_0_12px_rgba(173,239,209,0.25)]'
                            : 'bg-[#001833] border-[#ADEFD1]/20'
                        }`}>
                          {isCollected ? (
                            <CrystalBronzeBookKeySvg className="w-8 h-8" />
                          ) : (
                            <Lock className="w-4 h-4 text-[#ADEFD1]/40" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-black uppercase tracking-wide text-xs ${
                              isCollected ? 'text-[#FFD700]' : 'text-slate-400'
                            }`}>
                              Chìa Khóa Bí Mật Số {item.keyNumber}
                            </span>
                            <span className="text-[10px] text-[#ADEFD1] font-bold truncate">
                              • {item.roomName}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#FFFFE3]/85 truncate mt-0.5">
                            {isCollected ? item.summary : 'Chưa giải mã căn phòng này để nhận chìa khóa'}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isCollected ? (
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-full bg-[#ADEFD1] text-[#001833] text-[10px] sm:text-xs font-black flex items-center gap-1 shadow-xs hover:bg-white transition-colors cursor-pointer uppercase"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Đọc thư</span>
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-[#001833] border border-[#ADEFD1]/20 text-[10px] text-[#ADEFD1]/50 font-bold flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>Chưa mở</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Items & Artifacts Collected (5 columns) */}
            <div className="md:col-span-5 flex flex-col bg-[#001020]/90 border border-[#ADEFD1]/40 p-3.5 sm:p-4 rounded-2xl shadow-inner min-h-0">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FFD700] uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-[#FFD700]" />
                  <span>VẬT PHẨM KHAI PHÁ & THIỆP ({inventory.length + (savedCard ? 1 : 0)})</span>
                </div>
              </div>

              <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 custom-scrollbar">
                {/* Saved Card in Room 5 */}
                {savedCard && (
                  <div className="p-3 bg-gradient-to-r from-pink-950/80 via-purple-950/70 to-[#001020] border-2 border-pink-400 rounded-xl flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Heart className="w-7 h-7 text-rose-400 fill-rose-400 shrink-0 animate-pulse" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#FFD700] truncate">Tấm Thiệp Tri Ân 20/11</div>
                        <div className="text-[11px] text-[#ADEFD1] truncate">Gửi: {savedCard.teacherName}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onViewCard();
                      }}
                      className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-amber-400 text-[#00203F] text-xs font-black rounded-full hover:scale-105 transition-transform cursor-pointer shrink-0 uppercase shadow-md"
                    >
                      Xem Thiệp
                    </button>
                  </div>
                )}

                {/* Inventory Items list */}
                {inventory.map((item) => {
                  const getIconEmoji = (i: InventoryItem) => {
                    if (i.id.includes('calendar')) return '📅';
                    if (i.type === 'key' || i.id.includes('key')) return '🔑';
                    if (i.type === 'shard' || i.id.includes('shard')) return '✨';
                    if (i.id.includes('crystal')) return '💎';
                    if (i.type === 'letter' || i.type === 'scroll') return '📜';
                    return '🎁';
                  };

                  const isCalendar = item.id.includes('calendar');

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (isCalendar) {
                          soundManager.playSparkle();
                          setInspectedCalendar(true);
                        }
                      }}
                      className={`p-3 bg-[#001730] border rounded-xl flex items-center gap-3 shadow-inner transition-all ${
                        isCalendar
                          ? 'border-[#FFD700] hover:border-yellow-300 hover:bg-[#002855] cursor-pointer shadow-[0_0_12px_rgba(255,215,0,0.3)]'
                          : 'border-[#ADEFD1]/40 hover:border-[#FFD700]/70'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#001020] border border-[#FFD700] flex items-center justify-center text-[#FFD700] shrink-0 text-xl shadow-xs">
                        <span>{getIconEmoji(item)}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#FFD700] truncate flex items-center gap-1.5">
                          <span>{item.name}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div className="text-[11px] text-slate-300 leading-tight mt-0.5">
                          {item.description}
                        </div>
                      </div>

                      {isCalendar && (
                        <div className="shrink-0">
                          <button
                            type="button"
                            className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-[#00203F] text-[10px] font-black uppercase flex items-center gap-1 shadow-sm hover:scale-105 transition-transform"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>Xem tờ lịch</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {inventory.length === 0 && !savedCard && (
                  <div className="h-32 flex flex-col items-center justify-center text-center p-4 bg-black/30 border border-dashed border-slate-800 rounded-xl text-xs text-slate-500 italic">
                    <Backpack className="w-8 h-8 text-slate-600 mb-1" />
                    <span>Chưa có thêm vật phẩm khai phá nào trong túi đồ. Hãy khám phá các căn phòng để thu thập vật phẩm!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VINTAGE CALENDAR SHEET INSPECTION MODAL (KHÔNG LỘ HINT NĂM) */}
      {inspectedCalendar && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-pop">
          <div className="bg-[#FFFDF2] border-4 border-[#D4AF37] rounded-3xl relative w-full max-w-4xl h-full max-h-[89vh] overflow-y-auto p-5 sm:p-8 text-center shadow-[0_0_60px_rgba(255,215,0,0.85)] text-[#1A1A1A] flex flex-col items-center justify-center">
            {/* Top Close Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                setInspectedCalendar(false);
              }}
              className="absolute top-3 right-3 text-amber-900 hover:text-black p-1 rounded-full hover:bg-black/10 transition-colors z-20 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Vintage Tear-off Calendar Graphic */}
            <div className="w-full bg-[#FAFAFA] border-2 border-red-700 rounded-2xl overflow-hidden shadow-xl mb-4">
              {/* Red Header Bar (Không lộ năm) */}
              <div className="bg-red-700 text-white py-2.5 px-3 flex flex-col items-center justify-center border-b-2 border-red-800">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-200">
                  LỊCH TRUYỀN THỐNG VIỆT NAM
                </span>
                <span className="text-sm font-black uppercase tracking-wider mt-0.5">
                  THÁNG 11
                </span>
              </div>

              {/* Big Day Number */}
              <div className="py-6 px-4 bg-gradient-to-b from-white to-[#FFFBEB] flex flex-col items-center justify-center">
                <span
                  className="text-7xl sm:text-8xl font-black text-red-600 leading-none tracking-tighter drop-shadow-sm"
                  style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                >
                  20
                </span>
                <span className="text-xs sm:text-sm font-black text-amber-900 uppercase tracking-widest mt-2">
                  NGÀY NHÀ GIÁO VIỆT NAM
                </span>
                <div className="w-16 h-0.5 bg-red-600 my-2 rounded-full" />
                <p className="text-[11px] font-bold text-amber-800 italic max-w-xs text-center leading-snug">
                  “Quyết định của Hội đồng Bộ trưởng chính thức lấy ngày 20/11 hằng năm làm Ngày Nhà giáo Việt Nam.”
                </p>
              </div>

              {/* Footer Stamp */}
              <div className="bg-amber-100/80 py-1.5 px-3 border-t border-amber-300 text-[10px] font-bold text-amber-900 flex items-center justify-center gap-1">
                <span>✦ Mảnh lịch kỷ niệm trong Album Ký Ức ✦</span>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                setInspectedCalendar(false);
              }}
              className="w-full py-3 rounded-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 text-[#00203F] font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4 text-[#00203F]" />
              <span>ĐÓNG TỜ LỊCH</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
