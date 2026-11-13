import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Layers,
  Lock,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { StoryPanel } from '../StoryPanel';
import { LumiSpeech } from '../LumiSpeech';

interface Room2TeachersProps {
  task1Done: boolean;
  task2Done: boolean;
  onCompleteTask1: (score: number) => void;
  onCompleteTask2: (score: number) => void;
  onOpenLumiHint?: (hintText: string) => void;
  onNavigateToRoom3: () => void;
}

const ASSET_BASE =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%202.%20PH%C3%92NG%20DANH%20S%C6%AF%20%E2%80%93%20CH%C3%82N%20DUNG%20B%C3%8D%20%E1%BA%A8N/';

const BG_ROOM2 = `${ASSET_BASE}Ph%C3%B2ng%202.png`;
const HOTSPOT_1_IMG = `${ASSET_BASE}B%E1%BB%A9c%20tranh%20s%E1%BB%91%201.png`;
const HOTSPOT_2_IMG = `${ASSET_BASE}B%E1%BB%A9c%20tranh%20s%E1%BB%91%202.png`;

// 1. Lời dẫn vào Phòng Danh Sư (StoryPanel - Hộp thoại cổ điển viền vàng kim, nền xanh đậm, không in nghiêng, không ngoặc kép)
const NARRATOR_PARAGRAPHS = [
  'Cánh cửa cổ kính từ từ mở ra… Những bức chân dung danh sư hiện lên giữa căn phòng đầy bí ẩn. Thế nhưng, danh tính của họ đã bị xóa nhòa, còn những hồ sơ quý giá bị phong ấn! Liệu bạn có thể khám phá bí mật và khôi phục những câu chuyện đã bị lãng quên?',
];

// 2. Lời thoại Người Gác Thư Viện đầu phòng (LumiSpeech - Góc phải màn hình, bong bóng phía trên đầu, tự hủy khi xong)
const LUMI_DIALOGUE_PARAGRAPHS = [
  'Chào mừng cậu đến với Phòng Danh Sư! Những bức chân dung và hồ sơ về các bậc thầy đáng kính đã bị xáo trộn. Hãy giúp ta tìm lại danh tính của họ nhé! Thử thách đầu tiên đang chờ cậu trong khung tranh phát sáng kia!',
];

// 3. Lời thoại Lumi – Sau khi hoàn thành Nhiệm vụ 1
const LUMI_AFTER_TASK1_PARAGRAPHS = [
  'Xuất sắc! Cậu đã giúp những bức chân dung tìm lại danh tính rồi! Nhưng những hồ sơ ghi chép về các danh sư vẫn còn bị xáo trộn…',
  'Nhìn kìa! Khung tranh thứ hai đang phát sáng! Hãy nhấp vào đó để khám phá thử thách tiếp theo nhé!',
];

interface TeacherItem {
  id: number;
  name: string;
  title: string;
  era: string;
  portraitUrl: string;
  docUrl: string;
  shortBio: string;
}

