import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Lock,
  Unlock,
  Check,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { StoryPanel } from '../StoryPanel';
import { LumiSpeech } from '../LumiSpeech';
import { CrystalBronzeBookKeySvg } from '../InventoryModal';

const ROOM4_BG =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%204.%20PH%C3%92NG%20K%C3%9D%20%E1%BB%A8C%20%E2%80%93%20H%E1%BB%98P%20TH%E1%BB%9CI%20GIAN/PH%C3%92NG%204.%20PH%C3%92NG%20K%C3%9D%20%E1%BB%A8C%20%E2%80%93%20H%E1%BB%98P%20TH%E1%BB%9CI%20GIAN.png';

const HOTSPOT_ALBUM_IMG =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%204.%20PH%C3%92NG%20K%C3%9D%20%E1%BB%A8C%20%E2%80%93%20H%E1%BB%98P%20TH%E1%BB%9CI%20GIAN/Album%20%E1%BA%A3nh%20ch%C6%B0a%20ho%C3%A0n%20ch%E1%BB%89nh.png';

const HOTSPOT_RELICS_IMG =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%204.%20PH%C3%92NG%20K%C3%9D%20%E1%BB%A8C%20%E2%80%93%20H%E1%BB%98P%20TH%E1%BB%9CI%20GIAN/Nh%E1%BB%AFng%20k%E1%BB%B7%20v%E1%BA%ADt%20h%E1%BB%8Dc%20%C4%91%C6%B0%E1%BB%9Dng.png';

const HOTSPOT_BOX_IMG =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%204.%20PH%C3%92NG%20K%C3%9D%20%E1%BB%A8C%20%E2%80%93%20H%E1%BB%98P%20TH%E1%BB%9CI%20GIAN/Chi%E1%BA%BFc%20h%E1%BB%99p%20th%E1%BB%9Di%20gian.png';

const TABLE_BG_IMG =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/NHI%E1%BB%86M%20V%E1%BB%A4/C%C3%A1i%20b%C3%A0n.png';

const RELIC_NOTEBOOK_IMG =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/NHI%E1%BB%86M%20V%E1%BB%A4/quy%E1%BB%83n%20v%E1%BB%9F%20k%C3%AD%20%E1%BB%A9c.png';

const RELIC_PEN_IMG =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/NHI%E1%BB%86M%20V%E1%BB%A4/b%C3%BAt%20m%C3%A1y%20th%E1%BA%A7n%20k%C3%AC.png';

const RELIC_STAR_IMG =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/NHI%E1%BB%86M%20V%E1%BB%A4/c%C3%BAp%20khen%20th%C6%B0%E1%BB%9Fng%20ng%C3%B4i%20sao.png';

const RELIC_FLOWER_IMG =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/NHI%E1%BB%86M%20V%E1%BB%A4/b%C3%B4ng%20hoa%20gi%E1%BA%A5y.png';

const RELIC_MAILBOX_IMG =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/NHI%E1%BB%86M%20V%E1%BB%A4/chi%E1%BA%BFc%20h%E1%BB%99p%20th%C6%B0%20nh%E1%BB%8F%20y%C3%AAu%20th%C6%B0%C6%A1ng.png';

// 1. LỜI DẪN VÀO PHÒNG KÝ ỨC (Không in nghiêng, không có ngoặc kép)
const NARRATOR_PARAGRAPHS = [
  'Cánh cửa tiếp theo mở ra… Một lớp học thân quen hiện lên giữa ánh nắng vàng, nhưng những bức ảnh trong album đã biến mất, các kỷ vật nằm im lìm và chiếc hộp thời gian bị khóa kín!',
  'Dường như những ký ức đẹp về thầy cô và mái trường đang dần phai nhạt. Liệu bạn có thể tìm lại chúng trước khi mọi dấu vết biến mất?',
];

// 2. LỜI THOẠI NGƯỜI GÁC THƯ VIỆN – DẪN VÀO NHIỆM VỤ 1
const LUMI_DIALOGUE_PARAGRAPHS = [
  'Chào mừng cậu đến với Phòng Ký Ức! Những khoảnh khắc đáng nhớ của thầy trò đã bị thất lạc, khiến cuốn album chỉ còn những khung ảnh trống.',
  'Hãy nhấp vào cuốn album và vượt qua các thử thách để khôi phục những bức ảnh nhé!',
];

// 3. LỜI THOẠI LUMI – SAU KHI HOÀN THÀNH NHIỆM VỤ 1
const LUMI_AFTER_TASK1_PARAGRAPHS = [
  'Giỏi lắm! Những bức ảnh đã trở về cuốn album và chúng ta còn tìm được một mảnh lịch bí ẩn!',
  'Nhưng chiếc hộp thời gian vẫn chưa thể mở. Nhìn kìa, những kỷ vật trên bàn đang phát sáng!',
  'Hãy nhấp vào chúng để tìm thêm manh mối nhé!',
];

// 4. LỜI THOẠI LUMI – DẪN ĐẾN GIẢI MÃ BỨC THƯ
const LUMI_BEFORE_LETTER_PARAGRAPHS = [
  'Ồ, một bức thư bí mật vừa xuất hiện! Có lẽ nó đang cất giữ lời giải cho những con số chúng ta vừa tìm được.',
  'Hãy mở bức thư và khám phá bí mật bên trong nhé!',
];

// 5. LỜI THOẠI LUMI – DẪN ĐẾN CHIẾC HỘP THỜI GIAN
const LUMI_BEFORE_BOX_PARAGRAPHS = [
  'Thì ra bí mật nằm ở một dấu mốc lịch sử quan trọng! Cậu còn nhớ năm Ngày Nhà giáo Việt Nam được chính thức quy định không?',
  'Hãy kết hợp ngày tháng với năm ấy, rồi nhập mật mã vào chiếc hộp thời gian nhé!',
];

interface Room4MemoriesProps {
  task1Done: boolean;
  task2Done: boolean;
  onCompleteTask1: (score: number) => void;
  onCompleteTask2: (score: number) => void;
  onOpenLumiHint: (hintText: string) => void;
  onNavigateToRoom5: () => void;
}

interface ShuffledOption {
  id: string;
  text: string;
  displayLetter: string;
}

const shuffleOptionsWithLetters = (items: { id: string; text: string }[]): ShuffledOption[] => {
  const letters = ['A', 'B', 'C', 'D'];
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.map((item, idx) => ({
    ...item,
    displayLetter: letters[idx],
  }));
};

const R4_Q1_RAW = [
  { id: 'A', text: 'Im lặng và bỏ đi vì còn ngại ngùng.' },
  { id: 'B', text: 'Lễ phép cảm ơn cô và làm theo hướng dẫn.' },
  { id: 'C', text: 'Không trả lời cô và tiếp tục đứng ngoài lớp.' },
  { id: 'D', text: 'Yêu cầu cô không nói chuyện với mình.' },
];

const R4_Q2_RAW = [
  { id: 'A', text: 'Giả vờ đã hiểu để tránh bị chú ý.' },
  { id: 'B', text: 'Chép lại bài giải của bạn mà không cần hiểu.' },
  { id: 'C', text: 'Mạnh dạn trao đổi với cô để được giải thích thêm.' },
  { id: 'D', text: 'Bỏ qua phần kiến thức khó vì nghĩ mình không học được.' },
];

const R4_Q4_RAW = [
  { id: 'A', text: 'Cùng nhau viết một tấm thiệp với những lời cảm ơn chân thành.' },
  { id: 'B', text: 'Góp một khoản tiền lớn và yêu cầu tất cả học sinh phải tham gia.' },
  { id: 'C', text: 'Chuẩn bị một tiết mục nhỏ thể hiện những kỷ niệm đáng nhớ của lớp.' },
  { id: 'D', text: 'Cố gắng học tập và thực hiện những điều tốt đẹp đã được thầy cô hướng dẫn.' },
];

const R4_R2_RAW = [
  { id: 'A', text: 'Tranh thủ xem đáp án vì không ai chú ý.' },
  { id: 'B', text: 'Không xem đáp án, tiếp tục làm bài bằng khả năng của mình.' },
  { id: 'C', text: 'Nhờ bạn ngồi cạnh đọc đáp án giúp.' },
  { id: 'D', text: 'Chỉ xem đáp án của một câu khó.' },
];

const R4_R5_RAW = [
  { id: 'A', text: 'Chủ động hỏi thăm thầy cô, chia sẻ về quá trình trưởng thành của bản thân.' },
  { id: 'B', text: 'Cùng nhau ôn lại những kỷ niệm đẹp và bày tỏ lòng biết ơn chân thành.' },
  { id: 'C', text: 'Cho rằng đã trưởng thành nên không cần quan tâm đến những lời dạy trước đây.' },
  { id: 'D', text: 'Tiếp tục vận dụng những điều tốt đẹp thầy cô đã dạy trong cuộc sống.' },
];

