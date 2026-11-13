import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  PenTool,
  Lock,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Feather,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { StoryPanel } from '../StoryPanel';
import { LumiSpeech } from '../LumiSpeech';
import { CrystalBronzeBookKeySvg } from '../InventoryModal';
import room3PoemData from '../../data/room3Poem.json';

interface Room3LiteratureProps {
  task1Done: boolean;
  task2Done: boolean;
  autoOpenTask2?: boolean;
  onCompleteTask1: (score: number) => void;
  onCompleteTask2: (score: number) => void;
  onOpenLumiHint?: (hintText: string) => void;
  onNavigateToRoom4: () => void;
}

const BG_ROOM3 =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%203.%20PH%C3%92NG%20V%C4%82N%20H%E1%BB%8CC%20%E2%80%93%20NH%E1%BB%AENG%20V%E1%BA%A6N%20TH%C6%A0%20TH%E1%BA%A4T%20L%E1%BA%A0C/Ph%C3%B2ng%20V%C4%83n%20H%E1%BB%8Dc_%20Nh%E1%BB%AFng%20V%E1%BA%A7n%20Th%C6%A1%20Th%E1%BA%A5t%20L%E1%BA%A1c.png';

const HOTSPOT_1_IMG =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%203.%20PH%C3%92NG%20V%C4%82N%20H%E1%BB%8CC%20%E2%80%93%20NH%E1%BB%AENG%20V%E1%BA%A6N%20TH%C6%A0%20TH%E1%BA%A4T%20L%E1%BA%A0C/Quy%E1%BB%83n%20th%C6%A1%20c%E1%BB%95%20%C4%91ang%20m%E1%BB%9F,%20Nh%E1%BB%AFng%20trang%20th%C6%A1%20bay%20l%C6%A1%20l%E1%BB%ADng.png';

const HOTSPOT_2_IMG =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%203.%20PH%C3%92NG%20V%C4%82N%20H%E1%BB%8CC%20%E2%80%93%20NH%E1%BB%AENG%20V%E1%BA%A6N%20TH%C6%A0%20TH%E1%BA%A4T%20L%E1%BA%A0C/Chi%E1%BA%BFc%20b%C3%BAt%20l%C3%B4ng%20m%E1%BA%A5t%20%C3%A1nh%20s%C3%A1ng.png';

const WOODEN_DESK_BG =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/NHI%E1%BB%86M%20V%E1%BB%A4/C%C3%A1i%20b%C3%A0n.png';

// 1. LỜI DẪN VÀO PHÒNG VĂN HỌC (Không in nghiêng, không có ngoặc kép)
const NARRATOR_PARAGRAPHS = [
  'Cánh cửa thứ ba hé mở… Những trang giấy cổ bay lơ lửng giữa căn phòng, cuốn thơ phép thuật bị xáo trộn, còn chiếc bút lông nằm im lìm như đã đánh mất sức mạnh!',
  'Dường như những lời hay và vần thơ tri ân đang dần biến mất. Bí mật nào đang ẩn giấu giữa những trang giấy thất lạc ấy?',
];

// 2. LỜI THOẠI NGƯỜI GÁC THƯ VIỆN – DẪN VÀO NHIỆM VỤ 1
const LUMI_DIALOGUE_PARAGRAPHS = [
  'Chào mừng cậu đến với Phòng Văn Học! Những câu ca dao, tục ngữ về truyền thống tôn sư trọng đạo đã bị chia thành nhiều mảnh và cuốn đi khắp nơi!',
  'Hãy nhấp vào những trang giấy đang bay để ghép lại những lời hay đã thất lạc nhé!',
];

// 3. LỜI THOẠI LUMI – SAU KHI HOÀN THÀNH NHIỆM VỤ 1
const LUMI_AFTER_TASK1_PARAGRAPHS = [
  'Tuyệt vời! Những câu ca dao, tục ngữ đã được khôi phục rồi!',
  'Nhưng nhìn kìa, cuốn thơ cổ vẫn đang phát ra ánh sáng kỳ lạ! Có lẽ những vần thơ bên trong cũng đang cần chúng ta giúp đỡ.',
  'Hãy nhấp vào cuốn thơ để khám phá nhé!',
];

// 10 Ca Dao / Tục Ngữ Items (Hiển thị từng câu một trên trang giấy cổ SVG)
interface ProverbItem {
  id: number;
  line1: string;
  line2Prefix: string;
  correctSuffix: string;
  distractors: string[];
}

const PROVERBS: ProverbItem[] = [
  {
    id: 1,
    line1: 'Ăn quả nhớ kẻ trồng cây,',
    line2Prefix: 'Có danh có vọng',
    correctSuffix: 'nhớ thầy khi xưa.',
    distractors: ['có ngày nên kim.', 'thì mày làm nên.', 'thì yêu lấy thầy.'],
  },
  {
    id: 2,
    line1: 'Dốt kia thì phải cậy thầy,',
    line2Prefix: 'Vụng kia cậy thợ',
    correctSuffix: 'thì mày làm nên.',
    distractors: ['nhớ thầy khi xưa.', 'phải ăn lời thầy.', 'hậu học văn.'],
  },
  {
    id: 3,
    line1: 'Ở đây gần bạn gần thầy,',
    line2Prefix: 'Có công mài sắt',
    correctSuffix: 'có ngày nên kim.',
    distractors: ['bán tự vi sư.', 'ngàn năm lưu truyền.', 'nhớ thầy khi xưa.'],
  },
  {
    id: 4,
    line1: 'Lời dạy ngàn đời truyền lưu:',
    line2Prefix: 'Tiên học lễ,',
    correctSuffix: 'hậu học văn.',
    distractors: ['bán tự vi sư.', 'nhì sư.', 'làm nên.'],
  },
  {
    id: 5,
    line1: 'Đạo học khắc cốt ghi tâm:',
    line2Prefix: 'Nhất tự vi sư,',
    correctSuffix: 'bán tự vi sư.',
    distractors: ['hậu học văn.', 'ngàn năm lưu truyền.', 'thì yêu lấy thầy.'],
  },
  {
    id: 6,
    line1: 'Tục ngữ dân gian nhắc nhở:',
    line2Prefix: 'Không thầy đố mày',
    correctSuffix: 'làm nên.',
    distractors: ['nhì sư.', 'hậu học văn.', 'có ngày nên kim.'],
  },
  {
    id: 7,
    line1: 'Sự đời phải nghĩ mà răn,',
    line2Prefix: 'Phải nuốt lời bạn',
    correctSuffix: 'phải ăn lời thầy.',
    distractors: ['thì yêu lấy thầy.', 'nhớ thầy khi xưa.', 'thì mày làm nên.'],
  },
  {
    id: 8,
    line1: 'Kính trọng bậc dạy chữ nghĩa:',
    line2Prefix: 'Nhất quý',
    correctSuffix: 'nhì sư.',
    distractors: ['làm nên.', 'hậu học văn.', 'bán tự vi sư.'],
  },
  {
    id: 9,
    line1: 'Muốn sang thì bắc cầu Kiều,',
    line2Prefix: 'Muốn con hay chữ',
    correctSuffix: 'thì yêu lấy thầy.',
    distractors: ['nhớ thầy khi xưa.', 'phải ăn lời thầy.', 'có ngày nên kim.'],
  },
  {
    id: 10,
    line1: 'Truyền thống quý báu dân tộc:',
    line2Prefix: 'Tôn sư trọng đạo,',
    correctSuffix: 'ngàn năm lưu truyền.',
    distractors: ['bán tự vi sư.', 'nhớ thầy khi xưa.', 'có ngày nên kim.'],
  },
];

