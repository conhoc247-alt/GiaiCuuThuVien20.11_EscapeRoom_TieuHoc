import React, { useState, useEffect } from 'react';
import {
  Trophy,
  RotateCcw,
  Heart,
  Sparkles,
  CheckCircle2,
  Key,
  ArrowRight,
  Home,
} from 'lucide-react';
import { TeacherCard } from '../types/game';
import { soundManager } from '../utils/audio';
import { ROBOT_NORMAL_DATA_URL } from '../utils/assets';
import { CrystalBronzeBookKeySvg } from './InventoryModal';

interface VictoryScreenProps {
  score: number;
  completedTasksCount: number;
  savedCard?: TeacherCard | null;
  onViewCard?: () => void;
  onPlayAgain: () => void;
  onClose?: () => void;
}

const REVIVED_LIBRARY_BG =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/Tri%E1%BB%83n%20l%C3%A3m%20di%20s%E1%BA%A3n%20ng%C6%B0%E1%BB%9Di%20th%E1%BA%A7y%20huy%E1%BB%81n%20%E1%BA%A3o.png';

const HEART_IMG =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%205.%20PH%C3%92NG%20TRI%20%C3%82N%20%E2%80%93%20M%E1%BA%ACT%20M%C3%83%20CU%E1%BB%90I%20C%C3%99NG/TR%C3%81I%20TIM%20TH%C6%AF%20VI%E1%BB%86N.png';

const ROOM5_BG =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%205.%20PH%C3%92NG%20TRI%20%C3%82N%20%E2%80%93%20M%E1%BA%ACT%20M%C3%83%20CU%E1%BB%90I%20C%C3%99NG/PH%C3%92NG%205.%20PH%C3%92NG%20TRI%20%C3%82N%20%E2%80%93%20M%E1%BA%ACT%20M%C3%83%20CU%E1%BB%90I%20C%C3%99NG.png';

interface RestoredRoomScene {
  room: number;
  shortTitle: string;
  title: string;
  summary: string;
  bg: string;
}

const RESTORED_ROOMS: RestoredRoomScene[] = [
  {
    room: 1,
    shortTitle: 'Phòng 1 – Lịch Sử',
    title: 'Phòng 1 – Lịch Sử: Giải Mã Dấu Mốc Thời Gian',
    summary:
      'Những dấu mốc lịch sử được khôi phục trên cuộn thánh chỉ, ba phong ấn trong chiếc rương cổ được phá giải. Chiếc đồng hồ khổng lồ sáng lên, đánh dấu dòng thời gian đã trở lại.',
    bg: 'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/M%C3%80N%20K%E1%BA%BET%20TH%C3%9AC/PH%C3%92NG%201.%20PH%C3%92NG%20L%E1%BB%8ACH%20S%E1%BB%AC%20-%20GI%E1%BA%A2I%20M%C3%83%20D%E1%BA%A4U%20M%E1%BB%90C%20TH%E1%BB%9CI%20GIAN.png',
  },
  {
    room: 2,
    shortTitle: 'Phòng 2 – Danh Sư',
    title: 'Phòng 2 – Danh Sư: Chân Dung Bí Ẩn',
    summary:
      'Mười bức chân dung tìm lại đúng danh tính, những hồ sơ danh sư thất lạc được khôi phục. Hai khung tranh cổ đồng loạt phát sáng, lưu giữ những câu chuyện về các bậc thầy đáng kính.',
    bg: 'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/M%C3%80N%20K%E1%BA%BET%20TH%C3%9AC/PH%C3%92NG%202.%20PH%C3%92NG%20DANH%20S%C6%AF%20%E2%80%93%20CH%C3%82N%20DUNG%20B%C3%8D%20%E1%BA%A8N.png',
  },
  {
    room: 3,
    shortTitle: 'Phòng 3 – Văn Học',
    title: 'Phòng 3 – Văn Học: Những Vần Thơ Thất Lạc',
    summary:
      'Mười lời hay về truyền thống tôn sư trọng đạo được ghép lại hoàn chỉnh. Bài thơ Lời Tri Ân Thầm Lặng trở về đúng thứ tự, chiếc bút phép thuật thức tỉnh và tỏa sáng.',
    bg: 'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/M%C3%80N%20K%E1%BA%BET%20TH%C3%9AC/PH%C3%92NG%203.%20PH%C3%92NG%20V%C4%82N%20H%E1%BB%8CC%20%E2%80%93%20NH%E1%BB%AENG%20V%E1%BA%A6N%20TH%C6%A0%20TH%E1%BA%A4T%20L%E1%BA%A0C.png',
  },
  {
    room: 4,
    shortTitle: 'Phòng 4 – Ký Ức',
    title: 'Phòng 4 – Ký Ức: Hộp Thời Gian',
    summary:
      'Năm bức ảnh ký ức được khôi phục trong cuốn album, những kỷ vật học đường tìm lại câu chuyện của mình. Bức thư mật được giải mã, chiếc hộp thời gian mở ra với mật mã 20.11.1982.',
    bg: 'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/M%C3%80N%20K%E1%BA%BET%20TH%C3%9AC/PH%C3%92NG%204.%20PH%C3%92NG%20K%C3%9D%20%E1%BB%A8C%20%E2%80%93%20H%E1%BB%98P%20TH%E1%BB%9CI%20GIAN.png',
  },
  {
    room: 5,
    shortTitle: 'Phòng 5 – Tri Ân',
    title: 'Phòng 5 – Tri Ân: Mật Mã Cuối Cùng',
    summary:
      'Năm trang của Cuốn Sổ Tri Thức được khôi phục, năm bông hoa trên Cây Tri Ân đồng loạt nở rộ. Năm chìa khóa bí mật hội tụ, mật mã “TÔN SƯ TRỌNG ĐẠO” được giải đáp, đánh thức Trái Tim Thư Viện và phá tan phong ấn cuối cùng.',
    bg: 'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/M%C3%80N%20K%E1%BA%BET%20TH%C3%9AC/PH%C3%92NG%205.%20PH%C3%92NG%20TRI%20%C3%82N%20M%E1%BA%ACT%20M%C3%83%20CU%E1%BB%90I%20C%C3%99NG.png',
  },
];

