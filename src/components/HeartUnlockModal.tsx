import React, { useState } from 'react';
import { X, Heart, Sparkles, Key, AlertCircle, Lock, Zap, BookOpen } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { KEY_CLUES_DATA, KeyClueInfo } from '../types/game';
import { CrystalBronzeBookKeySvg } from './InventoryModal';

interface HeartUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectedLetters: string[];
  collectedShardsCount: number;
  onSuccessUnlock: () => void;
  onQuickComplete?: () => void;
}

export const HeartUnlockModal: React.FC<HeartUnlockModalProps> = ({
  isOpen,
  onClose,
  collectedShardsCount,
  onSuccessUnlock,
  onQuickComplete,
}) => {
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedClueLetter, setSelectedClueLetter] = useState<KeyClueInfo | null>(null);

  if (!isOpen) return null;

  const isFullyUnlocked = collectedShardsCount >= 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFullyUnlocked) {
      soundManager.playWrong();
      setErrorMsg(
        'Bệ đá chưa đủ năng lượng! Bạn cần hoàn thành đủ 5 phòng để thu thập đủ 5 chìa khóa mới có thể mở khóa Trái Tim Thư Viện.'
      );
      return;
    }

    const cleanInput = passcode
      .trim()
      .toUpperCase()
      .replace(/\s+/g, ' ');

    const isCorrect =
      cleanInput === 'TÔN SƯ TRỌNG ĐẠO' ||
      cleanInput === 'TON SU TRONG DAO' ||
      cleanInput === 'TÔN SƯ TRỌNG ĐAO' ||
      cleanInput === 'TON SU TRỌNG ĐẠO';

    if (isCorrect) {
      soundManager.playCorrect();
      soundManager.playSparkle();
      onSuccessUnlock();
      onClose();
    } else {
      soundManager.playWrong();
      setErrorMsg(
        'Mật mã chưa đúng! Gợi ý: Hãy đọc 5 manh mối trên bệ đá. Đây là câu nói bí mật gồm bốn từ về truyền thống tôn kính thầy cô giáo.'
      );
    }
  };

  return (
    <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-pop">
      {/* Starry Night Background Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 28 }).map((_, idx) => (
          <span
            key={idx}
            style={{
              left: `${(idx * 37) % 100}%`,
              top: `${(idx * 53) % 100}%`,
              animationDelay: `${(idx % 5) * 0.4}s`,
            }}
            className="absolute w-1 h-1 rounded-full bg-[#FFD700]/70 shadow-[0_0_8px_#FFD700] animate-ping"
          />
        ))}
      </div>

      {selectedClueLetter ? (
        /* ===================================================================== */
        /* CLUE LETTER DETAIL VIEW (ĐỒNG BỘ CHỦ ĐỀ GAME - ĐÃ BỎ NÚT NHẬN CHÌA KHÓA) */
        /* ===================================================================== */
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
              ✦ MANH MỐI {selectedClueLetter.keyNumber}/5 • TRÁI TIM THƯ VIỆN ✦
            </p>

            <div className="bg-[#002447] text-white p-4 rounded-2xl border border-[#ADEFD1]/60 shadow-inner text-left">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#FFD700] uppercase mb-2">
                <span>📜</span>
                <span>LỜI GỢI Ý TỪ {selectedClueLetter.roomName.toUpperCase()}</span>
              </div>
              <p className="text-xs sm:text-sm font-bold leading-relaxed text-[#FFFFE3]">
                “{selectedClueLetter.fullLetter}”
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ===================================================================== */
        /* MAIN HEART UNLOCK INTERFACE (FULL KHUNG MAIN & ĐỒNG BỘ CHỦ ĐỀ GAME) */
        /* ===================================================================== */
        <div className="bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl w-full h-full max-w-[1440px] max-h-full flex flex-col justify-between p-4 sm:p-6 shadow-2xl relative text-[#FFFFE3] overflow-hidden z-10">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-[#ADEFD1]/30 pb-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#002447] border border-[#ADEFD1] flex items-center justify-center text-[#FFD700] shadow-md shrink-0">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-[#FFD700] text-[#FFD700]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-xl font-black text-white uppercase tracking-wider truncate">
                  KÍCH HOẠT TRÁI TIM THƯ VIỆN
                </h2>
                <p className="text-[10px] sm:text-xs text-[#ADEFD1] font-medium truncate">
                  Đọc 5 bức thư manh mối từ 5 chìa khóa bí mật để giải mã câu nói gồm 4 từ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  soundManager.playSparkle();
                  if (onQuickComplete && !isFullyUnlocked) {
                    onQuickComplete();
                  }
                  setPasscode('TÔN SƯ TRỌNG ĐẠO');
                  setErrorMsg('');
                }}
                className="px-3 py-1.5 rounded-full bg-[#002447] hover:bg-[#003366] border border-[#ADEFD1] text-[#ADEFD1] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                title="Tự động thu thập đủ 5 chìa khóa và điền mật mã TÔN SƯ TRỌNG ĐẠO"
              >
                <Zap className="w-3.5 h-3.5 text-[#FFD700]" />
                <span>Test nhanh</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#002447] border border-[#ADEFD1] text-[#ADEFD1] hover:text-[#001833] hover:bg-[#ADEFD1] flex items-center justify-center transition-all cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Content Grid (Full Height Responsive Layout) */}
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 pt-3 overflow-y-auto lg:overflow-hidden custom-scrollbar">
            {/* Left Column (7 cols): 5 Secret Keys & Clue Letters */}
            <div className="lg:col-span-7 flex flex-col bg-[#002447]/65 border border-[#ADEFD1]/40 rounded-2xl p-3.5 sm:p-4 min-h-0 shadow-inner">
              <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#ADEFD1]/25 shrink-0">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-[#FFD700] uppercase tracking-wide">
                  <Key className="w-4 h-4 text-[#FFD700]" />
                  <span>5 CHÌA KHÓA MANH MỐI TRÊN BỆ ĐÁ ({collectedShardsCount}/5)</span>
                </div>
                <span className="text-[10px] sm:text-xs text-[#ADEFD1] font-semibold">
                  (Nhấp vào từng chìa khóa để đọc thư 📜)
                </span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 custom-scrollbar flex flex-col justify-between">
                {KEY_CLUES_DATA.map((item, idx) => {
                  const isUnlocked = idx < collectedShardsCount;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        if (isUnlocked) {
                          soundManager.playSparkle();
                          setSelectedClueLetter(item);
                        } else {
                          soundManager.playWrong();
                          setErrorMsg(
                            `🔒 ${item.title} chưa được thu thập! Hãy hoàn thành các nhiệm vụ tại ${item.roomName} để mở khóa manh mối này.`
                          );
                        }
                      }}
                      className={`p-2.5 sm:p-3 rounded-xl text-xs flex items-center justify-between gap-3 border transition-all cursor-pointer ${
                        isUnlocked
                          ? 'bg-[#001833] border-[#ADEFD1]/70 text-[#FFFFE3] shadow-sm hover:border-[#FFD700] hover:bg-[#002447]'
                          : 'bg-[#001020]/60 border-[#ADEFD1]/20 text-slate-400 hover:border-[#ADEFD1]/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                            isUnlocked
                              ? 'bg-[#002447] border-[#ADEFD1] shadow-[0_0_12px_rgba(173,239,209,0.25)]'
                              : 'bg-[#001833] border-[#ADEFD1]/20'
                          }`}
                        >
                          {isUnlocked ? (
                            <CrystalBronzeBookKeySvg className="w-8 h-8" />
                          ) : (
                            <Lock className="w-4 h-4 text-[#ADEFD1]/40" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-black uppercase text-xs ${
                                isUnlocked ? 'text-[#FFD700]' : 'text-slate-400'
                              }`}
                            >
                              {item.title}
                            </span>
                            <span className="text-[10px] text-[#ADEFD1] font-bold truncate">
                              • {item.roomName}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#FFFFE3]/85 truncate mt-0.5">
                            {isUnlocked ? item.summary : 'Chưa thu thập chìa khóa này'}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isUnlocked ? (
                          <span className="px-3 py-1.5 rounded-full bg-[#ADEFD1] text-[#001833] text-[10px] sm:text-xs font-black flex items-center gap-1 shadow-xs hover:bg-white transition-colors uppercase">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Đọc thư</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-[#001833] border border-[#ADEFD1]/20 text-[10px] text-[#ADEFD1]/50 font-bold">
                            Chưa mở
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column (5 cols): Pedestal Showcase + Passcode Input & Activation */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-[#002447]/65 border border-[#ADEFD1]/40 rounded-2xl p-4 sm:p-5 space-y-3 shadow-inner">
              {/* Illuminated Heart Pedestal Emblem */}
              <div className="flex flex-col items-center justify-center text-center py-2 px-3 rounded-2xl bg-[#001833] border border-[#ADEFD1]/40 relative overflow-hidden">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#002447] border-2 border-[#FFD700]/70 flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.35)] mb-2">
                  <img
                    src="https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%205.%20PH%C3%92NG%20TRI%20%C3%82N%20%E2%80%93%20M%E1%BA%ACT%20M%C3%83%20CU%E1%BB%90I%20C%C3%99NG/TR%C3%81I%20TIM%20TH%C6%AF%20VI%E1%BB%86N.png"
                    alt="Trái Tim Thư Viện"
                    loading="eager"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_0_15px_rgba(255,215,0,0.8)] animate-pulse"
                  />
                </div>
                <span className="text-xs sm:text-sm font-black text-[#FFD700] uppercase tracking-wider">
                  PHONG ẤN TRÁI TIM THƯ VIỆN
                </span>
                <span className="text-[11px] text-[#ADEFD1] font-medium mt-0.5">
                  Kết nối 5 manh mối để tìm ra câu thành ngữ 4 từ
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5 my-auto">
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-black text-[#FFD700] uppercase tracking-wider text-center">
                    NHẬP CÂU NÓI BÍ MẬT GỒM 4 TỪ:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={passcode}
                      onChange={(e) => {
                        setPasscode(e.target.value);
                        setErrorMsg('');
                      }}
                      disabled={!isFullyUnlocked}
                      placeholder="NHẬP 4 TỪ BÍ MẬT..."
                      className={`w-full px-4 py-3.5 rounded-2xl text-center text-base sm:text-xl font-black uppercase tracking-widest outline-none shadow-inner transition-all border-2 ${
                        isFullyUnlocked
                          ? 'bg-[#001833] border-[#ADEFD1] focus:border-[#FFD700] text-[#FFD700] placeholder:text-[#ADEFD1]/40'
                          : 'bg-[#001020] border-[#ADEFD1]/25 text-slate-500 opacity-65 cursor-not-allowed'
                      }`}
                      autoFocus={isFullyUnlocked}
                    />
                    <Key
                      className={`w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 ${
                        isFullyUnlocked ? 'text-[#ADEFD1]' : 'text-slate-600'
                      }`}
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-950/90 border border-rose-400 rounded-xl text-rose-200 text-xs font-bold flex items-start gap-2 leading-relaxed animate-pop">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isFullyUnlocked}
                  className={`w-full py-3.5 px-6 rounded-full font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg uppercase tracking-wider ${
                    isFullyUnlocked
                      ? 'bg-[#ADEFD1] text-[#001833] hover:bg-white hover:scale-[1.02] active:scale-95 cursor-pointer'
                      : 'bg-[#001833] text-slate-400 border border-[#ADEFD1]/25 cursor-not-allowed opacity-70'
                  }`}
                >
                  {isFullyUnlocked ? (
                    <>
                      <Sparkles className="w-4 h-4 fill-[#001833]" />
                      <span>KÍCH HOẠT TRÁI TIM THƯ VIỆN</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>CHƯA ĐỦ 5 CHÌA KHÓA ({collectedShardsCount}/5)</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