// Stanzas for Poem Reordering (loaded dynamically from src/data/room3Poem.json in correct order 1..N)
interface PoemChunk {
  id: number;
  lines: string[];
}

interface Room3PoemConfig {
  title?: string;
  author?: string;
  stanzas?: { lines: string[] }[];
}

const poemConfig = room3PoemData as Room3PoemConfig;
const POEM_TITLE: string = poemConfig.title || 'BÀI THƠ TRI ÂN';
const POEM_AUTHOR: string = (poemConfig.author || '').trim();
const POEM_CHUNKS: PoemChunk[] = (poemConfig.stanzas || []).map((stanza, index) => ({
  id: index + 1,
  lines: stanza.lines,
}));

function shufflePoemChunks(chunks: PoemChunk[]): PoemChunk[] {
  const copy = [...chunks];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  if (copy.length > 1 && copy.every((c, idx) => c.id === idx + 1)) {
    [copy[0], copy[1]] = [copy[1], copy[0]];
  }
  return copy;
}

function shuffleOptions(arr: string[]): string[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const Room3Literature: React.FC<Room3LiteratureProps> = ({
  task1Done,
  task2Done,
  autoOpenTask2 = false,
  onCompleteTask1,
  onCompleteTask2,
  onNavigateToRoom4,
}) => {
  // Dialogue state synchronized with Room 1 & Room 2
  const [dialoguePhase, setDialoguePhase] = useState<'narrator' | 'lumi' | 'lumi_after_task1' | 'explore'>(() => {
    if (autoOpenTask2) return 'explore';
    if (task1Done && task2Done) return 'explore';
    if (task1Done) return 'lumi_after_task1';
    return 'narrator';
  });

  const isRoomInteractive = dialoguePhase !== 'narrator' && dialoguePhase !== 'lumi';

  // Modal controls
  const [activeModal, setActiveModal] = useState<'task1' | 'task2' | 'task2_locked_notice' | 'secret_key_reward' | null>(() =>
    autoOpenTask2 ? 'task2' : null
  );

  // Secret Key Reward Modal
  const [rewardPhase, setRewardPhase] = useState<'quill_flips' | 'secret_compartment' | 'floating_key' | 'clue_scroll' | 'collecting'>('quill_flips');

  // ============================================================================
  // TASK 1: TỪNG CÂU MỘT TRÊN TRANG GIẤY CỔ SVG + KÉO THẢ MIẾNG GHÉP VÀO LỖ KHOÉT
  // ============================================================================
  const [activeProverbIndex, setActiveProverbIndex] = useState<number>(0);
  const [userAssignments, setUserAssignments] = useState<Record<number, string>>(() => {
    if (task1Done) {
      const map: Record<number, string> = {};
      PROVERBS.forEach((p) => {
        map[p.id] = p.correctSuffix;
      });
      return map;
    }
    return {};
  });
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
  const [isDragOverSlot, setIsDragOverSlot] = useState<boolean>(false);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [task1Feedback, setTask1Feedback] = useState<string | null>(null);
  const [task1Passed, setTask1Passed] = useState<boolean>(task1Done);

  // Pre-shuffled 4 options per proverb (1 correct + 3 distractors)
  const [proverbOptionsMap] = useState<Record<number, string[]>>(() => {
    const map: Record<number, string[]> = {};
    PROVERBS.forEach((p) => {
      map[p.id] = shuffleOptions([p.correctSuffix, ...p.distractors]);
    });
    return map;
  });

  // ============================================================================
  // TASK 2: CUỐN THƠ CỔ & BÚT LÔNG PHÉP THUẬT (SẮP XẾP CÁC KHỔ THƠ TỪ FILE DỮ LIỆU)
  // ============================================================================
  const [orderedChunks, setOrderedChunks] = useState<PoemChunk[]>(() =>
    task2Done ? POEM_CHUNKS : shufflePoemChunks(POEM_CHUNKS)
  );
  const [draggedChunkIdx, setDraggedChunkIdx] = useState<number | null>(null);
  const [dragOverChunkIdx, setDragOverChunkIdx] = useState<number | null>(null);
  const [task2Feedback, setTask2Feedback] = useState<string | null>(null);
  const [task2Checked, setTask2Checked] = useState<boolean>(task2Done);
  const [task2Passed, setTask2Passed] = useState<boolean>(task2Done);
  const [task2Failed, setTask2Failed] = useState<boolean>(false);
  const [isQuillAwakening, setIsQuillAwakening] = useState<boolean>(false);

  // Sync completion states if loaded
  useEffect(() => {
    if (task1Done) {
      setTask1Passed(true);
      const correctMap: Record<number, string> = {};
      PROVERBS.forEach((p) => {
        correctMap[p.id] = p.correctSuffix;
      });
      setUserAssignments(correctMap);
    }
    if (task2Done) {
      setTask2Checked(true);
      setTask2Passed(true);
      setOrderedChunks(POEM_CHUNKS);
      setIsQuillAwakening(true);
    }
  }, [task1Done, task2Done]);

  // Open Hotspot 1 (Những trang giấy bay)
  const handleOpenHotspot1 = () => {
    if (!isRoomInteractive) {
      soundManager.playWrong();
      return;
    }
    soundManager.playClick();
    setActiveModal('task1');
  };

  // Open Hotspot 2 (Cuốn thơ cổ & Chiếc bút lông)
  const handleOpenHotspot2 = () => {
    if (!isRoomInteractive) {
      soundManager.playWrong();
      return;
    }
    soundManager.playClick();
    if (!autoOpenTask2 && !task1Done && !task1Passed) {
      soundManager.playWrong();
      setActiveModal('task2_locked_notice');
      return;
    }
    setActiveModal('task2');
  };

  // Close Task 1 Modal
  const handleCloseTask1Modal = () => {
    soundManager.playClick();
    const allAnswered = Object.keys(userAssignments).length === PROVERBS.length;
    const correctTotal = PROVERBS.filter((p) => userAssignments[p.id] === p.correctSuffix).length;

    if ((task1Passed || (allAnswered && correctTotal >= 7)) && !task1Done) {
      onCompleteTask1(100);
      setDialoguePhase('lumi_after_task1');
    } else if (allAnswered && correctTotal < 7 && !task1Done) {
      setUserAssignments({});
      setActiveProverbIndex(0);
    }
    setActiveModal(null);
  };

  // Trigger 4-phase secret key reward sequence
  const triggerSecretKeyRewardSequence = () => {
    soundManager.playSparkle();
    setRewardPhase('quill_flips');
    setActiveModal('secret_key_reward');

    setTimeout(() => {
      soundManager.playCorrect();
      setRewardPhase('secret_compartment');
    }, 2000);

    setTimeout(() => {
      soundManager.playSparkle();
      setRewardPhase('floating_key');
    }, 3800);
  };

  // Close Task 2 Modal
  const handleCloseTask2Modal = () => {
    soundManager.playClick();
    if (task2Passed && !task2Done) {
      triggerSecretKeyRewardSequence();
    } else {
      setActiveModal(null);
    }
  };

  // TASK 1: Place a puzzle piece into the cutout slot of the current proverb
  const handlePlacePieceInSlot = (pieceText: string) => {
    const currentItem = PROVERBS[activeProverbIndex];
    // Lock each question to 1 choice (like Room 1 & Room 2) unless retrying
    if (userAssignments[currentItem.id] !== undefined) return;

    const nextAssignments = {
      ...userAssignments,
      [currentItem.id]: pieceText,
    };
    setUserAssignments(nextAssignments);
    setSelectedPiece(null);
    setDraggedPiece(null);
    setIsDragOverSlot(false);

    const isRight = pieceText === currentItem.correctSuffix;
    if (isRight) {
      soundManager.playCorrect();
      soundManager.playSparkle();
      setTask1Feedback(null);
    } else {
      soundManager.playWrong();
      setTask1Feedback(`Đáp án đúng là: "${currentItem.correctSuffix}"`);
    }

    // Check if all 10 are answered
    if (Object.keys(nextAssignments).length === PROVERBS.length) {
      const correctCount = PROVERBS.filter((p) => nextAssignments[p.id] === p.correctSuffix).length;
      window.parent.postMessage(
        {
          answerTrue: correctCount, // Cái này là câu trả lời đúng
          totalQuestion: PROVERBS.length, // 10 câu hỏi
          command: 'submit_result', //Không được đổi
        },
        '*'
      );
      setTask1Passed(true);
    }
  };

  const handleContinueTask1 = () => {
    soundManager.playClick();
    setTask1Feedback(null);
    setSelectedPiece(null);
    if (activeProverbIndex < PROVERBS.length - 1) {
      setActiveProverbIndex((prev) => prev + 1);
    }
  };

  const handleRetryTask1 = () => {
    soundManager.playClick();
    setUserAssignments({});
    setActiveProverbIndex(0);
    setTask1Feedback(null);
    setSelectedPiece(null);
    setTask1Passed(false);
  };

  // TASK 1: Quick Test Auto-complete
  const handleQuickTestTask1 = () => {
    soundManager.playSparkle();
    const correctMap: Record<number, string> = {};
    PROVERBS.forEach((p) => {
      correctMap[p.id] = p.correctSuffix;
    });
    setUserAssignments(correctMap);
    setActiveProverbIndex(PROVERBS.length - 1);
    setTask1Passed(true);
    setTask1Feedback(null);
  };

  // TASK 2: Reorder poem chunks via Up/Down buttons
  const moveChunk = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedChunks.length) return;
    soundManager.playClick();
    const next = [...orderedChunks];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    setOrderedChunks(next);
    setTask2Checked(false);
    setTask2Failed(false);
    setTask2Feedback(null);
  };

  // TASK 2: Reorder poem chunks via Drag and Drop
  const handleDropChunk = (targetIndex: number) => {
    if (draggedChunkIdx === null || draggedChunkIdx === targetIndex || task2Passed) {
      setDraggedChunkIdx(null);
      setDragOverChunkIdx(null);
      return;
    }
    soundManager.playClick();
    const next = [...orderedChunks];
    const [moved] = next.splice(draggedChunkIdx, 1);
    next.splice(targetIndex, 0, moved);
    setOrderedChunks(next);
    setDraggedChunkIdx(null);
    setDragOverChunkIdx(null);
    setTask2Checked(false);
    setTask2Failed(false);
    setTask2Feedback(null);
  };

  // TASK 2: Check Poem Order against ground-truth order 1..N (strict right/wrong check)
  const handleCheckTask2 = () => {
    const totalStanzas = POEM_CHUNKS.length;
    const correctCount = orderedChunks.filter((c, idx) => c.id === idx + 1).length;

    window.parent.postMessage(
      {
        answerTrue: correctCount, // Cái này là câu trả lời đúng
        totalQuestion: totalStanzas, // Tổng số khổ thơ
        command: 'submit_result', //Không được đổi
      },
      '*'
    );

    setTask2Checked(true);

    if (correctCount === totalStanzas) {
      soundManager.playCorrect();
      soundManager.playSparkle();
      setIsQuillAwakening(true);
      setTask2Passed(true);
      setTask2Failed(false);
      setTask2Feedback(
        `Chính xác tuyệt đối (${correctCount}/${totalStanzas} khổ thơ)! Bút Lông Phép Thuật đã được đánh thức!`
      );
    } else {
      soundManager.playWrong();
      setIsQuillAwakening(false);
      setTask2Passed(false);
      setTask2Failed(true);
      setTask2Feedback(
        `Chưa chính xác: Bạn đã xếp đúng ${correctCount}/${totalStanzas} khổ thơ. Các khổ viền xanh (✓ Đúng vị trí) đã chuẩn, hãy điều chỉnh lại các khổ viền đỏ (✕ Chưa đúng vị trí)!`
      );
    }
  };

  const handleRetryTask2 = () => {
    soundManager.playClick();
    setOrderedChunks(shufflePoemChunks(POEM_CHUNKS));
    setTask2Checked(false);
    setTask2Failed(false);
    setTask2Feedback(null);
  };

  // TASK 2: Quick Test Auto-complete
  const handleQuickTestTask2 = () => {
    soundManager.playSparkle();
    setOrderedChunks(POEM_CHUNKS);
    setTask2Checked(true);
    setIsQuillAwakening(true);
    setTask2Passed(true);
    setTask2Failed(false);
    setTask2Feedback(null);
  };

  // Inspect floating key to see clue scroll
  const handleInspectFloatingKey = () => {
    soundManager.playSparkle();
    setRewardPhase('clue_scroll');
  };

  // Collect secret key 3 and trigger room finish
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

  return (
    <div className="relative w-full h-full min-h-full overflow-hidden flex flex-col justify-between p-2 md:p-4 text-[#FFFFE3] select-none">
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <img
          src={BG_ROOM3}
          alt="Phòng Văn Học - Những Vần Thơ Thất Lạc"
          className="w-full h-full object-cover object-center filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001020]/80 via-transparent to-[#001020]/30 pointer-events-none" />
      </div>

      {/* 1. LỜI DẪN VÀO PHÒNG */}
      {!(task1Done && task2Done) && dialoguePhase === 'narrator' && (
        <StoryPanel
          title="BỐI CẢNH PHÒNG VĂN HỌC"
          lines={NARRATOR_PARAGRAPHS}
          onComplete={() => setDialoguePhase('lumi')}
        />
      )}

      {/* 2. LỜI THOẠI CỦA LUMI ĐẦU PHÒNG */}
      {!(task1Done && task2Done) && dialoguePhase === 'lumi' && !activeModal && (
        <LumiSpeech
          key="lumi-room3-intro"
          lines={LUMI_DIALOGUE_PARAGRAPHS}
          onComplete={() => setDialoguePhase('explore')}
        />
      )}

      {/* 3. LỜI THOẠI CỦA LUMI SAU KHI HOÀN THÀNH NHIỆM VỤ 1 */}
      {!(task1Done && task2Done) && dialoguePhase === 'lumi_after_task1' && !activeModal && (
        <LumiSpeech
          key="lumi-room3-after-task1"
          lines={LUMI_AFTER_TASK1_PARAGRAPHS}
          onComplete={() => setDialoguePhase('explore')}
        />
      )}

      {/* ROOM 3 INTERACTIVE HOTSPOTS - RESPONSIVE ACROSS PHONE, IPAD, LAPTOP, TV */}
      <div className="relative z-10 w-full flex-1 max-w-7xl mx-auto px-2 sm:px-6 flex items-end justify-between pb-[clamp(3.5rem,18vh,9.5rem)] pointer-events-none">
        {/* HOTSPOT 1: NHỮNG TRANG GIẤY BAY (Di chuyển xuống thêm 1cm) */}
        <div
          style={{ marginLeft: '3cm', marginBottom: '-0.5cm', transform: 'translateY(1cm)' }}
          className={`absolute left-[5%] sm:left-[12%] md:left-[18%] bottom-[4%] sm:bottom-[6%] w-[44%] sm:w-[40%] md:w-[38%] h-[42%] sm:h-[46%] pointer-events-auto flex flex-col items-center justify-end transition-all duration-300 ${
            !isRoomInteractive
              ? 'opacity-40 cursor-not-allowed filter grayscale pointer-events-none'
              : 'cursor-pointer group hover:scale-[1.03]'
          }`}
          onClick={handleOpenHotspot1}
          title={
            !isRoomInteractive
              ? 'Hoàn thành lời dẫn và lời thoại của Lumi để mở khóa đồ vật'
              : 'Những Trang Giấy Bay'
          }
        >
          {task1Done || task1Passed ? (
            <div className="mb-1 sm:mb-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#001c38] border border-emerald-400 text-emerald-300 font-black text-[10px] sm:text-xs md:text-sm shadow-md flex items-center gap-1.5 animate-pop whitespace-nowrap shrink-0 z-10">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span>ĐÃ HOÀN THÀNH</span>
            </div>
          ) : (
            <span className="mb-1 sm:mb-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#001833]/90 border border-[#ADEFD1]/50 text-[#ADEFD1] font-black text-[10px] sm:text-xs md:text-sm shadow-lg whitespace-nowrap shrink-0 z-10">
              Những Trang Giấy Bay
            </span>
          )}

          <div className="relative flex-1 min-h-0 w-full flex items-center justify-center">
            <img
              src={HOTSPOT_1_IMG}
              alt="Những Trang Giấy Bay"
              loading="eager"
              decoding="async"
              className={`h-full w-auto max-w-full object-contain filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.95)] transition-all duration-300 ${
                task1Done || task1Passed
                  ? 'brightness-110 drop-shadow-[0_0_20px_#28a745]'
                  : isRoomInteractive
                  ? 'group-hover:brightness-115 animate-pulse'
                  : ''
              }`}
            />
          </div>
        </div>

        {/* HOTSPOT 2: CUỐN THƠ CỔ & BÚT LÔNG */}
        <div
          className={`absolute right-[3%] sm:right-[4%] md:right-[5%] bottom-[4%] sm:bottom-[6%] w-[40%] sm:w-[36%] md:w-[34%] h-[38%] sm:h-[40%] pointer-events-auto flex flex-col items-center justify-end transition-all duration-300 ${
            !isRoomInteractive
              ? 'opacity-40 cursor-not-allowed filter grayscale pointer-events-none'
              : 'cursor-pointer group hover:scale-[1.03]'
          }`}
          onClick={handleOpenHotspot2}
          title={
            !isRoomInteractive
              ? 'Hoàn thành lời dẫn và lời thoại của Lumi để mở khóa đồ vật'
              : !task1Done && !task1Passed
              ? 'Hoàn thành Những Trang Giấy Bay trước để mở khóa Cuốn Thơ Cổ'
              : 'Cuốn Thơ Cổ'
          }
        >
          <div className="relative flex-1 min-h-0 w-full flex items-center justify-center">
            <img
              src={HOTSPOT_2_IMG}
              alt="Cuốn Thơ Cổ"
              className={`h-full w-auto max-w-full object-contain filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.95)] transition-all duration-300 ${
                task2Done || task2Passed
                  ? 'brightness-115 drop-shadow-[0_0_20px_#28a745]'
                  : task1Done || task1Passed
                  ? 'brightness-110 group-hover:brightness-120 animate-pulse'
                  : 'opacity-70 brightness-75'
              }`}
            />
          </div>

          {task2Done || task2Passed ? (
            <div className="mt-1 sm:mt-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#001c38] border border-emerald-400 text-emerald-300 font-black text-[10px] sm:text-xs md:text-sm shadow-md flex items-center gap-1.5 animate-pop whitespace-nowrap shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span>ĐÃ HOÀN THÀNH</span>
            </div>
          ) : (
            <span className="mt-1 sm:mt-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#001833]/90 border border-[#ADEFD1]/50 text-[#ADEFD1] font-black text-[10px] sm:text-xs md:text-sm shadow-lg whitespace-nowrap shrink-0">
              Cuốn Thơ Cổ
            </span>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROOM 3 COMPLETE CELEBRATION MODAL */}
      {/* ========================================================================= */}
      {task1Done && task2Done && !activeModal && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-pop">
          <div className="bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative text-white">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#002447] border border-[#ADEFD1] flex items-center justify-center text-[#FFD700] shadow-md animate-bounce-slow">
              <Sparkles className="w-9 h-9 text-[#FFD700]" />
            </div>

            <h3 className="text-xl font-black text-white uppercase tracking-wider mb-1">
              CHÚC MỪNG! BẠN ĐÃ VƯỢT QUA PHÒNG VĂN HỌC!
            </h3>

            <div className="flex items-center justify-center gap-2.5 my-3">
              <span className="px-3 py-1 rounded-full bg-[#002447] border border-emerald-400 text-xs font-bold text-emerald-300 flex items-center gap-1">
                <span className="text-emerald-400 font-black">✓</span> 2/2 nhiệm vụ
              </span>
              <span className="px-3 py-1 rounded-full bg-[#002447] border border-[#ADEFD1] text-xs font-bold text-[#ADEFD1] flex items-center gap-1">
                <span>🔑</span> Chìa khóa bí mật 3/5
              </span>
            </div>

            <p className="text-xs text-[#FFFFE3]/90 leading-relaxed mb-6">
              Bạn đã khôi phục 10 câu ca dao tôn sư trọng đạo và hoàn thành bài thơ tri ân thiêng liêng để thắp sáng Trái Tim Thư Viện!
            </p>

            <button
              onClick={() => {
                soundManager.playSparkle();
                onNavigateToRoom4();
              }}
              className="w-full py-3 rounded-full bg-[#ADEFD1] text-[#00203F] font-black text-sm hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase"
            >
              <Sparkles className="w-5 h-5 fill-[#00203F]" />
              <span>TIẾP TỤC ĐẾN PHÒNG KÝ ỨC</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* THÔNG BÁO KHI CHƯA MỞ KHÓA NHIỆM VỤ 2 */}
      {/* ========================================================================= */}
      {activeModal === 'task2_locked_notice' && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-pop">
          <div className="bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative text-white">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-[#ADEFD1] hover:text-white font-bold text-lg cursor-pointer"
            >
              ✕
            </button>
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-[#002447] border border-[#ADEFD1] flex items-center justify-center shadow-md">
              <Lock className="w-10 h-10 text-[#ADEFD1]" />
            </div>
            <h3 className="text-lg font-black text-white uppercase mb-2">
              CUỐN THƠ CỔ ĐANG BỊ PHONG ẤN!
            </h3>
            <p className="text-xs text-[#FFFFE3]/90 leading-relaxed mb-5">
              Cậu cần hoàn thành <span className="font-bold text-[#ADEFD1]">Nhiệm vụ 1: Những Lời Hay Thất Lạc</span> ở Những Trang Giấy Bay bên trái trước khi đánh thức Cuốn Thơ Cổ nhé!
            </p>
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveModal('task1');
              }}
              className="w-full py-3 rounded-full bg-[#ADEFD1] text-[#00203F] font-black text-xs hover:bg-white transition-all shadow-md cursor-pointer uppercase tracking-wider"
            >
              MỞ NHỮNG TRANG GIẤY BAY NGAY
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TASK 1 MODAL: NHIỆM VỤ 1 – NHỮNG LỜI HAY THẤT LẠC (TRANG GIẤY CỔ SVG TRÊN MẶT BÀN GỖ + KÉO THẢ MIẾNG GHÉP) */}
      {/* ========================================================================= */}
      {activeModal === 'task1' && (() => {
        const currentProverb = PROVERBS[activeProverbIndex];
        const currentOptions = proverbOptionsMap[currentProverb.id] || [];
        const assignedAnswer = userAssignments[currentProverb.id];
        const isCurrentAnswered = assignedAnswer !== undefined;
        const isCurrentCorrect = isCurrentAnswered && assignedAnswer === currentProverb.correctSuffix;

        const all10Answered = Object.keys(userAssignments).length === PROVERBS.length;
        const correctTotal = PROVERBS.filter((p) => userAssignments[p.id] === p.correctSuffix).length;
        const isTask1Success = all10Answered;
        const isTask1Failed = false;

        return (
          <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-pop">
            <div className="relative w-full max-w-5xl bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl p-3 sm:p-4 shadow-2xl flex flex-col h-full max-h-[89vh] overflow-hidden text-white">
              {/* Header (Đã bỏ (VÒNG ...)) */}
              <div className="flex items-center justify-between border-b border-[#ADEFD1]/30 pb-2 mb-2 shrink-0">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#002447] border border-[#ADEFD1] flex items-center justify-center text-[#ADEFD1] shrink-0">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-base font-black text-white uppercase tracking-wide truncate">
                      NHIỆM VỤ 1: NHỮNG LỜI HAY THẤT LẠC
                    </h3>
                    <p className="text-[10px] sm:text-xs text-[#ADEFD1] truncate">
                      Kéo thả (hoặc nhấp chọn) miếng ghép giấy cổ bên dưới vào lỗ khoét trên trang giấy để hoàn chỉnh câu ca dao, tục ngữ!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCloseTask1Modal}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#002447] border border-[#ADEFD1] text-[#ADEFD1] font-bold hover:bg-[#ADEFD1] hover:text-[#00203F] transition-all flex items-center justify-center cursor-pointer text-sm"
                    title="Đóng bảng"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Thanh 10 câu hỏi (Từng câu một 1..10 đồng bộ Phòng 1 & Phòng 2) */}
              <div className="bg-[#002447]/90 border border-[#ADEFD1]/40 rounded-2xl px-3 py-1.5 mb-2 shrink-0">
                <div className="flex items-center justify-between gap-1.5">
                  {PROVERBS.map((item, idx) => {
                    const ans = userAssignments[item.id];
                    const isAnswered = ans !== undefined;
                    const isRight = isAnswered && ans === item.correctSuffix;
                    const isCurrent = idx === activeProverbIndex;

                    let circleStyle =
                      'bg-[#001833] text-[#ADEFD1] border-[#ADEFD1]/40 hover:border-[#ADEFD1]';
                    if (isAnswered) {
                      circleStyle = isRight
                        ? 'bg-emerald-600 text-white border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                        : 'bg-rose-600 text-white border-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.6)]';
                    }

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          soundManager.playClick();
                          setActiveProverbIndex(idx);
                          setSelectedPiece(null);
                          setTask1Feedback(null);
                        }}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-black text-xs transition-all flex items-center justify-center border cursor-pointer ${circleStyle} ${
                          isCurrent ? 'ring-2 ring-[#FFD700] scale-110' : 'opacity-90 hover:opacity-100'
                        }`}
                        title={`Câu ${item.id}`}
                      >
                        {item.id}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Khu vực Mặt Bàn Gỗ + Trang Giấy Cổ SVG có Lỗ Khoét + 4 Miếng Ghép Giấy Cổ (Có thanh kéo) */}
              <div
                className="flex-1 min-h-0 relative rounded-2xl border-2 border-[#ADEFD1]/40 overflow-y-auto custom-scrollbar flex flex-col items-center justify-between p-2 sm:p-4 shadow-inner"
                style={{
                  backgroundImage: `url("${WOODEN_DESK_BG}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* TRANG GIẤY CỔ SVG CHÍNH (Theo mẫu gemini-svg (4).svg với Lỗ Khoét Tương Tác) */}
                <div
                  onDragOver={(e) => {
                    if (isCurrentAnswered) return;
                    e.preventDefault();
                    setIsDragOverSlot(true);
                  }}
                  onDragLeave={() => setIsDragOverSlot(false)}
                  onDrop={(e) => {
                    if (isCurrentAnswered) return;
                    e.preventDefault();
                    const pieceFromTransfer = e.dataTransfer.getData('text/plain') || draggedPiece;
                    if (pieceFromTransfer) {
                      handlePlacePieceInSlot(pieceFromTransfer);
                    }
                  }}
                  onClick={() => {
                    if (!isCurrentAnswered && selectedPiece) {
                      handlePlacePieceInSlot(selectedPiece);
                    }
                  }}
                  className={`relative z-10 w-full max-w-[720px] my-1 sm:my-auto flex items-center justify-center transition-transform duration-200 ${
                    !isCurrentAnswered && (isDragOverSlot || selectedPiece)
                      ? 'scale-[1.01] cursor-pointer'
                      : ''
                  }`}
                >
                  <svg
                    viewBox="0 0 800 350"
                    className="w-full h-auto max-h-[260px] drop-shadow-[0_16px_28px_rgba(0,0,0,0.85)] select-none"
                  >
                    <defs>
                      {/* Gradient giấy cổ chính theo mẫu gemini-svg (4).svg */}
                      <radialGradient id="ancient-paper-grad" cx="50%" cy="50%" r="62%">
                        <stop offset="0%" stopColor="#f5dfb3" />
                        <stop offset="58%" stopColor="#dfb97a" />
                        <stop offset="100%" stopColor="#c49450" />
                      </radialGradient>

                      {/* Gradient miếng ghép giấy cổ khi đã lắp vào lỗ khoét */}
                      <linearGradient id="fitted-piece-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ecd09c" />
                        <stop offset="50%" stopColor="#f7e4bc" />
                        <stop offset="100%" stopColor="#cfa360" />
                      </linearGradient>

                      {/* Gradient lỗ khoét tối trên mặt giấy khi chưa ghép */}
                      <linearGradient id="cutout-hole-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#261507" />
                        <stop offset="50%" stopColor="#3b220d" />
                        <stop offset="100%" stopColor="#1b0e04" />
                      </linearGradient>

                      <filter id="paper-stain-blur" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="16" />
                      </filter>
                    </defs>

                    {/* Bóng đổ tối phía dưới tờ giấy cổ */}
                    <polygon
                      points="68,42 195,35 222,45 355,33 485,41 620,33 650,45 735,39 747,108 740,152 749,202 732,252 742,316 602,326 498,314 378,328 252,314 188,324 65,316 55,245 69,195 57,128"
                      fill="#1a0903"
                      opacity="0.72"
                      transform="translate(8, 10)"
                    />

                    {/* Thân tờ giấy cổ rách viền tự nhiên */}
                    <polygon
                      points="68,42 195,35 222,45 355,33 485,41 620,33 650,45 735,39 747,108 740,152 749,202 732,252 742,316 602,326 498,314 378,328 252,314 188,324 65,316 55,245 69,195 57,128"
                      fill="url(#ancient-paper-grad)"
                      stroke="#7c5522"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                    />

                    {/* Các vệt ố thời gian trên giấy cổ giống hệt mẫu SVG */}
                    <ellipse
                      cx="125"
                      cy="95"
                      rx="55"
                      ry="48"
                      fill="#b5833e"
                      opacity="0.32"
                      filter="url(#paper-stain-blur)"
                    />
                    <ellipse
                      cx="415"
                      cy="68"
                      rx="95"
                      ry="28"
                      fill="#b5833e"
                      opacity="0.28"
                      filter="url(#paper-stain-blur)"
                    />
                    <ellipse
                      cx="210"
                      cy="275"
                      rx="46"
                      ry="42"
                      fill="#a67432"
                      opacity="0.35"
                      filter="url(#paper-stain-blur)"
                    />

                    {/* Khung viền nét đứt cổ điển bên trong tờ giấy */}
                    <rect
                      x="86"
                      y="58"
                      width="628"
                      height="242"
                      fill="none"
                      stroke="#8c622b"
                      strokeWidth="1.6"
                      strokeDasharray="10 5 2 5"
                      opacity="0.55"
                    />

                    {/* DÒNG 1 CỦA CÂU CA DAO / TỤC NGỮ */}
                    <text
                      x="120"
                      y="142"
                      fill="#2b1704"
                      fontSize="31"
                      fontWeight="600"
                      fontFamily="system-ui, -apple-system, sans-serif"
                    >
                      {currentProverb.line1}
                    </text>

                    {/* VẾ ĐẦU DÒNG 2 (TRƯỚC LỖ KHOÉT) */}
                    <text
                      x="120"
                      y="228"
                      fill="#2b1704"
                      fontSize="31"
                      fontWeight="600"
                      fontFamily="system-ui, -apple-system, sans-serif"
                    >
                      {currentProverb.line2Prefix}
                    </text>

                    {/* VÙNG LỖ KHOÉT (CUTOUT SLOT) ĐỂ THẢ MIẾNG GHÉP VÀO */}
                    <g className="transition-all duration-200">
                      {!isCurrentAnswered ? (
                        <>
                          {/* Lỗ khoét lõm xuống trên trang giấy cổ */}
                          <polygon
                            points="382,190 432,184 486,189 558,183 630,188 688,185 696,212 690,234 694,252 636,256 564,251 498,258 438,252 380,255 374,232 384,210"
                            fill="url(#cutout-hole-grad)"
                            stroke={isDragOverSlot || selectedPiece ? '#FFD700' : '#6e471b'}
                            strokeWidth={isDragOverSlot || selectedPiece ? '3.5' : '2.5'}
                            strokeDasharray={isDragOverSlot || selectedPiece ? 'none' : '7 4'}
                          />
                          <polygon
                            points="386,194 432,188 486,193 558,187 630,192 684,189 691,212 686,234 689,248 636,252 564,247 498,254 438,248 384,251 379,232 388,210"
                            fill="none"
                            stroke="#d4a862"
                            strokeWidth="1"
                            opacity="0.4"
                          />
                          <text
                            x="536"
                            y="227"
                            textAnchor="middle"
                            fill={isDragOverSlot || selectedPiece ? '#FFD700' : '#d6b27c'}
                            fontSize="17"
                            fontWeight="700"
                            fontFamily="system-ui, -apple-system, sans-serif"
                          >
                            {isDragOverSlot
                              ? '✦ Thả miếng ghép vào lỗ khoét ✦'
                              : selectedPiece
                              ? '✦ Nhấp để lắp miếng ghép ✦'
                              : '(Kéo miếng ghép thả vào lỗ khoét)'}
                          </text>
                        </>
                      ) : (
                        <>
                          {/* Miếng ghép giấy cổ đã lắp khít vào lỗ khoét giống mẫu gemini-svg (4).svg */}
                          <polygon
                            points="382,190 432,184 486,189 558,183 630,188 688,185 696,212 690,234 694,252 636,256 564,251 498,258 438,252 380,255 374,232 384,210"
                            fill="url(#fitted-piece-grad)"
                            stroke={isCurrentCorrect ? '#15803d' : '#b91c1c'}
                            strokeWidth="3"
                          />
                          <polygon
                            points="385,193 432,187 486,192 558,186 630,191 685,188 692,212 687,234 690,249 636,253 564,248 498,255 438,249 383,252 378,232 387,210"
                            fill="none"
                            stroke="#785021"
                            strokeWidth="1.2"
                            opacity="0.7"
                          />
                          <text
                            x="536"
                            y="229"
                            textAnchor="middle"
                            fill="#2b1704"
                            fontSize="27"
                            fontWeight="700"
                            fontFamily="system-ui, -apple-system, sans-serif"
                          >
                            {assignedAnswer}
                          </text>
                        </>
                      )}
                    </g>
                  </svg>
                </div>

                {/* KHAY 4 MIẾNG GHÉP GIẤY CỔ TRÊN MẶT BÀN GỖ (KÉO THẢ HOẶC NHẤP CHỌN) */}
                <div className="relative z-10 w-full bg-[#001428]/85 backdrop-blur-xs border border-[#ADEFD1]/45 rounded-2xl p-2.5 sm:p-3 shrink-0 shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] sm:text-xs font-black text-[#ADEFD1] uppercase tracking-wider flex items-center gap-1.5">
                      <span>🧩</span>
                      <span>CÁC MIẾNG GHÉP GIẤY CỔ (GIỮ CHUỘT KÉO THẢ VÀO LỖ KHOÉT TRÊN TRANG GIẤY):</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    {currentOptions.map((pieceText, idx) => {
                      const isThisPicked = assignedAnswer === pieceText;
                      const isCorrectOption = pieceText === currentProverb.correctSuffix;
                      const isSelected = selectedPiece === pieceText;

                      return (
                        <div
                          key={idx}
                          draggable={!isCurrentAnswered}
                          onDragStart={(e) => {
                            if (isCurrentAnswered) return;
                            e.dataTransfer.setData('text/plain', pieceText);
                            setDraggedPiece(pieceText);
                            setSelectedPiece(pieceText);
                          }}
                          onDragEnd={() => {
                            setDraggedPiece(null);
                            setIsDragOverSlot(false);
                          }}
                          onClick={() => {
                            if (isCurrentAnswered) return;
                            soundManager.playClick();
                            // Hỗ trợ cả nhấp trực tiếp để lắp ngay hoặc chọn rồi nhấp lỗ khoét
                            handlePlacePieceInSlot(pieceText);
                          }}
                          className={`group relative transition-all select-none ${
                            isCurrentAnswered
                              ? isThisPicked
                                ? 'opacity-45 scale-95 cursor-default'
                                : isCorrectOption
                                ? 'ring-2 ring-emerald-400 rounded-xl cursor-default'
                                : 'opacity-50 cursor-default'
                              : isSelected
                              ? 'scale-105 cursor-grabbing drop-shadow-[0_0_12px_rgba(255,215,0,0.8)]'
                              : 'cursor-grab active:cursor-grabbing hover:scale-105 hover:-translate-y-0.5'
                          }`}
                          title={
                            isCurrentAnswered
                              ? pieceText
                              : 'Giữ chuột kéo thả vào lỗ khoét trên trang giấy cổ (hoặc nhấp để ghép)'
                          }
                        >
                          {/* SVG hình miếng ghép giấy cổ đồng bộ với lỗ khoét */}
                          <svg viewBox="0 0 320 82" className="w-full h-auto drop-shadow-md">
                            <polygon
                              points="10,12 62,6 118,11 188,5 256,10 308,7 315,34 309,56 313,73 258,77 190,72 124,78 66,73 10,75 4,52 13,30"
                              fill="url(#fitted-piece-grad)"
                              stroke={
                                isCurrentAnswered && isCorrectOption
                                  ? '#10b981'
                                  : isSelected
                                  ? '#FFD700'
                                  : '#785021'
                              }
                              strokeWidth={isSelected || (isCurrentAnswered && isCorrectOption) ? '3.5' : '2.2'}
                            />
                            <polygon
                              points="14,16 62,10 118,15 188,9 256,14 304,11 310,34 305,56 308,69 258,73 190,68 124,74 66,69 14,71 9,52 17,30"
                              fill="none"
                              stroke="#8c622b"
                              strokeWidth="1"
                              strokeDasharray="6 3"
                              opacity="0.65"
                            />
                            <text
                              x="160"
                              y="49"
                              textAnchor="middle"
                              fill="#2b1704"
                              fontSize="21"
                              fontWeight="700"
                              fontFamily="system-ui, -apple-system, sans-serif"
                            >
                              {pieceText}
                            </text>
                          </svg>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Thanh điều hướng dưới cùng (Đã bỏ dòng Đã hoàn thành 1/10 theo yêu cầu Hình 4) */}
              <div className="pt-2.5 mt-2 border-t border-[#ADEFD1]/30 flex items-center justify-between gap-2 shrink-0 min-h-[42px]">
                <div className="text-xs font-bold truncate">
                  {isTask1Failed ? (
                    <span className="text-rose-300 font-black">
                      Bạn đạt {correctTotal}/10 câu đúng (cần tối thiểu 7/10 câu để hoàn thành). Hãy nhấn Thử lại nhé!
                    </span>
                  ) : task1Feedback ? (
                    <span className="text-[#FFD700] font-bold">{task1Feedback}</span>
                  ) : null}
                </div>

                {isCurrentAnswered && (
                  <div className="flex items-center gap-2 shrink-0 ml-auto">
                    {isTask1Failed ? (
                      <button
                        onClick={handleRetryTask1}
                        className="px-6 py-2 rounded-full bg-rose-700 text-white text-xs font-black hover:bg-rose-600 hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                      >
                        <span>THỬ LẠI</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={
                          activeProverbIndex < PROVERBS.length - 1
                            ? handleContinueTask1
                            : isTask1Success
                            ? handleCloseTask1Modal
                            : handleContinueTask1
                        }
                        className="px-7 py-2 rounded-full bg-[#ADEFD1] text-[#00203F] text-xs font-black hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                      >
                        <span>TIẾP TỤC</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* TASK 2 MODAL: CUỐN THƠ CỔ & BÚT LÔNG PHÉP THUẬT – KHÔI PHỤC BÀI THƠ "LỜI TRI ÂN THẦM LẶNG" */}
      {/* ========================================================================= */}
      {activeModal === 'task2' && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-pop">
          <div className="relative w-full max-w-5xl bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl p-3 sm:p-4 shadow-2xl flex flex-col h-full max-h-[89vh] overflow-hidden text-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#ADEFD1]/30 pb-2 mb-2.5 shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#002447] border border-[#ADEFD1] flex items-center justify-center text-[#ADEFD1] shrink-0">
                  <PenTool className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-base font-black text-white uppercase tracking-wide truncate">
                    NHIỆM VỤ 2: KHÔI PHỤC BÀI THƠ "{POEM_TITLE}"{POEM_AUTHOR ? ` — ${POEM_AUTHOR}` : ''}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-[#ADEFD1] truncate">
                    Kéo thả hoặc nhấn nút mũi tên ▲/▼ để sắp xếp {POEM_CHUNKS.length} khổ thơ trên Cuốn Thơ Cổ và đánh thức Bút Lông Phép Thuật!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCloseTask2Modal}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#002447] border border-[#ADEFD1] text-[#ADEFD1] font-bold hover:bg-[#ADEFD1] hover:text-[#00203F] transition-all flex items-center justify-center cursor-pointer text-sm"
                  title="Đóng bảng"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Khu vực Mặt Bàn Gỗ & Cuốn Thơ Cổ Đang Mở (2 Trang Giấy Cổ Văn Học) */}
            <div
              className="flex-1 min-h-0 relative rounded-2xl border-2 border-[#ADEFD1]/40 overflow-y-auto custom-scrollbar sm:overflow-hidden p-2 sm:p-4 flex items-center justify-center"
              style={{
                backgroundImage: `url("${WOODEN_DESK_BG}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >

              {/* CUỐN THƠ CỔ MỞ ĐÔI (2 TRANG GIẤY CỔ) */}
              {/* KHUNG SẮP XẾP CÁC DẢI GIẤY THƠ CỔ (Chỉ có các dòng thơ, thanh cuộn cuộn mượt lên đầu) */}
              <div className="relative z-10 w-full h-full max-w-3xl flex flex-col rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-4 border-[#5c3a18] bg-gradient-to-b from-[#fbf2dd] via-[#f5e4bd] to-[#e8cf9c] p-3 sm:p-5 text-[#2b1704]">
                {/* Header dải thơ */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#8c622b]/40 pb-2 mb-2.5 shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <Feather className="w-4 h-4 text-[#8c5215] shrink-0" />
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wide text-[#4a2507]">
                      Sắp xếp {POEM_CHUNKS.length} dải giấy thơ theo đúng thứ tự (1 → {POEM_CHUNKS.length}):
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {POEM_AUTHOR && (
                      <span className="text-[10px] sm:text-xs font-bold text-[#4a2507] bg-[#d4ab6a]/35 border border-[#8c622b]/40 px-2.5 py-0.5 rounded-full">
                        ✍️ Tác giả: {POEM_AUTHOR}
                      </span>
                    )}
                    <span className="text-[10px] sm:text-xs font-bold text-[#6e4414] bg-[#8c622b]/15 px-2.5 py-0.5 rounded-full">
                      Kéo thả hoặc nhấn ▲/▼
                    </span>
                  </div>
                </div>

                {/* Danh sách các dải giấy thơ cổ - Đã sửa lỗi thanh kéo (không dùng justify-center trên scrollable container) */}
                <div className="relative flex-1 min-h-0 overflow-y-auto space-y-2 pr-1.5 custom-scrollbar">
                  {orderedChunks.map((chunk, index) => {
                    const isBeingDragged = draggedChunkIdx === index;
                    const isDragTarget = dragOverChunkIdx === index;
                    const isChunkCorrect = chunk.id === index + 1;
                    const showCorrectState = task2Passed || (task2Checked && isChunkCorrect);
                    const showWrongState = !task2Passed && task2Checked && !isChunkCorrect;

                    return (
                      <div
                        key={chunk.id}
                        draggable={!task2Passed}
                        onDragStart={() => {
                          if (task2Passed) return;
                          setDraggedChunkIdx(index);
                        }}
                        onDragOver={(e) => {
                          if (task2Passed) return;
                          e.preventDefault();
                          setDragOverChunkIdx(index);
                        }}
                        onDragLeave={() => setDragOverChunkIdx(null)}
                        onDrop={(e) => {
                          e.preventDefault();
                          handleDropChunk(index);
                        }}
                        onDragEnd={() => {
                          setDraggedChunkIdx(null);
                          setDragOverChunkIdx(null);
                        }}
                        className={`px-3 py-2.5 rounded-xl border-2 transition-all flex items-center justify-between gap-3 shadow-sm ${
                          showCorrectState
                            ? 'bg-emerald-50 border-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.28)]'
                            : showWrongState
                            ? 'bg-rose-50 border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                            : isDragTarget
                            ? 'bg-[#fff8e6] border-[#d97706] scale-[1.01]'
                            : isBeingDragged
                            ? 'opacity-50 bg-[#ebd1a0] border-[#8c622b]'
                            : 'bg-[#faeed7]/95 border-[#8c622b]/70 hover:border-[#4a2507] cursor-grab active:cursor-grabbing'
                        }`}
                      >
                        {/* Con dấu sáp đánh số thứ tự khổ thơ 1..N */}
                        <div className="flex items-center gap-2 shrink-0">
                          <GripVertical className="w-4 h-4 text-[#8c622b] hidden sm:block" />
                          <div
                            className={`w-8 h-8 rounded-full font-black text-xs sm:text-sm flex items-center justify-center shadow-sm border ${
                              showCorrectState
                                ? 'bg-emerald-700 text-white border-emerald-400'
                                : showWrongState
                                ? 'bg-rose-700 text-white border-rose-400'
                                : 'bg-[#5c3211] text-[#f8ebd0] border-[#b5833e]'
                            }`}
                          >
                            {index + 1}
                          </div>
                        </div>

                        {/* Nội dung các câu thơ trên dải giấy cổ */}
                        <div className="flex-1 min-w-0 text-left">
                          {chunk.lines.map((lineText, lineIdx) => (
                            <p
                              key={lineIdx}
                              className={`text-xs sm:text-sm font-bold leading-snug ${
                                lineIdx === 0 ? 'text-[#2b1704]' : 'text-[#4a280a]'
                              }`}
                            >
                              {lineText}
                            </p>
                          ))}
                        </div>

                        {/* Nhãn phản hồi Đúng / Sai rõ ràng sau khi bấm kiểm tra */}
                        {showCorrectState && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-500 text-emerald-800 text-[10px] sm:text-xs font-black shrink-0 whitespace-nowrap">
                            ✓ Đúng vị trí
                          </span>
                        )}
                        {showWrongState && (
                          <span className="px-2.5 py-1 rounded-full bg-rose-100 border border-rose-500 text-rose-800 text-[10px] sm:text-xs font-black shrink-0 whitespace-nowrap">
                            ✕ Sai vị trí
                          </span>
                        )}

                        {/* Nút đổi vị trí Lên / Xuống */}
                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={index === 0 || task2Passed}
                            onClick={() => moveChunk(index, 'up')}
                            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                              index === 0 || task2Passed
                                ? 'bg-[#d4ab6a]/30 border-[#8c622b]/30 text-[#8c622b]/40 cursor-not-allowed'
                                : 'bg-[#5c3211] border-[#8c622b] text-[#f8ebd0] hover:bg-[#3d1e05] cursor-pointer'
                            }`}
                            title="Chuyển khổ thơ lên trên"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            disabled={index === orderedChunks.length - 1 || task2Passed}
                            onClick={() => moveChunk(index, 'down')}
                            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                              index === orderedChunks.length - 1 || task2Passed
                                ? 'bg-[#d4ab6a]/30 border-[#8c622b]/30 text-[#8c622b]/40 cursor-not-allowed'
                                : 'bg-[#5c3211] border-[#8c622b] text-[#f8ebd0] hover:bg-[#3d1e05] cursor-pointer'
                            }`}
                            title="Chuyển khổ thơ xuống dưới"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-2.5 pt-2 border-t border-[#ADEFD1]/30 flex flex-wrap items-center justify-between gap-2 shrink-0 min-h-[42px]">
              <div className="text-xs font-bold flex-1 min-w-[200px]">
                {task2Feedback ? (
                  <span className={task2Passed ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                    {task2Feedback}
                  </span>
                ) : null}
              </div>

              <div className="flex items-center gap-2 ml-auto shrink-0">
                {task2Passed ? (
                  <button
                    onClick={handleCloseTask2Modal}
                    className="px-7 py-2 rounded-full bg-[#ADEFD1] text-[#00203F] font-black text-xs hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <span>TIẾP TỤC</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : task2Failed ? (
                  <button
                    onClick={handleRetryTask2}
                    className="px-6 py-2 rounded-full bg-rose-700 text-white font-black text-xs hover:bg-rose-600 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <span>XÁO TRỘN LÀM LẠI</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleCheckTask2}
                    className="px-6 py-2 rounded-full bg-[#ADEFD1] text-[#00203F] font-black text-xs hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <span>KIỂM TRA BÀI THƠ</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECRET KEY 3 REWARD SEQUENCE */}
      {/* ========================================================================= */}
      {activeModal === 'secret_key_reward' && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-pop">
          {rewardPhase === 'quill_flips' && (
            <div className="bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative text-white animate-pop">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#002447] border border-[#ADEFD1] flex items-center justify-center shadow-md">
                <Sparkles className="w-9 h-9 text-[#FFD700] animate-spin" style={{ animationDuration: '5s' }} />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">
                NHỮNG VẦN THƠ ĐANG TỎA SÁNG!
              </h3>
              <p className="text-xs text-[#FFFFE3]/90 leading-relaxed mb-4">
                Bài thơ tri ân đã hoàn chỉnh, đánh thức chiếc bút lông phép thuật tỏa ánh sáng vàng rực rỡ...
              </p>
              <div className="w-full bg-[#002447] h-2 rounded-full overflow-hidden border border-[#ADEFD1]/40">
                <div className="bg-[#ADEFD1] h-full animate-pulse w-full" />
              </div>
            </div>
          )}

          {rewardPhase === 'secret_compartment' && (
            <div className="bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative text-white animate-pop">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#002447] border border-[#ADEFD1] flex items-center justify-center text-3xl shadow-md animate-bounce-slow">
                📖
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">
                NGĂN BÍ MẬT TRONG CUỐN THƠ HÉ MỞ!
              </h3>
              <p className="text-xs text-[#FFFFE3]/90 leading-relaxed mb-4">
                Ánh sáng từ chiếc bút lông mở ra ngăn bí mật ẩn sâu dưới cuốn thơ cổ...
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#002447] border border-[#ADEFD1] text-[#ADEFD1] text-xs font-bold">
                <Sparkles className="w-4 h-4 text-[#FFD700]" />
                <span>Chìa Khóa Bí Mật Số 3 đang xuất hiện...</span>
              </div>
            </div>
          )}

          {rewardPhase === 'floating_key' && (
            <div className="bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative text-white animate-pop">
              <div
                onClick={handleInspectFloatingKey}
                className="w-32 h-32 mx-auto mb-4 rounded-full bg-[#002447] border-2 border-[#ADEFD1] flex items-center justify-center shadow-[0_0_30px_rgba(173,239,209,0.35)] cursor-pointer hover:scale-105 transition-transform animate-bounce-slow"
              >
                <CrystalBronzeBookKeySvg className="w-24 h-24" />
              </div>

              <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">
                BẠN ĐÃ NHẬN ĐƯỢC CHÌA KHÓA BÍ MẬT SỐ 3!
              </h3>
              <p className="text-xs text-[#FFFFE3]/90 leading-relaxed mb-6">
                Một chiếc chìa khóa pha lê vàng đồng từ trang thơ thần kỳ bay lên cùng mảnh giấy cổ phát sáng!
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
              <div className="w-28 h-28 mx-auto mb-3 rounded-full bg-[#002447] border-2 border-[#ADEFD1] flex items-center justify-center shadow-[0_0_25px_rgba(173,239,209,0.3)]">
                <CrystalBronzeBookKeySvg className="w-20 h-20" />
              </div>

              <h3 className="text-xl font-black text-white uppercase tracking-wider mb-1">
                CHÌA KHÓA BÍ MẬT SỐ 3
              </h3>
              <p className="text-[11px] font-bold text-[#ADEFD1] uppercase tracking-widest mb-4">
                ✦ GỢI Ý THỨ BA (MANH MỐI 3/5) ✦
              </p>

              <div className="bg-[#002447] text-white p-4 rounded-2xl border border-[#ADEFD1]/50 shadow-inner mb-5 text-left">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#ADEFD1] uppercase mb-1.5">
                  <span>📜</span>
                  <span>LỜI GỢI Ý TỪ PHÒNG VĂN HỌC</span>
                </div>
                <p className="text-xs sm:text-sm font-bold leading-relaxed text-[#FFFFE3]">
                  “Tục ngữ "Không thầy đố mày làm nên" đề cao vai trò của người thầy trong việc truyền dạy kiến thức và giúp học trò học tập, tiến bộ.”
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