const TEACHERS: TeacherItem[] = [
  {
    id: 1,
    name: 'Chu Văn An',
    title: 'Tư nghiệp Quốc Tử Giám',
    era: 'Thời Trần (1292 - 1370)',
    portraitUrl: `${ASSET_BASE}Th%E1%BA%BB%201.png`,
    docUrl: `${ASSET_BASE}Th%E1%BA%BB%201.1.png`,
    shortBio: 'Bậc "Vạn thế sư biểu", dâng Thất trảm sớ, mở trường Huỳnh Cung dạy học.',
  },
  {
    id: 2,
    name: 'Nguyễn Bỉnh Khiêm',
    title: 'Trạng Trình',
    era: 'Thời Mạc (1491 - 1585)',
    portraitUrl: `${ASSET_BASE}Th%E1%BA%BB%202.png`,
    docUrl: `${ASSET_BASE}Th%E1%BA%BB%202.1.png`,
    shortBio: 'Tuyết Giang Phu Tử, bậc đại triết gia, thầy giáo của nhiều danh thần đất Việt.',
  },
  {
    id: 3,
    name: 'Võ Trường Toản',
    title: 'Danh sư Đất Phương Nam',
    era: 'Thế kỷ 18 (? - 1792)',
    portraitUrl: `${ASSET_BASE}Th%E1%BA%BB%203.png`,
    docUrl: `${ASSET_BASE}Th%E1%BA%BB%203.1.png`,
    shortBio: 'Bậc tùng bách Nam Bộ, đào tạo nên Gia Định tam gia kiệt xuất.',
  },
  {
    id: 4,
    name: 'Lê Quý Đôn',
    title: 'Bảng nhãn - Nhà Bác học',
    era: 'Thời Hậu Lê (1726 - 1784)',
    portraitUrl: `${ASSET_BASE}Th%E1%BA%BB%204.png`,
    docUrl: `${ASSET_BASE}Th%E1%BA%BB%204.1.png`,
    shortBio: 'Bộ óc bách khoa toàn thư, tác giả Vân đài loại ngữ, Đại Việt thông sử.',
  },
  {
    id: 5,
    name: 'Nguyễn Đình Chiểu',
    title: 'Nhà giáo - Thầy thuốc yêu nước',
    era: 'Thời Nguyễn (1822 - 1888)',
    portraitUrl: `${ASSET_BASE}Th%E1%BA%BB%205.png`,
    docUrl: `${ASSET_BASE}Th%E1%BA%BB%205.1.png`,
    shortBio: 'Cụ Đồ Chiểu, thầy giáo mù kiên trung, tác giả Lục Vân Tiên, Văn tế nghĩa sĩ Cần Giuộc.',
  },
  {
    id: 6,
    name: 'Đặng Thai Mai',
    title: 'Giáo sư - Nhà Văn hóa',
    era: 'Hiện đại (1902 - 1984)',
    portraitUrl: `${ASSET_BASE}Th%E1%BA%BB%206.png`,
    docUrl: `${ASSET_BASE}Th%E1%BA%BB%206.1.png`,
    shortBio: 'Viện trưởng đầu tiên Viện Văn học, người thầy mẫu mực của nhiều thế hệ nhà giáo.',
  },
  {
    id: 7,
    name: 'Hoàng Xuân Hãn',
    title: 'Giáo sư - Học giả Toán học',
    era: 'Hiện đại (1908 - 1996)',
    portraitUrl: `${ASSET_BASE}Th%E1%BA%BB%207.png`,
    docUrl: `${ASSET_BASE}Th%E1%BA%BB%207.1.png`,
    shortBio: 'Tác giả chương trình giáo dục Việt Nam đầu tiên năm 1945 và công trình La Sơn Phu Tử.',
  },
  {
    id: 8,
    name: 'Nguyễn Văn Huyên',
    title: 'Bộ trưởng Giáo dục lâu năm nhất',
    era: 'Hiện đại (1905 - 1975)',
    portraitUrl: `${ASSET_BASE}Th%E1%BA%BB%208.png`,
    docUrl: `${ASSET_BASE}Th%E1%BA%BB%208.1.png`,
    shortBio: 'Gần 30 năm lãnh đạo Bộ Giáo dục, xây dựng nền giáo dục nhân dân dân chủ vững chắc.',
  },
  {
    id: 9,
    name: 'Tạ Quang Bửu',
    title: 'Giáo sư - Nhà Khoa học',
    era: 'Hiện đại (1910 - 1986)',
    portraitUrl: `${ASSET_BASE}Th%E1%BA%BB%209.png`,
    docUrl: `${ASSET_BASE}Th%E1%BA%BB%209.1.png`,
    shortBio: 'Bộ trưởng Bộ Đại học, đặt nền móng cho hệ thống trường chuyên và đào tạo khoa học hiện đại.',
  },
  {
    id: 10,
    name: 'Nguyễn Ngọc Ký',
    title: 'Nhà giáo Ưu tú',
    era: 'Hiện đại (1947 - 2022)',
    portraitUrl: `${ASSET_BASE}Th%E1%BA%BB%2010.png`,
    docUrl: `${ASSET_BASE}Th%E1%BA%BB%2010.1.png`,
    shortBio: 'Tấm gương nghị lực phi thường viết chữ bằng chân, thắp sáng ước mơ cho triệu triệu học trò.',
  },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Biểu tượng Chìa Khóa Pha Lê Vàng Đồng có hình Cuốn Sách Cổ & Hoa Văn Ánh Sáng (Đồng bộ 100% với Phòng 1 & Túi Đồ)
 */
const CrystalBronzeBookKeySvg: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="r2-crystal-aura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ADEFD1" stopOpacity="0.8" />
        <stop offset="60%" stopColor="#4FC3F7" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#00203F" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="r2-bronze-gold-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFE3" />
        <stop offset="40%" stopColor="#ADEFD1" />
        <stop offset="80%" stopColor="#4FC3F7" />
        <stop offset="100%" stopColor="#00355E" />
      </linearGradient>
      <linearGradient id="r2-crystal-gem" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#ADEFD1" />
        <stop offset="100%" stopColor="#4FC3F7" />
      </linearGradient>
      <filter id="r2-key-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <circle cx="100" cy="100" r="88" fill="url(#r2-crystal-aura)" />

    <g filter="url(#r2-key-glow)">
      <rect x="93" y="88" width="14" height="86" rx="6" fill="url(#r2-bronze-gold-body)" stroke="#FFFFE3" strokeWidth="1.5" />
      <path d="M 100,94 L 100,168" stroke="#FFFFE3" strokeWidth="1.8" strokeDasharray="5 4" />
      <circle cx="100" cy="115" r="3" fill="#ffffff" />
      <circle cx="100" cy="135" r="3" fill="#ffffff" />
      <circle cx="100" cy="155" r="3" fill="#ffffff" />
      <path
        d="M 107,138 L 128,138 L 128,148 L 116,148 L 116,156 L 132,156 L 132,168 L 107,168 Z"
        fill="url(#r2-bronze-gold-body)"
        stroke="#FFFFE3"
        strokeWidth="1.2"
      />
      <circle cx="100" cy="58" r="36" fill="#001833" stroke="url(#r2-bronze-gold-body)" strokeWidth="5" />
      <circle cx="100" cy="58" r="29" fill="none" stroke="#ADEFD1" strokeWidth="1.2" strokeDasharray="4 3" />
      <polygon points="100,14 106,24 100,29 94,24" fill="url(#r2-crystal-gem)" />
      <polygon points="144,58 134,64 129,58 134,52" fill="url(#r2-crystal-gem)" />
      <polygon points="56,58 66,64 71,58 66,52" fill="url(#r2-crystal-gem)" />
      <g transform="translate(100, 58)">
        <path d="M -18,-10 Q -9,-14 0,-8 L 0,12 Q -9,6 -18,10 Z" fill="url(#r2-crystal-gem)" stroke="#FFFFE3" strokeWidth="1.5" />
        <path d="M 18,-10 Q 9,-14 0,-8 L 0,12 Q 9,6 18,10 Z" fill="url(#r2-crystal-gem)" stroke="#FFFFE3" strokeWidth="1.5" />
        <line x1="0" y1="-9" x2="0" y2="12" stroke="#00203F" strokeWidth="2" />
        <line x1="-13" y1="-4" x2="-4" y2="-2" stroke="#00203F" strokeWidth="1.2" />
        <line x1="-13" y1="1" x2="-4" y2="3" stroke="#00203F" strokeWidth="1.2" />
        <line x1="4" y1="-2" x2="13" y2="-4" stroke="#00203F" strokeWidth="1.2" />
        <line x1="4" y1="3" x2="13" y2="1" stroke="#00203F" strokeWidth="1.2" />
      </g>
    </g>
  </svg>
);

export const Room2Teachers: React.FC<Room2TeachersProps> = ({
  task1Done,
  task2Done,
  onCompleteTask1,
  onCompleteTask2,
  onNavigateToRoom3,
}) => {
  // dialoguePhase:
  // 'narrator'         -> Hiển thị StoryPanel (Lời dẫn vào phòng)
  // 'lumi'             -> Hiển thị LumiSpeech (Lời thoại đầu phòng của Lumi)
  // 'lumi_after_task1' -> Hiển thị LumiSpeech sau khi hoàn thành Nhiệm vụ 1
  // 'explore'          -> Đã xong lời dẫn & lời thoại -> Mở khóa đồ vật trong phòng
  const [dialoguePhase, setDialoguePhase] = useState<
    'narrator' | 'lumi' | 'lumi_after_task1' | 'explore'
  >(() => {
    if (task1Done && task2Done) return 'explore';
    if (task1Done && !task2Done) return 'lumi_after_task1';
    return 'narrator';
  });

  const isRoomInteractive = dialoguePhase === 'explore';

  const [activeModal, setActiveModal] = useState<
    'task1_portraits' | 'task2_book' | 'task2_locked_notice' | 'secret_key_reward' | null
  >(null);

  // ----------------------------------------------------
  // NHIỆM VỤ 1: NHẬN DIỆN DANH SƯ (2 VÒNG: 1-5 & 6-10)
  // ----------------------------------------------------
  const [task1Round, setTask1Round] = useState<1 | 2>(1);
  const round1Teachers = TEACHERS.slice(0, 5);
  const round2Teachers = TEACHERS.slice(5, 10);
  const currentRoundTeachers = task1Round === 1 ? round1Teachers : round2Teachers;

  const [round1Assignments, setRound1Assignments] = useState<(number | null)[]>(() =>
    task1Done ? round1Teachers.map((t) => t.id) : [null, null, null, null, null]
  );
  const [round2Assignments, setRound2Assignments] = useState<(number | null)[]>(() =>
    task1Done ? round2Teachers.map((t) => t.id) : [null, null, null, null, null]
  );

  const [shuffledNamesR1] = useState<TeacherItem[]>(() =>
    shuffleArray(round1Teachers)
  );
  const [shuffledNamesR2] = useState<TeacherItem[]>(() =>
    shuffleArray(round2Teachers)
  );

  const [selectedNameTag, setSelectedNameTag] = useState<TeacherItem | null>(null);
  const [task1Error, setTask1Error] = useState<string | null>(null);
  const [round1Completed, setRound1Completed] = useState<boolean>(task1Done);
  const [round2Completed, setRound2Completed] = useState<boolean>(task1Done);
  const [task1Failed, setTask1Failed] = useState<boolean>(false);

  const handleQuickTestTask1 = () => {
    soundManager.playCorrect();
    soundManager.playSparkle();
    setRound1Assignments(round1Teachers.map((t) => t.id));
    setRound2Assignments(round2Teachers.map((t) => t.id));
    setRound1Completed(true);
    setRound2Completed(true);
    setTask1Failed(false);
    setTask1Error(null);
  };

  const handleRetryTask1 = () => {
    soundManager.playClick();
    setRound1Assignments([null, null, null, null, null]);
    setRound2Assignments([null, null, null, null, null]);
    setRound1Completed(false);
    setRound2Completed(false);
    setTask1Failed(false);
    setTask1Round(1);
    setSelectedNameTag(null);
    setTask1Error(null);
  };

  const handleAssignToSlot = (slotIdx: number) => {
    const isRoundDone = task1Round === 1 ? round1Completed : round2Completed;
    if (isRoundDone || !selectedNameTag) return;
    soundManager.playClick();
    if (task1Round === 1) {
      const next = [...round1Assignments];
      next[slotIdx] = selectedNameTag.id;
      setRound1Assignments(next);
    } else {
      const next = [...round2Assignments];
      next[slotIdx] = selectedNameTag.id;
      setRound2Assignments(next);
    }
    setSelectedNameTag(null);
    setTask1Error(null);
  };

  const handleClearSlot = (slotIdx: number) => {
    const isRoundDone = task1Round === 1 ? round1Completed : round2Completed;
    if (isRoundDone) return;
    soundManager.playClick();
    if (task1Round === 1) {
      const next = [...round1Assignments];
      next[slotIdx] = null;
      setRound1Assignments(next);
    } else {
      const next = [...round2Assignments];
      next[slotIdx] = null;
      setRound2Assignments(next);
    }
    setTask1Error(null);
  };

  const handleVerifyRound = () => {
    const currentAssignments =
      task1Round === 1 ? round1Assignments : round2Assignments;
    if (currentAssignments.some((id) => id === null)) {
      soundManager.playWrong();
      setTask1Error('Hãy ghép tên cho đủ cả 5 bức chân dung trước khi kiểm tra nhé!');
      return;
    }

    if (task1Round === 1) {
      setRound1Completed(true);
      soundManager.playCorrect();
      soundManager.playSparkle();
      setTask1Error(null);
    } else {
      const r1Correct = round1Teachers.filter((t, idx) => round1Assignments[idx] === t.id).length;
      const r2Correct = round2Teachers.filter((t, idx) => round2Assignments[idx] === t.id).length;
      const totalCorrect = r1Correct + r2Correct;
      const correctCount = totalCorrect;
      setRound2Completed(true);

      window.parent.postMessage(
        {
          answerTrue: correctCount, // Cái này là câu trả lời đúng
          totalQuestion: TEACHERS.length, // 10 câu hỏi
          command: 'submit_result', //Không được đổi
        },
        '*'
      );

      soundManager.playCorrect();
      soundManager.playSparkle();
      setTask1Failed(false);
      setTask1Error(null);
    }
  };

  // Chỉ khi người chơi tự đóng bảng mới chuyển kịch bản tiếp theo
  const handleCloseTask1Modal = () => {
    soundManager.playClick();
    setActiveModal(null);
    if (round1Completed && round2Completed && !task1Done) {
      onCompleteTask1(100);
      setDialoguePhase('lumi_after_task1');
    }
  };

  // ----------------------------------------------------
  // NHIỆM VỤ 2: HỒ SƠ DANH SƯ THẤT LẠC (VÒNG TRÒN 1-10, ĐÚNG XANH SAI ĐỎ, ĐẠT >= 7/10 HOÀN THÀNH, PHÓNG TO ẢNH)
  // ----------------------------------------------------
  const [activeDocIndex, setActiveDocIndex] = useState<number>(0);
  const [isDocZoomed, setIsDocZoomed] = useState<boolean>(false);
  const [docZoomScale, setDocZoomScale] = useState<number>(1);
  const [docPanX, setDocPanX] = useState<number>(0);
  const [docPanY, setDocPanY] = useState<number>(0);
  const [isDraggingDoc, setIsDraggingDoc] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [dragStartY, setDragStartY] = useState<number>(0);
  const docImgRef = useRef<HTMLImageElement | null>(null);

  const clampDocPan = (nextX: number, nextY: number, scale: number) => {
    const imgEl = docImgRef.current;
    if (!imgEl || scale <= 1) {
      return { x: 0, y: 0 };
    }
    const baseW = imgEl.offsetWidth;
    const baseH = imgEl.offsetHeight;
    // Chỉ cho phép kéo đúng trong phạm vi phần hình ảnh bị phóng to vượt ra ngoài khung gốc
    const maxPanX = Math.max(0, ((baseW * (scale - 1)) / 2) / scale);
    const maxPanY = Math.max(0, ((baseH * (scale - 1)) / 2) / scale);
    return {
      x: Math.max(-maxPanX, Math.min(maxPanX, nextX)),
      y: Math.max(-maxPanY, Math.min(maxPanY, nextY)),
    };
  };
  // Lưu đáp án người chơi chọn cho từng hồ sơ (id hồ sơ 1..10 -> id danh sư đã chọn)
  const [userDocAnswers, setUserDocAnswers] = useState<Record<number, number>>(() => {
    if (task2Done) {
      const initial: Record<number, number> = {};
      TEACHERS.forEach((t) => {
        initial[t.id] = t.id;
      });
      return initial;
    }
    return {};
  });

  const getOptionsForDoc = (docId: number) => {
    const correct = TEACHERS.find((t) => t.id === docId)!;
    const others = TEACHERS.filter((t) => t.id !== docId);
    const distractors = shuffleArray(others).slice(0, 3);
    return shuffleArray([correct, ...distractors]);
  };

  const [docOptionsMap] = useState<Record<number, TeacherItem[]>>(() => {
    const map: Record<number, TeacherItem[]> = {};
    TEACHERS.forEach((t) => {
      map[t.id] = getOptionsForDoc(t.id);
    });
    return map;
  });

  // Mỗi câu chỉ chọn 1 lần duy nhất
  const handleSelectTeacherForDoc = (teacherId: number) => {
    const currentDoc = TEACHERS[activeDocIndex];
    if (userDocAnswers[currentDoc.id] !== undefined) return;

    const nextAnswers = { ...userDocAnswers, [currentDoc.id]: teacherId };
    setUserDocAnswers(nextAnswers);

    if (teacherId === currentDoc.id) {
      soundManager.playCorrect();
      soundManager.playSparkle();
    } else {
      soundManager.playWrong();
    }

    if (Object.keys(nextAnswers).length === TEACHERS.length) {
      const correctCount = TEACHERS.filter((t) => nextAnswers[t.id] === t.id).length;
      window.parent.postMessage(
        {
          answerTrue: correctCount, // Cái này là câu trả lời đúng
          totalQuestion: TEACHERS.length, // 10 câu hỏi
          command: 'submit_result', //Không được đổi
        },
        '*'
      );
    }
  };

  const handleContinueTask2 = () => {
    soundManager.playClick();
    if (activeDocIndex < TEACHERS.length - 1) {
      setActiveDocIndex((prev) => prev + 1);
    }
  };

  const handleRetryTask2 = () => {
    soundManager.playClick();
    setUserDocAnswers({});
    setActiveDocIndex(0);
  };

  const handleQuickTestTask2 = () => {
    soundManager.playSparkle();
    const allDone: Record<number, number> = {};
    TEACHERS.forEach((t) => {
      allDone[t.id] = t.id;
    });
    setUserDocAnswers(allDone);
    setActiveDocIndex(TEACHERS.length - 1);
  };

  const handleCloseTask2Modal = () => {
    soundManager.playClick();
    const allAnswered = Object.keys(userDocAnswers).length === TEACHERS.length;
    if (allAnswered && !task2Done) {
      triggerSecretKeyReward();
    } else {
      setActiveModal(null);
    }
  };

  // ----------------------------------------------------
  // CHUỖI PHẦN THƯỞNG CHÌA KHÓA BÍ MẬT SỐ 2 (ĐỒNG BỘ PHÒNG 1 & HÌNH 4)
  // ----------------------------------------------------
  const [rewardPhase, setRewardPhase] = useState<
    'records_restoring' | 'secret_compartment' | 'floating_key' | 'clue_scroll' | 'collecting'
  >('records_restoring');
  const [restoredCount, setRestoredCount] = useState<number>(0);

  const triggerSecretKeyReward = () => {
    soundManager.playSparkle();
    setActiveModal('secret_key_reward');
    setRewardPhase('records_restoring');
    setRestoredCount(0);

    for (let i = 1; i <= 10; i++) {
      setTimeout(() => {
        setRestoredCount(i);
        if (i % 3 === 0) soundManager.playSparkle();
      }, i * 160);
    }

    setTimeout(() => {
      soundManager.playDoorTransition();
      setRewardPhase('secret_compartment');
    }, 2100);

    setTimeout(() => {
      soundManager.playSparkle();
      setRewardPhase('floating_key');
    }, 4100);
  };

  const handleInspectFloatingKey = () => {
    soundManager.playSparkle();
    setRewardPhase('clue_scroll');
  };

  const handleCollectSecretKey = () => {
    soundManager.playSparkle();
    setRewardPhase('collecting');
    onCompleteTask2(100);
    setTimeout(() => {
      soundManager.playSparkle();
      setActiveModal(null);
      setDialoguePhase('explore');
    }, 1800);
  };

  const handleOpenHotspot1 = () => {
    if (!isRoomInteractive) {
      soundManager.playWrong();
      return;
    }
    soundManager.playClick();
    if (task1Done) {
      setRound1Assignments(round1Teachers.map((t) => t.id));
      setRound2Assignments(round2Teachers.map((t) => t.id));
      setRound1Completed(true);
      setRound2Completed(true);
    }
    setActiveModal('task1_portraits');
  };

  const handleOpenHotspot2 = () => {
    if (!isRoomInteractive) {
      soundManager.playWrong();
      return;
    }
    soundManager.playClick();
    if (!task1Done && !(round1Completed && round2Completed)) {
      soundManager.playWrong();
      setActiveModal('task2_locked_notice');
      return;
    }
    if (task2Done) {
      const completedMap: Record<number, number> = {};
      TEACHERS.forEach((t) => {
        completedMap[t.id] = t.id;
      });
      setUserDocAnswers(completedMap);
      setActiveDocIndex(0);
    }
    setActiveModal('task2_book');
  };

  return (
    <div className="relative w-full h-full min-h-full overflow-hidden flex flex-col justify-between p-2 md:p-4 text-[#FFFFE3]">
      {/* BACKGROUND IMAGE - Full Main Fill */}
      <div className="absolute inset-0 z-0">
        <img
          src={BG_ROOM2}
          alt="Phòng Danh Sư - Bối Cảnh"
          className="w-full h-full object-cover object-center filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001020]/80 via-transparent to-[#001020]/30"></div>
      </div>

      {/* 1. LỜI DẪN VÀO PHÒNG (StoryPanel - Hộp thoại cổ điển viền vàng kim, nền xanh đậm) */}
      {!(task1Done && task2Done) && dialoguePhase === 'narrator' && (
        <StoryPanel
          title="BỐI CẢNH PHÒNG DANH SƯ"
          lines={NARRATOR_PARAGRAPHS}
          onComplete={() => setDialoguePhase('lumi')}
        />
      )}

      {/* 2. LỜI THOẠI CỦA LUMI ĐẦU PHÒNG (LumiSpeech - Trượt từ góc phải, bong bóng trên đầu, xong tự hủy) */}
      {!(task1Done && task2Done) && dialoguePhase === 'lumi' && !activeModal && (
        <LumiSpeech
          key="lumi-room2-intro"
          lines={LUMI_DIALOGUE_PARAGRAPHS}
          onComplete={() => setDialoguePhase('explore')}
        />
      )}

      {/* 3. LỜI THOẠI CỦA LUMI SAU KHI HOÀN THÀNH NHIỆM VỤ 1 */}
      {!(task1Done && task2Done) && dialoguePhase === 'lumi_after_task1' && !activeModal && (
        <LumiSpeech
          key="lumi-room2-after-task1"
          lines={LUMI_AFTER_TASK1_PARAGRAPHS}
          onComplete={() => setDialoguePhase('explore')}
        />
      )}

      {/* CENTRAL ROOM SCENE - RESPONSIVE ACROSS PHONE, IPAD, LAPTOP, TV */}
      <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-2 sm:px-6 flex items-end justify-between pb-[clamp(3.5rem,18vh,9.5rem)] pointer-events-none">
        {/* BỨC TRANH SỐ 1 (Dịch qua phải 1cm so với vị trí trước) */}
        <div
          onClick={handleOpenHotspot1}
          style={{ marginLeft: '0.5cm', marginBottom: '2cm' }}
          className={`absolute left-[8%] sm:left-[15%] md:left-[18%] bottom-[16%] sm:bottom-[18%] w-[38%] sm:w-[30%] md:w-[25%] max-w-[290px] pointer-events-auto group flex flex-col items-center justify-center transition-all duration-300 ${
            !isRoomInteractive
              ? 'opacity-40 cursor-not-allowed filter grayscale pointer-events-none'
              : 'cursor-pointer hover:scale-[1.04]'
          }`}
          title={
            !isRoomInteractive
              ? 'Hoàn thành lời dẫn và lời thoại của Lumi để mở khóa đồ vật'
              : 'Bức Tranh Số 1'
          }
        >
          <div className="relative w-full aspect-[4/3] flex items-center justify-center">
            <img
              src={HOTSPOT_1_IMG}
              alt="Bức Tranh Số 1"
              loading="eager"
              decoding="async"
              className={`w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.85)] transition-all duration-300 ${
                task1Done || (round1Completed && round2Completed && !task1Failed)
                  ? 'brightness-105 drop-shadow-[0_0_20px_#28a745]'
                  : isRoomInteractive
                  ? 'group-hover:brightness-110 animate-pulse'
                  : ''
              }`}
            />
          </div>

          {task1Done || (round1Completed && round2Completed && !task1Failed) ? (
            <div className="mt-1 sm:mt-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#001c38] border border-emerald-400 text-emerald-300 font-black text-[10px] sm:text-xs md:text-sm shadow-md flex items-center gap-1.5 animate-pop whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span>ĐÃ HOÀN THÀNH</span>
            </div>
          ) : (
            <span className="mt-1 sm:mt-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#001833]/90 border border-[#ADEFD1]/50 text-[#ADEFD1] font-black text-[10px] sm:text-xs md:text-sm shadow-lg whitespace-nowrap">
              Bức Tranh Số 1
            </span>
          )}
        </div>

        {/* BỨC TRANH SỐ 2 (Dịch qua trái 1cm so với vị trí trước) */}
        <div
          onClick={handleOpenHotspot2}
          style={{ marginRight: '0.5cm', marginBottom: '2cm' }}
          className={`absolute right-[8%] sm:right-[15%] md:right-[18%] bottom-[16%] sm:bottom-[18%] w-[38%] sm:w-[30%] md:w-[25%] max-w-[290px] pointer-events-auto group flex flex-col items-center justify-center transition-all duration-300 ${
            !isRoomInteractive
              ? 'opacity-40 cursor-not-allowed filter grayscale pointer-events-none'
              : 'cursor-pointer hover:scale-[1.04]'
          }`}
          title={
            !isRoomInteractive
              ? 'Hoàn thành lời dẫn và lời thoại của Lumi để mở khóa đồ vật'
              : !task1Done && !(round1Completed && round2Completed && !task1Failed)
              ? 'Hoàn thành Bức Tranh Số 1 trước để mở khóa Bức Tranh Số 2'
              : 'Bức Tranh Số 2'
          }
        >
          <div className="relative w-full aspect-[4/3] flex items-center justify-center">
            <img
              src={HOTSPOT_2_IMG}
              alt="Bức Tranh Số 2"
              loading="eager"
              decoding="async"
              className={`w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.85)] transition-all duration-300 ${
                task2Done
                  ? 'brightness-105 drop-shadow-[0_0_20px_#28a745]'
                  : task1Done || (round1Completed && round2Completed && !task1Failed)
                  ? 'group-hover:brightness-110 animate-pulse'
                  : 'opacity-65 brightness-75'
              }`}
            />
          </div>

          {task2Done ? (
            <div className="mt-1 sm:mt-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#001c38] border border-emerald-400 text-emerald-300 font-black text-[10px] sm:text-xs md:text-sm shadow-md flex items-center gap-1.5 animate-pop whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span>ĐÃ HOÀN THÀNH</span>
            </div>
          ) : (
            <span className="mt-1 sm:mt-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#001833]/90 border border-[#ADEFD1]/50 text-[#ADEFD1] font-black text-[10px] sm:text-xs md:text-sm shadow-lg whitespace-nowrap">
              Bức Tranh Số 2
            </span>
          )}
        </div>
      </div>

      {/* BẢNG THÔNG BÁO KHI NHẤP VÀO BỨC TRANH SỐ 2 TRƯỚC KHI XONG NHIỆM VỤ 1 (STYLE HÌNH 4) */}
      {activeModal === 'task2_locked_notice' && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-pop">
          <div className="bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative text-white">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#002447] border border-[#ADEFD1] flex items-center justify-center text-[#ADEFD1] shadow-md">
              <Lock className="w-9 h-9 text-[#FFD700]" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">
              BỨC TRANH SỐ 2 ĐANG BỊ PHONG ẤN
            </h3>
            <p className="text-xs text-[#FFFFE3]/90 leading-relaxed mb-6">
              Bạn hãy hoàn thành <span className="text-[#ADEFD1] font-bold">Nhiệm vụ 1 ở Bức Tranh Số 1</span> (nhận diện 10 vị danh sư) trước khi mở khóa kho hồ sơ tại Bức Tranh Số 2 nhé!
            </p>
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveModal(null);
              }}
              className="w-full py-3 rounded-full bg-[#ADEFD1] text-[#00203F] font-black text-sm hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase"
            >
              <span>ĐÃ HIỂU</span>
            </button>
          </div>
        </div>
      )}

      {/* ROOM 2 COMPLETE CELEBRATION MODAL (ĐỒNG BỘ STYLE HÌNH 4 & PHÒNG 1) */}
      {task1Done && task2Done && !activeModal && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-pop">
          <div className="bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative text-white">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#002447] border border-[#ADEFD1] flex items-center justify-center text-[#FFD700] shadow-md animate-bounce-slow">
              <Sparkles className="w-9 h-9 text-[#FFD700]" />
            </div>

            <h3 className="text-xl font-black text-white uppercase tracking-wider mb-1">
              CHÚC MỪNG! BẠN ĐÃ VƯỢT QUA PHÒNG DANH SƯ!
            </h3>

            <div className="flex items-center justify-center gap-2.5 my-3">
              <span className="px-3 py-1 rounded-full bg-[#002447] border border-emerald-400 text-xs font-bold text-emerald-300 flex items-center gap-1">
                <span className="text-emerald-400 font-black">✓</span> 2/2 nhiệm vụ
              </span>
              <span className="px-3 py-1 rounded-full bg-[#002447] border border-[#ADEFD1] text-xs font-bold text-[#ADEFD1] flex items-center gap-1">
                <span>🔑</span> Chìa khóa bí mật 2/5
              </span>
            </div>

            <p className="text-xs text-[#FFFFE3]/90 leading-relaxed mb-6">
              Bạn đã khôi phục thành công hồ sơ của 10 vị danh sư và thu thập được manh mối thứ hai để giải mã Trái Tim Thư Viện!
            </p>

            <button
              onClick={() => {
                soundManager.playSparkle();
                onNavigateToRoom3();
              }}
              className="w-full py-3 rounded-full bg-[#ADEFD1] text-[#00203F] font-black text-sm hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase"
            >
              <Sparkles className="w-5 h-5 fill-[#00203F]" />
              <span>TIẾP TỤC ĐẾN PHÒNG VĂN HỌC</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NHIỆM VỤ 1: NHẬN DIỆN DANH SƯ (ĐỒNG BỘ NỀN BÓNG TỐI ÁNH SAO & BẢNG #001833 VIỀN #ADEFD1) */}
      {/* ========================================================================= */}
      {activeModal === 'task1_portraits' && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-pop">
          <div className="relative bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-5xl w-full max-h-full p-3 sm:p-5 shadow-2xl flex flex-col overflow-hidden text-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#ADEFD1]/30 pb-2 mb-2.5 shrink-0">
              <div className="min-w-0">
                <h3 className="text-xs sm:text-base font-black text-white uppercase tracking-wide truncate">
                  NHIỆM VỤ 1: NHẬN DIỆN 10 DANH SƯ VIỆT NAM
                </h3>
                <p className="text-[10px] sm:text-xs text-[#ADEFD1] truncate">
                  Chọn thẻ tên bên dưới rồi nhấp vào ô dưới chân dung tương ứng để ghép (Cần đạt tối thiểu 7/10 danh sư đúng)!
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCloseTask1Modal}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#002447] border border-[#ADEFD1] text-[#ADEFD1] font-bold hover:bg-[#ADEFD1] hover:text-[#00203F] flex items-center justify-center cursor-pointer text-sm transition-all"
                  title="Đóng bảng"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Round Tab Switcher */}
            <div className="flex items-center gap-2 mb-2.5 shrink-0">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setTask1Round(1);
                  setTask1Error(null);
                }}
                className={`px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  task1Round === 1
                    ? 'bg-[#ADEFD1] text-[#00203F] shadow-md'
                    : 'bg-[#002447] text-[#FFFFE3] border border-[#ADEFD1]/40 hover:border-[#ADEFD1]'
                }`}
              >
                Vòng 1: Danh sư 1 - 5 {round1Completed && '✓'}
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setTask1Round(2);
                  setTask1Error(null);
                }}
                className={`px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  task1Round === 2
                    ? 'bg-[#ADEFD1] text-[#00203F] shadow-md'
                    : 'bg-[#002447] text-[#FFFFE3] border border-[#ADEFD1]/40 hover:border-[#ADEFD1]'
                }`}
              >
                Vòng 2: Danh sư 6 - 10 {round2Completed && '✓'}
              </button>
            </div>

            {/* 5 Portrait Slots + Shuffled Name Tags */}
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
              <div className="grid grid-cols-5 gap-1.5 sm:gap-3 mb-2.5">
                {currentRoundTeachers.map((teacher, slotIdx) => {
                  const assignedId =
                    task1Round === 1
                      ? round1Assignments[slotIdx]
                      : round2Assignments[slotIdx];
                  const assignedTeacher = TEACHERS.find((t) => t.id === assignedId);
                  const isRoundDone =
                    task1Round === 1 ? round1Completed : round2Completed;

                  return (
                    <div
                      key={teacher.id}
                      className="bg-[#002447]/90 border border-[#ADEFD1]/40 rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5 flex flex-col items-center justify-between text-center shadow-lg relative group"
                    >
                      <div className="w-full aspect-square bg-[#001020] rounded-lg sm:rounded-xl overflow-hidden border border-[#ADEFD1]/30 relative mb-1.5 sm:mb-2 flex items-center justify-center">
                        <img
                          src={teacher.portraitUrl}
                          alt={`Chân dung ${teacher.name}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div
                        onClick={() => {
                          if (assignedTeacher) {
                            handleClearSlot(slotIdx);
                          } else {
                            handleAssignToSlot(slotIdx);
                          }
                        }}
                        className={`w-full min-h-[38px] sm:min-h-[46px] p-1 rounded-lg sm:rounded-xl border flex flex-col items-center justify-center transition-all ${
                          isRoundDone ? 'cursor-default' : 'cursor-pointer'
                        } ${
                          assignedTeacher
                            ? isRoundDone
                              ? assignedTeacher.id === teacher.id
                                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300'
                                : 'bg-rose-950/90 border-rose-500 text-rose-200'
                              : 'bg-[#001833] border-[#FFD700] text-white shadow-md'
                            : selectedNameTag
                            ? 'bg-[#001833] border-dashed border-[#FFD700] text-[#FFD700] animate-pulse'
                            : 'bg-[#001020]/70 border-dashed border-[#ADEFD1]/40 text-[#ADEFD1]/70'
                        }`}
                      >
                        {assignedTeacher ? (
                          <>
                            <span className="text-[10px] sm:text-xs font-black leading-tight line-clamp-1">
                              {assignedTeacher.name}
                            </span>
                            <span className="text-[8px] sm:text-[10px] text-[#ADEFD1] leading-tight line-clamp-1">
                              {assignedTeacher.title}
                            </span>
                          </>
                        ) : (
                          <span className="text-[9px] sm:text-[11px] font-semibold leading-tight">
                            {selectedNameTag ? 'Nhấp đặt thẻ' : '(Chưa ghép)'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Shuffled Name Tags Pool */}
              <div className="bg-[#002447]/80 border border-[#ADEFD1]/40 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 mb-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] sm:text-xs font-bold text-[#ADEFD1] uppercase flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    BẢNG THẺ TÊN DANH SƯ (NHẤP ĐỂ CHỌN):
                  </span>
                  {selectedNameTag && (
                    <span className="text-[9px] sm:text-[11px] text-[#FFD700] font-bold animate-pulse truncate">
                      Đang chọn: {selectedNameTag.name}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {(task1Round === 1 ? shuffledNamesR1 : shuffledNamesR2).map(
                    (tag) => {
                      const isAssigned =
                        task1Round === 1
                          ? round1Assignments.includes(tag.id)
                          : round2Assignments.includes(tag.id);
                      const isSelected = selectedNameTag?.id === tag.id;

                      return (
                        <button
                          key={tag.id}
                          disabled={isAssigned}
                          onClick={() => {
                            soundManager.playClick();
                            setSelectedNameTag(isSelected ? null : tag);
                          }}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isAssigned
                              ? 'bg-[#001020]/50 border-slate-800 text-slate-500 opacity-40 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-[#ADEFD1] text-[#00203F] border-white shadow-[0_0_12px_rgba(173,239,209,0.7)] scale-105'
                              : 'bg-[#001833] border border-[#ADEFD1]/40 text-white hover:bg-[#003366] hover:border-[#ADEFD1]'
                          }`}
                        >
                          <span>{tag.name}</span>
                          <span className="text-[10px] opacity-80">
                            ({tag.title})
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            {/* Error Message Only (Đã bỏ thanh thông báo xanh Hình 1) */}
            {task1Error && (
              <div className="mt-2 p-2.5 rounded-xl text-xs font-bold text-center shrink-0 animate-pop bg-rose-950/90 border border-rose-500 text-rose-200">
                {task1Error}
              </div>
            )}

            {/* Footer Actions (Cố định nút TIẾP TỤC hoặc THỬ LẠI nếu < 70%) */}
            <div className="mt-2.5 pt-2.5 border-t border-[#ADEFD1]/30 flex items-center justify-end shrink-0">
              <div className="flex items-center gap-2">
                {task1Failed ? (
                  <button
                    onClick={handleRetryTask1}
                    className="px-6 py-2 rounded-full bg-rose-700 text-white text-xs font-black hover:bg-rose-600 hover:scale-105 transition-all shadow-md flex items-center gap-1.5 cursor-pointer uppercase tracking-wider whitespace-nowrap"
                  >
                    <span>THỬ LẠI</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : task1Round === 1 && round1Completed && !round2Completed ? (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setTask1Round(2);
                      setTask1Error(null);
                    }}
                    className="px-6 py-2 rounded-full bg-[#ADEFD1] text-[#00203F] text-xs font-black hover:bg-white hover:scale-105 transition-all shadow-md flex items-center gap-1.5 cursor-pointer uppercase tracking-wider whitespace-nowrap"
                  >
                    <span>TIẾP TỤC</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : round1Completed && round2Completed ? (
                  <button
                    onClick={handleCloseTask1Modal}
                    className="px-6 py-2 rounded-full bg-[#ADEFD1] text-[#00203F] text-xs font-black hover:bg-white hover:scale-105 transition-all shadow-md flex items-center gap-1.5 cursor-pointer uppercase tracking-wider animate-pop whitespace-nowrap"
                  >
                    <span>TIẾP TỤC</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleVerifyRound}
                    className="px-5 py-2 rounded-full bg-[#ADEFD1] text-[#00203F] text-xs font-black hover:bg-white transition-all shadow-md cursor-pointer uppercase tracking-wider whitespace-nowrap"
                  >
                    KIỂM TRA ĐÁP ÁN
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NHIỆM VỤ 2: HỒ SƠ DANH SƯ THẤT LẠC (ĐỒNG BỘ FORMAT PHÒNG 1 + PHÓNG TO ẢNH XEM RÕ HƠN) */}
      {/* ========================================================================= */}
      {activeModal === 'task2_book' && (() => {
        const currentDoc = TEACHERS[activeDocIndex];
        const selectedOptionId = userDocAnswers[currentDoc.id];
        const isCurrentAnswered = selectedOptionId !== undefined;
        const all10Answered = Object.keys(userDocAnswers).length === TEACHERS.length;
        const correctCount = TEACHERS.filter((t) => userDocAnswers[t.id] === t.id).length;
        const isTask2Passed = all10Answered;
        const isTask2Failed = false;

        const handleOpenDocZoom = () => {
          soundManager.playClick();
          setDocZoomScale(1);
          setDocPanX(0);
          setDocPanY(0);
          setIsDraggingDoc(false);
          setIsDocZoomed(true);
        };

        return (
          <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden">
            <div className="relative bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-5xl w-full max-h-full p-3 sm:p-5 shadow-2xl flex flex-col overflow-hidden text-white animate-pop">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#ADEFD1]/30 pb-2 mb-2.5 shrink-0">
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-base font-black text-white uppercase tracking-wide truncate">
                    NHIỆM VỤ 2: HỒ SƠ DANH SƯ THẤT LẠC
                  </h3>
                  <p className="text-[10px] sm:text-xs text-[#ADEFD1] truncate">
                    Mỗi câu chỉ chọn đáp án 1 lần • Hoàn thành 10 câu hỏi để nhận Chìa Khóa Bí Mật Số 2!
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCloseTask2Modal}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#002447] border border-[#ADEFD1] text-[#ADEFD1] font-bold hover:bg-[#ADEFD1] hover:text-[#00203F] flex items-center justify-center cursor-pointer text-sm transition-all"
                    title="Đóng bảng"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Thanh 10 vòng tròn đánh số 1..10 (Đúng -> Xanh, Sai -> Đỏ, đồng bộ 100% với Phòng 1) */}
              <div className="bg-[#002447]/90 border border-[#ADEFD1]/40 rounded-2xl px-3 py-2 mb-3 shrink-0">
                <div className="flex items-center justify-between gap-1.5">
                  {TEACHERS.map((t, idx) => {
                    const ans = userDocAnswers[t.id];
                    const isAnswered = ans !== undefined;
                    const isRight = isAnswered && ans === t.id;
                    const isCurrent = idx === activeDocIndex;

                    let circleStyle =
                      'bg-[#001833] text-[#ADEFD1] border-[#ADEFD1]/40 hover:border-[#ADEFD1]';
                    if (isAnswered) {
                      circleStyle = isRight
                        ? 'bg-emerald-600 text-white border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                        : 'bg-rose-600 text-white border-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.6)]';
                    }

                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          soundManager.playClick();
                          setActiveDocIndex(idx);
                        }}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full font-black text-xs transition-all flex items-center justify-center border cursor-pointer ${circleStyle} ${
                          isCurrent ? 'ring-2 ring-[#FFD700] scale-110' : 'opacity-90 hover:opacity-100'
                        }`}
                        title={`Hồ sơ số ${t.id}`}
                      >
                        {t.id}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Nội dung Hồ Sơ & 4 Phương Án Chọn */}
              <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-4 items-center pr-1 custom-scrollbar">
                {/* Cột Trái: Hình ảnh Trang Tư Liệu Cổ (Nhấp để phóng to xem rõ hơn) */}
                <div className="md:col-span-5 flex flex-col items-center justify-center">
                  <div
                    onClick={handleOpenDocZoom}
                    className="group relative bg-white rounded-2xl shadow-xl p-2 border-2 border-[#ADEFD1] w-full max-w-[290px] sm:max-w-[330px] flex flex-col items-center cursor-zoom-in transition-transform hover:scale-[1.02]"
                    title="Nhấp vào ảnh để phóng to xem rõ hơn"
                  >
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-white flex items-center justify-center relative">
                      <img
                        src={currentDoc.docUrl}
                        alt={`Hồ sơ tư liệu ${activeDocIndex + 1}`}
                        className="w-full h-full object-contain filter contrast-105"
                      />
                      {/* Nút kính lúp góc trên bên phải */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDocZoom();
                        }}
                        className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-[#001833]/90 border border-[#ADEFD1] text-[#ADEFD1] text-[10px] font-bold flex items-center gap-1 shadow-md group-hover:bg-[#ADEFD1] group-hover:text-[#00203F] transition-all cursor-pointer"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Phóng to</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cột Phải: Câu hỏi, 4 Đáp án & Giải thích chi tiết */}
                <div className="md:col-span-7 flex flex-col justify-center space-y-2.5">
                  <div className="bg-[#002447] border border-[#ADEFD1]/40 rounded-2xl p-3">
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                      Câu {currentDoc.id}: Trang tư liệu cổ bên cạnh ghi lại cuộc đời, danh hiệu và cống hiến của vị danh sư nào trong lịch sử Việt Nam?
                    </h4>
                  </div>

                  {/* 4 Đáp án lựa chọn */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {docOptionsMap[currentDoc.id].map((opt, idx) => {
                      const letterPrefix = ['A', 'B', 'C', 'D'][idx];
                      const isSelected = selectedOptionId === opt.id;
                      const isCorrectOption = opt.id === currentDoc.id;

                      let btnStyle =
                        'bg-[#002447] border-[#ADEFD1]/40 text-[#FFFFE3] hover:bg-[#003366] hover:border-[#ADEFD1]';
                      if (isCurrentAnswered) {
                        if (isCorrectOption) {
                          btnStyle =
                            'bg-emerald-900 border-2 border-emerald-400 text-white font-bold shadow-sm';
                        } else if (isSelected) {
                          btnStyle =
                            'bg-rose-950 border-2 border-rose-500 text-rose-200';
                        } else {
                          btnStyle =
                            'bg-[#001833]/55 border-[#ADEFD1]/20 text-slate-400 opacity-65';
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          disabled={isCurrentAnswered}
                          onClick={() => handleSelectTeacherForDoc(opt.id)}
                          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-center ${
                            isCurrentAnswered ? 'cursor-default' : 'cursor-pointer'
                          } ${btnStyle}`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-black">
                              {letterPrefix}. {opt.name}
                            </span>
                            {isCurrentAnswered && isCorrectOption && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                            )}
                          </div>
                          <span className="text-[10px] text-[#ADEFD1]/90 mt-0.5">
                            {opt.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Giải thích chi tiết hiện ngay sau khi chọn */}
                  {isCurrentAnswered && (
                    <div className="p-3 bg-[#002447] border border-[#ADEFD1] rounded-xl text-xs text-[#FFFFE3] leading-snug animate-pop">
                      <div className="font-black text-[#ADEFD1] uppercase mb-0.5 flex items-center gap-1.5 text-[11px]">
                        <BookOpen className="w-3.5 h-3.5 text-[#ADEFD1]" />
                        <span>Giải thích chi tiết:</span>
                      </div>
                      <p className="text-[#FFFFE3]/95">
                        <span className="font-bold text-[#FFD700]">{currentDoc.name}</span> ({currentDoc.title} • {currentDoc.era}): {currentDoc.shortBio}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Thanh điều hướng dưới cùng (Đồng bộ Phòng 1: Nút TIẾP TỤC hoặc THỬ LẠI nếu < 7/10) */}
              {isCurrentAnswered && (
                <div className="pt-2.5 mt-2 border-t border-[#ADEFD1]/30 flex items-center justify-between gap-2 shrink-0">
                  <div className="text-[11px] font-bold">
                    {isTask2Failed && (
                      <span className="text-rose-300 font-black">
                        Bạn đạt {correctCount}/10 câu đúng (cần tối thiểu 7/10 câu để hoàn thành). Hãy nhấn Thử lại nhé!
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-auto">
                    {isTask2Failed ? (
                      <button
                        onClick={handleRetryTask2}
                        className="px-6 py-2 rounded-full bg-rose-700 text-white text-xs font-black hover:bg-rose-600 hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                      >
                        <span>THỬ LẠI</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={
                          activeDocIndex < TEACHERS.length - 1
                            ? handleContinueTask2
                            : isTask2Passed
                            ? handleCloseTask2Modal
                            : handleContinueTask2
                        }
                        className="px-7 py-2 rounded-full bg-[#ADEFD1] text-[#00203F] text-xs font-black hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                      >
                        <span>TIẾP TỤC</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CHẾ ĐỘ PHÓNG TO ẢNH TƯ LIỆU VỪA KHUNG NỘI DUNG (MẶC ĐỊNH 100% + KÉO ĐA HƯỚNG TRONG TẦM HÌNH ẢNH) */}
            {isDocZoomed && (
              <div
                onClick={() => {
                  soundManager.playClick();
                  setIsDraggingDoc(false);
                  setIsDocZoomed(false);
                }}
                className="fixed top-0 bottom-[60px] left-0 right-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-5xl h-full max-h-[89vh] bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl p-3 sm:p-5 shadow-2xl flex flex-col overflow-hidden text-white"
                >
                  {/* Header vừa khít chiều ngang hình ảnh */}
                  <div className="flex items-center justify-between gap-3 border-b border-[#ADEFD1]/30 pb-2.5 mb-2.5 shrink-0">
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-base font-black text-white uppercase tracking-wide truncate">
                        HỒ SƠ TƯ LIỆU
                      </h3>
                      <p className="text-[10px] sm:text-xs text-[#ADEFD1] truncate">
                        Giữ chuột kéo lên/xuống/qua/lại hoặc dùng nút thu phóng
                      </p>
                    </div>

                    {/* Cụm nút điều khiển thu phóng đồng bộ màu #002447 & #ADEFD1 */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex items-center gap-1 bg-[#002447] border border-[#ADEFD1]/50 rounded-full px-2 py-1">
                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playClick();
                            setDocZoomScale((prev) => {
                              const next = Math.max(1, Number((prev - 0.25).toFixed(2)));
                              const clamped = clampDocPan(docPanX, docPanY, next);
                              setDocPanX(clamped.x);
                              setDocPanY(clamped.y);
                              return next;
                            });
                          }}
                          disabled={docZoomScale <= 1}
                          className="w-6 h-6 rounded-full bg-[#001833] text-[#ADEFD1] hover:bg-[#ADEFD1] hover:text-[#00203F] disabled:opacity-35 disabled:pointer-events-none flex items-center justify-center transition-all cursor-pointer"
                          title="Thu nhỏ"
                        >
                          <ZoomOut className="w-3.5 h-3.5" />
                        </button>

                        <span className="text-[11px] sm:text-xs font-black text-[#FFFFE3] min-w-[42px] text-center">
                          {Math.round(docZoomScale * 100)}%
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playClick();
                            setDocZoomScale((prev) => {
                              const next = Math.min(2.5, Number((prev + 0.25).toFixed(2)));
                              const clamped = clampDocPan(docPanX, docPanY, next);
                              setDocPanX(clamped.x);
                              setDocPanY(clamped.y);
                              return next;
                            });
                          }}
                          disabled={docZoomScale >= 2.5}
                          className="w-6 h-6 rounded-full bg-[#001833] text-[#ADEFD1] hover:bg-[#ADEFD1] hover:text-[#00203F] disabled:opacity-35 disabled:pointer-events-none flex items-center justify-center transition-all cursor-pointer"
                          title="Phóng to"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          setIsDraggingDoc(false);
                          setIsDocZoomed(false);
                        }}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#002447] border border-[#ADEFD1] text-[#ADEFD1] font-bold hover:bg-[#ADEFD1] hover:text-[#00203F] flex items-center justify-center cursor-pointer text-sm transition-all"
                        title="Đóng chế độ phóng to"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Khung hiển thị ảnh tư liệu bọc sát hình ảnh + Kéo đa hướng lên/xuống/qua/lại trong tầm của ảnh */}
                  <div
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setIsDraggingDoc(true);
                      setDragStartX(e.clientX - docPanX);
                      setDragStartY(e.clientY - docPanY);
                    }}
                    onMouseMove={(e) => {
                      if (!isDraggingDoc) return;
                      const rawX = e.clientX - dragStartX;
                      const rawY = e.clientY - dragStartY;
                      const clamped = clampDocPan(rawX, rawY, docZoomScale);
                      setDocPanX(clamped.x);
                      setDocPanY(clamped.y);
                    }}
                    onMouseUp={() => setIsDraggingDoc(false)}
                    onMouseLeave={() => setIsDraggingDoc(false)}
                    onTouchStart={(e) => {
                      if (e.touches.length === 1) {
                        setIsDraggingDoc(true);
                        setDragStartX(e.touches[0].clientX - docPanX);
                        setDragStartY(e.touches[0].clientY - docPanY);
                      }
                    }}
                    onTouchMove={(e) => {
                      if (!isDraggingDoc || e.touches.length !== 1) return;
                      const rawX = e.touches[0].clientX - dragStartX;
                      const rawY = e.touches[0].clientY - dragStartY;
                      const clamped = clampDocPan(rawX, rawY, docZoomScale);
                      setDocPanX(clamped.x);
                      setDocPanY(clamped.y);
                    }}
                    onTouchEnd={() => setIsDraggingDoc(false)}
                    onWheel={(e) => {
                      e.preventDefault();
                      const rawX = docPanX - e.deltaX * 0.5;
                      const rawY = docPanY - e.deltaY * 0.5;
                      const clamped = clampDocPan(rawX, rawY, docZoomScale);
                      setDocPanX(clamped.x);
                      setDocPanY(clamped.y);
                    }}
                    className={`flex-1 min-h-0 bg-[#001020]/90 border border-[#ADEFD1]/30 rounded-2xl overflow-hidden flex items-center justify-center p-2 relative select-none touch-none ${
                      isDraggingDoc ? 'cursor-grabbing' : 'cursor-grab'
                    }`}
                    title="Giữ và kéo bàn tay lên/xuống/qua/lại để di chuyển trong tầm trang tư liệu"
                  >
                    <img
                      ref={docImgRef}
                      src={currentDoc.docUrl}
                      alt={`Phóng to hồ sơ tư liệu ${activeDocIndex + 1}`}
                      draggable={false}
                      className={`h-full w-auto max-w-[85vw] sm:max-w-[470px] object-contain bg-white rounded-2xl p-2 sm:p-3 border-2 border-[#ADEFD1] shadow-[0_10px_40px_rgba(0,0,0,0.85)] pointer-events-none ${
                        isDraggingDoc ? '' : 'transition-transform duration-150'
                      }`}
                      style={{
                        transform: `translate(${docPanX}px, ${docPanY}px) scale(${docZoomScale})`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* PHẦN THƯỞNG SAU NHIỆM VỤ 2: ĐỒNG BỘ STYLE HÌNH 4 & PHÒNG 1 */}
      {/* ========================================================================= */}
      {activeModal === 'secret_key_reward' && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-hidden animate-pop">
          {rewardPhase === 'records_restoring' && (
            <div className="bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative text-white animate-pop">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#002447] border border-[#ADEFD1] flex items-center justify-center shadow-md">
                <Sparkles className="w-9 h-9 text-[#FFD700] animate-spin" style={{ animationDuration: '5s' }} />
              </div>

              <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">
                10 HỒ SƠ DANH SƯ TỎA SÁNG!
              </h3>
              <p className="text-xs text-[#FFFFE3]/90 leading-relaxed mb-4">
                Năng lượng tri thức đang kết nối 10 trang tư liệu danh sư và hóa giải phong ấn căn phòng...
              </p>

              {/* 10 Vòng tròn Hồ Sơ gọn trong khung */}
              <div className="grid grid-cols-5 gap-2.5 bg-[#002447]/80 border border-[#ADEFD1]/40 rounded-2xl p-3.5 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const isRestored = restoredCount >= num;
                  return (
                    <div
                      key={num}
                      className={`h-11 rounded-xl border flex items-center justify-center font-black text-xs transition-all duration-300 ${
                        isRestored
                          ? 'bg-[#ADEFD1] border-white text-[#00203F] scale-105 shadow-[0_0_12px_rgba(173,239,209,0.8)]'
                          : 'bg-[#001833] border-[#ADEFD1]/30 text-[#ADEFD1]/60'
                      }`}
                    >
                      {isRestored ? <Sparkles className="w-4 h-4 fill-[#00203F]" /> : num}
                    </div>
                  );
                })}
              </div>

              <div className="w-full h-2.5 rounded-full bg-[#001020] border border-[#ADEFD1]/40 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-[#ADEFD1] transition-all duration-300"
                  style={{ width: `${restoredCount * 10}%` }}
                />
              </div>
            </div>
          )}

          {rewardPhase === 'secret_compartment' && (
            <div className="bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative text-white animate-pop">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[#002447] border border-[#ADEFD1] flex items-center justify-center shadow-md animate-bounce-slow">
                <BookOpen className="w-11 h-11 text-[#ADEFD1]" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">
                KHO LƯU TRỮ DANH SƯ MỞ KHÓA!
              </h3>
              <p className="text-xs text-[#FFFFE3]/90 leading-relaxed">
                Các trang tư liệu đã trở về đúng vị trí, để lộ một <span className="text-[#ADEFD1] font-bold">ngăn bí mật phía sau bức chân dung cổ</span>!
              </p>
            </div>
          )}

          {rewardPhase === 'floating_key' && (
            <div className="bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative text-white animate-pop">
              <div
                onClick={handleInspectFloatingKey}
                className="w-24 h-24 mx-auto mb-4 rounded-full bg-[#002447] border border-[#ADEFD1] flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform animate-bounce-slow"
                title="Nhấp vào chìa khóa để mở mảnh giấy cổ"
              >
                <CrystalBronzeBookKeySvg className="w-20 h-20" />
              </div>

              <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">
                BẠN ĐÃ NHẬN ĐƯỢC CHÌA KHÓA BÍ MẬT SỐ 2!
              </h3>
              <p className="text-xs text-[#FFFFE3]/90 leading-relaxed mb-6">
                Trên thân <span className="text-[#ADEFD1] font-bold">Chìa Khóa Pha Lê Vàng Đồng</span> tỏa sáng biểu tượng cuốn sách cổ và đính kèm một mảnh giấy cổ phát sáng!
              </p>

              <button
                onClick={handleInspectFloatingKey}
                className="w-full py-3 rounded-full bg-[#ADEFD1] text-[#00203F] font-black text-sm hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase"
              >
                <Sparkles className="w-5 h-5 fill-[#00203F]" />
                <span>MỞ MẢNH GIẤY CỔ PHÁT SÁNG</span>
              </button>
            </div>
          )}

          {(rewardPhase === 'clue_scroll' || rewardPhase === 'collecting') && (
            <div
              className={`bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl text-white relative transition-all duration-700 ${
                rewardPhase === 'collecting'
                  ? 'scale-90 opacity-40 translate-y-12'
                  : 'animate-pop'
              }`}
            >
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-[#002447] border border-[#ADEFD1] flex items-center justify-center shadow-md">
                <CrystalBronzeBookKeySvg className="w-16 h-16" />
              </div>

              <h3 className="text-xl font-black text-white uppercase tracking-wider mb-1">
                MẢNH GIẤY CỔ PHÁT SÁNG
              </h3>
              <p className="text-[11px] font-bold text-[#ADEFD1] uppercase tracking-widest mb-4">
                ✦ GỢI Ý THỨ HAI (MANH MỐI 2/5) ✦
              </p>

              <div className="bg-[#002447] text-white p-4 rounded-2xl border border-[#ADEFD1]/50 shadow-inner mb-5 text-left">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#ADEFD1] uppercase mb-1.5">
                  <span>📜</span>
                  <span>LỜI GỢI Ý TỪ PHÒNG DANH SƯ</span>
                </div>
                <p className="text-xs sm:text-sm font-bold italic leading-relaxed text-[#FFFFE3]">
                  “Người thầy không chỉ truyền dạy kiến thức mà còn bồi dưỡng nhân cách cho các thế hệ học trò.”
                </p>
              </div>

              {rewardPhase === 'collecting' ? (
                <div className="w-full py-3 bg-[#002447] border border-[#ADEFD1] rounded-full text-xs font-bold text-[#ADEFD1] flex items-center justify-center gap-2 animate-pulse">
                  <Sparkles className="w-4 h-4 text-[#ADEFD1]" />
                  <span>Đang cất Chìa khóa & Mảnh giấy vào Túi đồ...</span>
                </div>
              ) : (
                <button
                  onClick={handleCollectSecretKey}
                  className="w-full py-3 rounded-full bg-[#ADEFD1] text-[#00203F] font-black text-sm hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase"
                >
                  <Sparkles className="w-5 h-5 fill-[#00203F]" />
                  <span>NHẬN CHÌA KHÓA VÀO TÚI ĐỒ</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