export const Room4Memories: React.FC<Room4MemoriesProps> = ({
  task1Done,
  task2Done,
  onCompleteTask1,
  onCompleteTask2,
  onNavigateToRoom5,
}) => {
  // Dialogue state synchronized with Room 1, 2, 3
  const [dialoguePhase, setDialoguePhase] = useState<
    'narrator' | 'lumi' | 'lumi_after_task1' | 'lumi_before_letter' | 'lumi_before_box' | 'explore'
  >(() => {
    if (task1Done && task2Done) return 'explore';
    if (task1Done) return 'lumi_after_task1';
    return 'narrator';
  });

  const isRoomInteractive = dialoguePhase !== 'narrator' && dialoguePhase !== 'lumi';

  // Active Modals
  const [activeModal, setActiveModal] = useState<
    | 'album_task1'
    | 'calendar_reward'
    | 'relics_task2'
    | 'relics_locked_notice'
    | 'secret_letter'
    | 'timebox_lock'
    | 'secret_key_reward'
    | null
  >(null);

  // Whether the Time Box has been unlocked with 20.11.1982
  const [isTimeBoxUnlocked, setIsTimeBoxUnlocked] = useState<boolean>(task1Done && task2Done);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Task 1 (Album 5 questions) State
  const [albumPage, setAlbumPage] = useState<number>(0); // 0 to 4 (5 questions)
  const [restoredPhotos, setRestoredPhotos] = useState<number[]>([]);
  const [albumResults, setAlbumResults] = useState<Record<number, boolean>>(
    task1Done ? { 0: true, 1: true, 2: true, 3: true, 4: true } : ({} as Record<number, boolean>)
  );
  const [task1Passed, setTask1Passed] = useState<boolean>(task1Done);

  // 3D Page Flip SVG Refs & Helper (from Cu_n_s_ch_71f4fd8c.svg)
  const flipPageRef = useRef<SVGPathElement | null>(null);
  const flipShadowRef = useRef<SVGPathElement | null>(null);
  const flipHighlightRef = useRef<SVGPathElement | null>(null);
  const flipAnimRef = useRef<number | null>(null);
  const [isFlippingPage, setIsFlippingPage] = useState<boolean>(false);

  const renderFlipAt = (t: number) => {
    const flipPage = flipPageRef.current;
    const flipShadow = flipShadowRef.current;
    const flipHighlight = flipHighlightRef.current;
    if (!flipPage || !flipShadow || !flipHighlight) return;

    if (t <= 0.002 || t >= 0.998) {
      flipPage.setAttribute('opacity', '0');
      flipShadow.setAttribute('opacity', '0');
      flipHighlight.setAttribute('opacity', '0');
      return;
    }

    const SPINE_X = 600;
    const SPINE_TOP_Y = 132;
    const SPINE_BOT_Y = 624;
    const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

    const arch = Math.sin(t * Math.PI);
    const tTop = Math.pow(t, 0.92);
    const tBot = Math.pow(t, 1.08);

    const outerTopX = lerp(1065, 135, tTop);
    const outerTopY = 114 - arch * 68;

    const outerBotX = lerp(1086, 114, tBot);
    const outerBotY = 592 - arch * 54;

    const ctrl1X = lerp(735, 465, t);
    const ctrl1Y = 80 - arch * 52;

    const ctrl2X = lerp(955, 245, tTop);
    const ctrl2Y = 84 - arch * 75;

    const ctrlBot1X = lerp(955, 245, tBot);
    const ctrlBot1Y = 568 - arch * 65;

    const ctrlBot2X = lerp(735, 465, t);
    const ctrlBot2Y = 570 - arch * 42;

    const outerMidX = (outerTopX + outerBotX) / 2 + (0.5 - t) * arch * 38;
    const outerMidY = (outerTopY + outerBotY) / 2 - arch * 15;

    const pagePath = [
      'M', SPINE_X, SPINE_TOP_Y,
      'C', ctrl1X, ctrl1Y, ctrl2X, ctrl2Y, outerTopX, outerTopY,
      'Q', outerMidX, outerMidY, outerBotX, outerBotY,
      'C', ctrlBot1X, ctrlBot1Y, ctrlBot2X, ctrlBot2Y, SPINE_X, SPINE_BOT_Y,
      'Z',
    ].join(' ');

    const shadowOffset = (0.5 - t) * 55 * arch;
    const shadowPath = [
      'M', SPINE_X, SPINE_TOP_Y + 6,
      'C', ctrl1X + shadowOffset, ctrl1Y + 25, ctrl2X + shadowOffset, ctrl2Y + 32, outerTopX + shadowOffset, outerTopY + 28,
      'Q', outerMidX + shadowOffset, outerMidY + 28, outerBotX + shadowOffset, outerBotY + 24,
      'C', ctrlBot1X + shadowOffset, ctrlBot1Y + 24, ctrlBot2X + shadowOffset, ctrlBot2Y + 18, SPINE_X, SPINE_BOT_Y + 4,
      'Z',
    ].join(' ');

    const highlightXTop = lerp(SPINE_X, outerTopX, 0.55);
    const highlightYTop = lerp(SPINE_TOP_Y, outerTopY, 0.55) - arch * 38;
    const highlightXBot = lerp(SPINE_X, outerBotX, 0.55);
    const highlightYBot = lerp(SPINE_BOT_Y, outerBotY, 0.55) - arch * 30;
    const highlightPath = ['M', highlightXTop, highlightYTop, 'L', highlightXBot, highlightYBot].join(' ');

    const edgeFade = Math.min(1, Math.min(t * 12, (1 - t) * 12));

    flipPage.setAttribute('d', pagePath);
    flipPage.setAttribute('opacity', edgeFade.toFixed(3));
    flipPage.setAttribute('fill', t < 0.5 ? 'url(#flip-page-grad)' : 'url(#flip-back-grad)');

    flipShadow.setAttribute('d', shadowPath);
    flipShadow.setAttribute('opacity', (arch * 0.38 * edgeFade).toFixed(3));

    flipHighlight.setAttribute('d', highlightPath);
    flipHighlight.setAttribute('opacity', (arch * 0.45 * edgeFade).toFixed(3));
  };

  const flipToAlbumPage = (targetPage: number) => {
    if (targetPage === albumPage || isFlippingPage) return;
    if (flipAnimRef.current) cancelAnimationFrame(flipAnimRef.current);

    const isForward = targetPage > albumPage;
    const fromT = isForward ? 0.02 : 0.98;
    const toT = isForward ? 0.999 : 0.001;
    const duration = 640;
    const startTime = performance.now();
    let pageSwitched = false;

    setIsFlippingPage(true);
    soundManager.playClick();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const raw = Math.min(1, elapsed / duration);
      const eased =
        raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;
      const currentT = fromT + (toT - fromT) * eased;
      renderFlipAt(currentT);

      if (!pageSwitched && raw >= 0.48) {
        pageSwitched = true;
        setAlbumPage(targetPage);
      }

      if (raw < 1) {
        flipAnimRef.current = requestAnimationFrame(step);
      } else {
        renderFlipAt(0);
        setIsFlippingPage(false);
        flipAnimRef.current = null;
      }
    };

    flipAnimRef.current = requestAnimationFrame(step);
  };

  // Question 1 state (ABCD - B)
  const [q1Options, setQ1Options] = useState<ShuffledOption[]>(() => shuffleOptionsWithLetters(R4_Q1_RAW));
  const [q1Selected, setQ1Selected] = useState<string | null>(null);
  const [q1Feedback, setQ1Feedback] = useState<string | null>(null);

  // Question 2 state (ABCD - C)
  const [q2Options, setQ2Options] = useState<ShuffledOption[]>(() => shuffleOptionsWithLetters(R4_Q2_RAW));
  const [q2Selected, setQ2Selected] = useState<string | null>(null);
  const [q2Feedback, setQ2Feedback] = useState<string | null>(null);

  // Question 3 state (True / False for 4 statements: T, F, T, T)
  const [q3Answers, setQ3Answers] = useState<Record<number, boolean | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
  });
  const [q3Feedback, setQ3Feedback] = useState<string | null>(null);

  // Question 4 state (Multiple choice A, C, D)
  const [q4Options, setQ4Options] = useState<ShuffledOption[]>(() => shuffleOptionsWithLetters(R4_Q4_RAW));
  const [q4Selected, setQ4Selected] = useState<string[]>([]);
  const [q4Feedback, setQ4Feedback] = useState<string | null>(null);

  // Question 5 state (Input numbers Day 20, Month 11)
  const [q5Day, setQ5Day] = useState<string>('');
  const [q5Month, setQ5Month] = useState<string>('');
  const [q5Feedback, setQ5Feedback] = useState<string | null>(null);

  // Task 2 (5 Relics) State
  const [relicSelected, setRelicSelected] = useState<number>(1);
  const [activeRelicQuestionModal, setActiveRelicQuestionModal] = useState<number | null>(null);
  const [solvedRelics, setSolvedRelics] = useState<number[]>([]); // 1, 2, 3, 4, 5
  const [relicResults, setRelicResults] = useState<Record<number, boolean>>(
    task2Done ? { 1: true, 2: true, 3: true, 4: true, 5: true } : ({} as Record<number, boolean>)
  );
  const [task2Passed, setTask2Passed] = useState<boolean>(task2Done);

  // Relic 1: Quyển vở cũ (Điền từ: "Không [thầy] đố mày làm nên")
  const [r1Input, setR1Input] = useState<string>('');
  const [r1Feedback, setR1Feedback] = useState<string | null>(null);

  // Relic 2: Cây bút máy (Huy không xem đáp án -> B)
  const [r2Options, setR2Options] = useState<ShuffledOption[]>(() => shuffleOptionsWithLetters(R4_R2_RAW));
  const [r2Selected, setR2Selected] = useState<string | null>(null);
  const [r2Feedback, setR2Feedback] = useState<string | null>(null);

  // Relic 3: Ngôi sao khen thưởng (Sắp xếp 3 bước: 2 -> 3 -> 1)
  const [r3Order, setR3Order] = useState<number[]>([1, 2, 3]);
  const [r3Feedback, setR3Feedback] = useState<string | null>(null);

  // Relic 4: Bông hoa giấy (Đúng / Sai 4 nhận định: T - F - T - F)
  const [r4Answers, setR4Answers] = useState<Record<number, boolean | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
  });
  const [r4Feedback, setR4Feedback] = useState<string | null>(null);

  // Relic 5: Chiếc hộp thư nhỏ (Chọn A, B, D)
  const [r5Options, setR5Options] = useState<ShuffledOption[]>(() => shuffleOptionsWithLetters(R4_R5_RAW));
  const [r5Selected, setR5Selected] = useState<string[]>([]);
  const [r5Feedback, setR5Feedback] = useState<string | null>(null);

  // Time Capsule Box Code Lock state (Mã: 20111982 / 20.11.1982)
  const [timeCode, setTimeCode] = useState<string>('');
  const [timeCodeFeedback, setTimeCodeFeedback] = useState<string | null>(null);
  const [isBoxUnlocking, setIsBoxUnlocking] = useState<boolean>(false);

  // Secret Key Reward Sequence
  const [rewardPhase, setRewardPhase] = useState<'floating_key' | 'clue_scroll' | 'collecting'>('floating_key');

  // Sync completion states
  useEffect(() => {
    if (task1Done) {
      setTask1Passed(true);
      setRestoredPhotos([0, 1, 2, 3, 4]);
      setAlbumResults({ 0: true, 1: true, 2: true, 3: true, 4: true });
    }
  }, [task1Done]);

  useEffect(() => {
    if (task2Done) {
      setTask2Passed(true);
      setSolvedRelics([1, 2, 3, 4, 5]);
      setRelicResults({ 1: true, 2: true, 3: true, 4: true, 5: true });
    }
  }, [task2Done]);

  // Record Album Page Answer & Evaluate 70% Threshold (4/5 correct)
  const recordAlbumAnswer = (pageIdx: number, isCorrect: boolean) => {
    const nextResults = { ...albumResults, [pageIdx]: isCorrect };
    setAlbumResults(nextResults);

    if (isCorrect && !restoredPhotos.includes(pageIdx)) {
      setRestoredPhotos((prev) => [...prev, pageIdx]);
    }

    if (Object.keys(nextResults).length === 5) {
      const correctCount = Object.values(nextResults).filter(Boolean).length;
      window.parent.postMessage(
        {
          answerTrue: correctCount, // Cái này là câu trả lời đúng
          totalQuestion: 5, // Cái này là số câu hỏi
          command: 'submit_result', //Không được đổi
        },
        '*'
      );
      soundManager.playVictory();
      setRestoredPhotos([0, 1, 2, 3, 4]);
      setTask1Passed(true);
    }
  };

  // Record Relic Answer & Complete Task 2
  const recordRelicAnswer = (relicId: number, isCorrect: boolean) => {
    const nextResults = { ...relicResults, [relicId]: isCorrect };
    setRelicResults(nextResults);

    if (isCorrect && !solvedRelics.includes(relicId)) {
      setSolvedRelics((prev) => [...prev, relicId]);
    }

    if (Object.keys(nextResults).length === 5) {
      const correctCount = Object.values(nextResults).filter(Boolean).length;
      window.parent.postMessage(
        {
          answerTrue: correctCount, // Cái này là câu trả lời đúng
          totalQuestion: 5, // Cái này là số câu hỏi
          command: 'submit_result', //Không được đổi
        },
        '*'
      );
      soundManager.playVictory();
      setSolvedRelics([1, 2, 3, 4, 5]);
      setTask2Passed(true);
    }
  };

  const handleRetryTask1 = () => {
    soundManager.playClick();
    setAlbumResults({});
    setRestoredPhotos([]);
    setAlbumPage(0);
    setQ1Options(shuffleOptionsWithLetters(R4_Q1_RAW));
    setQ1Selected(null);
    setQ1Feedback(null);
    setQ2Options(shuffleOptionsWithLetters(R4_Q2_RAW));
    setQ2Selected(null);
    setQ2Feedback(null);
    setQ3Answers({ 1: null, 2: null, 3: null, 4: null });
    setQ3Feedback(null);
    setQ4Options(shuffleOptionsWithLetters(R4_Q4_RAW));
    setQ4Selected([]);
    setQ4Feedback(null);
    setQ5Day('');
    setQ5Month('');
    setQ5Feedback(null);
    setTask1Passed(false);
  };

  const handleRetryTask2 = () => {
    soundManager.playClick();
    setRelicResults({});
    setSolvedRelics([]);
    setR1Input('');
    setR1Feedback(null);
    setR2Options(shuffleOptionsWithLetters(R4_R2_RAW));
    setR2Selected(null);
    setR2Feedback(null);
    setR3Order([1, 2, 3]);
    setR3Feedback(null);
    setR4Answers({ 1: null, 2: null, 3: null, 4: null });
    setR4Feedback(null);
    setR5Options(shuffleOptionsWithLetters(R4_R5_RAW));
    setR5Selected([]);
    setR5Feedback(null);
    setTask2Passed(false);
    setActiveRelicQuestionModal(null);
  };

  // Handle Quick Tests
  const handleQuickTestTask1 = () => {
    soundManager.playVictory();
    setRestoredPhotos([0, 1, 2, 3, 4]);
    setAlbumResults({ 0: true, 1: true, 2: true, 3: true, 4: true });
    setQ1Selected('B');
    setQ2Selected('C');
    setQ3Answers({ 1: true, 2: false, 3: true, 4: true });
    setQ4Selected(['A', 'C', 'D']);
    setQ5Day('20');
    setQ5Month('11');
    setTask1Passed(true);
  };

  const handleQuickTestTask2 = () => {
    soundManager.playVictory();
    setSolvedRelics([1, 2, 3, 4, 5]);
    setRelicResults({ 1: true, 2: true, 3: true, 4: true, 5: true });
    setR1Input('thầy');
    setR2Selected('B');
    setR3Order([2, 3, 1]);
    setR4Answers({ 1: true, 2: false, 3: true, 4: false });
    setR5Selected(['A', 'B', 'D']);
    setTask2Passed(true);
  };

  // Close Task 1 Modal: If passed, show Calendar 20/11 reward modal first!
  const handleCloseTask1Modal = () => {
    soundManager.playClick();
    if (task1Passed && !task1Done) {
      setActiveModal('calendar_reward');
    } else {
      if (Object.keys(albumResults).length === 5 && !task1Passed && !task1Done) {
        handleRetryTask1();
      }
      setActiveModal(null);
    }
  };

  // Collect Calendar 20/11 Reward -> advance to Lumi speech 3
  const handleCollectCalendarReward = () => {
    soundManager.playSparkle();
    onCompleteTask1(100);
    setActiveModal(null);
    setDialoguePhase('lumi_after_task1');
  };

  // Close Task 2 Modal: If passed (>= 70%), trigger Lumi speech 4 (lead to Secret Letter)
  const handleCloseTask2Modal = () => {
    soundManager.playClick();
    setActiveRelicQuestionModal(null);
    setActiveModal(null);
    if (task2Passed || solvedRelics.length === 5) {
      setDialoguePhase('lumi_before_letter');
    } else if (Object.keys(relicResults).length === 5 && !task2Passed && !task2Done) {
      handleRetryTask2();
    }
  };

  // Close Secret Letter Modal -> trigger Lumi speech 5 (lead to Time Box)
  const handleCloseSecretLetterModal = () => {
    soundManager.playClick();
    setActiveModal(null);
    setDialoguePhase('lumi_before_box');
  };

  // Question 1 Verify (B)
  const handleVerifyQ1 = () => {
    const correctLetter = q1Options.find((o) => o.id === 'B')?.displayLetter || 'B';
    if (q1Selected === 'B') {
      soundManager.playCorrect();
      soundManager.playSparkle();
      setQ1Feedback('Chính xác! Lễ phép cảm ơn cô và làm theo hướng dẫn thể hiện sự tôn trọng và tự tin.');
      recordAlbumAnswer(0, true);
    } else {
      soundManager.playWrong();
      setQ1Feedback(`Chưa đúng rồi! Đáp án đúng là ${correctLetter}: Lễ phép cảm ơn cô và làm theo hướng dẫn.`);
      recordAlbumAnswer(0, false);
    }
  };

  // Question 2 Verify (C)
  const handleVerifyQ2 = () => {
    const correctLetter = q2Options.find((o) => o.id === 'C')?.displayLetter || 'C';
    if (q2Selected === 'C') {
      soundManager.playCorrect();
      soundManager.playSparkle();
      setQ2Feedback('Chính xác! Mạnh dạn trao đổi với cô giáo thể hiện tinh thần ham học hỏi và giúp em hiểu sâu kiến thức.');
      recordAlbumAnswer(1, true);
    } else {
      soundManager.playWrong();
      setQ2Feedback(`Chưa đúng rồi! Đáp án đúng là ${correctLetter}: Mạnh dạn trao đổi với cô để được giải thích thêm.`);
      recordAlbumAnswer(1, false);
    }
  };

  // Question 3 Verify (1: T, 2: F, 3: T, 4: T)
  const handleVerifyQ3 = () => {
    const isCorrect =
      q3Answers[1] === true &&
      q3Answers[2] === false &&
      q3Answers[3] === true &&
      q3Answers[4] === true;

    if (isCorrect) {
      soundManager.playCorrect();
      soundManager.playSparkle();
      setQ3Feedback('Chính xác tuyệt đối! (Đúng – Sai – Đúng – Đúng). Tiếp thu ý kiến và rèn luyện giúp ta ngày càng tiến bộ.');
      recordAlbumAnswer(2, true);
    } else {
      soundManager.playWrong();
      setQ3Feedback('Chưa hoàn toàn chính xác! Đáp án đúng là: Đúng – Sai – Đúng – Đúng.');
      recordAlbumAnswer(2, false);
    }
  };

  // Question 4 Verify (A, C, D)
  const handleToggleQ4Option = (optId: string) => {
    setQ4Selected((prev) =>
      prev.includes(optId) ? prev.filter((id) => id !== optId) : [...prev, optId]
    );
  };

  const handleVerifyQ4 = () => {
    const correct = ['A', 'C', 'D'];
    const correctLetters = q4Options
      .filter((o) => correct.includes(o.id))
      .map((o) => o.displayLetter)
      .join(', ');
    const isMatch =
      q4Selected.length === 3 &&
      correct.every((opt) => q4Selected.includes(opt));

    if (isMatch) {
      soundManager.playCorrect();
      soundManager.playSparkle();
      setQ4Feedback(`Xuất sắc! Các ý tưởng ${correctLetters} rất ý nghĩa và chân thành. Lòng biết ơn không bắt nguồn từ ép buộc tiền bạc.`);
      recordAlbumAnswer(3, true);
    } else {
      soundManager.playWrong();
      setQ4Feedback(`Chưa đúng rồi! Đáp án đúng là các ý tưởng ${correctLetters}.`);
      recordAlbumAnswer(3, false);
    }
  };

  // Question 5 Verify (20 / 11)
  const handleVerifyQ5 = () => {
    const d = q5Day.trim();
    const m = q5Month.trim();
    if (d === '20' && m === '11') {
      soundManager.playCorrect();
      soundManager.playSparkle();
      setQ5Feedback('Chính xác! Ngày 20 tháng 11 là Ngày Nhà giáo Việt Nam!');
      recordAlbumAnswer(4, true);
    } else {
      soundManager.playWrong();
      setQ5Feedback('Chưa đúng ngày rồi! Ngày Nhà giáo Việt Nam là ngày 20 tháng 11.');
      recordAlbumAnswer(4, false);
    }
  };

  // Relic 1: Quyển vở cũ (thầy)
  const handleVerifyRelic1 = () => {
    const clean = r1Input.trim().toLowerCase();
    if (clean === 'thầy' || clean === 'thay') {
      soundManager.playCorrect();
      soundManager.playSparkle();
      setR1Feedback('Chính xác! “Không thầy đố mày làm nên”. Quyển vở phát sáng và để lộ chữ số 1!');
      recordRelicAnswer(1, true);
    } else {
      soundManager.playWrong();
      setR1Feedback('Chưa đúng rồi! Từ cần điền là “thầy” (“Không thầy đố mày làm nên”).');
      recordRelicAnswer(1, false);
    }
  };

  // Relic 2: Cây bút máy (B)
  const handleVerifyRelic2 = () => {
    const correctLetter = r2Options.find((o) => o.id === 'B')?.displayLetter || 'B';
    if (r2Selected === 'B') {
      soundManager.playCorrect();
      soundManager.playSparkle();
      setR2Feedback('Chính xác! Trung thực trong học tập là đức tính quý giá. Cây bút máy xoay nhẹ để lộ chữ số 9!');
      recordRelicAnswer(2, true);
    } else {
      soundManager.playWrong();
      setR2Feedback(`Chưa đúng! Đáp án đúng là ${correctLetter}: Không xem đáp án, tiếp tục làm bài bằng khả năng của mình.`);
      recordRelicAnswer(2, false);
    }
  };

  // Relic 3: Sắp xếp 3 bước tiến bộ: 2 -> 3 -> 1
  const handleMoveR3 = (fromIndex: number, toIndex: number) => {
    const newOrder = [...r3Order];
    const item = newOrder.splice(fromIndex, 1)[0];
    newOrder.splice(toIndex, 0, item);
    setR3Order(newOrder);
    soundManager.playClick();
  };

  const handleVerifyRelic3 = () => {
    if (r3Order[0] === 2 && r3Order[1] === 3 && r3Order[2] === 1) {
      soundManager.playCorrect();
      soundManager.playSparkle();
      setR3Feedback('Chính xác! Trình tự chuẩn: Lắng nghe góp ý → Sửa lỗi sai → Luyện tập. Ngôi sao khen thưởng phát sáng, để lộ chữ số 8!');
      recordRelicAnswer(3, true);
    } else {
      soundManager.playWrong();
      setR3Feedback('Chưa đúng trình tự! Trình tự đúng là: Lắng nghe góp ý → Sửa lỗi đã mắc → Luyện tập.');
      recordRelicAnswer(3, false);
    }
  };

  // Relic 4: Bông hoa giấy (1: T, 2: F, 3: T, 4: F)
  const handleVerifyRelic4 = () => {
    const isCorrect =
      r4Answers[1] === true &&
      r4Answers[2] === false &&
      r4Answers[3] === true &&
      r4Answers[4] === false;

    if (isCorrect) {
      soundManager.playCorrect();
      soundManager.playSparkle();
      setR4Feedback('Chính xác! (Đúng – Sai – Đúng – Sai). Bông hoa giấy phát sáng và xuất hiện chữ số 2!');
      recordRelicAnswer(4, true);
    } else {
      soundManager.playWrong();
      setR4Feedback('Chưa chính xác! Đáp án đúng là: Đúng – Sai – Đúng – Sai.');
      recordRelicAnswer(4, false);
    }
  };

  // Relic 5: Chiếc hộp thư nhỏ (A, B, D)
  const handleToggleR5 = (opt: string) => {
    setR5Selected((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  };

  const handleVerifyRelic5 = () => {
    const correct = ['A', 'B', 'D'];
    const correctLetters = r5Options
      .filter((o) => correct.includes(o.id))
      .map((o) => o.displayLetter)
      .join(', ');
    const isMatch =
      r5Selected.length === 3 &&
      correct.every((opt) => r5Selected.includes(opt));

    if (isMatch) {
      soundManager.playVictory();
      setR5Feedback(`Xuất sắc! Cả 3 hành động ${correctLetters} đều thể hiện lòng tri ân sâu sắc. Chiếc hộp thư nhỏ bật mở, xuất hiện Bức Thư Mật!`);
      recordRelicAnswer(5, true);
    } else {
      soundManager.playWrong();
      setR5Feedback(`Chưa đủ hoặc có lựa chọn chưa phù hợp! Đáp án đúng là ${correctLetters}.`);
      recordRelicAnswer(5, false);
    }
  };

  // Handle Unlock Time Capsule Box: Code 20111982 or 20.11.1982
  const handleUnlockBox = () => {
    const cleaned = timeCode.replace(/[\.\-\/\s]/g, '').trim();
    if (cleaned === '20111982') {
      soundManager.playBoxOpen();
      setIsBoxUnlocking(true);
      setTimeCodeFeedback('MẬT MÃ HOÀN TOÀN CHÍNH XÁC! CHIẾC HỘP THỜI GIAN ĐANG MỞ...');
      setTimeout(() => {
        setIsBoxUnlocking(false);
        setIsTimeBoxUnlocked(true);
        onCompleteTask2(100);
        setRewardPhase('floating_key');
        setActiveModal('secret_key_reward');
      }, 1200);
    } else {
      soundManager.playWrong();
      setTimeCodeFeedback('Mật mã chưa đúng! Gợi ý: Ghép ngày-tháng trong Album (20/11) với 4 con số năm lịch sử từ các kỷ vật.');
    }
  };

  const handleInspectFloatingKey = () => {
    soundManager.playSparkle();
    setRewardPhase('clue_scroll');
  };

  const handleCollectSecretKey = () => {
    soundManager.playSparkle();
    setRewardPhase('collecting');
    setTimeout(() => {
      soundManager.playSparkle();
      setActiveModal(null);
      setShowCelebration(true);
      setDialoguePhase('explore');
    }, 1600);
  };

  // Photo details for Task 1
  const albumPhotos = [
    {
      title: 'Bức ảnh 1: Ngày đầu đến lớp',
      situation:
        'Trong ngày đầu tiên đến trường, Lan cảm thấy lo lắng vì chưa quen bạn bè và thầy cô. Cô giáo đến hỏi han, động viên và hướng dẫn Lan vào lớp.',
      question: 'Câu 1: Theo em, Lan nên làm gì?',
      icon: '🏫',
      imageUrl:
        'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/NHI%E1%BB%86M%20V%E1%BB%A4%201/C%C3%B4%20gi%C3%A1o%20%C4%91%C3%B3n%20em%20v%C3%A0o%20l%E1%BB%9Bp-1.png',
    },
    {
      title: 'Bức ảnh 2: Bài học khó',
      situation:
        'Trong giờ học, Minh không hiểu một phần bài giảng. Cô giáo hỏi cả lớp có ai cần giải thích thêm không, nhưng Minh ngại giơ tay vì sợ các bạn chê mình học chậm.',
      question: 'Câu 2: Nếu là Minh, em sẽ chọn cách nào?',
      icon: '💡',
      imageUrl:
        'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/NHI%E1%BB%86M%20V%E1%BB%A4%201/C%C3%B4%20gi%C3%A1o%20t%E1%BA%ADn%20t%C3%A2m%20b%C3%AAn%20h%E1%BB%8Dc%20tr%C3%B2-2.png',
    },
    {
      title: 'Bức ảnh 3: Lời góp ý của thầy cô',
      situation:
        'Trong một bài kiểm tra, Nam mắc nhiều lỗi. Thầy giáo nhận xét cụ thể từng lỗi và hướng dẫn Nam cách khắc phục. Nam cảm thấy buồn vì kết quả chưa tốt.',
      question: 'Câu 3: Hãy xác định mỗi nhận định sau là Đúng hay Sai:',
      icon: '📝',
      imageUrl:
        'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/NHI%E1%BB%86M%20V%E1%BB%A4%201/Th%E1%BA%A7y%20c%C3%B4%20kh%C3%ADch%20l%E1%BB%87%20h%E1%BB%8Dc%20tr%C3%B2%20trong%20l%E1%BB%9Bp%20h%E1%BB%8Dc-3.png',
    },
    {
      title: 'Bức ảnh 4: Một lời cảm ơn ý nghĩa',
      situation:
        'Nhân dịp 20/11, lớp 9A muốn tổ chức một hoạt động tri ân giáo viên chủ nhiệm. Các bạn đưa ra nhiều ý tưởng khác nhau.',
      question:
        'Câu 4: Những ý tưởng nào sau đây phù hợp để thể hiện lòng biết ơn và kính trọng thầy cô? (Chọn tất cả đáp án đúng)',
      icon: '💐',
      imageUrl:
        'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/NHI%E1%BB%86M%20V%E1%BB%A4%201/Tri%20%C3%A2n%20c%C3%B4%20gi%C3%A1o%20trong%20l%E1%BB%9Bp%20h%E1%BB%8Dc%20t%C6%B0%C6%A1i%20vui-4.png',
    },
    {
      title: 'Bức ảnh 5: Ngày đặc biệt trong cuốn album',
      situation:
        'Trong cuốn album có một bức ảnh ghi lại khoảnh khắc học sinh gửi lời tri ân đến thầy cô. Bên cạnh bức ảnh là một tờ lịch cũ, nhưng phần ngày và tháng đã bị mờ, khiến ký ức về ngày đặc biệt ấy chưa thể khôi phục.',
      question: 'Câu 5: Ngày Nhà giáo Việt Nam được tổ chức vào ngày, tháng nào hằng năm?',
      icon: '📅',
      imageUrl:
        'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/NHI%E1%BB%86M%20V%E1%BB%A4%201/C%C3%B4%20gi%C3%A1o%20v%C3%A0%20h%E1%BB%8Dc%20tr%C3%B2%20m%E1%BB%ABng%20ng%C3%A0y%20%C4%91%E1%BA%B7c%20bi%E1%BB%87t-5.png',
    },
  ];

  // Preload all Room 4 images on mount for instant rendering
  useEffect(() => {
    const urls = [
      ROOM4_BG,
      HOTSPOT_ALBUM_IMG,
      HOTSPOT_RELICS_IMG,
      HOTSPOT_BOX_IMG,
      TABLE_BG_IMG,
      RELIC_NOTEBOOK_IMG,
      RELIC_PEN_IMG,
      RELIC_STAR_IMG,
      RELIC_FLOWER_IMG,
      RELIC_MAILBOX_IMG,
      ...albumPhotos.map((p) => p.imageUrl),
    ];
    urls.forEach((u) => {
      const img = new Image();
      img.src = u;
    });
  }, []);

  const isCurrentAlbumPageSolved = restoredPhotos.includes(albumPage);
  const isCurrentAlbumPageAnswered = albumResults[albumPage] !== undefined;
  const all5AlbumAnswered = Object.keys(albumResults).length === 5;
  const correctAlbumCount = Object.values(albumResults).filter(Boolean).length;
  const isTask1Failed = false;

  const isCurrentRelicSolved = solvedRelics.includes(relicSelected);
  const isCurrentRelicAnswered = relicResults[relicSelected] !== undefined;
  const all5RelicsAnswered = Object.keys(relicResults).length === 5;
  const correctRelicCount = Object.values(relicResults).filter(Boolean).length;
  const renderAlbumLeftContent = () => (
    <div className="w-full h-full flex flex-col justify-between p-2 text-[#2b1704] select-none">
      {/* Tiêu đề bức ảnh canh giữa và ngắt dòng tên bức ảnh xuống */}
      <div className="flex flex-col items-center justify-center text-center border-b border-[#8c622b]/45 pb-1.5 shrink-0">
        <span className="text-[13px] font-bold text-[#5c3a18] leading-tight">
          Bức ảnh {albumPage + 1}:
        </span>
        <span className="text-[15px] font-black uppercase text-[#3d1e05] tracking-wide leading-tight mt-0.5">
          {albumPhotos[albumPage].title.split(':')[1]?.trim() || albumPhotos[albumPage].title}
        </span>
      </div>

      {/* Khung Bức Ảnh Ký Ức */}
      <div
        className={`relative w-full h-[228px] my-2 rounded-xl border-2 overflow-hidden flex flex-col items-center justify-center text-center transition-all duration-500 shadow-inner shrink-0 ${
          isCurrentAlbumPageSolved
            ? 'border-emerald-600 bg-[#fffaf0] shadow-[0_0_20px_rgba(16,185,129,0.35)]'
            : 'border-dashed border-[#8c622b]/65 bg-[#e9d5b0]/65 p-3'
        }`}
      >
        {isCurrentAlbumPageSolved ? (
          <div className="relative w-full h-full flex items-center justify-center animate-pop bg-[#1a0f05]">
            <img
              src={albumPhotos[albumPage].imageUrl}
              alt={albumPhotos[albumPage].title}
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-1.5 right-2 px-2.5 py-0.5 rounded-full bg-emerald-700/95 border border-emerald-300 text-white text-[11px] font-black uppercase shadow-md flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
              <span>Đã khôi phục</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-[#5c3a18] space-y-1.5">
            <div className="w-12 h-12 rounded-full bg-[#d6b986] border border-[#8c622b]/50 flex items-center justify-center text-2xl animate-pulse">
              🖼️
            </div>
            <p className="text-[15px] font-black text-[#3d1e05]">
              Khung ảnh đang trống...
            </p>
            <p className="text-[13px] text-[#5c3a18] font-semibold">
              Trả lời đúng câu hỏi ở trang bên phải để khôi phục bức ảnh
            </p>
          </div>
        )}
      </div>

      {/* Tình huống học đường (Khung đề của bức hình) */}
      <div className="flex-1 min-h-0 bg-[#efe0c2]/95 p-3 rounded-xl border border-[#8c622b]/45 text-[14px] leading-snug text-[#2b1704] shadow-xs flex flex-col justify-center">
        <span className="font-black text-[#6e4414] block mb-1 uppercase tracking-wide text-[13px]">
          Tình huống học đường:
        </span>
        <p className="font-semibold leading-relaxed">
          {albumPhotos[albumPage].situation}
        </p>
      </div>
    </div>
  );

  const renderAlbumRightContent = () => (
    <div className="w-full h-full flex flex-col justify-between p-2 text-[#2b1704] select-none">
      <div className="flex-1 min-h-0 flex flex-col justify-start space-y-2 overflow-y-auto pr-0.5 custom-scrollbar">
        {/* Câu hỏi */}
        <div className="bg-[#efe0c2]/95 border border-[#8c622b]/50 rounded-xl p-3 shadow-xs shrink-0">
          <h4 className="text-[15px] font-black text-[#3d1e05] leading-snug">
            {albumPhotos[albumPage].question}
          </h4>
        </div>

        {/* CÂU 1 */}
        {albumPage === 0 && (
          <div className="space-y-2">
            {q1Options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  soundManager.playClick();
                  setQ1Selected(opt.id);
                  setQ1Feedback(null);
                }}
                className={`w-full p-2.5 rounded-xl border text-left text-[13.5px] font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                  q1Selected === opt.id
                    ? 'bg-[#002447] border-[#001833] text-[#ADEFD1] shadow-md'
                    : 'bg-[#fff9eb]/95 hover:bg-[#f3e2be] border-[#8c622b]/45 text-[#2b1704]'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full font-black text-[12px] flex items-center justify-center shrink-0 ${
                    q1Selected === opt.id
                      ? 'bg-[#ADEFD1] text-[#00203F]'
                      : 'bg-[#5c3a18] text-[#f7ead0]'
                  }`}
                >
                  {opt.displayLetter}
                </span>
                <span className="leading-snug">{opt.text}</span>
              </button>
            ))}
            {q1Feedback && (
              <div
                className={`p-2 rounded-xl border text-[13px] font-bold ${
                  isCurrentAlbumPageSolved
                    ? 'bg-emerald-900 border-emerald-400 text-emerald-100'
                    : 'bg-rose-900 border-rose-400 text-rose-100'
                }`}
              >
                {q1Feedback}
              </div>
            )}
          </div>
        )}

        {/* CÂU 2 */}
        {albumPage === 1 && (
          <div className="space-y-2">
            {q2Options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  soundManager.playClick();
                  setQ2Selected(opt.id);
                  setQ2Feedback(null);
                }}
                className={`w-full p-2.5 rounded-xl border text-left text-[13.5px] font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                  q2Selected === opt.id
                    ? 'bg-[#002447] border-[#001833] text-[#ADEFD1] shadow-md'
                    : 'bg-[#fff9eb]/95 hover:bg-[#f3e2be] border-[#8c622b]/45 text-[#2b1704]'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full font-black text-[12px] flex items-center justify-center shrink-0 ${
                    q2Selected === opt.id
                      ? 'bg-[#ADEFD1] text-[#00203F]'
                      : 'bg-[#5c3a18] text-[#f7ead0]'
                  }`}
                >
                  {opt.displayLetter}
                </span>
                <span className="leading-snug">{opt.text}</span>
              </button>
            ))}
            {q2Feedback && (
              <div
                className={`p-2 rounded-xl border text-[13px] font-bold ${
                  isCurrentAlbumPageSolved
                    ? 'bg-emerald-900 border-emerald-400 text-emerald-100'
                    : 'bg-rose-900 border-rose-400 text-rose-100'
                }`}
              >
                {q2Feedback}
              </div>
            )}
          </div>
        )}

        {/* CÂU 3 */}
        {albumPage === 2 && (
          <div className="space-y-1.5">
            {[
              { id: 1, text: '1. Nam nên đọc kỹ những lời nhận xét của thầy để hiểu lỗi sai.' },
              { id: 2, text: '2. Nam chỉ cần sửa những lỗi nhỏ, không cần quan tâm lỗi nghiêm trọng.' },
              { id: 3, text: '3. Nam có thể trao đổi với thầy nếu chưa hiểu lời nhận xét.' },
              { id: 4, text: '4. Nam nên cố gắng luyện tập để tránh lặp lại lỗi sai.' },
            ].map((item) => (
              <div
                key={item.id}
                className="p-2 bg-[#fff9eb]/95 rounded-xl border border-[#8c622b]/45 flex items-center justify-between gap-2 text-[13px] font-bold text-[#2b1704]"
              >
                <span className="flex-1 leading-snug">{item.text}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setQ3Answers((prev) => ({ ...prev, [item.id]: true }));
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[12px] font-black cursor-pointer transition-all border ${
                      q3Answers[item.id] === true
                        ? 'bg-emerald-700 border-emerald-400 text-white shadow-xs'
                        : 'bg-[#e6d2aa] border-[#8c622b]/50 text-[#3d1e05]'
                    }`}
                  >
                    Đúng
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setQ3Answers((prev) => ({ ...prev, [item.id]: false }));
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[12px] font-black cursor-pointer transition-all border ${
                      q3Answers[item.id] === false
                        ? 'bg-rose-700 border-rose-400 text-white shadow-xs'
                        : 'bg-[#e6d2aa] border-[#8c622b]/50 text-[#3d1e05]'
                    }`}
                  >
                    Sai
                  </button>
                </div>
              </div>
            ))}
            {q3Feedback && (
              <div
                className={`p-2 rounded-xl border text-[12.5px] font-bold ${
                  isCurrentAlbumPageSolved
                    ? 'bg-emerald-900 border-emerald-400 text-emerald-100'
                    : 'bg-rose-900 border-rose-400 text-rose-100'
                }`}
              >
                {q3Feedback}
              </div>
            )}
          </div>
        )}

        {/* CÂU 4 */}
        {albumPage === 3 && (
          <div className="space-y-1.5">
            {q4Options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  soundManager.playClick();
                  handleToggleQ4Option(opt.id);
                }}
                className={`w-full p-2 rounded-xl border text-left text-[13px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  q4Selected.includes(opt.id)
                    ? 'bg-[#002447] border-[#001833] text-[#ADEFD1] shadow-md'
                    : 'bg-[#fff9eb]/95 hover:bg-[#f3e2be] border-[#8c622b]/45 text-[#2b1704]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                    q4Selected.includes(opt.id)
                      ? 'bg-[#ADEFD1] text-[#00203F] border-[#ADEFD1]'
                      : 'border-[#8c622b] bg-[#e6d2aa]'
                  }`}
                >
                  {q4Selected.includes(opt.id) && <Check className="w-3.5 h-3.5" />}
                </span>
                <span className="leading-snug">{opt.displayLetter}. {opt.text}</span>
              </button>
            ))}
            {q4Feedback && (
              <div
                className={`p-2 rounded-xl border text-[12.5px] font-bold ${
                  isCurrentAlbumPageSolved
                    ? 'bg-emerald-900 border-emerald-400 text-emerald-100'
                    : 'bg-rose-900 border-rose-400 text-rose-100'
                }`}
              >
                {q4Feedback}
              </div>
            )}
          </div>
        )}

        {/* CÂU 5 */}
        {albumPage === 4 && (
          <div className="space-y-2">
            <div className="p-3 bg-[#fff9eb]/95 rounded-xl border border-[#8c622b]/50 text-center space-y-2.5">
              <p className="text-[14px] font-black text-[#3d1e05]">
                Nhập ngày và tháng tổ chức Ngày Nhà giáo Việt Nam:
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-black text-[#3d1e05]">Ngày:</span>
                  <input
                    type="text"
                    maxLength={2}
                    value={q5Day}
                    onChange={(e) => setQ5Day(e.target.value)}
                    placeholder="20"
                    className="w-16 p-2 bg-white border-2 border-[#5c3a18] rounded-lg text-center font-black text-base text-[#00203F] outline-none shadow-xs"
                  />
                </div>
                <span className="text-lg font-black text-[#5c3a18]">/</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-black text-[#3d1e05]">Tháng:</span>
                  <input
                    type="text"
                    maxLength={2}
                    value={q5Month}
                    onChange={(e) => setQ5Month(e.target.value)}
                    placeholder="11"
                    className="w-16 p-2 bg-white border-2 border-[#5c3a18] rounded-lg text-center font-black text-base text-[#00203F] outline-none shadow-xs"
                  />
                </div>
              </div>
            </div>
            {q5Feedback && (
              <div
                className={`p-2 rounded-xl border text-[13px] font-bold ${
                  isCurrentAlbumPageSolved
                    ? 'bg-emerald-900 border-emerald-400 text-emerald-100'
                    : 'bg-rose-900 border-rose-400 text-rose-100'
                }`}
              >
                {q5Feedback}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Bar nằm gọn bên trong đáy trang phải */}
      <div className="pt-2 mt-1.5 border-t border-[#8c622b]/40 flex flex-col gap-1.5 shrink-0">
        {isTask1Failed && (
          <div className="p-1.5 rounded-lg bg-rose-900 border border-rose-400 text-[12px] font-black text-rose-100 text-center">
            Bạn đạt {correctAlbumCount}/5 câu đúng (cần tối thiểu 70% - 4/5 câu đúng). Hãy nhấn Thử lại nhé!
          </div>
        )}
        <div className="flex items-center justify-end gap-2">
          {isTask1Failed ? (
            <button
              onClick={handleRetryTask1}
              className="px-5 py-2 rounded-full bg-rose-700 text-white border border-rose-300 font-black text-[12.5px] hover:bg-rose-600 transition-all shadow-md cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>THỬ LẠI</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : !isCurrentAlbumPageAnswered ? (
            <button
              onClick={() => {
                if (albumPage === 0) handleVerifyQ1();
                else if (albumPage === 1) handleVerifyQ2();
                else if (albumPage === 2) handleVerifyQ3();
                else if (albumPage === 3) handleVerifyQ4();
                else if (albumPage === 4) handleVerifyQ5();
              }}
              className="px-5 py-2 rounded-full bg-[#001833] text-[#ADEFD1] border border-[#ADEFD1] font-black text-[12.5px] hover:bg-[#002447] transition-all shadow-md cursor-pointer uppercase tracking-wider"
            >
              KIỂM TRA ĐÁP ÁN
            </button>
          ) : (
            <button
              onClick={() => {
                if (albumPage < 4) {
                  flipToAlbumPage(albumPage + 1);
                } else if (task1Passed) {
                  handleCloseTask1Modal();
                } else {
                  const nextUnanswered = [0, 1, 2, 3, 4].find(
                    (i) => albumResults[i] === undefined
                  );
                  if (nextUnanswered !== undefined) {
                    flipToAlbumPage(nextUnanswered);
                  }
                }
              }}
              className="px-6 py-2 rounded-full bg-emerald-700 text-white border border-emerald-300 font-black text-[12.5px] hover:bg-emerald-600 transition-all shadow-md cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>{albumPage === 4 && task1Passed ? 'HOÀN THÀNH' : 'TIẾP TỤC'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-full min-h-full select-none flex flex-col justify-between p-2 md:p-4 text-[#FFFFE3] overflow-hidden">
      {/* ROOM 4 BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src={ROOM4_BG}
          alt="Phòng Ký Ức - Hộp Thời Gian"
          className="w-full h-full object-cover object-center filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001020]/80 via-transparent to-[#001020]/30 pointer-events-none" />
      </div>

      {/* 1. LỜI DẪN VÀO PHÒNG (StoryPanel) */}
      {!(task1Done && task2Done) && dialoguePhase === 'narrator' && (
        <StoryPanel
          title="BỐI CẢNH PHÒNG KÝ ỨC"
          lines={NARRATOR_PARAGRAPHS}
          onComplete={() => setDialoguePhase('lumi')}
        />
      )}

      {/* 2. LỜI THOẠI NGƯỜI GÁC THƯ VIỆN – DẪN VÀO NHIỆM VỤ 1 */}
      {!(task1Done && task2Done) && dialoguePhase === 'lumi' && !activeModal && (
        <LumiSpeech
          key="lumi-room4-intro"
          lines={LUMI_DIALOGUE_PARAGRAPHS}
          onComplete={() => setDialoguePhase('explore')}
        />
      )}

      {/* 3. LỜI THOẠI LUMI – SAU KHI HOÀN THÀNH NHIỆM VỤ 1 */}
      {!(task1Done && task2Done) && dialoguePhase === 'lumi_after_task1' && !activeModal && (
        <LumiSpeech
          key="lumi-room4-after-task1"
          lines={LUMI_AFTER_TASK1_PARAGRAPHS}
          onComplete={() => setDialoguePhase('explore')}
        />
      )}

      {/* 4. LỜI THOẠI LUMI – DẪN ĐẾN GIẢI MÃ BỨC THƯ */}
      {dialoguePhase === 'lumi_before_letter' && !activeModal && (
        <LumiSpeech
          key="lumi-room4-before-letter"
          lines={LUMI_BEFORE_LETTER_PARAGRAPHS}
          onComplete={() => {
            setDialoguePhase('explore');
            setActiveModal('secret_letter');
          }}
        />
      )}

      {/* 5. LỜI THOẠI LUMI – DẪN ĐẾN CHIẾC HỘP THỜI GIAN */}
      {dialoguePhase === 'lumi_before_box' && !activeModal && (
        <LumiSpeech
          key="lumi-room4-before-box"
          lines={LUMI_BEFORE_BOX_PARAGRAPHS}
          onComplete={() => setDialoguePhase('explore')}
        />
      )}

      {/* ========================================================================= */}
      {/* 3 INTERACTIVE OBJECTS ON SCREEN - RESPONSIVE ACROSS PHONE, IPAD, LAPTOP, TV */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full flex-1 max-w-7xl mx-auto px-2 sm:px-4 flex items-end justify-between pb-[clamp(3.5rem,18vh,9.5rem)] pointer-events-none">
        {/* VẬT PHẨM 1: ALBUM ẢNH CHƯA HOÀN CHỈNH (Di chuyển xuống 0.8cm) */}
        <div
          style={{ transform: 'translateY(0.8cm)' }}
          className={`absolute left-[3%] sm:left-[7%] md:left-[10%] bottom-[16%] sm:bottom-[18%] w-[32%] sm:w-[30%] h-[42%] sm:h-[48%] pointer-events-auto flex flex-col items-center justify-end transition-all duration-300 ${
            !isRoomInteractive
              ? 'opacity-40 cursor-not-allowed filter grayscale pointer-events-none'
              : 'cursor-pointer group hover:scale-[1.03]'
          }`}
          onClick={() => {
            if (!isRoomInteractive) {
              soundManager.playWrong();
              return;
            }
            soundManager.playClick();
            setActiveModal('album_task1');
          }}
          title={
            !isRoomInteractive
              ? 'Hoàn thành lời dẫn và lời thoại của Lumi để mở khóa đồ vật'
              : 'Album Ảnh Chưa Hoàn Chỉnh'
          }
        >
          <div className="relative flex-1 min-h-0 w-full flex items-center justify-center">
            <img
              src={HOTSPOT_ALBUM_IMG}
              alt="Album Ảnh Chưa Hoàn Chỉnh"
              className={`h-full w-auto max-w-full object-contain filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.95)] transition-all duration-300 ${
                task1Done || task1Passed
                  ? 'brightness-110 drop-shadow-[0_0_20px_#28a745]'
                  : isRoomInteractive
                  ? 'group-hover:brightness-115 animate-pulse'
                  : ''
              }`}
            />
          </div>

          {task1Done || task1Passed ? (
            <div className="mt-1 sm:mt-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#001c38] border border-emerald-400 text-emerald-300 font-black text-[10px] sm:text-xs md:text-sm shadow-md flex items-center gap-1.5 animate-pop whitespace-nowrap shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span>ĐÃ HOÀN THÀNH</span>
            </div>
          ) : (
            <span className="mt-1 sm:mt-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#001833]/90 border border-[#ADEFD1]/50 text-[#ADEFD1] font-black text-[10px] sm:text-xs md:text-sm shadow-lg whitespace-nowrap shrink-0">
              Album Ảnh Chưa Hoàn Chỉnh
            </span>
          )}
        </div>

        {/* VẬT PHẨM 3 (ĐÍCH ĐẾN): CHIẾC HỘP THỜI GIAN */}
        <div
          className={`absolute right-[3%] sm:right-[5%] md:right-[7%] bottom-[16%] sm:bottom-[18%] w-[26%] sm:w-[24%] h-[38%] sm:h-[42%] pointer-events-auto flex flex-col items-center justify-end transition-all duration-300 ${
            !isRoomInteractive
              ? 'opacity-40 cursor-not-allowed filter grayscale pointer-events-none'
              : 'cursor-pointer group hover:scale-[1.03]'
          }`}
          onClick={() => {
            if (!isRoomInteractive) {
              soundManager.playWrong();
              return;
            }
            soundManager.playClick();
            setActiveModal('timebox_lock');
          }}
          title={
            !isRoomInteractive
              ? 'Hoàn thành lời dẫn và lời thoại của Lumi để mở khóa đồ vật'
              : 'Chiếc Hộp Thời Gian'
          }
        >
          <div className="relative flex-1 min-h-0 w-full flex items-center justify-center">
            <img
              src={HOTSPOT_BOX_IMG}
              alt="Chiếc Hộp Thời Gian"
              className={`h-full w-auto max-w-full object-contain filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.95)] transition-all duration-300 ${
                isTimeBoxUnlocked
                  ? 'brightness-115 drop-shadow-[0_0_20px_#28a745]'
                  : (task1Done || task1Passed) && (task2Done || task2Passed)
                  ? 'brightness-110 group-hover:brightness-120 animate-pulse'
                  : 'brightness-95 group-hover:brightness-110'
              }`}
            />
          </div>

          {isTimeBoxUnlocked ? (
            <div className="mt-1 sm:mt-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#001c38] border border-emerald-400 text-emerald-300 font-black text-[10px] sm:text-xs md:text-sm shadow-md flex items-center gap-1.5 animate-pop whitespace-nowrap shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span>ĐÃ HOÀN THÀNH</span>
            </div>
          ) : (
            <span className="mt-1 sm:mt-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#001833]/90 border border-[#ADEFD1]/50 text-[#ADEFD1] font-black text-[10px] sm:text-xs md:text-sm shadow-lg whitespace-nowrap shrink-0">
              Chiếc Hộp Thời Gian
            </span>
          )}
        </div>

        {/* VẬT PHẨM 2: NHỮNG KỶ VẬT HỌC ĐƯỜNG */}
        <div
          className={`absolute left-[31%] sm:left-[34%] bottom-[0%] w-[44%] sm:w-[48%] h-[36%] sm:h-[39%] pointer-events-auto flex flex-col items-center justify-end transition-all duration-300 ${
            !isRoomInteractive
              ? 'opacity-40 cursor-not-allowed filter grayscale pointer-events-none'
              : 'cursor-pointer group hover:scale-[1.03]'
          }`}
          onClick={() => {
            if (!isRoomInteractive) {
              soundManager.playWrong();
              return;
            }
            soundManager.playClick();
            if (!task1Done && !task1Passed) {
              soundManager.playWrong();
              setActiveModal('relics_locked_notice');
              return;
            }
            setActiveModal('relics_task2');
          }}
          title={
            !isRoomInteractive
              ? 'Hoàn thành lời dẫn và lời thoại của Lumi để mở khóa đồ vật'
              : !task1Done && !task1Passed
              ? 'Hoàn thành Album Ảnh Chưa Hoàn Chỉnh trước để mở khóa Những Kỷ Vật Học Đường'
              : 'Những Kỷ Vật Học Đường'
          }
        >
          {task2Done || task2Passed ? (
            <div className="mb-1 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#001c38] border border-emerald-400 text-emerald-300 font-black text-[10px] sm:text-xs md:text-sm shadow-md flex items-center gap-1.5 animate-pop whitespace-nowrap shrink-0 z-10">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span>ĐÃ HOÀN THÀNH</span>
            </div>
          ) : (
            <span className="mb-1 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#001833]/90 border border-[#ADEFD1]/50 text-[#ADEFD1] font-black text-[10px] sm:text-xs md:text-sm shadow-lg whitespace-nowrap shrink-0 z-10">
              Những Kỷ Vật Học Đường
            </span>
          )}

          <div className="relative flex-1 min-h-0 w-full flex items-center justify-center">
            <img
              src={HOTSPOT_RELICS_IMG}
              alt="Những Kỷ Vật Học Đường"
              className={`h-full w-auto max-w-full object-contain filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.95)] transition-all duration-300 ${
                task2Done || task2Passed
                  ? 'brightness-110 drop-shadow-[0_0_20px_#28a745]'
                  : task1Done || task1Passed
                  ? 'brightness-105 group-hover:brightness-120 animate-pulse'
                  : 'opacity-75 brightness-80'
              }`}
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROOM 4 COMPLETE CELEBRATION MODAL (ĐỒNG BỘ STYLE HÌNH 4 & PHÒNG 1, 2, 3) */}
      {/* ========================================================================= */}
      {(showCelebration || (task1Done && task2Done && isTimeBoxUnlocked && !activeModal)) && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-pop">
          <div className="bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative text-white">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#002447] border border-[#ADEFD1] flex items-center justify-center text-[#FFD700] shadow-md animate-bounce-slow">
              <Sparkles className="w-9 h-9 text-[#FFD700]" />
            </div>

            <h3 className="text-xl font-black text-white uppercase tracking-wider mb-1">
              CHÚC MỪNG! BẠN ĐÃ VƯỢT QUA PHÒNG KÝ ỨC!
            </h3>

            <div className="flex items-center justify-center gap-2.5 my-3">
              <span className="px-3 py-1 rounded-full bg-[#002447] border border-emerald-400 text-xs font-bold text-emerald-300 flex items-center gap-1">
                <span className="text-emerald-400 font-black">✓</span> 2/2 nhiệm vụ
              </span>
              <span className="px-3 py-1 rounded-full bg-[#002447] border border-[#ADEFD1] text-xs font-bold text-[#ADEFD1] flex items-center gap-1">
                <span>🔑</span> Chìa khóa bí mật 4/5
              </span>
            </div>

            <p className="text-xs text-[#FFFFE3]/90 leading-relaxed mb-6">
              Bạn đã khôi phục trọn vẹn cuốn Album ký ức, giải mã 5 kỷ vật học đường và mở thành công Chiếc Hộp Thời Gian (20.11.1982)!
            </p>

            <button
              onClick={() => {
                soundManager.playSparkle();
                onNavigateToRoom5();
              }}
              className="w-full py-3 rounded-full bg-[#ADEFD1] text-[#00203F] font-black text-sm hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase"
            >
              <Sparkles className="w-5 h-5 fill-[#00203F]" />
              <span>TIẾP TỤC ĐẾN PHÒNG TRI ÂN</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* THÔNG BÁO KHI CHƯA MỞ KHÓA NHIỆM VỤ 2 */}
      {/* ========================================================================= */}
      {activeModal === 'relics_locked_notice' && (
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
              NHỮNG KỶ VẬT ĐANG BỊ PHONG ẤN!
            </h3>
            <p className="text-xs text-[#FFFFE3]/90 leading-relaxed mb-5">
              Cậu cần hoàn thành <span className="font-bold text-[#ADEFD1]">Nhiệm vụ 1: Album Ảnh Chưa Hoàn Chỉnh</span> ở bên trái trước khi khám phá Những Kỷ Vật Học Đường nhé!
            </p>
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveModal('album_task1');
              }}
              className="w-full py-3 rounded-full bg-[#ADEFD1] text-[#00203F] font-black text-xs hover:bg-white transition-all shadow-md cursor-pointer uppercase tracking-wider"
            >
              MỞ ALBUM ẢNH NGAY
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NHIỆM VỤ 1: ALBUM ẢNH CHƯA HOÀN CHỈNH (CUỐN SÁCH SVG LẬT TRANG 3D TRÊN MẶT BÀN GỖ) */}
      {/* ========================================================================= */}
      {activeModal === 'album_task1' && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-1 sm:p-2 overflow-hidden animate-pop">
          <div className="relative w-full max-w-6xl bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl p-2 sm:p-3 shadow-2xl flex flex-col h-full max-h-[92vh] overflow-hidden text-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#ADEFD1]/30 pb-1.5 mb-1.5 shrink-0 px-1">
              <div className="min-w-0">
                <h3 className="text-xs sm:text-base font-black text-white uppercase truncate">
                  NHIỆM VỤ 1: ALBUM ẢNH CHƯA HOÀN CHỈNH
                </h3>
                <p className="text-[10px] sm:text-xs text-[#ADEFD1] truncate">
                  Hoàn thành 5 bức ảnh ký ức của thầy trò để tìm lại mảnh lịch bí ẩn!
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

            {/* Thanh tiến trình: 5 vòng tròn gắn số (Đúng = xanh, Sai = đỏ, đang chọn = viền vàng) */}
            <div className="mb-1 bg-[#002447]/60 border border-[#ADEFD1]/30 rounded-2xl p-1.5 shrink-0">
              <div className="flex items-center justify-around gap-2">
                {[0, 1, 2, 3, 4].map((idx) => {
                  const ans = albumResults[idx];
                  const isAnswered = ans !== undefined;
                  const isRight = ans === true;
                  const isCurrent = albumPage === idx;
                  const circleStyle = isAnswered
                    ? isRight
                      ? 'bg-emerald-600 text-white border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                      : 'bg-rose-600 text-white border-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                    : 'bg-[#001833] text-[#ADEFD1] border-[#ADEFD1]/40';

                  return (
                    <button
                      key={idx}
                      onClick={() => flipToAlbumPage(idx)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-black text-xs transition-all flex items-center justify-center border cursor-pointer ${circleStyle} ${
                        isCurrent ? 'ring-2 ring-[#FFD700] scale-110' : 'opacity-90 hover:opacity-100'
                      }`}
                      title={`Bức ảnh ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CUỐN SÁCH SVG MỞ ĐÔI VỚI HIỆU ỨNG LẬT TRANG 3D & VỪA SÁT KHUNG TRÊN MẶT BÀN GỖ */}
            <div
              className="relative flex-1 min-h-0 w-full overflow-y-auto custom-scrollbar sm:overflow-hidden rounded-2xl border-2 border-[#ADEFD1]/40 shadow-inner flex flex-col sm:items-center sm:justify-center p-2 sm:p-0"
              style={{
                backgroundImage: `url("${TABLE_BG_IMG}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* DESKTOP & TABLET: GIỮ NGUYÊN 100% CUỐN SÁCH SVG MỞ ĐÔI 3D */}
              <div className="hidden sm:flex w-full h-full items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="28 88 1144 624"
                  preserveAspectRatio="xMidYMid meet"
                  className="w-full h-full max-w-full max-h-full select-none"
                >
                <defs>
                  <filter id="book-drop-shadow" x="-8%" y="-8%" width="116%" height="120%">
                    <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#000000" floodOpacity="0.42" />
                  </filter>
                  <filter id="flip-shadow-blur" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="12" />
                  </filter>
                  <linearGradient id="blue-cover-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1d439b" />
                    <stop offset="25%" stopColor="#10296b" />
                    <stop offset="50%" stopColor="#091845" />
                    <stop offset="75%" stopColor="#10296b" />
                    <stop offset="100%" stopColor="#071336" />
                  </linearGradient>
                  <linearGradient id="blue-edge-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3c6be0" />
                    <stop offset="50%" stopColor="#15327a" />
                    <stop offset="100%" stopColor="#06102e" />
                  </linearGradient>
                  <linearGradient id="red-lining-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#801111" />
                    <stop offset="20%" stopColor="#c42121" />
                    <stop offset="50%" stopColor="#5e0b0b" />
                    <stop offset="80%" stopColor="#c42121" />
                    <stop offset="100%" stopColor="#801111" />
                  </linearGradient>
                  <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff6b3" />
                    <stop offset="22%" stopColor="#ffd24c" />
                    <stop offset="50%" stopColor="#e09612" />
                    <stop offset="78%" stopColor="#ffcf40" />
                    <stop offset="100%" stopColor="#8c5100" />
                  </linearGradient>
                  <linearGradient id="gold-rim-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffe885" />
                    <stop offset="50%" stopColor="#d48806" />
                    <stop offset="100%" stopColor="#784300" />
                  </linearGradient>
                  <linearGradient id="page-block-left" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c49a68" />
                    <stop offset="35%" stopColor="#e3c193" />
                    <stop offset="70%" stopColor="#cfa674" />
                    <stop offset="100%" stopColor="#f2dbb8" />
                  </linearGradient>
                  <linearGradient id="page-block-right" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f2dbb8" />
                    <stop offset="30%" stopColor="#cfa674" />
                    <stop offset="65%" stopColor="#e3c193" />
                    <stop offset="100%" stopColor="#c49a68" />
                  </linearGradient>
                  <linearGradient id="page-block-bottom" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ecd2ad" />
                    <stop offset="45%" stopColor="#d4af7d" />
                    <stop offset="85%" stopColor="#b58952" />
                    <stop offset="100%" stopColor="#8c6230" />
                  </linearGradient>
                  <linearGradient id="left-page-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#edd3ad" />
                    <stop offset="18%" stopColor="#f8e8cc" />
                    <stop offset="65%" stopColor="#fdf4e3" />
                    <stop offset="88%" stopColor="#efd7b4" />
                    <stop offset="96%" stopColor="#d4b083" />
                    <stop offset="100%" stopColor="#b08858" />
                  </linearGradient>
                  <linearGradient id="right-page-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a88050" />
                    <stop offset="4%" stopColor="#d1ad80" />
                    <stop offset="12%" stopColor="#efd7b4" />
                    <stop offset="35%" stopColor="#fdf4e3" />
                    <stop offset="82%" stopColor="#f8e8cc" />
                    <stop offset="100%" stopColor="#edd3ad" />
                  </linearGradient>
                  <linearGradient id="flip-page-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#d8b588" />
                    <stop offset="20%" stopColor="#faf0dc" />
                    <stop offset="55%" stopColor="#fff9ee" />
                    <stop offset="85%" stopColor="#f2dec0" />
                    <stop offset="100%" stopColor="#c9a16f" />
                  </linearGradient>
                  <linearGradient id="flip-back-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c49c6b" />
                    <stop offset="40%" stopColor="#f7e7cb" />
                    <stop offset="75%" stopColor="#fff8eb" />
                    <stop offset="100%" stopColor="#d1ab7a" />
                  </linearGradient>
                  <linearGradient id="ribbon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff3b3b" />
                    <stop offset="45%" stopColor="#d61515" />
                    <stop offset="100%" stopColor="#7a0606" />
                  </linearGradient>
                  <g id="corner-flourish">
                    <path
                      d="M 0,0 C 18,2 32,2 44,8 C 34,12 22,12 12,10 C 16,20 26,26 36,28 C 24,30 14,24 8,14 C 10,24 10,36 6,46 C 2,34 2,18 0,0 Z"
                      fill="url(#gold-grad)"
                      opacity="0.85"
                    />
                    <circle cx="16" cy="16" r="2.5" fill="#c9830c" />
                  </g>
                </defs>

                {/* TẦNG 1: BÌA SÁCH VÀ GÁY SÁCH */}
                <g id="book-cover-layer" filter="url(#book-drop-shadow)">
                  <path
                    d="M 55,140 Q 62,115 90,115 L 560,132 Q 600,145 640,132 L 1110,115 Q 1138,115 1145,140 L 1168,625 Q 1172,658 1138,662 L 652,668 Q 600,692 548,668 L 62,662 Q 28,658 32,625 Z"
                    fill="url(#blue-cover-grad)"
                    stroke="#050d26"
                    strokeWidth="3"
                  />
                  <path
                    d="M 32,625 Q 28,658 62,662 L 548,668 Q 600,692 652,668 L 1138,662 Q 1172,658 1168,625 L 1155,642 Q 1152,672 1125,675 L 654,680 Q 600,706 546,680 L 75,675 Q 48,672 45,642 Z"
                    fill="url(#blue-edge-highlight)"
                    stroke="#040a1f"
                    strokeWidth="2"
                  />
                  <path
                    d="M 66,144 Q 72,126 95,126 L 558,140 Q 600,152 642,140 L 1105,126 Q 1128,126 1134,144 L 1154,618 Q 1156,645 1128,648 L 650,654 Q 600,676 550,654 L 72,648 Q 44,645 46,618 Z"
                    fill="none"
                    stroke="url(#gold-rim-grad)"
                    strokeWidth="2.5"
                    opacity="0.85"
                  />
                  <path
                    d="M 74,146 L 560,145 Q 600,156 640,145 L 1126,146 L 1144,622 L 648,638 Q 600,658 552,638 L 56,622 Z"
                    fill="url(#red-lining-grad)"
                    stroke="#4a0606"
                    strokeWidth="2"
                  />
                  <g id="gold-corner-tl">
                    <path
                      d="M 52,188 L 56,136 Q 59,110 86,110 L 138,113 L 132,135 L 92,134 Q 78,135 76,148 L 73,190 Z"
                      fill="url(#gold-grad)"
                      stroke="#593100"
                      strokeWidth="2"
                    />
                    <path
                      d="M 63,168 L 66,140 Q 68,122 86,122 L 116,124"
                      fill="none"
                      stroke="#fff9c4"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="82" cy="130" r="4" fill="#9c5700" />
                  </g>
                  <g id="gold-corner-tr" transform="translate(1200, 0) scale(-1, 1)">
                    <path
                      d="M 52,188 L 56,136 Q 59,110 86,110 L 138,113 L 132,135 L 92,134 Q 78,135 76,148 L 73,190 Z"
                      fill="url(#gold-grad)"
                      stroke="#593100"
                      strokeWidth="2"
                    />
                    <path
                      d="M 63,168 L 66,140 Q 68,122 86,122 L 116,124"
                      fill="none"
                      stroke="#fff9c4"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="82" cy="130" r="4" fill="#9c5700" />
                  </g>
                  <g id="gold-corner-bl">
                    <path
                      d="M 35,576 L 30,632 Q 28,664 62,668 L 126,670 L 128,644 L 74,642 Q 56,640 57,622 L 60,578 Z"
                      fill="url(#gold-grad)"
                      stroke="#593100"
                      strokeWidth="2"
                    />
                    <path
                      d="M 46,594 L 43,628 Q 42,650 66,652 L 106,654"
                      fill="none"
                      stroke="#fff9c4"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <circle cx="66" cy="645" r="4.5" fill="#9c5700" />
                  </g>
                  <g id="gold-corner-br" transform="translate(1200, 0) scale(-1, 1)">
                    <path
                      d="M 35,576 L 30,632 Q 28,664 62,668 L 126,670 L 128,644 L 74,642 Q 56,640 57,622 L 60,578 Z"
                      fill="url(#gold-grad)"
                      stroke="#593100"
                      strokeWidth="2"
                    />
                    <path
                      d="M 46,594 L 43,628 Q 42,650 66,652 L 106,654"
                      fill="none"
                      stroke="#fff9c4"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <circle cx="66" cy="645" r="4.5" fill="#9c5700" />
                  </g>
                </g>

                {/* TẦNG 2: KHỐI DÀY CÁC TRANG GIẤY VÀ RUY BĂNG */}
                <g id="page-block-layer">
                  <path
                    d="M 135,114 L 82,138 L 62,612 L 114,592 Z"
                    fill="url(#page-block-left)"
                    stroke="#8f6838"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 124,119 L 73,607 M 114,124 L 66,610 M 103,129 L 78,460 M 93,133 L 70,540"
                    fill="none"
                    stroke="#9e7442"
                    strokeWidth="1.1"
                    opacity="0.65"
                  />
                  <path
                    d="M 1065,114 L 1118,138 L 1138,612 L 1086,592 Z"
                    fill="url(#page-block-right)"
                    stroke="#8f6838"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 1076,119 L 1127,607 M 1086,124 L 1134,610 M 1097,129 L 1122,460 M 1107,133 L 1130,540"
                    fill="none"
                    stroke="#9e7442"
                    strokeWidth="1.1"
                    opacity="0.65"
                  />
                  <path
                    d="M 62,612 L 114,592 C 245,568 465,570 600,624 L 600,652 C 465,606 240,602 62,612 Z"
                    fill="url(#page-block-bottom)"
                    stroke="#7d5628"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 76,609 C 242,580 462,582 600,634 M 92,603 C 245,575 464,577 600,629"
                    fill="none"
                    stroke="#8c6230"
                    strokeWidth="1.2"
                    opacity="0.7"
                  />
                  <path
                    d="M 1138,612 L 1086,592 C 955,568 735,570 600,624 L 600,652 C 735,606 960,602 1138,612 Z"
                    fill="url(#page-block-bottom)"
                    stroke="#7d5628"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 1124,609 C 958,580 738,582 600,634 M 1108,603 C 955,575 736,577 600,629"
                    fill="none"
                    stroke="#8c6230"
                    strokeWidth="1.2"
                    opacity="0.7"
                  />
                  <path
                    d="M 556,642 Q 600,618 644,642 L 638,656 Q 600,636 562,656 Z"
                    fill="url(#gold-grad)"
                    stroke="#613600"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M 564,646 Q 600,626 636,646"
                    fill="none"
                    stroke="#8f4b00"
                    strokeWidth="2"
                    strokeDasharray="5,4"
                  />
                  <path
                    d="M 615,634 C 635,648 652,678 666,722 L 688,708 L 712,716 C 694,676 675,646 646,632 Z"
                    fill="url(#ribbon-grad)"
                    stroke="#4f0303"
                    strokeWidth="1.8"
                  />
                </g>

                {/* TẦNG 3: HAI TRANG SÁCH MỞ */}
                <g id="static-open-pages">
                  <path
                    id="left-page"
                    d="M 600,132 C 465,80 245,84 135,114 L 114,592 C 245,568 465,570 600,624 Z"
                    fill="url(#left-page-grad)"
                    stroke="#c29b6b"
                    strokeWidth="1.5"
                  />
                  <path
                    id="right-page"
                    d="M 600,132 C 735,80 955,84 1065,114 L 1086,592 C 955,568 735,570 600,624 Z"
                    fill="url(#right-page-grad)"
                    stroke="#c29b6b"
                    strokeWidth="1.5"
                  />
                  <use href="#corner-flourish" transform="translate(148, 126) rotate(4)" />
                  <use href="#corner-flourish" transform="translate(128, 576) scale(1, -1) rotate(4)" />
                  <use href="#corner-flourish" transform="translate(1052, 126) scale(-1, 1) rotate(4)" />
                  <use href="#corner-flourish" transform="translate(1072, 576) scale(-1, -1) rotate(4)" />
                  <path d="M 600,132 L 600,624" stroke="#7d572c" strokeWidth="2" opacity="0.65" />
                </g>

                {/* TẦNG 3.5: NỘI DUNG TRANG TRÁI VÀ TRANG PHẢI MỞ RỘNG TỐI ĐA VỪA KHÍT TRANG SÁCH */}
                <foreignObject x="138" y="122" width="444" height="460">
                  {renderAlbumLeftContent()}
                </foreignObject>

                {/* TRANG PHẢI: KHUNG CÁC PHƯƠNG ÁN & NÚT KIỂM TRA / LẬT TRANG */}
                <foreignObject x="618" y="122" width="444" height="460">
                  {renderAlbumRightContent()}
                </foreignObject>

                {/* TẦNG 4: LỚP TRANG LẬT 3D ĐỘNG (HIỆU ỨNG LẬT TRANG QUA CÂU TIẾP THEO) */}
                <g id="dynamic-flip-layer" pointerEvents="none">
                  <path
                    ref={flipShadowRef}
                    d=""
                    fill="#2b1804"
                    opacity="0"
                    filter="url(#flip-shadow-blur)"
                  />
                  <path
                    ref={flipPageRef}
                    d=""
                    fill="url(#flip-page-grad)"
                    stroke="#bd9564"
                    strokeWidth="1.4"
                    opacity="0"
                  />
                  <path
                    ref={flipHighlightRef}
                    d=""
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="10"
                    opacity="0"
                    filter="url(#flip-shadow-blur)"
                  />
                </g>
              </svg>
              </div>

              {/* MOBILE (ĐIỆN THOẠI): CHIỀU WIDTH NGANG VỚI KHUNG VÀ DÙNG THANH KÉO ĐỂ QUAN SÁT NỘI DUNG */}
              <div className="sm:hidden flex flex-col w-full space-y-3 z-10 my-1">
                {/* Trang 1: Bức ảnh */}
                <div className="w-full bg-[#fdf7ec] border-2 border-[#b88c56] rounded-2xl p-3 shadow-md text-[#2b1704]">
                  {renderAlbumLeftContent()}
                </div>

                {/* Trang 2: Câu đố & Các lựa chọn */}
                <div className="w-full bg-[#fdf7ec] border-2 border-[#b88c56] rounded-2xl p-3 shadow-md text-[#2b1704]">
                  {renderAlbumRightContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHẦN THƯỞNG MẢNH LỊCH 20/11 SAU KHI HOÀN THÀNH NHIỆM VỤ 1 */}
      {/* ========================================================================= */}
      {activeModal === 'calendar_reward' && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-pop">
          <div className="bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl relative w-full max-w-4xl h-full max-h-[89vh] p-6 text-center shadow-2xl text-white flex flex-col items-center justify-center overflow-y-auto">
            <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-[#002447] border-2 border-[#ADEFD1] flex flex-col items-center justify-center shadow-lg animate-bounce-slow">
              <span className="text-[10px] font-black text-[#ADEFD1] uppercase tracking-widest">
                THÁNG 11
              </span>
              <span className="text-3xl font-black text-[#FFD700] leading-none mt-0.5">
                20
              </span>
            </div>

            <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">
              ĐÃ THU THẬP MẢNH LỊCH BÍ ẨN!
            </h3>
            <p className="text-xs text-[#FFFFE3]/90 leading-relaxed mb-6">
              Bạn đã khôi phục trọn vẹn 5 bức ảnh trong cuốn Album và tìm thấy mảnh lịch ghi dấu ngày <span className="font-bold text-[#FFD700]">20/11</span>! Hãy cất giữ cẩn thận để mở Chiếc Hộp Thời Gian nhé!
            </p>

            <button
              onClick={handleCollectCalendarReward}
              className="w-full py-3 rounded-full bg-[#ADEFD1] text-[#00203F] font-black text-sm hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase"
            >
              <span>TIẾP TỤC</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NHIỆM VỤ 2: NHỮNG KỶ VẬT BIẾT KỂ CHUYỆN (BỐI CẢNH MẶT BÀN & 5 VẬT PHẨM KHÔNG ĐÈ NHAU) */}
      {/* ========================================================================= */}
      {activeModal === 'relics_task2' && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-pop">
          <div className="relative w-full max-w-5xl bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl p-3 sm:p-4 shadow-2xl flex flex-col h-full max-h-[89vh] overflow-hidden text-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#ADEFD1]/30 pb-2 mb-2 shrink-0">
              <div className="min-w-0">
                <h3 className="text-xs sm:text-base font-black text-white uppercase truncate">
                  NHIỆM VỤ 2: NHỮNG KỶ VẬT BIẾT KỂ CHUYỆN
                </h3>
                <p className="text-[10px] sm:text-xs text-[#ADEFD1] truncate">
                  Khám phá 5 kỷ vật học đường trên mặt bàn để tìm ra 4 con số lịch sử và bức thư bí mật!
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

            {/* BỐI CẢNH CÁI BÀN VÀ 5 KỶ VẬT ĐẶT TÁCH BIỆT TUYỆT ĐỐI KHÔNG ĐÈ NHAU */}
            <div className="relative flex-1 min-h-0 w-full rounded-2xl border-2 border-[#ADEFD1]/40 overflow-y-auto custom-scrollbar sm:overflow-hidden shadow-inner flex flex-col justify-between">
              {/* Hình nền Cái Bàn */}
              <img
                src={TABLE_BG_IMG}
                alt="Bàn kỷ vật học đường"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
              />

              {/* Hướng dẫn nhỏ phía trên mặt bàn */}
              <div className="relative z-10 w-full px-3 pt-2.5 flex items-center justify-between gap-2 pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-[#001833]/90 border border-[#ADEFD1]/60 text-[#ADEFD1] text-[10px] sm:text-xs font-black shadow-md">
                  {task2Passed || solvedRelics.length === 5
                    ? 'Đã hoàn thành khám phá 5 kỷ vật! Nhấn Mở Bức Thư Bí Mật để tiếp tục.'
                    : `Nhấp vào từng kỷ vật trên bàn để giải đố (${solvedRelics.length}/5 kỷ vật)`}
                </span>
                {(task2Passed || solvedRelics.length === 5) ? (
                  <button
                    onClick={handleCloseTask2Modal}
                    className="pointer-events-auto px-4 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-300 text-[10px] sm:text-xs font-black uppercase shadow-lg flex items-center gap-1 cursor-pointer animate-bounce"
                  >
                    <span>Mở Bức Thư Bí Mật</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : null}
              </div>

              {/* Sân khấu 5 kỷ vật đặt nháo nhào tự nhiên trong 5 vùng riêng biệt (tuyệt đối không chạm hay đè mép nhau) */}
              <div className="relative z-10 flex-1 min-h-0 w-full">
                {[
                  {
                    id: 1,
                    name: 'Quyển vở cũ',
                    img: RELIC_NOTEBOOK_IMG,
                    clue: 'Số 1',
                    style: { left: '3%', top: '6%', width: '25%', height: '42%' },
                    rotate: '-rotate-6',
                  },
                  {
                    id: 4,
                    name: 'Bông hoa giấy',
                    img: RELIC_FLOWER_IMG,
                    clue: 'Số 2',
                    style: { left: '37%', top: '3%', width: '24%', height: '39%' },
                    rotate: 'rotate-6',
                  },
                  {
                    id: 3,
                    name: 'Ngôi sao khen thưởng',
                    img: RELIC_STAR_IMG,
                    clue: 'Số 8',
                    style: { left: '70%', top: '5%', width: '26%', height: '43%' },
                    rotate: '-rotate-3',
                  },
                  {
                    id: 2,
                    name: 'Cây bút máy',
                    img: RELIC_PEN_IMG,
                    clue: 'Số 9',
                    style: { left: '14%', top: '53%', width: '28%', height: '42%' },
                    rotate: 'rotate-8',
                  },
                  {
                    id: 5,
                    name: 'Hộp thư nhỏ',
                    img: RELIC_MAILBOX_IMG,
                    clue: 'Mật thư',
                    style: { left: '56%', top: '51%', width: '28%', height: '44%' },
                    rotate: '-rotate-4',
                  },
                ].map((item) => {
                  const isSolved = solvedRelics.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      style={item.style}
                      onClick={() => {
                        soundManager.playClick();
                        setRelicSelected(item.id);
                        setActiveRelicQuestionModal(item.id);
                      }}
                      className="absolute flex flex-col items-center justify-center p-1 cursor-pointer group transition-transform duration-300 hover:scale-105"
                      title={item.name}
                    >
                      <div className={`relative flex-1 min-h-0 w-full flex items-center justify-center ${item.rotate} group-hover:rotate-0 transition-transform duration-300`}>
                        <img
                          src={item.img}
                          alt={item.name}
                          className={`max-h-full max-w-full w-auto h-auto object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)] transition-all duration-300 ${
                            isSolved
                              ? 'brightness-110 drop-shadow-[0_0_16px_#28a745]'
                              : 'group-hover:brightness-115'
                          }`}
                        />
                      </div>

                      {isSolved ? (
                        <div className="mt-1 px-2.5 py-0.5 rounded-full bg-[#001c38]/95 border border-emerald-400 text-emerald-300 font-black text-[9px] sm:text-[11px] shadow-md flex items-center gap-1 whitespace-nowrap shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>ĐÃ HOÀN THÀNH ({item.clue})</span>
                        </div>
                      ) : (
                        <span className="mt-1 px-2.5 py-0.5 rounded-full bg-[#001833]/90 border border-[#ADEFD1]/60 text-[#ADEFD1] group-hover:bg-[#ADEFD1] group-hover:text-[#00203F] font-black text-[9px] sm:text-[11px] shadow-md whitespace-nowrap shrink-0 transition-colors">
                          {item.name}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* BẢNG CÂU HỎI KHI NHẤN VÀO MỘT KỶ VẬT TRÊN BÀN */}
              {activeRelicQuestionModal !== null && (
                <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-pop">
                  <div className="relative w-full max-w-2xl bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between max-h-full overflow-y-auto text-white">
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setActiveRelicQuestionModal(null);
                      }}
                      className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[#002447] border border-[#ADEFD1] text-[#ADEFD1] hover:bg-[#ADEFD1] hover:text-[#00203F] flex items-center justify-center font-bold text-sm cursor-pointer transition-all"
                      title="Quay lại mặt bàn"
                    >
                      ✕
                    </button>

                    <div className="pr-8">
                      {/* RELIC 1: QUYỂN VỞ CŨ */}
                      {relicSelected === 1 && (
                        <div className="space-y-3">
                          <div className="bg-[#002447] border border-[#ADEFD1]/40 rounded-xl p-3">
                            <h4 className="text-xs sm:text-sm font-black text-[#ADEFD1] uppercase mb-1">
                              KỶ VẬT: QUYỂN VỞ CŨ – LỜI DẠY CÒN MÃI
                            </h4>
                            <p className="text-xs text-[#FFFFE3]">
                              Điền từ còn thiếu vào câu tục ngữ nhắc nhở vai trò của người thầy:
                            </p>
                          </div>

                          <div className="p-4 bg-[#002447] rounded-xl border border-[#ADEFD1]/35 text-center space-y-3">
                            <p className="text-sm md:text-base font-bold text-white">
                              “Không <span className="underline text-[#FFD700] px-2 font-black">......</span> đố mày làm nên.”
                            </p>
                            <div className="flex items-center justify-center gap-2">
                              <input
                                type="text"
                                value={r1Input}
                                onChange={(e) => setR1Input(e.target.value)}
                                placeholder="Nhập từ..."
                                className="p-2.5 bg-white border-2 border-[#ADEFD1] rounded-xl text-center font-black text-sm text-[#00203F] outline-none w-48 shadow-sm"
                              />
                            </div>
                          </div>
                          {r1Feedback && (
                            <div
                              className={`p-2.5 rounded-xl border text-xs font-bold ${
                                isCurrentRelicSolved
                                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                                  : 'bg-rose-950/80 border-rose-400 text-rose-200'
                              }`}
                            >
                              {r1Feedback}
                            </div>
                          )}
                        </div>
                      )}

                      {/* RELIC 2: CÂY BÚT MÁY */}
                      {relicSelected === 2 && (
                        <div className="space-y-2.5">
                          <div className="bg-[#002447] border border-[#ADEFD1]/40 rounded-xl p-3">
                            <h4 className="text-xs sm:text-sm font-black text-[#ADEFD1] uppercase mb-1">
                              KỶ VẬT: CÂY BÚT MÁY – BÀI HỌC VỀ SỰ TRUNG THỰC
                            </h4>
                            <p className="text-xs text-[#FFFFE3]">
                              Trong giờ kiểm tra, Huy vô tình để quên vở có đáp án dưới ngăn bàn. Huy nên làm gì?
                            </p>
                          </div>

                          <div className="space-y-2">
                            {r2Options.map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => {
                                  soundManager.playClick();
                                  setR2Selected(opt.id);
                                  setR2Feedback(null);
                                }}
                                className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                                  r2Selected === opt.id
                                    ? 'bg-[#ADEFD1] border-white text-[#00203F] font-bold shadow-md'
                                    : 'bg-[#002447] hover:bg-[#003366] border-[#ADEFD1]/35 text-[#FFFFE3]'
                                }`}
                              >
                                <span
                                  className={`w-5 h-5 rounded-full font-black text-[10px] flex items-center justify-center shrink-0 ${
                                    r2Selected === opt.id
                                      ? 'bg-[#00203F] text-[#ADEFD1]'
                                      : 'bg-[#001833] text-[#ADEFD1] border border-[#ADEFD1]/40'
                                  }`}
                                >
                                  {opt.displayLetter}
                                </span>
                                <span>{opt.text}</span>
                              </button>
                            ))}
                            {r2Feedback && (
                              <div
                                className={`p-2.5 rounded-xl border text-xs font-bold ${
                                  isCurrentRelicSolved
                                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                                    : 'bg-rose-950/80 border-rose-400 text-rose-200'
                                }`}
                              >
                                {r2Feedback}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* RELIC 3: NGÔI SAO KHEN THƯỞNG */}
                      {relicSelected === 3 && (
                        <div className="space-y-2.5">
                          <div className="bg-[#002447] border border-[#ADEFD1]/40 rounded-xl p-3">
                            <h4 className="text-xs sm:text-sm font-black text-[#ADEFD1] uppercase mb-1">
                              KỶ VẬT: NGÔI SAO KHEN THƯỞNG – HÀNH TRÌNH TIẾN BỘ
                            </h4>
                            <p className="text-xs text-[#FFFFE3]">
                              Sắp xếp 3 hành động theo trình tự hợp lý để sửa chữa lỗi sai và tiến bộ:
                            </p>
                          </div>

                          <div className="space-y-2">
                            {r3Order.map((stepId, idx) => {
                              const labels: Record<number, string> = {
                                1: 'Luyện tập và tự kiểm tra để tránh lặp lại lỗi.',
                                2: 'Lắng nghe và tìm hiểu lời góp ý của cô.',
                                3: 'Xác định, sửa lại những lỗi đã mắc.',
                              };
                              return (
                                <div
                                  key={stepId}
                                  className="p-2.5 bg-[#002447] border border-[#ADEFD1]/35 rounded-xl flex items-center justify-between gap-3 text-xs text-white"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span className="w-6 h-6 rounded-full bg-[#ADEFD1] text-[#00203F] font-black flex items-center justify-center shrink-0">
                                      {idx + 1}
                                    </span>
                                    <span className="font-semibold">{labels[stepId]}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => idx > 0 && handleMoveR3(idx, idx - 1)}
                                      disabled={idx === 0}
                                      className="p-1.5 bg-[#001833] border border-[#ADEFD1]/40 text-[#ADEFD1] rounded-lg disabled:opacity-30 hover:bg-[#ADEFD1] hover:text-[#00203F] cursor-pointer"
                                    >
                                      <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => idx < 2 && handleMoveR3(idx, idx + 1)}
                                      disabled={idx === 2}
                                      className="p-1.5 bg-[#001833] border border-[#ADEFD1]/40 text-[#ADEFD1] rounded-lg disabled:opacity-30 hover:bg-[#ADEFD1] hover:text-[#00203F] cursor-pointer"
                                    >
                                      <ChevronDown className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                            {r3Feedback && (
                              <div
                                className={`p-2.5 rounded-xl border text-xs font-bold ${
                                  isCurrentRelicSolved
                                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                                    : 'bg-rose-950/80 border-rose-400 text-rose-200'
                                }`}
                              >
                                {r3Feedback}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* RELIC 4: BÔNG HOA GIẤY */}
                      {relicSelected === 4 && (
                        <div className="space-y-2.5">
                          <div className="bg-[#002447] border border-[#ADEFD1]/40 rounded-xl p-3">
                            <h4 className="text-xs sm:text-sm font-black text-[#ADEFD1] uppercase mb-1">
                              KỶ VẬT: BÔNG HOA GIẤY – LÒNG BIẾT ƠN TRONG HÀNH ĐỘNG
                            </h4>
                            <p className="text-xs text-[#FFFFE3]">
                              Xác định các nhận định sau là Đúng hay Sai:
                            </p>
                          </div>

                          <div className="space-y-2">
                            {[
                              { id: 1, text: '1. Lòng biết ơn thầy cô có thể được thể hiện qua những hành động nhỏ nhưng chân thành.' },
                              { id: 2, text: '2. Giá trị của món quà quyết định mức độ kính trọng của học sinh đối với thầy cô.' },
                              { id: 3, text: '3. Học tập nghiêm túc và sống có trách nhiệm cũng là cách trân trọng những lời dạy tốt đẹp.' },
                              { id: 4, text: '4. Chỉ cần thể hiện lòng biết ơn vào ngày 20/11, những ngày khác không cần quan tâm.' },
                            ].map((item) => (
                              <div
                                key={item.id}
                                className="p-2 bg-[#002447] border border-[#ADEFD1]/35 rounded-xl flex items-center justify-between gap-2 text-xs text-white"
                              >
                                <span className="leading-snug font-medium">{item.text}</span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    onClick={() => {
                                      soundManager.playClick();
                                      setR4Answers((prev) => ({ ...prev, [item.id]: true }));
                                    }}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all border ${
                                      r4Answers[item.id] === true
                                        ? 'bg-emerald-600 border-emerald-300 text-white shadow-xs'
                                        : 'bg-[#001833] border-[#ADEFD1]/30 text-[#ADEFD1]'
                                    }`}
                                  >
                                    Đúng
                                  </button>
                                  <button
                                    onClick={() => {
                                      soundManager.playClick();
                                      setR4Answers((prev) => ({ ...prev, [item.id]: false }));
                                    }}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all border ${
                                      r4Answers[item.id] === false
                                        ? 'bg-rose-600 border-rose-300 text-white shadow-xs'
                                        : 'bg-[#001833] border-[#ADEFD1]/30 text-[#ADEFD1]'
                                    }`}
                                  >
                                    Sai
                                  </button>
                                </div>
                              </div>
                            ))}
                            {r4Feedback && (
                              <div
                                className={`p-2.5 rounded-xl border text-xs font-bold ${
                                  isCurrentRelicSolved
                                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                                    : 'bg-rose-950/80 border-rose-400 text-rose-200'
                                }`}
                              >
                                {r4Feedback}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* RELIC 5: CHIẾC HỘP THƯ NHỎ */}
                      {relicSelected === 5 && (
                        <div className="space-y-2.5">
                          <div className="bg-[#002447] border border-[#ADEFD1]/40 rounded-xl p-3">
                            <h4 className="text-xs sm:text-sm font-black text-[#ADEFD1] uppercase mb-1">
                              KỶ VẬT: CHIẾC HỘP THƯ NHỎ – LỜI NHẮN GỬI TƯƠNG LAI
                            </h4>
                            <p className="text-xs text-[#FFFFE3]">
                              Nhiều năm sau khi tốt nghiệp, những hành động nào của cựu học sinh thể hiện lòng biết ơn thầy cô? (Chọn tất cả đáp án đúng)
                            </p>
                          </div>

                          <div className="space-y-2">
                            {r5Options.map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => {
                                  soundManager.playClick();
                                  handleToggleR5(opt.id);
                                }}
                                className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                                  r5Selected.includes(opt.id)
                                    ? 'bg-[#ADEFD1] border-white text-[#00203F] font-bold shadow-md'
                                    : 'bg-[#002447] hover:bg-[#003366] border-[#ADEFD1]/35 text-[#FFFFE3]'
                                }`}
                              >
                                <span
                                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                                    r5Selected.includes(opt.id)
                                      ? 'bg-[#00203F] text-[#ADEFD1] border-[#00203F]'
                                      : 'border-[#ADEFD1]/50 bg-[#001833]'
                                  }`}
                                >
                                  {r5Selected.includes(opt.id) && <Check className="w-3.5 h-3.5" />}
                                </span>
                                <span>{opt.displayLetter}. {opt.text}</span>
                              </button>
                            ))}
                            {r5Feedback && (
                              <div
                                className={`p-2.5 rounded-xl border text-xs font-bold ${
                                  isCurrentRelicSolved
                                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                                    : 'bg-rose-950/80 border-rose-400 text-rose-200'
                                }`}
                              >
                                {r5Feedback}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Bar dưới cùng của bảng câu hỏi Kỷ vật */}
                    <div className="pt-3 mt-3 border-t border-[#ADEFD1]/30 flex flex-col gap-2 shrink-0">
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            soundManager.playClick();
                            setActiveRelicQuestionModal(null);
                          }}
                          className="px-4 py-2 rounded-full bg-[#002447] border border-[#ADEFD1]/50 text-[#ADEFD1] font-bold text-xs hover:bg-[#003366] transition-all cursor-pointer"
                        >
                          Quay lại bàn
                        </button>

                        {!isCurrentRelicAnswered ? (
                          <button
                            onClick={() => {
                              if (relicSelected === 1) handleVerifyRelic1();
                              else if (relicSelected === 2) handleVerifyRelic2();
                              else if (relicSelected === 3) handleVerifyRelic3();
                              else if (relicSelected === 4) handleVerifyRelic4();
                              else if (relicSelected === 5) handleVerifyRelic5();
                            }}
                            className="px-6 py-2 rounded-full bg-[#ADEFD1] text-[#00203F] font-black text-xs hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer uppercase tracking-wider"
                          >
                            KIỂM TRA ĐÁP ÁN
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              soundManager.playClick();
                              setActiveRelicQuestionModal(null);
                              if (task2Passed || solvedRelics.length === 5) {
                                handleCloseTask2Modal();
                              }
                            }}
                            className="px-7 py-2 rounded-full bg-emerald-600 text-white border border-emerald-300 font-black text-xs hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
                          >
                            <span>{task2Passed ? 'HOÀN THÀNH' : 'TIẾP TỤC'}</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BỨC THƯ MẬT TỪ THỜI GIAN (ĐỒNG BỘ STYLE #001833 & #ADEFD1) */}
      {/* ========================================================================= */}
      {activeModal === 'secret_letter' && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-pop">
          <div className="relative bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-xl w-full max-h-full overflow-y-auto p-5 sm:p-6 shadow-2xl text-[#FFFFE3]">
            <button
              onClick={handleCloseSecretLetterModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#002447] border border-[#ADEFD1] text-[#ADEFD1] hover:bg-[#ADEFD1] hover:text-[#00203F] flex items-center justify-center font-bold text-sm cursor-pointer transition-all"
            >
              ✕
            </button>

            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#002447] border-2 border-[#ADEFD1] flex items-center justify-center text-2xl shadow-md animate-bounce-slow">
              📜
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white text-center uppercase tracking-wider mb-1">
              BỨC THƯ GỬI TỪ THỜI GIAN
            </h3>
            <p className="text-[11px] font-bold text-[#ADEFD1] text-center uppercase tracking-widest mb-4">
              ✦ MẬT THƯ GIẢI MÃ CHIẾC HỘP THỜI GIAN ✦
            </p>

            <div className="bg-[#002447] p-4 sm:p-5 rounded-2xl border border-[#ADEFD1]/50 text-xs sm:text-sm leading-relaxed text-[#FFFFE3] space-y-2.5 font-medium shadow-inner">
              <p className="font-bold text-[#ADEFD1]">“Gửi người đang tìm kiếm kho báu ký ức,</p>
              <p>Trong cuốn album là một ngày đặc biệt dành cho những người thầy, người cô.</p>
              <p>Còn bốn kỷ vật đang cất giữ những con số của một năm lịch sử.</p>
              <p>
                Đó là năm Hội đồng Bộ trưởng ban hành quyết định lấy ngày ấy hằng năm là Ngày Nhà giáo Việt Nam.
              </p>
              <p>Hãy sắp xếp bốn con số theo đúng năm lịch sử, rồi ghép chúng với ngày tháng tìm được trong album.</p>
              <p className="font-bold text-[#FFD700]">
                Khi mọi con số trở về đúng vị trí, chiếc hộp thời gian sẽ mở ra!”</p>
              <p className="text-right font-black text-[#ADEFD1] pt-1">— Người Gác Ký Ức —</p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={handleCloseSecretLetterModal}
                className="w-full py-3 rounded-full bg-[#ADEFD1] text-[#00203F] font-black text-xs sm:text-sm hover:bg-white hover:scale-105 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <span>TIẾP TỤC</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BẢNG MỞ KHÓA CHIẾC HỘP THỜI GIAN (MẬT MÃ 20.11.1982 - ĐỒNG BỘ STYLE #001833 & #ADEFD1) */}
      {/* ========================================================================= */}
      {activeModal === 'timebox_lock' && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-pop">
          <div className="relative bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-lg w-full max-h-full overflow-y-auto p-5 sm:p-6 shadow-2xl text-[#FFFFE3] flex flex-col items-center text-center">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#002447] border border-[#ADEFD1] text-[#ADEFD1] hover:bg-[#ADEFD1] hover:text-[#00203F] flex items-center justify-center font-bold text-sm cursor-pointer transition-all"
            >
              ✕
            </button>

            <div className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-[#002447] border-2 border-[#ADEFD1] flex items-center justify-center p-2 shadow-md animate-bounce-slow">
              <img src={HOTSPOT_BOX_IMG} alt="Hộp thời gian" className="w-full h-full object-contain" />
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider">
              MỞ KHÓA CHIẾC HỘP THỜI GIAN
            </h3>
            <p className="text-xs text-[#ADEFD1] mt-1 max-w-sm">
              Nhập mật mã ngày - tháng - năm lịch sử thành lập Ngày Nhà giáo Việt Nam:
            </p>

            {/* Manh mối đã thu thập */}
            <div className="my-3 p-3 bg-[#002447] border border-[#ADEFD1]/40 rounded-2xl w-full flex items-center justify-around text-xs">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-[#ADEFD1] font-bold uppercase">Mảnh lịch Album:</span>
                <span className="font-black text-[#FFD700]">{task1Done || task1Passed ? 'Ngày 20/11' : 'Chưa mở'}</span>
              </div>
              <div className="h-8 w-px bg-[#ADEFD1]/30" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-[#ADEFD1] font-bold uppercase">Con số Kỷ vật:</span>
                <span className="font-black text-[#FFD700]">
                  {solvedRelics.length >= 4 ? 'Đã thu thập đủ 4 số' : `${solvedRelics.length}/4 con số`}
                </span>
              </div>
            </div>

            {/* Quy định cách nhập đáp án */}
            <div className="bg-[#002447]/70 border border-[#ADEFD1]/40 rounded-xl p-3 text-left w-full text-xs space-y-1 mb-3">
              <div className="flex items-center gap-1.5 font-black text-[#ADEFD1] uppercase text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                <span>HƯỚNG DẪN NHẬP MẬT MÃ:</span>
              </div>
              <p className="text-[#FFFFE3] leading-relaxed">
                • Nhập theo định dạng <span className="font-bold text-[#ADEFD1]">Ngày.Tháng.Năm</span> (Ví dụ: <span className="font-mono text-[#FFD700]">DD.MM.YYYY</span>) hoặc viết liền 8 chữ số (<span className="font-mono text-[#FFD700]">DDMMYYYY</span>).
              </p>
            </div>

            {/* Ô Nhập Mật Mã */}
            <div className="space-y-3 w-full">
              <div className="flex items-center justify-center gap-2">
                <input
                  type="text"
                  maxLength={12}
                  value={timeCode}
                  onChange={(e) => setTimeCode(e.target.value)}
                  placeholder="DD.MM.YYYY..."
                  className="w-full max-w-xs p-3 bg-white border-2 border-[#ADEFD1] rounded-2xl text-center font-black text-xl sm:text-2xl text-[#00203F] tracking-widest outline-none shadow-md placeholder-slate-400 placeholder:text-sm placeholder:font-normal placeholder:tracking-normal"
                />
              </div>



              {timeCodeFeedback && (
                <div
                  className={`p-2.5 rounded-xl border text-xs font-bold ${
                    timeCodeFeedback.includes('CHÍNH XÁC')
                      ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 animate-pulse'
                      : 'bg-rose-950/90 border-rose-500 text-rose-200'
                  }`}
                >
                  {timeCodeFeedback}
                </div>
              )}

              <button
                onClick={handleUnlockBox}
                disabled={isBoxUnlocking}
                className="w-full py-3 rounded-full bg-[#ADEFD1] text-[#00203F] font-black text-sm hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <Unlock className="w-4 h-4" />
                <span>{isBoxUnlocking ? 'ĐANG MỞ HỘP...' : 'MỞ KHÓA CHIẾC HỘP THỜI GIAN'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECRET KEY 4 REWARD SEQUENCE (ĐỒNG BỘ STYLE HÌNH 4 & TÚI ĐỒ) */}
      {/* ========================================================================= */}
      {activeModal === 'secret_key_reward' && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-pop">
          {rewardPhase === 'floating_key' && (
            <div className="bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative text-white animate-pop">
              <div
                onClick={handleInspectFloatingKey}
                className="w-32 h-32 mx-auto mb-4 rounded-full bg-[#002447] border-2 border-[#ADEFD1] flex items-center justify-center shadow-[0_0_30px_rgba(173,239,209,0.35)] cursor-pointer hover:scale-105 transition-transform animate-bounce-slow"
              >
                <CrystalBronzeBookKeySvg className="w-24 h-24" />
              </div>

              <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">
                BẠN ĐÃ NHẬN ĐƯỢC CHÌA KHÓA BÍ MẬT SỐ 4!
              </h3>
              <p className="text-xs text-[#FFFFE3]/90 leading-relaxed mb-6">
                Một chiếc chìa khóa pha lê vàng đồng từ đáy Hộp Thời Gian bay lên cùng mảnh giấy cổ phát sáng!
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
                rewardPhase === 'collecting' ? 'scale-90 opacity-40 translate-y-12' : 'animate-pop'
              }`}
            >
              <div className="w-28 h-28 mx-auto mb-3 rounded-full bg-[#002447] border-2 border-[#ADEFD1] flex items-center justify-center shadow-[0_0_25px_rgba(173,239,209,0.3)]">
                <CrystalBronzeBookKeySvg className="w-20 h-20" />
              </div>

              <h3 className="text-xl font-black text-white uppercase tracking-wider mb-1">
                CHÌA KHÓA BÍ MẬT SỐ 4
              </h3>
              <p className="text-[11px] font-bold text-[#ADEFD1] uppercase tracking-widest mb-4">
                ✦ GỢI Ý THỨ TƯ (MANH MỐI 4/5) ✦
              </p>

              <div className="bg-[#002447] text-white p-4 rounded-2xl border border-[#ADEFD1]/50 shadow-inner mb-5 text-left">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#ADEFD1] uppercase mb-1.5">
                  <span>📜</span>
                  <span>LỜI GỢI Ý TỪ PHÒNG KÝ ỨC</span>
                </div>
                <p className="text-xs sm:text-sm font-bold leading-relaxed text-[#FFFFE3]">
                  “Học sinh thể hiện tinh thần 'kính thầy, yêu bạn' qua việc lễ phép với thầy cô, chăm chú nghe giảng, đoàn kết và sẵn sàng giúp đỡ bạn bè. Kính trọng thầy cô, yêu thương bạn bè để mỗi ngày đến trường đều đong đầy niềm vui và những điều tốt đẹp nhé!”
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
