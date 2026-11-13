import React, { useState, useEffect } from 'react';
import { ArrowRight, SkipForward } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { ROBOT_NORMAL_DATA_URL, ROBOT_WARNING_DATA_URL } from '../utils/assets';

interface StoryCutsceneProps {
  onFinishCutscene: () => void;
}

const PEACEFUL_BG = 'https://github.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/blob/main/Tri%E1%BB%83n%20l%C3%A3m%20di%20s%E1%BA%A3n%20ng%C6%B0%E1%BB%9Di%20th%E1%BA%A7y%20huy%E1%BB%81n%20%E1%BA%A3o.png?raw=true';
const EMERGENCY_BG = 'https://github.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/blob/main/Th%C6%B0%20vi%E1%BB%87n%20ma%20thu%E1%BA%ADt%20v%C3%A0%20kho%20l%C6%B0u%20tr%E1%BB%AF%20b%C3%AD%20m%E1%BA%ADt.png?raw=true';

const ROBOT_NORMAL_SVG = ROBOT_NORMAL_DATA_URL;
const ROBOT_WARNING_SVG = ROBOT_WARNING_DATA_URL;

export const StoryCutscene: React.FC<StoryCutsceneProps> = ({ onFinishCutscene }) => {
  // Phase 1: Bối cảnh triển lãm bình thường
  // Phase 2: Tín hiệu Cảnh báo khẩn cấp (Hình 2)
  // Phase 3: Lời thoại robot 1 di chuyển lên khung trên, giao diện giữ nguyên trạng thái Cảnh báo khẩn cấp
  // Phase 4: Lời thoại robot 2 (kêu gọi giúp đỡ), sẵn sàng bắt đầu khám phá
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);
  const [isShaking, setIsShaking] = useState(false);

  // Preload SVGs and background images immediately for instant rendering
  useEffect(() => {
    const imgNormal = new Image();
    imgNormal.src = ROBOT_NORMAL_SVG;
    const imgWarning = new Image();
    imgWarning.src = ROBOT_WARNING_SVG;
    const bgPeaceful = new Image();
    bgPeaceful.src = PEACEFUL_BG;
    const bgEmergency = new Image();
    bgEmergency.src = EMERGENCY_BG;
  }, []);

  useEffect(() => {
    soundManager.playClick();
  }, [phase]);

  const handleNextPhase = () => {
    if (phase === 1) {
      // Phase 2: Warning with screen shake + emergency alarm sound + red warning state
      setIsShaking(true);
      soundManager.playWrong();
      setTimeout(() => setIsShaking(false), 900);
      setPhase(2);
    } else if (phase === 2) {
      // User clicks "ĐI GẶP NGƯỜI GÁC THƯ VIỆN":
      // Khung lời dẫn thay bằng lời thoại robot với style đồng bộ phòng chơi
      soundManager.playClick();
      setPhase(3);
    } else if (phase === 3) {
      // Next dialogue of Lumi
      soundManager.playClick();
      setPhase(4);
    } else {
      // Finish cutscene & enter Room 1 with transition
      soundManager.playDoorTransition();
      onFinishCutscene();
    }
  };

  // Determine which background image and atmosphere to show
  const currentBgSrc = phase === 1 ? PEACEFUL_BG : EMERGENCY_BG;
  const isEmergencyState = phase >= 2;

  const getButtonLabel = () => {
    switch (phase) {
      case 1:
        return 'TIẾP TỤC';
      case 2:
        return 'ĐI GẶP NGƯỜI GÁC THƯ VIỆN';
      case 3:
        return 'TIẾP TỤC';
      case 4:
        return 'BẮT ĐẦU KHÁM PHÁ';
    }
  };

  return (
    <div
      className={`fixed inset-0 w-full h-full z-[3000] bg-[#001730] flex flex-col items-center justify-between p-3 sm:p-6 overflow-hidden select-none transition-transform duration-100 ${
        isShaking ? 'animate-shake' : ''
      }`}
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentBgSrc}
          alt={phase === 1 ? 'Triển lãm di sản người thầy' : 'Thư viện số cảnh báo khẩn cấp'}
          className="w-full h-full object-cover filter brightness-95 transition-all duration-700"
          referrerPolicy="no-referrer"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />

        {/* Emergency Red Flash & Alarm Ambiance (Active for Phase 2, 3, and 4) */}
        {isEmergencyState && (
          <>
            <div className="absolute inset-0 bg-rose-950/30 mix-blend-color-burn pointer-events-none transition-opacity duration-700" />
            <div className="absolute inset-0 bg-red-600/20 animate-emergency-pulse pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/40 via-transparent to-red-950/30 pointer-events-none" />
          </>
        )}
      </div>

      {/* Top Bar with Skip Button Only */}
      <div className="relative z-20 w-full flex items-center justify-end">
        <button
          onClick={() => {
            soundManager.playClick();
            onFinishCutscene();
          }}
          className="px-4 py-2 rounded-full bg-[#001730]/85 hover:bg-[#002855] border-2 border-[#FFD700]/70 text-[#FFFFE3] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.8)] hover:scale-105 active:scale-95"
          title="Bỏ qua đoạn phim mở đầu"
        >
          <span>Bỏ Qua</span>
          <SkipForward className="w-3.5 h-3.5 text-[#FFD700]" />
        </button>
      </div>

      {/* TOP CONTAINER:
          - Khung lời dẫn / lời thoại đồng bộ phong cách các phòng chơi (Navy sang trọng + viền vàng #FFD700 + backdrop blur)
          - Đuôi bong bóng thoại ở chính giữa (left-1/2 -translate-x-1/2) trỏ thẳng xuống vị trí Center của Robot Lumi
      */}
      <div className="relative z-20 w-full max-w-4xl mx-auto mt-2 px-2 sm:px-4">
        {phase <= 2 ? (
          /* Khung lời dẫn truyện bối cảnh */
          <div
            key={`narration-phase-${phase}`}
            className="bg-gradient-to-r from-[#001730]/95 via-[#002855]/95 to-[#001730]/95 border-2 border-[#FFD700] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_10px_40px_rgba(0,0,0,0.85)] text-center text-[#FFFFE3] backdrop-blur-md animate-pop relative"
          >
            <div className="flex items-center justify-center gap-2 mb-2 pb-1.5 border-b border-[#FFD700]/30">
              <span className={`w-2.5 h-2.5 rounded-full ${phase === 1 ? 'bg-[#FFD700] animate-pulse' : 'bg-rose-500 animate-ping'}`} />
              <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#FFD700]">
                {phase === 1 ? 'BỐI CẢNH TRIỂN LÃM 20/11' : 'CẢNH BÁO KHẨN CẤP THƯ VIỆN SỐ'}
              </span>
            </div>

            {phase === 1 && (
              <p className="text-[#FFFFE3] font-bold text-sm sm:text-base md:text-lg leading-relaxed">
                Đêm 19/11, chỉ còn ít giờ nữa là chương trình triển lãm trực tuyến{' '}
                <span className="text-[#FFD700] font-black underline underline-offset-4">"Dấu ấn người thầy"</span> chính thức khai mạc.
              </p>
            )}

            {phase === 2 && (
              <p className="text-[#FFFFE3] font-bold text-sm sm:text-base md:text-lg leading-relaxed">
                Bỗng nhiên, hệ thống thư viện số phát ra tín hiệu cảnh báo khẩn cấp! Những cuốn sách
                quý biến mất khỏi giá, tranh chân dung các danh sư bị xáo trộn, những trang thơ tan
                thành nhiều mảnh và kho ký ức học đường bị khóa kín.
              </p>
            )}
          </div>
        ) : (
          /* LỜI THOẠI ROBOT DI CHUYỂN LÊN VỊ TRÍ KHUNG TRÊN (Bong bóng thoại có đuôi trỏ xuống chính giữa Robot) */
          <div
            key={`dialogue-phase-${phase}`}
            className="relative bg-gradient-to-r from-[#001730]/95 via-[#002855]/95 to-[#001730]/95 border-2 border-[#FFD700] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_10px_40px_rgba(0,0,0,0.85)] text-[#FFFFE3] backdrop-blur-md animate-slide-up"
          >
            {/* Header label for Lumi */}
            <div className="flex items-center justify-center gap-2 mb-2 pb-1.5 border-b border-[#FFD700]/30">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#FFD700]">
                LUMI - NGƯỜI GÁC THƯ VIỆN
              </span>
            </div>

            {/* Đuôi bong bóng nói trỏ xuống phía dưới chính giữa về phía Robot Lumi */}
            <div className="absolute -bottom-[16px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[16px] border-t-[#FFD700]" />
            <div className="absolute -bottom-[13px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-t-[13px] border-t-[#002855]" />

            {/* Nội dung lời thoại của robot */}
            {phase === 3 && (
              <p className="text-sm sm:text-lg md:text-xl font-medium text-[#FFFFE3] leading-relaxed italic text-center">
                “Ôi không! Kho tư liệu 20/11 đã bị khóa bởi một hệ thống bảo vệ bí ẩn! Năm nguồn
                năng lượng tri thức đã biến mất, khiến mọi căn phòng rơi vào trạng thái ngủ yên.”
              </p>
            )}

            {phase === 4 && (
              <p className="text-sm sm:text-lg md:text-xl font-medium text-[#FFFFE3] leading-relaxed italic text-center">
                “Nhà thám hiểm nhỏ tuổi, cậu có thể giúp mình không? Hãy giải mã những bí ẩn, thu
                thập đủ năm Mảnh Sáng Tri Thức và khôi phục thư viện trước khi lễ kỷ niệm bắt đầu!”
              </p>
            )}
          </div>
        )}
      </div>

      {/* MIDDLE & BOTTOM LAYOUT:
          - Robot Lumi CHỈ XUẤT HIỆN Ở PHASE 3 VÀ 4 (KHI BẮT ĐẦU CÓ LỜI THOẠI)
          - Ở Phase 1 & 2: Robot ẩn, người chơi ngắm toàn cảnh thư viện và đọc lời dẫn bối cảnh
          - Nút điều hướng luôn căn giữa hoàn hảo
      */}
      <div className="relative z-20 w-full max-w-xl mx-auto my-auto flex flex-col items-center justify-center py-2 px-4">
        {/* Robot Lumi - Chỉ hiện khi bắt đầu có lời thoại (phase >= 3) */}
        {phase >= 3 && (
          <div className="w-40 h-52 sm:w-48 sm:h-60 relative flex items-center justify-center animate-pop mx-auto mb-2">
            <img
              src={ROBOT_WARNING_SVG}
              alt="Robot Lumi Cảnh Báo"
              className="w-full h-full object-contain filter drop-shadow-[0_12px_35px_rgba(0,0,0,0.9)] animate-float"
              loading="eager"
            />
          </div>
        )}

        {/* Centered Action Button */}
        <div className={`flex justify-center w-full ${phase >= 3 ? 'mt-4 sm:mt-5' : 'mt-10 sm:mt-16'}`}>
          <button
            onClick={handleNextPhase}
            className="px-8 sm:px-12 py-3.5 rounded-full bg-gradient-to-r from-[#FFD700] via-amber-300 to-[#ADEFD1] text-[#00203F] font-black text-xs sm:text-sm md:text-base tracking-wider uppercase shadow-[0_0_25px_rgba(255,215,0,0.85)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2.5 border-2 border-slate-900 mx-auto"
          >
            <span>{getButtonLabel()}</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