// Lời dẫn chuyện Cảnh 1, 2, 3 (Không in nghiêng, không ngoặc kép)
const SCENE_NARRATIONS: Record<number, string> = {
  1: 'Bí mật cuối cùng đã được giải mã! Năm chìa khóa hội tụ, đánh thức sức mạnh của Trái Tim Thư Viện. Truyền thống tôn sư trọng đạo chính là ánh sáng kết nối tri thức, lòng biết ơn và những giá trị tốt đẹp qua bao thế hệ.',
  2: 'Những trang sử đã trở về đúng dấu mốc. Chân dung các danh sư được khôi phục. Những vần thơ lại ngân vang, ký ức học đường được gìn giữ và những lời tri ân tiếp tục tỏa sáng.\nTừng mảnh tri thức thất lạc giờ đây đã trở về, thắp sáng cả thư viện!',
  3: 'Thư viện số đã hồi sinh! Nhưng điều quý giá nhất không chỉ nằm ở những cuốn sách hay những ký ức được khôi phục. Đó còn là lòng kính trọng đối với thầy cô, sự trân trọng tri thức và ý thức tiếp nối những điều tốt đẹp mà các thế hệ đi trước đã truyền dạy.',
};

// Lời thoại cuối cùng từ Lumi ở Cảnh 4 (Xuất hiện lần lượt từng đoạn khi nhấn Tiếp tục)
const LUMI_FINAL_LINES = [
  'Chúng ta làm được rồi! Cảm ơn cậu đã cùng mình vượt qua năm căn phòng và giải cứu thư viện!',
  'Qua hành trình này, chúng ta đã tìm hiểu về những dấu mốc lịch sử, những người thầy đáng kính, những vần thơ tri ân và biết bao ký ức đẹp dưới mái trường.',
  'Nhưng hãy nhớ nhé! Tôn sư trọng đạo không chỉ là lời nói trong ngày 20/11, mà còn được thể hiện qua cách chúng ta học tập, cư xử và trân trọng những điều thầy cô đã dạy.',
  'Hãy mang những điều tốt đẹp ấy theo mình, dù mai này cậu đi đến đâu!',
];

// Positions for 5 Secret Keys arranged in a semi-circular arc around Trái Tim Thư Viện
const KEY_ARC_POSITIONS = [
  { x: -135, y: -25, angle: 35 },
  { x: -78, y: -95, angle: 62 },
  { x: 0, y: -122, angle: 90 },
  { x: 78, y: -95, angle: 118 },
  { x: 135, y: -25, angle: 145 },
];

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  completedTasksCount,
  savedCard,
  onViewCard,
  onPlayAgain,
  onClose,
}) => {
  // Current finale scene: 1 to 5
  const [currentScene, setCurrentScene] = useState<number>(1);

  // Scene 1 specific 6-step animation state
  const [scene1Step, setScene1Step] = useState<number>(0);

  // Scene 2 active room index (0 to 4) + sweep animation key
  const [scene2RoomIdx, setScene2RoomIdx] = useState<number>(0);
  const [sweepKey, setSweepKey] = useState<number>(0);

  // Scene 4 Lumi paragraph index (0 to 3) & closing transition state
  const [lumiLineIdx, setLumiLineIdx] = useState<number>(0);
  const [lumiBookClosing, setLumiBookClosing] = useState<boolean>(false);

  // Typewriter text state for Scenes 1–4
  const [typedText, setTypedText] = useState<string>('');
  const [isTypingDone, setIsTypingDone] = useState<boolean>(false);

  // Preload finale background images & gửi điểm về hệ thống CMS
  useEffect(() => {
    [REVIVED_LIBRARY_BG, HEART_IMG, ...RESTORED_ROOMS.map((r) => r.bg)].forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const tasksScore = completedTasksCount || 10;
    window.parent.postMessage(
      {
        answerTrue: tasksScore, // Đạt điểm theo thang 10 nhiệm vụ
        totalQuestion: 10, // Tổng 10 nhiệm vụ
        command: 'submit_result', // Không được đổi
      },
      '*'
    );
  }, [completedTasksCount]);

  // Sound per scene
  useEffect(() => {
    if (currentScene === 1) {
      soundManager.playDoorTransition();
      soundManager.playSparkle();
    } else if (currentScene === 2) {
      soundManager.playSparkle();
    } else if (currentScene === 3) {
      soundManager.playVictory();
      soundManager.playSparkle();
    } else if (currentScene === 4) {
      soundManager.playSparkle();
    } else if (currentScene === 5) {
      soundManager.playVictory();
      const tasksScore = completedTasksCount || 10;
      window.parent.postMessage(
        {
          answerTrue: tasksScore, // Hoàn thành trọn vẹn cả 10 nhiệm vụ
          totalQuestion: 10, // Thang 10 nhiệm vụ
          command: 'submit_result', // Không được đổi
        },
        '*'
      );
    }
  }, [currentScene, completedTasksCount]);

  // SCENE 1: 6-step visual choreography
  useEffect(() => {
    if (currentScene !== 1) return;
    setScene1Step(1);

    const timers = [
      setTimeout(() => {
        soundManager.playClick();
        setScene1Step(2);
      }, 450),
      setTimeout(() => {
        soundManager.playClick();
        setScene1Step(3);
      }, 900),
      setTimeout(() => {
        soundManager.playClick();
        setScene1Step(4);
      }, 1350),
      setTimeout(() => {
        soundManager.playSparkle();
        setScene1Step(5);
      }, 2000),
      setTimeout(() => {
        soundManager.playDoorTransition();
        setScene1Step(6);
      }, 3200),
      setTimeout(() => {
        soundManager.playSparkle();
        setScene1Step(7);
      }, 4500),
      setTimeout(() => {
        soundManager.playVictory();
        setScene1Step(8);
      }, 5600),
    ];

    return () => timers.forEach(clearTimeout);
  }, [currentScene]);

  // SCENE 2: 5 Rooms Restored (3.8s per room with slow zoom + light sweep)
  useEffect(() => {
    if (currentScene !== 2) return;
    setScene2RoomIdx(0);
    setSweepKey((k) => k + 1);

    const interval = setInterval(() => {
      setScene2RoomIdx((prev) => {
        const next = (prev + 1) % RESTORED_ROOMS.length;
        soundManager.playSparkle();
        setSweepKey((k) => k + 1);
        return next;
      });
    }, 3800);

    return () => clearInterval(interval);
  }, [currentScene]);

  // SCENE 4: Reset Lumi paragraph index and book state on entry
  useEffect(() => {
    if (currentScene !== 4) return;
    setLumiLineIdx(0);
    setLumiBookClosing(false);
  }, [currentScene]);

  // Typewriter effect for narration (Scenes 1-3) and Lumi paragraph (Scene 4)
  useEffect(() => {
    if (currentScene === 5) return;
    const fullText =
      currentScene === 4
        ? LUMI_FINAL_LINES[lumiLineIdx] || ''
        : SCENE_NARRATIONS[currentScene] || '';

    let charIdx = 0;
    setTypedText('');
    setIsTypingDone(false);

    const timer = setInterval(() => {
      charIdx += 2;
      if (charIdx >= fullText.length) {
        setTypedText(fullText);
        setIsTypingDone(true);
        clearInterval(timer);
      } else {
        setTypedText(fullText.slice(0, charIdx));
      }
    }, 18);

    return () => clearInterval(timer);
  }, [currentScene, lumiLineIdx]);

  const handleSkipTyping = () => {
    if (currentScene === 5) return;
    const fullText =
      currentScene === 4
        ? LUMI_FINAL_LINES[lumiLineIdx] || ''
        : SCENE_NARRATIONS[currentScene] || '';
    setTypedText(fullText);
    setIsTypingDone(true);
  };

  const triggerScene4To5Transition = () => {
    if (lumiBookClosing) return;
    soundManager.playSparkle();
    setLumiBookClosing(true);
    setTimeout(() => {
      soundManager.playVictory();
      setCurrentScene(5);
      setLumiBookClosing(false);
    }, 900);
  };

  const handleNextScene = () => {
    soundManager.playClick();
    if (!isTypingDone && currentScene < 5) {
      handleSkipTyping();
      return;
    }
    if (currentScene === 4) {
      if (lumiLineIdx < LUMI_FINAL_LINES.length - 1) {
        setLumiLineIdx((prev) => prev + 1);
      } else {
        triggerScene4To5Transition();
      }
      return;
    }
    if (currentScene < 5) {
      setCurrentScene((prev) => prev + 1);
    }
  };

  const handlePrevScene = () => {
    soundManager.playClick();
    if (currentScene === 4 && lumiLineIdx > 0) {
      setLumiLineIdx((prev) => prev - 1);
      return;
    }
    if (currentScene > 1) {
      setCurrentScene((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-[#000814] flex flex-col justify-between overflow-hidden select-none animate-pop text-[#FFFFE3]">
      {/* ========================================================================= */}
      {/* SCENE-SPECIFIC FULL-BLEED BACKGROUNDS (SCENES 1 TO 5) */}
      {/* ========================================================================= */}
      {currentScene === 1 && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={ROOM5_BG}
            alt="Đại sảnh Trái Tim Thư Viện"
            className={`w-full h-full object-cover transition-all duration-1000 ${
              scene1Step >= 8 ? 'brightness-110 scale-105' : 'brightness-50'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#000c1d]/85 via-[#001833]/55 to-[#000c1d]/90" />
        </div>
      )}

      {currentScene === 2 && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            key={`bg-room-${scene2RoomIdx}`}
            src={RESTORED_ROOMS[scene2RoomIdx].bg}
            alt={RESTORED_ROOMS[scene2RoomIdx].title}
            className="w-full h-full object-cover brightness-45 blur-[2px] scale-105 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#000c1d]/85 via-[#001833]/65 to-[#000c1d]/90" />
        </div>
      )}

      {/* CẢNH 3, 4, 5 GIỮ NGUYÊN HÌNH NỀN THƯ VIỆN HUYỀN ẢO */}
      {currentScene >= 3 && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src={REVIVED_LIBRARY_BG}
            alt="Thư viện số hồi sinh"
            className={`w-full h-full object-cover transition-all duration-[3500ms] ease-out ${
              currentScene === 3
                ? 'scale-100 brightness-105'
                : currentScene === 4
                ? 'scale-105 brightness-90'
                : 'scale-100 brightness-75'
            }`}
          />
          <div
            className={`absolute inset-0 transition-all duration-700 ${
              currentScene === 3
                ? 'bg-gradient-to-b from-[#001020]/55 via-transparent to-[#001020]/75'
                : currentScene === 4
                ? 'bg-gradient-to-b from-[#001020]/65 via-[#001833]/40 to-[#001020]/85'
                : 'bg-black/65 backdrop-blur-[1px]'
            }`}
          />
        </div>
      )}

      {/* Starry night & magic particles overlay across all scenes (no fireworks) */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {Array.from({ length: 36 }).map((_, idx) => (
          <span
            key={idx}
            style={{
              left: `${(idx * 29) % 100}%`,
              top: `${(idx * 43) % 100}%`,
              animationDelay: `${(idx % 6) * 0.4}s`,
            }}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#FFD700]/80 shadow-[0_0_8px_#FFD700] animate-ping"
          />
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TOP NARRATION BOX FOR SCENES 1, 2, 3 (SYNCHRONIZED STORYPANEL STYLE) */}
      {/* ========================================================================= */}
      {currentScene <= 3 && (
        <div className="relative z-20 w-[96%] max-w-4xl mx-auto mt-3 shrink-0">
          <div
            onClick={handleSkipTyping}
            className="bg-gradient-to-r from-[#001730]/95 via-[#002855]/95 to-[#001730]/95 text-[#FFFFE3] border-2 border-[#FFD700] rounded-2xl px-3.5 sm:px-5 py-2.5 sm:py-3 shadow-[0_6px_30px_rgba(0,0,0,0.85)] backdrop-blur-md flex items-center gap-3 cursor-pointer"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#3E1F08] border-2 border-[#FFD700] flex items-center justify-center text-amber-200 shrink-0 text-base sm:text-xl shadow-[0_0_12px_rgba(255,215,0,0.45)]">
              📖
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] sm:text-xs font-black text-[#FFD700] uppercase tracking-wider block">
                {currentScene === 1 && 'MẬT MÃ CUỐI CÙNG ĐƯỢC GIẢI'}
                {currentScene === 2 && 'CẢNH HỒI SINH – NĂM CĂN PHÒNG ĐƯỢC KHÔI PHỤC'}
                {currentScene === 3 && 'THƯ VIỆN SỐ HỒI SINH'}
              </span>
              <p className="text-[11px] sm:text-xs md:text-sm font-medium text-[#FFFFE3] leading-relaxed whitespace-pre-line">
                {typedText}
                {!isTypingDone && (
                  <span className="animate-pulse inline-block ml-1 text-[#FFD700]">▌</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN STAGE AREA (SCENES 1 TO 5 - NO SCROLLBAR) */}
      {/* ========================================================================= */}
      <div className="relative z-20 flex-1 min-h-0 flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-3 sm:px-6 py-1 overflow-hidden">
        {/* ===================================================================== */}
        {/* CẢNH 1 – MẬT MÃ CUỐI CÙNG ĐƯỢC GIẢI */}
        {/* ===================================================================== */}
        {currentScene === 1 && (
          <div className="flex flex-col items-center justify-center text-center w-full h-full gap-1.5 sm:gap-2.5 overflow-hidden animate-pop">
            <div className="space-y-0.5 z-20 shrink-0">
              <div
                className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full border text-xs sm:text-sm font-black uppercase tracking-widest transition-all duration-500 ${
                  scene1Step >= 8
                    ? 'bg-[#FFD700] text-[#001833] border-white shadow-[0_0_25px_#FFD700] scale-105'
                    : 'bg-[#001833]/90 text-[#ADEFD1] border-[#ADEFD1]/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>GIẢI MÃ THÀNH CÔNG!</span>
              </div>
              <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-[#FFD700] uppercase tracking-widest drop-shadow-[0_0_20px_rgba(255,215,0,0.9)]">
                TÔN SƯ TRỌNG ĐẠO
              </h1>
            </div>

            {/* Sân khấu trung tâm: 5 Chìa khóa xếp vòng cung + Tia sáng hội tụ + Vòng phong ấn vỡ + Trái Tim Thư Viện bừng sáng */}
            <div className="relative w-72 h-48 sm:w-96 sm:h-56 flex items-center justify-center shrink-0">
              {scene1Step >= 8 && (
                <>
                  <div className="absolute w-48 h-48 sm:w-64 sm:h-64 rounded-full border-2 border-[#FFD700]/80 animate-ping pointer-events-none" />
                  <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-[#ADEFD1]/60 animate-pulse pointer-events-none" />
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(255,215,0,0.45)_0%,_transparent_70%)] blur-xl pointer-events-none" />
                </>
              )}

              {scene1Step < 7 ? (
                <div
                  className={`absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-dashed border-[#ADEFD1]/70 flex items-center justify-center transition-all duration-300 ${
                    scene1Step === 6 ? 'animate-shake border-[#FFD700] scale-105' : 'animate-spin'
                  }`}
                  style={{ animationDuration: scene1Step === 6 ? '0.25s' : '16s' }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {Array.from({ length: 24 }).map((_, sIdx) => {
                    const rad = (sIdx * 15 * Math.PI) / 180;
                    const dist = scene1Step >= 8 ? 135 : 95;
                    return (
                      <span
                        key={sIdx}
                        style={{
                          transform: `translate(${Math.cos(rad) * dist}px, ${Math.sin(rad) * dist}px)`,
                        }}
                        className="absolute w-2 h-2 rounded-full bg-[#FFD700] shadow-[0_0_12px_#FFD700] transition-all duration-1000 opacity-90 animate-pulse"
                      />
                    );
                  })}
                </div>
              )}

              {scene1Step >= 6 && (
                <svg
                  viewBox="-180 -150 360 220"
                  className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
                >
                  <defs>
                    <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFF7B2" />
                      <stop offset="50%" stopColor="#FFD700" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>
                  {KEY_ARC_POSITIONS.map((pos, idx) => (
                    <g key={idx}>
                      <line
                        x1={pos.x}
                        y1={pos.y}
                        x2={0}
                        y2={15}
                        stroke="url(#beamGrad)"
                        strokeWidth={scene1Step >= 8 ? '3' : '5'}
                        strokeLinecap="round"
                        className="animate-pulse"
                        opacity={scene1Step >= 8 ? 0.55 : 0.95}
                      />
                    </g>
                  ))}
                  <circle
                    cx="0"
                    cy="15"
                    r={scene1Step >= 7 ? 24 : 14}
                    fill="#FFD700"
                    className="animate-ping"
                    opacity="0.75"
                  />
                </svg>
              )}

              {KEY_ARC_POSITIONS.map((pos, kIdx) => (
                <div
                  key={kIdx}
                  style={{
                    transform:
                      scene1Step >= 5
                        ? `translate(${pos.x}px, ${pos.y}px) scale(1)`
                        : 'translate(0px, 80px) scale(0)',
                  }}
                  className="absolute z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#001833] border-2 border-[#FFD700] flex items-center justify-center shadow-[0_0_20px_#FFD700] transition-all duration-700"
                  title={`Chìa khóa bí mật số ${kIdx + 1}`}
                >
                  <CrystalBronzeBookKeySvg className="w-8 h-8 sm:w-9 sm:h-9" />
                </div>
              ))}

              <div
                className={`relative z-20 translate-y-3 transition-all duration-1000 flex items-center justify-center ${
                  scene1Step >= 8
                    ? 'w-32 h-32 sm:w-40 sm:h-40 scale-110 filter drop-shadow-[0_0_45px_rgba(255,215,0,1)]'
                    : scene1Step >= 6
                    ? 'w-28 h-28 sm:w-36 sm:h-36 scale-105 filter drop-shadow-[0_0_30px_rgba(255,215,0,0.85)]'
                    : 'w-28 h-28 sm:w-36 sm:h-36 opacity-90 filter drop-shadow-[0_0_15px_rgba(173,239,209,0.5)]'
                }`}
              >
                <img
                  src={HEART_IMG}
                  alt="Trái Tim Thư Viện"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 sm:gap-3 z-20">
              {['TÔN', 'SƯ', 'TRỌNG', 'ĐẠO'].map((word, wIdx) => {
                const isLit = scene1Step >= wIdx + 1;
                return (
                  <div
                    key={word}
                    className={`px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-2xl border-2 font-black text-sm sm:text-lg tracking-wider uppercase transition-all duration-500 ${
                      isLit
                        ? 'bg-gradient-to-b from-[#FFD700] to-amber-400 text-[#001833] border-white shadow-[0_0_20px_#FFD700] scale-105'
                        : 'bg-[#001833]/80 text-slate-500 border-slate-700'
                    }`}
                  >
                    {word}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* CẢNH 2 – NĂM CĂN PHÒNG ĐƯỢC KHÔI PHỤC (CHỈ HIỆN HÌNH NỀN, BỎ VẬT PHẨM) */}
        {/* ===================================================================== */}
        {currentScene === 2 && (
          <div className="flex flex-col items-center justify-center w-full max-w-4xl gap-2.5 animate-pop">
            {/* 5 Room Selector Pills */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 w-full">
              {RESTORED_ROOMS.map((rItem, idx) => {
                const isActive = scene2RoomIdx === idx;
                return (
                  <button
                    key={rItem.room}
                    onClick={() => {
                      soundManager.playClick();
                      setScene2RoomIdx(idx);
                      setSweepKey((k) => k + 1);
                    }}
                    className={`py-1.5 px-2 rounded-xl border text-[10px] sm:text-xs font-black transition-all cursor-pointer truncate flex items-center justify-center gap-1 ${
                      isActive
                        ? 'bg-[#ADEFD1] text-[#001833] border-white shadow-[0_0_15px_rgba(173,239,209,0.7)] scale-[1.03]'
                        : 'bg-[#001833]/90 text-[#FFFFE3] border-[#ADEFD1]/40 hover:border-[#ADEFD1]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    <span className="truncate">{rItem.shortTitle}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Room Background with Slow Zoom & Light Sweep (No floating items) */}
            <div className="relative w-full h-60 sm:h-76 md:h-84 rounded-3xl overflow-hidden border-2 border-[#ADEFD1] shadow-[0_0_40px_rgba(0,0,0,0.9)] bg-[#001833]">
              <img
                key={`room-zoom-${scene2RoomIdx}-${sweepKey}`}
                src={RESTORED_ROOMS[scene2RoomIdx].bg}
                alt={RESTORED_ROOMS[scene2RoomIdx].title}
                className="w-full h-full object-cover brightness-105 animate-slow-zoom"
              />

              <div
                key={`sweep-${sweepKey}`}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent -translate-x-full animate-[shimmer_2.4s_ease-in-out_infinite] pointer-events-none"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#001022]/90 via-transparent to-transparent" />

              {/* Bottom Room Restoration Description */}
              <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5 flex flex-col justify-end text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#002447]/95 border border-emerald-400 text-emerald-300 text-[10px] sm:text-xs font-black w-fit mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{RESTORED_ROOMS[scene2RoomIdx].title}</span>
                </div>
                <p className="text-xs sm:text-sm md:text-base font-bold text-[#FFFFE3] leading-relaxed drop-shadow-md">
                  {RESTORED_ROOMS[scene2RoomIdx].summary}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* CẢNH 3 – THƯ VIỆN SỐ HỒI SINH (BỎ VẬT PHẨM, HIỆN NỀN TRIỂN LÃM & NGÔI SAO) */}
        {/* ===================================================================== */}
        {currentScene === 3 && (
          <div className="flex flex-col items-center justify-center w-full max-w-3xl my-auto text-center animate-pop">
            <div className="bg-[#001833]/90 border-2 border-[#FFD700] rounded-3xl px-6 sm:px-10 py-5 sm:py-6 shadow-[0_0_40px_rgba(255,215,0,0.45)] backdrop-blur-md space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-400 text-emerald-300 text-[10px] sm:text-xs font-black uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>ĐẠI SẢNH THƯ VIỆN SỐ BỪNG SÁNG</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#FFD700] uppercase tracking-wider drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]">
                THƯ VIỆN ĐÃ HỒI SINH!
              </h2>
              <p className="text-xs sm:text-base md:text-lg text-[#ADEFD1] font-black tracking-wide">
                Tri thức được gìn giữ – Lòng biết ơn được tiếp nối
              </p>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* CẢNH 4 – LỜI NHẮN CUỐI CÙNG TỪ LUMI (HIỆN TỪNG ĐOẠN, KHÔNG RỚT CHỮ) */}
        {/* ===================================================================== */}
        {currentScene === 4 && (
          <div className="relative flex flex-col items-center justify-center w-full max-w-3xl gap-3.5 animate-pop my-auto">
            {lumiBookClosing && (
              <div className="fixed inset-0 z-50 bg-[radial-gradient(circle,_#FFF7B2_0%,_#FFD700_45%,_transparent_80%)] animate-ping pointer-events-none" />
            )}

            {/* Lumi Avatar with Floating Golden Heart */}
            <div
              className={`relative flex flex-col items-center transition-all duration-700 ${
                lumiBookClosing ? 'scale-110 brightness-150' : 'scale-100'
              }`}
            >
              {/* Hạt sáng vàng bay ra tạo thành hình trái tim nhỏ phía trên Lumi */}
              <div className="relative flex items-center justify-center mb-2">
                <div className="w-10 h-10 rounded-full bg-[#FFD700]/25 border border-[#FFD700] flex items-center justify-center shadow-[0_0_25px_#FFD700] animate-bounce">
                  <Heart className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />
                </div>
                <Sparkles className="w-4 h-4 text-[#FFD700] absolute -left-6 -top-1 animate-ping" />
                <Sparkles className="w-4 h-4 text-[#FFD700] absolute -right-6 -top-1 animate-ping" />
              </div>

              {/* Khung tròn Lumi gọn đẹp + Tag tên 1 dòng duy nhất không rớt chữ */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#001833] border-4 border-[#ADEFD1] p-2 shadow-[0_0_35px_rgba(173,239,209,0.75)] flex items-center justify-center">
                <img
                  src={ROBOT_NORMAL_DATA_URL}
                  alt="Lumi - Người Gác Thư Viện"
                  className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(173,239,209,0.8)] animate-float"
                />
              </div>

              <div className="mt-2 px-4 py-1 rounded-full bg-[#001833] border border-[#FFD700] text-[#FFD700] font-black text-[11px] sm:text-xs tracking-wider uppercase whitespace-nowrap shadow-lg">
                LUMI – NGƯỜI GÁC THƯ VIỆN
              </div>
            </div>

            {/* Hộp thoại Lumi từng đoạn (1/4 -> 4/4) */}
            <div
              onClick={handleSkipTyping}
              className="bg-[#001833]/95 border-2 border-[#ADEFD1] rounded-3xl p-5 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.9)] backdrop-blur-md text-left w-full cursor-pointer space-y-2.5 relative"
            >
              <div className="flex items-center justify-between border-b border-[#ADEFD1]/30 pb-2">
                <span className="text-xs sm:text-sm font-black text-[#FFD700] uppercase tracking-wider">
                  LỜI NHẮN CUỐI CÙNG TỪ LUMI
                </span>
                <div className="flex items-center gap-1.5">
                  {LUMI_FINAL_LINES.map((_, dotIdx) => (
                    <span
                      key={dotIdx}
                      className={`h-2 rounded-full transition-all ${
                        dotIdx === lumiLineIdx
                          ? 'w-6 bg-[#FFD700]'
                          : dotIdx < lumiLineIdx
                          ? 'w-2 bg-[#ADEFD1]'
                          : 'w-2 bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm sm:text-base md:text-lg font-medium text-[#FFFFE3] leading-relaxed min-h-[3.5rem] flex items-center">
                <span>
                  “{typedText}”
                  {!isTypingDone && (
                    <span className="animate-pulse inline-block ml-1 text-[#ADEFD1]">▌</span>
                  )}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* CẢNH 5 – CHỨNG NHẬN HOÀN THÀNH HÀNH TRÌNH (KHÔNG TỰ ĐỘNG CHUYỂN MẤT) */}
        {/* ===================================================================== */}
        {currentScene === 5 && (
          <div className="bg-[#001833]/95 border-2 border-[#ADEFD1] rounded-3xl max-w-xl w-full p-5 sm:p-6 text-center shadow-[0_0_50px_rgba(0,0,0,0.95)] backdrop-blur-md relative animate-pop space-y-4 my-auto">
            {/* Trophy Badge & Title */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#002447] border-2 border-[#FFD700] flex items-center justify-center text-[#FFD700] shadow-[0_0_25px_rgba(255,215,0,0.5)] mb-2 animate-bounce-slow">
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-[#FFD700]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#FFD700] uppercase tracking-wider">
                CHÚC MỪNG!
              </h2>
              <p className="text-xs sm:text-sm md:text-base font-black text-[#FFFFE3] uppercase tracking-wide mt-0.5">
                BẠN ĐÃ GIẢI CỨU THÀNH CÔNG THƯ VIỆN 20/11!
              </p>
            </div>

            {/* 2 Thành Tích: 5/5 căn phòng | 5/5 chìa khóa (Đã bỏ ô Đã hồi sinh ở Hình 8) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-[#002447] border border-[#ADEFD1]/60 flex flex-col items-center justify-center gap-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-xs sm:text-sm font-black text-[#FFFFE3]">5/5 căn phòng</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#002447] border border-[#FFD700]/70 flex flex-col items-center justify-center gap-1">
                <Key className="w-5 h-5 text-[#FFD700]" />
                <span className="text-xs sm:text-sm font-black text-[#FFD700]">5/5 chìa khóa</span>
              </div>
            </div>

            {/* THÔNG ĐIỆP CỦA HÀNH TRÌNH */}
            <div className="bg-[#002447] border border-[#ADEFD1]/50 rounded-2xl p-4 space-y-2.5">
              <div className="text-[11px] sm:text-xs font-black text-[#ADEFD1] uppercase tracking-widest">
                THÔNG ĐIỆP CỦA HÀNH TRÌNH
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#FFD700] uppercase tracking-wider">
                TÔN SƯ TRỌNG ĐẠO
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#FFFFE3]">
                Kính trọng thầy cô – Trân trọng tri thức – Tiếp nối điều hay
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#ADEFD1]/20 text-center">
                <div className="p-2.5 rounded-xl bg-[#001833] border border-[#ADEFD1]/40 space-y-0.5">
                  <span className="text-xs sm:text-sm font-black text-[#FFD700] block">
                    Tri thức
                  </span>
                  <span className="text-[11px] sm:text-xs text-[#FFFFE3] font-medium block">
                    Không ngừng học hỏi
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#001833] border border-[#ADEFD1]/40 space-y-0.5">
                  <span className="text-xs sm:text-sm font-black text-[#FFD700] block">
                    Tri ân
                  </span>
                  <span className="text-[11px] sm:text-xs text-[#FFFFE3] font-medium block">
                    Biết ơn bằng hành động
                  </span>
                </div>
              </div>
            </div>

            {/* Các nút "CHƠI LẠI" và "KẾT THÚC" */}
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-1">
              {savedCard && onViewCard && (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onViewCard();
                  }}
                  className="px-5 py-3 rounded-full bg-[#002447] border border-[#FFD700] text-[#FFD700] font-black text-xs hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase"
                >
                  <Heart className="w-4 h-4 fill-[#FFD700]" />
                  <span>XEM THIỆP TRI ÂN</span>
                </button>
              )}

              <button
                onClick={() => {
                  soundManager.playClick();
                  onPlayAgain();
                }}
                className="flex-1 py-3 px-6 rounded-full bg-[#ADEFD1] text-[#001833] font-black text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <RotateCcw className="w-4 h-4" />
                <span>CHƠI LẠI</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  if (onClose) onClose();
                  else onPlayAgain();
                }}
                className="flex-1 py-3 px-6 rounded-full bg-[#002447] border-2 border-[#ADEFD1] text-[#ADEFD1] font-black text-xs sm:text-sm hover:bg-[#ADEFD1] hover:text-[#001833] active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <Home className="w-4 h-4" />
                <span>KẾT THÚC</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM NAVIGATION CONTROLS FOR SCENES 1 TO 4 (Đã bỏ nút Quay lại theo Hình 4) */}
      {/* ========================================================================= */}
      {currentScene < 5 && (
        <div className="relative z-20 w-[96%] max-w-4xl mx-auto pb-2.5 pt-1 flex items-center justify-end shrink-0">
          <button
            onClick={handleNextScene}
            className="px-6 sm:px-8 py-2.5 rounded-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 text-[#001833] font-black text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,215,0,0.7)] cursor-pointer uppercase flex items-center gap-2"
          >
            <span>Tiếp tục</span>
            <ArrowRight className="w-4 h-4 text-[#001833]" />
          </button>
        </div>
      )}
    </div>
  );
};
