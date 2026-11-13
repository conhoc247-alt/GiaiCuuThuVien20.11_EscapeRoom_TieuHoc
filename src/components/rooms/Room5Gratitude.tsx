import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Lock,
  BookOpen,
  Check,
  ChevronUp,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { StoryPanel } from '../StoryPanel';
import { LumiSpeech } from '../LumiSpeech';
import { CrystalBronzeBookKeySvg } from '../InventoryModal';

interface Room5GratitudeProps {
  task1Done: boolean;
  task2Done: boolean;
  onCompleteTask1: (score: number) => void;
  onCompleteTask2: (score: number) => void;
  onSaveCard?: (card: any) => void;
  onOpenLumiHint: (hintText: string) => void;
  onOpenHeartModal: () => void;
}

const ROOM5_BG =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%205.%20PH%C3%92NG%20TRI%20%C3%82N%20%E2%80%93%20M%E1%BA%ACT%20M%C3%83%20CU%E1%BB%90I%20C%C3%99NG/PH%C3%92NG%205.%20PH%C3%92NG%20TRI%20%C3%82N%20%E2%80%93%20M%E1%BA%ACT%20M%C3%83%20CU%E1%BB%90I%20C%C3%99NG.png';

const HOTSPOT_BOOK_IMG =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%205.%20PH%C3%92NG%20TRI%20%C3%82N%20%E2%80%93%20M%E1%BA%ACT%20M%C3%83%20CU%E1%BB%90I%20C%C3%99NG/CU%E1%BB%90N%20S%E1%BB%94%20TRI%20TH%E1%BB%A8C.png';

const HOTSPOT_TREE_IMG =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%205.%20PH%C3%92NG%20TRI%20%C3%82N%20%E2%80%93%20M%E1%BA%ACT%20M%C3%83%20CU%E1%BB%90I%20C%C3%99NG/C%C3%82Y%20TRI%20%C3%82N.png';

const HEART_IMG =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%205.%20PH%C3%92NG%20TRI%20%C3%82N%20%E2%80%93%20M%E1%BA%ACT%20M%C3%83%20CU%E1%BB%90I%20C%C3%99NG/TR%C3%81I%20TIM%20TH%C6%AF%20VI%E1%BB%86N.png';

const WOODEN_DESK_BG =
  'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/NHI%E1%BB%86M%20V%E1%BB%A4/C%C3%A1i%20b%C3%A0n.png';

// 1. LỜI DẪN VÀO PHÒNG TRI ÂN (Không in nghiêng, không có ngoặc kép)
const NARRATOR_PARAGRAPHS = [
  'Cánh cửa cuối cùng chậm rãi mở ra… Một đại sảnh rực rỡ hiện lên giữa những tia sáng vàng huyền ảo. Thế nhưng, Trái Tim Thư Viện vẫn đang bị phong ấn, ánh sáng bên trong ngày một yếu dần!',
  'Hành trình giải cứu đã đến hồi quyết định. Liệu bạn có thể vượt qua những thử thách cuối cùng và đánh thức Trái Tim Thư Viện?',
];

// 2. LỜI THOẠI NGƯỜI GÁC THƯ VIỆN – DẪN VÀO NHIỆM VỤ 1
const LUMI_DIALOGUE_PARAGRAPHS = [
  'Cuối cùng, cậu đã đến được Phòng Tri Ân! Trái Tim Thư Viện đang ở ngay trước mắt, nhưng sức mạnh của nó vẫn bị phong ấn.',
  'Hãy bắt đầu với Cuốn Sổ Tri Thức, vượt qua năm thử thách để khôi phục những bài học quý giá mà thầy cô đã truyền dạy nhé!',
];

// 3. LỜI THOẠI LUMI – SAU KHI HOÀN THÀNH NHIỆM VỤ 1
const LUMI_AFTER_TASK1_PARAGRAPHS = [
  'Tuyệt vời! Năm trang tri thức đã được khôi phục và phong ấn của Trái Tim Thư Viện đang yếu dần!',
  'Nhưng chúng ta vẫn cần đánh thức sức mạnh của lòng biết ơn. Nhìn kìa, Cây Tri Ân đang phát sáng!',
  'Hãy nhấp vào cây để tiếp tục thử thách cuối cùng nhé!',
];

// 4. LỜI THOẠI LUMI – DẪN VÀO GIẢI MÃ CUỐI CÙNG
const LUMI_BEFORE_HEART_PARAGRAPHS = [
  'Chúng ta đã thu thập đủ năm chìa khóa bí mật rồi!',
  'Mỗi chìa khóa đều chứa một lời gợi ý về truyền thống tốt đẹp của dân tộc Việt Nam. Hãy kết nối những manh mối ấy để tìm ra câu thành ngữ gồm bốn tiếng và giải phong ấn Trái Tim Thư Viện nhé!',
];

const TASK1_PAGES = [
  {
    title: 'Trang 1: Ý nghĩa của người thầy',
    situation:
      'Một học sinh cho rằng ngày nay có thể tìm thấy kiến thức trên Internet nên vai trò của thầy cô không còn quan trọng.',
    question: 'Câu 1: Nhận định nào sau đây phù hợp nhất?',
  },
  {
    title: 'Trang 2: Bài học về sự tôn trọng',
    situation:
      'Trong giờ học, thầy giáo đang giải thích một vấn đề mới. Một số học sinh có ý kiến khác với cách giải thích của thầy.',
    question: 'Câu 2: Hãy xác định các nhận định sau là Đúng hay Sai:',
  },
  {
    title: 'Trang 3: Truyền thống hiếu học',
    situation:
      'Trong Cuốn Sổ Tri Thức có ghi lại một câu tục ngữ quen thuộc của dân tộc Việt Nam khuyên nhủ con người luôn ghi nhớ công ơn dạy dỗ của người thầy.',
    question: 'Câu 3: Điền từ thích hợp vào chỗ trống để hoàn chỉnh câu tục ngữ:',
  },
  {
    title: 'Trang 4: Giá trị của việc học',
    situation:
      'Trong buổi sinh hoạt lớp, các bạn học sinh cùng nhau thảo luận về mục đích và ý nghĩa thực sự của việc học tập mỗi ngày.',
    question: 'Câu 4: Những ý kiến nào sau đây phù hợp? (Chọn tất cả đáp án đúng)',
  },
  {
    title: 'Trang 5: Tiếp nối lời dạy',
    situation:
      'Thầy cô luôn hướng dẫn học sinh không chỉ ghi nhớ kiến thức trong sách vở mà còn biết vận dụng điều đã học vào thực tế cuộc sống.',
    question: 'Câu 5: Sắp xếp các hành động theo trình tự học tập hợp lý:',
  },
];

const TASK2_LEAVES = [
  {
    title: 'Bông hoa 1: Khi thầy cô mắc sai sót',
    situation:
      'Trong giờ học, cô giáo vô tình viết sai một phép tính trên bảng. An nhận ra lỗi sai và muốn góp ý với cô.',
    question: 'Câu 1: Theo em, An nên làm gì?',
  },
  {
    title: 'Bông hoa 2: Ứng xử trên không gian mạng',
    situation:
      'Trong nhóm chat của lớp, một số bạn chia sẻ hình ảnh chế giễu giáo viên và rủ mọi người bình luận cho vui.',
    question: 'Câu 2: Nếu chứng kiến tình huống này, em nên làm gì? (Chọn tất cả đáp án đúng)',
  },
  {
    title: 'Bông hoa 3: Một lời xin lỗi chân thành',
    situation:
      'Trong giờ học, Bình mải nói chuyện khiến cả lớp mất tập trung. Khi được cô giáo nhắc nhở, Bình nhận ra hành động của mình chưa đúng.',
    question: 'Câu 3: Sắp xếp các hành động theo trình tự hợp lý nhất để Bình sửa lỗi:',
  },
  {
    title: 'Bông hoa 4: Giúp đỡ bạn cùng tiến bộ',
    situation:
      'Linh học khá môn Toán. Một bạn trong lớp nhờ Linh giúp đỡ vì chưa hiểu bài. Linh muốn làm theo lời thầy cô dạy về tinh thần chia sẻ.',
    question: 'Câu 4: Hãy xác định các nhận định sau là Đúng hay Sai:',
  },
  {
    title: 'Bông hoa 5: Lời tri ân sau nhiều năm',
    situation:
      'Nhiều năm sau khi rời ghế nhà trường, một cựu học sinh trở thành người có ích cho cộng đồng và muốn thể hiện lòng biết ơn thầy cô.',
    question: 'Câu 5: Hành động nào thể hiện đầy đủ nhất tinh thần tri ân?',
  },
];

interface R5ShuffledOption {
  key: string;
  text: string;
  displayLetter: string;
}

const shuffleR5Options = (items: { key: string; text: string }[]): R5ShuffledOption[] => {
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

const R5_T1_Q1_RAW = [
  { key: 'A', text: 'Thầy cô chỉ có nhiệm vụ cung cấp kiến thức trong sách giáo khoa.' },
  { key: 'B', text: 'Internet có thể thay thế hoàn toàn vai trò của thầy cô.' },
  { key: 'C', text: 'Thầy cô không chỉ truyền đạt kiến thức mà còn hướng dẫn phương pháp học tập và bồi dưỡng nhân cách.' },
  { key: 'D', text: 'Học sinh chỉ cần học thuộc các câu trả lời có sẵn trên mạng.' },
];

const R5_T1_Q4_RAW = [
  { key: 'A', text: 'Học để mở rộng hiểu biết và phát triển năng lực bản thân.' },
  { key: 'B', text: 'Học chỉ để đạt điểm cao hơn các bạn khác.' },
  { key: 'C', text: 'Học để biết vận dụng kiến thức giải quyết vấn đề trong cuộc sống.' },
  { key: 'D', text: 'Học để rèn luyện tư duy, trách nhiệm và khả năng tự học.' },
];

const R5_T2_Q1_RAW = [
  { key: 'A', text: 'Cười lớn và nói với cả lớp rằng cô đã giảng sai.' },
  { key: 'B', text: 'Im lặng dù lỗi sai có thể khiến các bạn hiểu nhầm.' },
  { key: 'C', text: 'Lễ phép xin phép phát biểu, trình bày điều mình nhận thấy và trao đổi với cô.' },
  { key: 'D', text: 'Chụp ảnh lỗi sai để đăng lên mạng chế giễu cô.' },
];

const R5_T2_Q2_RAW = [
  { key: 'A', text: 'Không chia sẻ hoặc tham gia chế giễu.' },
  { key: 'B', text: 'Khuyên các bạn dừng lại và tôn trọng hình ảnh của giáo viên.' },
  { key: 'C', text: 'Chuyển hình ảnh sang các nhóm khác để nhiều người cùng xem.' },
  { key: 'D', text: 'Khi cần thiết, báo với giáo viên hoặc người lớn đáng tin cậy để được hỗ trợ xử lý.' },
];

const R5_T2_Q5_RAW = [
  { key: 'A', text: 'Chỉ nhắc đến thầy cô khi có dịp nhận giải thưởng.' },
  { key: 'B', text: 'Chỉ gửi quà vào ngày 20/11, không cần quan tâm đến những lời dạy trước đây.' },
  { key: 'C', text: 'Cho rằng những thành công của mình hoàn toàn không liên quan đến sự hướng dẫn của thầy cô.' },
  { key: 'D', text: 'Giữ gìn những điều tốt đẹp đã được dạy, tiếp tục học hỏi, sống có trách nhiệm và quan tâm đến thầy cô bằng những cách phù hợp.' },
];

export const Room5Gratitude: React.FC<Room5GratitudeProps> = ({
  task1Done,
  task2Done,
  onCompleteTask1,
  onCompleteTask2,
  onOpenHeartModal,
}) => {
  // Dialogue state synchronized with Rooms 1, 2, 3, 4
  const [dialoguePhase, setDialoguePhase] = useState<
    'narrator' | 'lumi' | 'lumi_after_task1' | 'lumi_before_heart' | 'explore'
  >(() => {
    if (task1Done && task2Done) return 'lumi_before_heart';
    if (task1Done) return 'lumi_after_task1';
    return 'narrator';
  });

  const isRoomInteractive = dialoguePhase !== 'narrator' && dialoguePhase !== 'lumi';

  // Active Modals
  const [activeModal, setActiveModal] = useState<
    'task1_notebook' | 'task2_tree' | 'task2_locked_notice' | 'secret_key_reward' | null
  >(null);

  // Task 1: 5 Questions in Cuốn Sổ Tri Thức (Requires >= 70% i.e. 4/5 correct)
  const [t1ActivePage, setT1ActivePage] = useState<number>(0); // 0 to 4
  const [t1SolvedPages, setT1SolvedPages] = useState<number[]>(() => (task1Done ? [0, 1, 2, 3, 4] : []));
  const [t1Results, setT1Results] = useState<Record<number, boolean>>(
    task1Done ? { 0: true, 1: true, 2: true, 3: true, 4: true } : ({} as Record<number, boolean>)
  );
  const [task1Passed, setTask1Passed] = useState<boolean>(task1Done);

  // Task 1 Question States
  const [q1Options, setQ1Options] = useState<R5ShuffledOption[]>(() => shuffleR5Options(R5_T1_Q1_RAW));
  const [q1Selected, setQ1Selected] = useState<string | null>(null);
  const [q1Feedback, setQ1Feedback] = useState<string | null>(null);

  const [q2Answers, setQ2Answers] = useState<Record<number, boolean | null>>({ 1: null, 2: null, 3: null, 4: null });
  const [q2Feedback, setQ2Feedback] = useState<string | null>(null);

  const [q3Input, setQ3Input] = useState<string>('');
  const [q3Feedback, setQ3Feedback] = useState<string | null>(null);

  const [q4Options, setQ4Options] = useState<R5ShuffledOption[]>(() => shuffleR5Options(R5_T1_Q4_RAW));
  const [q4Selected, setQ4Selected] = useState<string[]>([]);
  const [q4Feedback, setQ4Feedback] = useState<string | null>(null);

  const [q5Order, setQ5Order] = useState<number[]>([1, 2, 3, 4]);
  const [q5Feedback, setQ5Feedback] = useState<string | null>(null);

  // Task 2: 5 Situations in Cây Tri Ân (Requires >= 70% i.e. 4/5 correct)
  const [t2ActiveLeaf, setT2ActiveLeaf] = useState<number>(0); // 0 to 4
  const [t2SolvedLeaves, setT2SolvedLeaves] = useState<number[]>(() => (task2Done ? [0, 1, 2, 3, 4] : []));
  const [t2Results, setT2Results] = useState<Record<number, boolean>>(
    task2Done ? { 0: true, 1: true, 2: true, 3: true, 4: true } : ({} as Record<number, boolean>)
  );
  const [task2Passed, setTask2Passed] = useState<boolean>(task2Done);

  // Task 2 Question States
  const [t2q1Options, setT2q1Options] = useState<R5ShuffledOption[]>(() => shuffleR5Options(R5_T2_Q1_RAW));
  const [t2q1Selected, setT2q1Selected] = useState<string | null>(null);
  const [t2q1Feedback, setT2q1Feedback] = useState<string | null>(null);

  const [t2q2Options, setT2q2Options] = useState<R5ShuffledOption[]>(() => shuffleR5Options(R5_T2_Q2_RAW));
  const [t2q2Selected, setT2q2Selected] = useState<string[]>([]);
  const [t2q2Feedback, setT2q2Feedback] = useState<string | null>(null);

  const [t2q3Order, setT2q3Order] = useState<number[]>([1, 2, 3, 4]);
  const [t2q3Feedback, setT2q3Feedback] = useState<string | null>(null);

  const [t2q4Answers, setT2q4Answers] = useState<Record<number, boolean | null>>({ 1: null, 2: null, 3: null, 4: null });
  const [t2q4Feedback, setT2q4Feedback] = useState<string | null>(null);

  const [t2q5Options, setT2q5Options] = useState<R5ShuffledOption[]>(() => shuffleR5Options(R5_T2_Q5_RAW));
  const [t2q5Selected, setT2q5Selected] = useState<string | null>(null);
  const [t2q5Feedback, setT2q5Feedback] = useState<string | null>(null);

  // Secret Key Reward Sequence
  const [rewardPhase, setRewardPhase] = useState<'floating_key' | 'clue_scroll' | 'collecting'>('floating_key');

  // 3D Book Page Flip Refs (shared by active book modal)
  const flipPageRef = useRef<SVGPathElement | null>(null);
  const flipShadowRef = useRef<SVGPathElement | null>(null);
  const flipHighlightRef = useRef<SVGPathElement | null>(null);
  const isFlippingRef = useRef<boolean>(false);

  const renderFlipAt = (t: number) => {
    const flipPage = flipPageRef.current;
    const flipShadow = flipShadowRef.current;
    const flipHighlight = flipHighlightRef.current;
    if (!flipPage || !flipShadow || !flipHighlight) return;

    if (t <= 0.001 || t >= 0.999) {
      flipPage.setAttribute('opacity', '0');
      flipShadow.setAttribute('opacity', '0');
      flipHighlight.setAttribute('opacity', '0');
      return;
    }

    const SPINE_X = 600;
    const SPINE_TOP_Y = 132;
    const SPINE_BOT_Y = 624;
    const theta = t * Math.PI;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);

    const outerTopX = SPINE_X + 465 * cosT;
    const outerBotX = SPINE_X + 486 * cosT;
    const outerTopY = 114 - 75 * sinT;
    const outerBotY = 592 - 92 * sinT;

    const cp1X = SPINE_X + (outerTopX - SPINE_X) * 0.36;
    const cp2X = SPINE_X + (outerTopX - SPINE_X) * 0.78;
    const cp1Y = 82 - 88 * sinT;
    const cp2Y = 86 - 95 * sinT;

    const bcp2X = SPINE_X + (outerBotX - SPINE_X) * 0.36;
    const bcp1X = SPINE_X + (outerBotX - SPINE_X) * 0.78;
    const bcp1Y = 568 - 76 * sinT;
    const bcp2Y = 572 - 70 * sinT;

    const dPage = [
      `M ${SPINE_X},${SPINE_TOP_Y}`,
      `C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${outerTopX},${outerTopY}`,
      `L ${outerBotX},${outerBotY}`,
      `C ${bcp1X},${bcp1Y} ${bcp2X},${bcp2Y} ${SPINE_X},${SPINE_BOT_Y}`,
      'Z',
    ].join(' ');

    flipPage.setAttribute('d', dPage);
    flipPage.setAttribute('opacity', '1');
    flipPage.setAttribute('fill', t < 0.5 ? 'url(#r5-flip-page-grad)' : 'url(#r5-flip-back-grad)');

    const shadowOffset = 28 * sinT * (t < 0.5 ? 1 : -1);
    const dShadow = [
      `M ${SPINE_X},${SPINE_TOP_Y + 8}`,
      `C ${cp1X},${cp1Y + 26} ${cp2X},${cp2Y + 30} ${outerTopX + shadowOffset},${outerTopY + 28}`,
      `L ${outerBotX + shadowOffset},${outerBotY + 24}`,
      `C ${bcp1X},${bcp1Y + 22} ${bcp2X},${bcp2Y + 18} ${SPINE_X},${SPINE_BOT_Y + 6}`,
      'Z',
    ].join(' ');

    flipShadow.setAttribute('d', dShadow);
    flipShadow.setAttribute('opacity', (0.38 * sinT).toFixed(3));

    const crestXTop = SPINE_X + (outerTopX - SPINE_X) * 0.52;
    const crestYTop = cp1Y * 0.5 + cp2Y * 0.5 + 14;
    const crestXBot = SPINE_X + (outerBotX - SPINE_X) * 0.52;
    const crestYBot = bcp1Y * 0.5 + bcp2Y * 0.5 + 12;

    flipHighlight.setAttribute('d', `M ${crestXTop},${crestYTop} L ${crestXBot},${crestYBot}`);
    flipHighlight.setAttribute('opacity', (0.55 * sinT).toFixed(3));
  };

  const animatePageFlip = (direction: 'next' | 'prev', onMidFlip: () => void) => {
    if (isFlippingRef.current) {
      onMidFlip();
      return;
    }
    soundManager.playClick();
    isFlippingRef.current = true;
    const duration = 560;
    const startTime = performance.now();
    let switched = false;

    const easeInOutCubic = (x: number) =>
      x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

    const step = (now: number) => {
      const raw = Math.min((now - startTime) / duration, 1);
      const eased = easeInOutCubic(raw);
      const t = direction === 'next' ? eased : 1 - eased;
      renderFlipAt(t);

      if (!switched && raw >= 0.5) {
        switched = true;
        onMidFlip();
      }

      if (raw < 1) {
        requestAnimationFrame(step);
      } else {
        renderFlipAt(0);
        isFlippingRef.current = false;
      }
    };

    requestAnimationFrame(step);
  };

  const flipToT1Page = (targetPage: number) => {
    if (targetPage === t1ActivePage) return;
    animatePageFlip(targetPage > t1ActivePage ? 'next' : 'prev', () => {
      setT1ActivePage(targetPage);
    });
  };

  const flipToT2Leaf = (targetLeaf: number) => {
    if (targetLeaf === t2ActiveLeaf) return;
    animatePageFlip(targetLeaf > t2ActiveLeaf ? 'next' : 'prev', () => {
      setT2ActiveLeaf(targetLeaf);
    });
  };

  // Sync completion
  useEffect(() => {
    if (task1Done) {
      setTask1Passed(true);
      setT1SolvedPages([0, 1, 2, 3, 4]);
      setT1Results({ 0: true, 1: true, 2: true, 3: true, 4: true });
    }
  }, [task1Done]);

  useEffect(() => {
    if (task2Done) {
      setTask2Passed(true);
      setT2SolvedLeaves([0, 1, 2, 3, 4]);
      setT2Results({ 0: true, 1: true, 2: true, 3: true, 4: true });
    }
  }, [task2Done]);

  // Preload Room 5 images on mount for instant display
  useEffect(() => {
    [ROOM5_BG, HOTSPOT_BOOK_IMG, HOTSPOT_TREE_IMG, HEART_IMG].forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  // Record page answer & complete Task 1
  const recordT1Answer = (pageIdx: number, isCorrect: boolean) => {
    const nextResults = { ...t1Results, [pageIdx]: isCorrect };
    setT1Results(nextResults);
    if (isCorrect && !t1SolvedPages.includes(pageIdx)) {
      setT1SolvedPages((prev) => [...prev, pageIdx]);
    }
    const answeredCount = Object.keys(nextResults).length;
    const correctCount = Object.values(nextResults).filter(Boolean).length;
    if (answeredCount === 5) {
      window.parent.postMessage(
        {
          answerTrue: correctCount, // Cái này là câu trả lời đúng
          totalQuestion: 5, // Cái này là số câu hỏi
          command: 'submit_result', //Không được đổi
        },
        '*'
      );
      soundManager.playVictory();
      setTask1Passed(true);
      setT1SolvedPages([0, 1, 2, 3, 4]);
    }
  };

  const handleRetryTask1 = () => {
    soundManager.playClick();
    setT1ActivePage(0);
    setT1SolvedPages([]);
    setT1Results({});
    setTask1Passed(false);
    setQ1Options(shuffleR5Options(R5_T1_Q1_RAW));
    setQ1Selected(null);
    setQ1Feedback(null);
    setQ2Answers({ 1: null, 2: null, 3: null, 4: null });
    setQ2Feedback(null);
    setQ3Input('');
    setQ3Feedback(null);
    setQ4Options(shuffleR5Options(R5_T1_Q4_RAW));
    setQ4Selected([]);
    setQ4Feedback(null);
    setQ5Order([1, 2, 3, 4]);
    setQ5Feedback(null);
  };

  // Record leaf answer & complete Task 2
  const recordT2Answer = (leafIdx: number, isCorrect: boolean) => {
    const nextResults = { ...t2Results, [leafIdx]: isCorrect };
    setT2Results(nextResults);
    if (isCorrect && !t2SolvedLeaves.includes(leafIdx)) {
      setT2SolvedLeaves((prev) => [...prev, leafIdx]);
    }
    const answeredCount = Object.keys(nextResults).length;
    const correctCount = Object.values(nextResults).filter(Boolean).length;
    if (answeredCount === 5) {
      window.parent.postMessage(
        {
          answerTrue: correctCount, // Cái này là câu trả lời đúng
          totalQuestion: 5, // Cái này là số câu hỏi
          command: 'submit_result', //Không được đổi
        },
        '*'
      );
      soundManager.playVictory();
      setTask2Passed(true);
      setT2SolvedLeaves([0, 1, 2, 3, 4]);
    }
  };

  const handleRetryTask2 = () => {
    soundManager.playClick();
    setT2ActiveLeaf(0);
    setT2SolvedLeaves([]);
    setT2Results({});
    setTask2Passed(false);
    setT2q1Options(shuffleR5Options(R5_T2_Q1_RAW));
    setT2q1Selected(null);
    setT2q1Feedback(null);
    setT2q2Options(shuffleR5Options(R5_T2_Q2_RAW));
    setT2q2Selected([]);
    setT2q2Feedback(null);
    setT2q3Order([1, 2, 3, 4]);
    setT2q3Feedback(null);
    setT2q4Answers({ 1: null, 2: null, 3: null, 4: null });
    setT2q4Feedback(null);
    setT2q5Options(shuffleR5Options(R5_T2_Q5_RAW));
    setT2q5Selected(null);
    setT2q5Feedback(null);
  };

  // Quick Test Task 1
  const handleQuickTestTask1 = () => {
    soundManager.playVictory();
    setT1SolvedPages([0, 1, 2, 3, 4]);
    setT1Results({ 0: true, 1: true, 2: true, 3: true, 4: true });
    setQ1Selected('C');
    setQ2Answers({ 1: true, 2: false, 3: true, 4: false });
    setQ3Input('nên');
    setQ4Selected(['A', 'C', 'D']);
    setQ5Order([2, 4, 1, 3]);
    setTask1Passed(true);
  };

  // Quick Test Task 2
  const handleQuickTestTask2 = () => {
    soundManager.playVictory();
    setT2SolvedLeaves([0, 1, 2, 3, 4]);
    setT2Results({ 0: true, 1: true, 2: true, 3: true, 4: true });
    setT2q1Selected('C');
    setT2q2Selected(['A', 'B', 'D']);
    setT2q3Order([2, 4, 1, 3]);
    setT2q4Answers({ 1: true, 2: false, 3: true, 4: false });
    setT2q5Selected('D');
    setTask2Passed(true);
  };

  // Manual close Task 1 modal handler
  const handleCloseTask1Modal = () => {
    soundManager.playClick();
    if (task1Passed && !task1Done) {
      onCompleteTask1(100);
      setDialoguePhase('lumi_after_task1');
    }
    setActiveModal(null);
  };

  // Manual close Task 2 modal handler
  const handleCloseTask2Modal = () => {
    soundManager.playClick();
    if (task2Passed && !task2Done) {
      setRewardPhase('floating_key');
      setActiveModal('secret_key_reward');
    } else {
      setActiveModal(null);
    }
  };

  // Verification Handlers Task 1
  const verifyQ1 = () => {
    if (!q1Selected) return;
    const correctLetter = q1Options.find((o) => o.key === 'C')?.displayLetter || 'C';
    if (q1Selected === 'C') {
      soundManager.playCorrect();
      soundManager.playSparkle();
      setQ1Feedback('Chính xác! Thầy cô hướng dẫn phương pháp học tập và bồi dưỡng nhân cách.');
      recordT1Answer(0, true);
    } else {
      soundManager.playWrong();
      setQ1Feedback(`Chưa chính xác! Đáp án đúng là ${correctLetter}.`);
      recordT1Answer(0, false);
    }
  };

  const verifyQ2 = () => {
    const isCorrect =
      q2Answers[1] === true &&
      q2Answers[2] === false &&
      q2Answers[3] === true &&
      q2Answers[4] === false;

    if (isCorrect) {
      soundManager.playCorrect();
      soundManager.playSparkle();
      setQ2Feedback('Xuất sắc! Học sinh có thể trao đổi, phản biện một cách lịch sự, có căn cứ.');
      recordT1Answer(1, true);
    } else {
      soundManager.playWrong();
      setQ2Feedback('Chưa đúng hoàn toàn! Đáp án đúng: 1-Đúng, 2-Sai, 3-Đúng, 4-Sai.');
      recordT1Answer(1, false);
    }
  };

  const verifyQ3 = () => {
    const clean = q3Input.trim().toLowerCase();
    if (!clean) return;
    if (clean === 'nên' || clean === 'nen') {
      soundManager.playCorrect();
      soundManager.playSparkle();
      setQ3Feedback('Chính xác! “Không thầy đố mày làm nên”. Trang sách phát sáng!');
      recordT1Answer(2, true);
    } else {
      soundManager.playWrong();
      setQ3Feedback('Chưa chính xác! Từ còn thiếu là “nên”.');
      recordT1Answer(2, false);
    }
  };

  const verifyQ4 = () => {
    const correctLetters = q4Options
      .filter((o) => ['A', 'C', 'D'].includes(o.key))
      .map((o) => o.displayLetter)
      .join(', ');
    const isCorrect =
      q4Selected.length === 3 &&
      q4Selected.includes('A') &&
      q4Selected.includes('C') &&
      q4Selected.includes('D');

    if (isCorrect) {
      soundManager.playCorrect();
      soundManager.playSparkle();
      setQ4Feedback('Chính xác! Học để mở rộng hiểu biết, vận dụng vào cuộc sống và rèn luyện tư duy.');
      recordT1Answer(3, true);
    } else {
      soundManager.playWrong();
      setQ4Feedback(`Chưa đúng! Đáp án đúng là ${correctLetters}.`);
      recordT1Answer(3, false);
    }
  };

  const verifyQ5 = () => {
    if (q5Order[0] === 2 && q5Order[1] === 4 && q5Order[2] === 1 && q5Order[3] === 3) {
      soundManager.playCorrect();
      soundManager.playSparkle();
      setQ5Feedback('Chính xác! Trình tự học tập: Tìm hiểu → Luyện tập → Vận dụng → Chia sẻ.');
      recordT1Answer(4, true);
    } else {
      soundManager.playWrong();
      setQ5Feedback('Chưa đúng trình tự! Trình tự đúng: Tìm hiểu → Luyện tập → Vận dụng → Chia sẻ.');
      recordT1Answer(4, false);
    }
  };

  // Verification Handlers Task 2
  const verifyT2Q1 = () => {
    if (!t2q1Selected) return;
    const correctLetter = t2q1Options.find((o) => o.key === 'C')?.displayLetter || 'C';
    if (t2q1Selected === 'C') {
      soundManager.playCorrect();
      soundManager.playSparkle();
      setT2q1Feedback('Chính xác! Lễ phép xin phép phát biểu và trao đổi lịch sự với cô.');
      recordT2Answer(0, true);
    } else {
      soundManager.playWrong();
      setT2q1Feedback(`Chưa đúng! Đáp án đúng là ${correctLetter}.`);
      recordT2Answer(0, false);
    }
  };

  const verifyT2Q2 = () => {
    const correctLetters = t2q2Options
      .filter((o) => ['A', 'B', 'D'].includes(o.key))
      .map((o) => o.displayLetter)
      .join(', ');
    const isCorrect =
      t2q2Selected.length === 3 &&
      t2q2Selected.includes('A') &&
      t2q2Selected.includes('B') &&
      t2q2Selected.includes('D');

    if (isCorrect) {
      soundManager.playCorrect();
      soundManager.playSparkle();
      setT2q2Feedback('Xuất sắc! Không tham gia chế giễu, khuyên bạn dừng lại và báo giáo viên hỗ trợ.');
      recordT2Answer(1, true);
    } else {
      soundManager.playWrong();
      setT2q2Feedback(`Chưa đúng! Đáp án đúng là ${correctLetters}.`);
      recordT2Answer(1, false);
    }
  };

  const verifyT2Q3 = () => {
    if (t2q3Order[0] === 2 && t2q3Order[1] === 4 && t2q3Order[2] === 1 && t2q3Order[3] === 3) {
      soundManager.playCorrect();
      soundManager.playSparkle();
      setT2q3Feedback('Chính xác! Trình tự xin lỗi: Nhận lỗi → Xin lỗi → Sửa hành vi → Duy trì thay đổi.');
      recordT2Answer(2, true);
    } else {
      soundManager.playWrong();
      setT2q3Feedback('Chưa đúng! Trình tự đúng: Nhận lỗi → Xin lỗi → Sửa hành vi → Duy trì thay đổi.');
      recordT2Answer(2, false);
    }
  };

  const verifyT2Q4 = () => {
    const isCorrect =
      t2q4Answers[1] === true &&
      t2q4Answers[2] === false &&
      t2q4Answers[3] === true &&
      t2q4Answers[4] === false;

    if (isCorrect) {
      soundManager.playCorrect();
      soundManager.playSparkle();
      setT2q4Feedback('Chính xác! Hướng dẫn bạn suy nghĩ và khuyến khích bạn tự làm bài.');
      recordT2Answer(3, true);
    } else {
      soundManager.playWrong();
      setT2q4Feedback('Chưa đúng! Đáp án đúng: 1-Đúng, 2-Sai, 3-Đúng, 4-Sai.');
      recordT2Answer(3, false);
    }
  };

  const verifyT2Q5 = () => {
    if (!t2q5Selected) return;
    const correctLetter = t2q5Options.find((o) => o.key === 'D')?.displayLetter || 'D';
    if (t2q5Selected === 'D') {
      soundManager.playCorrect();
      soundManager.playSparkle();
      setT2q5Feedback('Xuất sắc! Giữ gìn điều tốt đẹp đã học, sống có trách nhiệm và quan tâm thầy cô.');
      recordT2Answer(4, true);
    } else {
      soundManager.playWrong();
      setT2q5Feedback(`Chưa đúng! Đáp án đúng là ${correctLetter}.`);
      recordT2Answer(4, false);
    }
  };

  // Reorder helper
  const moveQ5 = (idx: number, dir: 'up' | 'down') => {
    const next = [...q5Order];
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= next.length) return;
    const temp = next[idx];
    next[idx] = next[target];
    next[target] = temp;
    setQ5Order(next);
    soundManager.playClick();
  };

  const moveT2Q3 = (idx: number, dir: 'up' | 'down') => {
    const next = [...t2q3Order];
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= next.length) return;
    const temp = next[idx];
    next[idx] = next[target];
    next[target] = temp;
    setT2q3Order(next);
    soundManager.playClick();
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
      setDialoguePhase('lumi_before_heart');
    }, 1600);
  };

  const isCurrentT1PageAnswered = t1ActivePage in t1Results || task1Passed;
  const isCurrentT1PageSolved = t1Results[t1ActivePage] === true || task1Passed;
  const t1AnsweredCount = Object.keys(t1Results).length;
  const t1CorrectCount = Object.values(t1Results).filter(Boolean).length;
  const t1AllAnswered = t1AnsweredCount === 5;
  const t1FailedThreshold = false;

  const isCurrentT2LeafAnswered = t2ActiveLeaf in t2Results || task2Passed;
  const isCurrentT2LeafSolved = t2Results[t2ActiveLeaf] === true || task2Passed;
  const t2AnsweredCount = Object.keys(t2Results).length;
  const t2CorrectCount = Object.values(t2Results).filter(Boolean).length;
  const t2AllAnswered = t2AnsweredCount === 5;
  const t2FailedThreshold = false;

  const renderOpenBookFrame = (leftContent: React.ReactNode, rightContent: React.ReactNode) => (
    <div
      className="relative flex-1 min-h-0 w-full overflow-y-auto custom-scrollbar sm:overflow-hidden rounded-2xl border-2 border-[#ADEFD1]/40 shadow-inner flex flex-col sm:items-center sm:justify-center p-2 sm:p-0"
      style={{
        backgroundImage: `url("${WOODEN_DESK_BG}")`,
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
          className="w-full h-full max-w-full max-h-full select-none relative z-10"
        >
        <defs>
          <filter id="r5-book-drop-shadow" x="-8%" y="-8%" width="116%" height="120%">
            <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#000000" floodOpacity="0.42" />
          </filter>
          <filter id="r5-flip-shadow-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <linearGradient id="r5-blue-cover-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1d439b" />
            <stop offset="25%" stopColor="#10296b" />
            <stop offset="50%" stopColor="#091845" />
            <stop offset="75%" stopColor="#10296b" />
            <stop offset="100%" stopColor="#071336" />
          </linearGradient>
          <linearGradient id="r5-blue-edge-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3c6be0" />
            <stop offset="50%" stopColor="#15327a" />
            <stop offset="100%" stopColor="#06102e" />
          </linearGradient>
          <linearGradient id="r5-red-lining-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#801111" />
            <stop offset="20%" stopColor="#c42121" />
            <stop offset="50%" stopColor="#5e0b0b" />
            <stop offset="80%" stopColor="#c42121" />
            <stop offset="100%" stopColor="#801111" />
          </linearGradient>
          <linearGradient id="r5-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff6b3" />
            <stop offset="22%" stopColor="#ffd24c" />
            <stop offset="50%" stopColor="#e09612" />
            <stop offset="78%" stopColor="#ffcf40" />
            <stop offset="100%" stopColor="#8c5100" />
          </linearGradient>
          <linearGradient id="r5-gold-rim-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffe885" />
            <stop offset="50%" stopColor="#d48806" />
            <stop offset="100%" stopColor="#784300" />
          </linearGradient>
          <linearGradient id="r5-page-block-left" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c49a68" />
            <stop offset="35%" stopColor="#e3c193" />
            <stop offset="70%" stopColor="#cfa674" />
            <stop offset="100%" stopColor="#f2dbb8" />
          </linearGradient>
          <linearGradient id="r5-page-block-right" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f2dbb8" />
            <stop offset="30%" stopColor="#cfa674" />
            <stop offset="65%" stopColor="#e3c193" />
            <stop offset="100%" stopColor="#c49a68" />
          </linearGradient>
          <linearGradient id="r5-page-block-bottom" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ecd2ad" />
            <stop offset="45%" stopColor="#d4af7d" />
            <stop offset="85%" stopColor="#b58952" />
            <stop offset="100%" stopColor="#8c6230" />
          </linearGradient>
          <linearGradient id="r5-left-page-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#edd3ad" />
            <stop offset="18%" stopColor="#f8e8cc" />
            <stop offset="65%" stopColor="#fdf4e3" />
            <stop offset="88%" stopColor="#efd7b4" />
            <stop offset="96%" stopColor="#d4b083" />
            <stop offset="100%" stopColor="#b08858" />
          </linearGradient>
          <linearGradient id="r5-right-page-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a88050" />
            <stop offset="4%" stopColor="#d1ad80" />
            <stop offset="12%" stopColor="#efd7b4" />
            <stop offset="35%" stopColor="#fdf4e3" />
            <stop offset="82%" stopColor="#f8e8cc" />
            <stop offset="100%" stopColor="#edd3ad" />
          </linearGradient>
          <linearGradient id="r5-flip-page-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d8b588" />
            <stop offset="20%" stopColor="#faf0dc" />
            <stop offset="55%" stopColor="#fff9ee" />
            <stop offset="85%" stopColor="#f2dec0" />
            <stop offset="100%" stopColor="#c9a16f" />
          </linearGradient>
          <linearGradient id="r5-flip-back-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c49c6b" />
            <stop offset="40%" stopColor="#f7e7cb" />
            <stop offset="75%" stopColor="#fff8eb" />
            <stop offset="100%" stopColor="#d1ab7a" />
          </linearGradient>
          <linearGradient id="r5-ribbon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff3b3b" />
            <stop offset="45%" stopColor="#d61515" />
            <stop offset="100%" stopColor="#7a0606" />
          </linearGradient>
          <g id="r5-corner-flourish">
            <path
              d="M 0,0 C 18,2 32,2 44,8 C 34,12 22,12 12,10 C 16,20 26,26 36,28 C 24,30 14,24 8,14 C 10,24 10,36 6,46 C 2,34 2,18 0,0 Z"
              fill="url(#r5-gold-grad)"
              opacity="0.85"
            />
            <circle cx="16" cy="16" r="2.5" fill="#c9830c" />
          </g>
        </defs>

        {/* TẦNG 1: BÌA SÁCH VÀ GÁY SÁCH */}
        <g filter="url(#r5-book-drop-shadow)">
          <path
            d="M 55,140 Q 62,115 90,115 L 560,132 Q 600,145 640,132 L 1110,115 Q 1138,115 1145,140 L 1168,625 Q 1172,658 1138,662 L 652,668 Q 600,692 548,668 L 62,662 Q 28,658 32,625 Z"
            fill="url(#r5-blue-cover-grad)"
            stroke="#050d26"
            strokeWidth="3"
          />
          <path
            d="M 32,625 Q 28,658 62,662 L 548,668 Q 600,692 652,668 L 1138,662 Q 1172,658 1168,625 L 1155,642 Q 1152,672 1125,675 L 654,680 Q 600,706 546,680 L 75,675 Q 48,672 45,642 Z"
            fill="url(#r5-blue-edge-highlight)"
            stroke="#040a1f"
            strokeWidth="2"
          />
          <path
            d="M 66,144 Q 72,126 95,126 L 558,140 Q 600,152 642,140 L 1105,126 Q 1128,126 1134,144 L 1154,618 Q 1156,645 1128,648 L 650,654 Q 600,676 550,654 L 72,648 Q 44,645 46,618 Z"
            fill="none"
            stroke="url(#r5-gold-rim-grad)"
            strokeWidth="2.5"
            opacity="0.85"
          />
          <path
            d="M 74,146 L 560,145 Q 600,156 640,145 L 1126,146 L 1144,622 L 648,638 Q 600,658 552,638 L 56,622 Z"
            fill="url(#r5-red-lining-grad)"
            stroke="#4a0606"
            strokeWidth="2"
          />
          <g>
            <path
              d="M 52,188 L 56,136 Q 59,110 86,110 L 138,113 L 132,135 L 92,134 Q 78,135 76,148 L 73,190 Z"
              fill="url(#r5-gold-grad)"
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
          <g transform="translate(1200, 0) scale(-1, 1)">
            <path
              d="M 52,188 L 56,136 Q 59,110 86,110 L 138,113 L 132,135 L 92,134 Q 78,135 76,148 L 73,190 Z"
              fill="url(#r5-gold-grad)"
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
          <g>
            <path
              d="M 35,576 L 30,632 Q 28,664 62,668 L 126,670 L 128,644 L 74,642 Q 56,640 57,622 L 60,578 Z"
              fill="url(#r5-gold-grad)"
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
          <g transform="translate(1200, 0) scale(-1, 1)">
            <path
              d="M 35,576 L 30,632 Q 28,664 62,668 L 126,670 L 128,644 L 74,642 Q 56,640 57,622 L 60,578 Z"
              fill="url(#r5-gold-grad)"
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
        <g>
          <path
            d="M 135,114 L 82,138 L 62,612 L 114,592 Z"
            fill="url(#r5-page-block-left)"
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
            fill="url(#r5-page-block-right)"
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
            fill="url(#r5-page-block-bottom)"
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
            fill="url(#r5-page-block-bottom)"
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
            fill="url(#r5-gold-grad)"
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
            fill="url(#r5-ribbon-grad)"
            stroke="#4f0303"
            strokeWidth="1.8"
          />
        </g>

        {/* TẦNG 3: HAI TRANG SÁCH MỞ */}
        <g>
          <path
            d="M 600,132 C 465,80 245,84 135,114 L 114,592 C 245,568 465,570 600,624 Z"
            fill="url(#r5-left-page-grad)"
            stroke="#c29b6b"
            strokeWidth="1.5"
          />
          <path
            d="M 600,132 C 735,80 955,84 1065,114 L 1086,592 C 955,568 735,570 600,624 Z"
            fill="url(#r5-right-page-grad)"
            stroke="#c29b6b"
            strokeWidth="1.5"
          />
          <use href="#r5-corner-flourish" transform="translate(148, 126) rotate(4)" />
          <use href="#r5-corner-flourish" transform="translate(128, 576) scale(1, -1) rotate(4)" />
          <use href="#r5-corner-flourish" transform="translate(1052, 126) scale(-1, 1) rotate(4)" />
          <use href="#r5-corner-flourish" transform="translate(1072, 576) scale(-1, -1) rotate(4)" />
          <path d="M 600,132 L 600,624" stroke="#7d572c" strokeWidth="2" opacity="0.65" />
        </g>

        {/* TẦNG 3.5: NỘI DUNG TRANG TRÁI VÀ TRANG PHẢI */}
        <foreignObject x="138" y="122" width="444" height="460">
          {leftContent}
        </foreignObject>
        <foreignObject x="618" y="122" width="444" height="460">
          {rightContent}
        </foreignObject>

        {/* TẦNG 4: LỚP TRANG LẬT 3D ĐỘNG */}
        <g pointerEvents="none">
          <path
            ref={flipShadowRef}
            d=""
            fill="#2b1804"
            opacity="0"
            filter="url(#r5-flip-shadow-blur)"
          />
          <path
            ref={flipPageRef}
            d=""
            fill="url(#r5-flip-page-grad)"
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
            filter="url(#r5-flip-shadow-blur)"
          />
        </g>
      </svg>
      </div>

      {/* MOBILE (ĐIỆN THOẠI): CHIỀU WIDTH NGANG VỚI KHUNG VÀ DÙNG THANH KÉO ĐỂ QUAN SÁT NỘI DUNG */}
      <div className="sm:hidden flex flex-col w-full space-y-3 z-10 my-1">
        <div className="w-full bg-[#fdf7ec] border-2 border-[#b88c56] rounded-2xl p-3 shadow-md text-[#2b1704]">
          {leftContent}
        </div>
        <div className="w-full bg-[#fdf7ec] border-2 border-[#b88c56] rounded-2xl p-3 shadow-md text-[#2b1704]">
          {rightContent}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-full min-h-full select-none flex flex-col justify-between p-2 md:p-4 text-[#FFFFE3] overflow-hidden">
      {/* ROOM 5 BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src={ROOM5_BG}
          alt="Phòng Tri Ân - Mật Mã Cuối Cùng"
          className="w-full h-full object-cover object-center filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001020]/80 via-transparent to-[#001020]/30 pointer-events-none" />
      </div>

      {/* 1. LỜI DẪN VÀO PHÒNG (StoryPanel) */}
      {!(task1Done && task2Done) && dialoguePhase === 'narrator' && (
        <StoryPanel
          title="BỐI CẢNH PHÒNG TRI ÂN"
          lines={NARRATOR_PARAGRAPHS}
          onComplete={() => setDialoguePhase('lumi')}
        />
      )}

      {/* 2. LỜI THOẠI NGƯỜI GÁC THƯ VIỆN – DẪN VÀO NHIỆM VỤ 1 */}
      {!(task1Done && task2Done) && dialoguePhase === 'lumi' && !activeModal && (
        <LumiSpeech
          key="lumi-room5-intro"
          lines={LUMI_DIALOGUE_PARAGRAPHS}
          onComplete={() => setDialoguePhase('explore')}
        />
      )}

      {/* 3. LỜI THOẠI LUMI – SAU KHI HOÀN THÀNH NHIỆM VỤ 1 */}
      {!(task1Done && task2Done) && dialoguePhase === 'lumi_after_task1' && !activeModal && (
        <LumiSpeech
          key="lumi-room5-after-task1"
          lines={LUMI_AFTER_TASK1_PARAGRAPHS}
          onComplete={() => setDialoguePhase('explore')}
        />
      )}

      {/* 4. LỜI THOẠI LUMI – DẪN VÀO GIẢI MÃ CUỐI CÙNG */}
      {dialoguePhase === 'lumi_before_heart' && !activeModal && (
        <LumiSpeech
          key="lumi-room5-before-heart"
          lines={LUMI_BEFORE_HEART_PARAGRAPHS}
          onComplete={() => setDialoguePhase('explore')}
        />
      )}

      {/* ========================================================================= */}
      {/* CENTRAL ROOM SCENE INTERACTIVE HOTSPOTS WITH SYNCHRONIZED ITEM TAGS */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full flex-1 max-w-7xl mx-auto px-4 flex items-end justify-between pb-6 sm:pb-10 pointer-events-none">
        {/* HOTSPOT 1: CUỐN SỔ TRI THỨC (LEFT SIDE - MOVED DOWN 2CM) */}
        <div
          style={{ marginBottom: '-2cm' }}
          className={`absolute left-[3%] sm:left-[6%] bottom-[10%] sm:bottom-[14%] w-[29%] sm:w-[28%] h-[42%] sm:h-[46%] pointer-events-auto flex flex-col items-center justify-end transition-all duration-300 ${
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
            setActiveModal('task1_notebook');
          }}
          title={
            !isRoomInteractive
              ? 'Hoàn thành lời dẫn và lời thoại của Lumi để mở khóa đồ vật'
              : 'Cuốn Sổ Tri Thức'
          }
        >
          <div className="relative flex-1 min-h-0 w-full flex items-center justify-center">
            <img
              src={HOTSPOT_BOOK_IMG}
              alt="Cuốn Sổ Tri Thức"
              className={`h-full w-auto max-w-full object-contain filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.95)] transition-all duration-300 ${
                task1Done || task1Passed
                  ? 'brightness-110 drop-shadow-[0_0_20px_#28a745]'
                  : isRoomInteractive
                  ? 'group-hover:brightness-120 animate-pulse'
                  : ''
              }`}
            />
          </div>

          {task1Done || task1Passed ? (
            <div className="mt-1 sm:mt-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#001c38] border border-emerald-400 text-emerald-300 font-black text-[10px] sm:text-xs md:text-sm shadow-md flex items-center gap-1.5 animate-pop whitespace-nowrap shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span>ĐÃ HOÀN THÀNH</span>
            </div>
          ) : (
            <span className="mt-1 sm:mt-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#001833]/90 border border-[#ADEFD1]/50 text-[#ADEFD1] font-black text-[10px] sm:text-xs md:text-sm shadow-lg whitespace-nowrap shrink-0">
              Cuốn Sổ Tri Thức
            </span>
          )}
        </div>

        {/* CENTER: TRÁI TIM THƯ VIỆN (PHONG ẤN / KÍCH HOẠT - Di chuyển xuống 0.7cm) */}
        <div
          style={{ transform: 'translateY(0.7cm)' }}
          className={`absolute left-[36%] sm:left-[37%] bottom-[18%] sm:bottom-[22%] w-[28%] sm:w-[26%] h-[46%] sm:h-[50%] pointer-events-auto flex flex-col items-center justify-end transition-all duration-300 ${
            !isRoomInteractive
              ? 'opacity-40 cursor-not-allowed filter grayscale pointer-events-none'
              : 'cursor-pointer group hover:scale-[1.03]'
          }`}
          onClick={() => {
            if (!isRoomInteractive) {
              soundManager.playWrong();
              return;
            }
            soundManager.playSparkle();
            onOpenHeartModal();
          }}
          title={
            !isRoomInteractive
              ? 'Hoàn thành lời dẫn và lời thoại của Lumi để mở khóa đồ vật'
              : 'Trái Tim Thư Viện'
          }
        >
          <div className="relative flex-1 min-h-0 w-full flex items-center justify-center">
            <img
              src={HEART_IMG}
              alt="Trái Tim Thư Viện"
              className="h-full w-auto max-w-full object-contain filter drop-shadow-[0_0_35px_rgba(255,215,0,0.8)] animate-pulse"
            />
            {!(task1Done && task2Done) && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#001833]/85 border-2 border-[#ADEFD1] flex items-center justify-center shadow-lg">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-[#ADEFD1]" />
                </div>
              </div>
            )}
          </div>

          <span className="mt-1 sm:mt-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#001833]/90 border border-[#ADEFD1]/50 text-[#ADEFD1] font-black text-[10px] sm:text-xs md:text-sm shadow-lg whitespace-nowrap shrink-0">
            Trái Tim Thư Viện
          </span>
        </div>

        {/* HOTSPOT 2: CÂY TRI ÂN (RIGHT SIDE - MOVED DOWN 2CM) */}
        <div
          style={{ marginBottom: '-2cm' }}
          className={`absolute right-[3%] sm:right-[6%] bottom-[10%] sm:bottom-[14%] w-[29%] sm:w-[28%] h-[44%] sm:h-[48%] pointer-events-auto flex flex-col items-center justify-end transition-all duration-300 ${
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
              setActiveModal('task2_locked_notice');
              return;
            }
            setActiveModal('task2_tree');
          }}
          title={
            !isRoomInteractive
              ? 'Hoàn thành lời dẫn và lời thoại của Lumi để mở khóa đồ vật'
              : !task1Done && !task1Passed
              ? 'Hoàn thành Cuốn Sổ Tri Thức trước để mở khóa Cây Tri Ân'
              : 'Cây Tri Ân'
          }
        >
          <div className="relative flex-1 min-h-0 w-full flex items-center justify-center">
            <img
              src={HOTSPOT_TREE_IMG}
              alt="Cây Tri Ân"
              className={`h-full w-auto max-w-full object-contain filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.95)] transition-all duration-300 ${
                task2Done || task2Passed
                  ? 'brightness-110 drop-shadow-[0_0_20px_#28a745]'
                  : task1Done || task1Passed
                  ? 'brightness-105 group-hover:brightness-120 animate-pulse'
                  : 'opacity-70 brightness-75'
              }`}
            />
          </div>

          {task2Done || task2Passed ? (
            <div className="mt-1 sm:mt-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#001c38] border border-emerald-400 text-emerald-300 font-black text-[10px] sm:text-xs md:text-sm shadow-md flex items-center gap-1.5 animate-pop whitespace-nowrap shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span>ĐÃ HOÀN THÀNH</span>
            </div>
          ) : (
            <span className="mt-1 sm:mt-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#001833]/90 border border-[#ADEFD1]/50 text-[#ADEFD1] font-black text-[10px] sm:text-xs md:text-sm shadow-lg whitespace-nowrap shrink-0">
              Cây Tri Ân
            </span>
          )}
        </div>
      </div>

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
              CÂY TRI ÂN ĐANG BỊ PHONG ẤN!
            </h3>
            <p className="text-xs text-[#FFFFE3]/90 leading-relaxed mb-5">
              Cậu cần hoàn thành <span className="font-bold text-[#ADEFD1]">Nhiệm vụ 1: Dấu Ấn Người Thầy</span> ở Cuốn Sổ Tri Thức bên trái trước khi đánh thức Cây Tri Ân nhé!
            </p>
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveModal('task1_notebook');
              }}
              className="w-full py-3 rounded-full bg-[#ADEFD1] text-[#00203F] font-black text-xs hover:bg-white transition-all shadow-md cursor-pointer uppercase tracking-wider"
            >
              MỞ CUỐN SỔ TRI THỨC NGAY
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TASK 1 MODAL: CUỐN SỔ TRI THỨC (TRÊN MẶT BÀN GỖ) */}
      {/* ========================================================================= */}
      {activeModal === 'task1_notebook' && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-1 sm:p-2 overflow-hidden animate-pop">
          <div className="relative w-full max-w-6xl bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl p-2 sm:p-3 shadow-2xl flex flex-col h-full max-h-[92vh] overflow-hidden text-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#ADEFD1]/30 pb-1.5 mb-1.5 shrink-0 px-1">
              <div className="min-w-0">
                <h3 className="text-xs sm:text-base font-black text-white uppercase truncate">
                  NHIỆM VỤ 1: DẤU ẤN NGƯỜI THẦY
                </h3>
                <p className="text-[10px] sm:text-xs text-[#ADEFD1] truncate">
                  Giải đáp 5 câu hỏi tri thức để khôi phục 5 trang sách vàng trong Cuốn Sổ Tri Thức!
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

            {/* Thanh tiến trình: 5 vòng tròn gắn số */}
            <div className="mb-1 bg-[#002447]/60 border border-[#ADEFD1]/30 rounded-2xl p-1.5 shrink-0">
              <div className="flex items-center justify-around gap-2">
                {[0, 1, 2, 3, 4].map((pIdx) => {
                  const isAnswered = pIdx in t1Results || task1Passed;
                  const isCorrect = t1Results[pIdx] === true || task1Passed;
                  const isActive = t1ActivePage === pIdx;
                  const circleStyle = isAnswered
                    ? isCorrect
                      ? 'bg-emerald-600 text-white border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                      : 'bg-rose-600 text-white border-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                    : 'bg-[#001833] text-[#ADEFD1] border-[#ADEFD1]/40';

                  return (
                    <button
                      key={pIdx}
                      onClick={() => flipToT1Page(pIdx)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-black text-xs transition-all flex items-center justify-center border cursor-pointer ${circleStyle} ${
                        isActive ? 'ring-2 ring-[#FFD700] scale-110' : 'opacity-90 hover:opacity-100'
                      }`}
                      title={`Trang ${pIdx + 1}`}
                    >
                      {pIdx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CUỐN SÁCH SVG MỞ ĐÔI VỚI HIỆU ỨNG LẬT TRANG 3D GIỐNG NHIỆM VỤ 1 PHÒNG 4 */}
            {renderOpenBookFrame(
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#2b1704] overflow-hidden select-none">
                <span className="text-[20px] font-bold text-[#5c3a18] tracking-wide mb-2">
                  Trang {t1ActivePage + 1}
                </span>
                <h4 className="text-[24px] font-black uppercase text-[#3d1e05] leading-snug tracking-wide max-w-[360px]">
                  {TASK1_PAGES[t1ActivePage].title.split(':')[1]?.trim() || TASK1_PAGES[t1ActivePage].title}
                </h4>
              </div>,
              <div className="w-full h-full flex flex-col justify-between p-2 text-[#2b1704] overflow-hidden select-none">
                <div className="flex-1 min-h-0 flex flex-col justify-start space-y-2 overflow-y-auto pr-0.5 custom-scrollbar">
                  {/* Tình huống & Câu hỏi */}
                  <div className="bg-[#efe0c2]/95 border border-[#8c622b]/50 rounded-xl p-3 shadow-xs shrink-0 space-y-1">
                    <p className="text-[13.5px] font-semibold text-[#2b1704] leading-snug">
                      {TASK1_PAGES[t1ActivePage].situation}
                    </p>
                    <h4 className="text-[14.5px] font-black text-[#3d1e05] leading-snug">
                      {TASK1_PAGES[t1ActivePage].question}
                    </h4>
                  </div>

                  {/* PAGE 1: ABCD */}
                  {t1ActivePage === 0 && (
                    <div className="space-y-2">
                      {q1Options.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => {
                            soundManager.playClick();
                            setQ1Selected(opt.key);
                            setQ1Feedback(null);
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left text-[13.5px] font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                            q1Selected === opt.key
                              ? 'bg-[#002447] border-[#001833] text-[#ADEFD1] shadow-md'
                              : 'bg-[#fff9eb]/95 hover:bg-[#f3e2be] border-[#8c622b]/45 text-[#2b1704]'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full font-black text-[12px] flex items-center justify-center shrink-0 ${
                              q1Selected === opt.key
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
                            isCurrentT1PageSolved
                              ? 'bg-emerald-900 border-emerald-400 text-emerald-100'
                              : 'bg-rose-900 border-rose-400 text-rose-100'
                          }`}
                        >
                          {q1Feedback}
                        </div>
                      )}
                    </div>
                  )}

                  {/* PAGE 2: Đúng / Sai */}
                  {t1ActivePage === 1 && (
                    <div className="space-y-1.5">
                      {[
                        { id: 1, text: '1. Học sinh có thể đặt câu hỏi để hiểu rõ hơn nội dung bài học.' },
                        { id: 2, text: '2. Tôn trọng thầy cô nghĩa là không bao giờ được có ý kiến khác.' },
                        { id: 3, text: '3. Khi có ý kiến khác, học sinh nên trình bày lịch sự và có căn cứ.' },
                        { id: 4, text: '4. Ngắt lời, chế giễu thầy cô là cách thể hiện sự tự tin.' },
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
                                setQ2Answers((prev) => ({ ...prev, [item.id]: true }));
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[12px] font-black cursor-pointer transition-all border ${
                                q2Answers[item.id] === true
                                  ? 'bg-emerald-700 border-emerald-400 text-white shadow-xs'
                                  : 'bg-[#e6d2aa] border-[#8c622b]/50 text-[#3d1e05]'
                              }`}
                            >
                              Đúng
                            </button>
                            <button
                              onClick={() => {
                                soundManager.playClick();
                                setQ2Answers((prev) => ({ ...prev, [item.id]: false }));
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[12px] font-black cursor-pointer transition-all border ${
                                q2Answers[item.id] === false
                                  ? 'bg-rose-700 border-rose-400 text-white shadow-xs'
                                  : 'bg-[#e6d2aa] border-[#8c622b]/50 text-[#3d1e05]'
                              }`}
                            >
                              Sai
                            </button>
                          </div>
                        </div>
                      ))}
                      {q2Feedback && (
                        <div
                          className={`p-2 rounded-xl border text-[12.5px] font-bold ${
                            isCurrentT1PageSolved
                              ? 'bg-emerald-900 border-emerald-400 text-emerald-100'
                              : 'bg-rose-900 border-rose-400 text-rose-100'
                          }`}
                        >
                          {q2Feedback}
                        </div>
                      )}
                    </div>
                  )}

                  {/* PAGE 3: Điền từ */}
                  {t1ActivePage === 2 && (
                    <div className="space-y-2.5">
                      <div className="p-3 bg-[#fff9eb]/95 rounded-xl border border-[#8c622b]/50 text-center space-y-2.5">
                        <p className="text-[15px] font-black text-[#3d1e05]">
                          “Không thầy đố mày làm <span className="text-[#8c5100] underline">......</span>”
                        </p>
                        <input
                          type="text"
                          value={q3Input}
                          onChange={(e) => setQ3Input(e.target.value)}
                          placeholder="Nhập từ còn thiếu..."
                          className="w-full max-w-xs p-2.5 bg-white border-2 border-[#5c3a18] rounded-xl text-center font-black text-base text-[#00203F] outline-none shadow-xs"
                        />
                      </div>
                      {q3Feedback && (
                        <div
                          className={`p-2 rounded-xl border text-[13px] font-bold ${
                            isCurrentT1PageSolved
                              ? 'bg-emerald-900 border-emerald-400 text-emerald-100'
                              : 'bg-rose-900 border-rose-400 text-rose-100'
                          }`}
                        >
                          {q3Feedback}
                        </div>
                      )}
                    </div>
                  )}

                  {/* PAGE 4: Chọn nhiều */}
                  {t1ActivePage === 3 && (
                    <div className="space-y-1.5">
                      {q4Options.map((opt) => {
                        const isSel = q4Selected.includes(opt.key);
                        return (
                          <button
                            key={opt.key}
                            onClick={() => {
                              soundManager.playClick();
                              if (isSel) {
                                setQ4Selected((prev) => prev.filter((k) => k !== opt.key));
                              } else {
                                setQ4Selected((prev) => [...prev, opt.key]);
                              }
                            }}
                            className={`w-full p-2 rounded-xl border text-left text-[13px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                              isSel
                                ? 'bg-[#002447] border-[#001833] text-[#ADEFD1] shadow-md'
                                : 'bg-[#fff9eb]/95 hover:bg-[#f3e2be] border-[#8c622b]/45 text-[#2b1704]'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                                isSel
                                  ? 'bg-[#ADEFD1] text-[#00203F] border-[#ADEFD1]'
                                  : 'border-[#8c622b] bg-[#e6d2aa]'
                              }`}
                            >
                              {isSel && <Check className="w-3.5 h-3.5" />}
                            </span>
                            <span className="leading-snug">{opt.displayLetter}. {opt.text}</span>
                          </button>
                        );
                      })}
                      {q4Feedback && (
                        <div
                          className={`p-2 rounded-xl border text-[12.5px] font-bold ${
                            isCurrentT1PageSolved
                              ? 'bg-emerald-900 border-emerald-400 text-emerald-100'
                              : 'bg-rose-900 border-rose-400 text-rose-100'
                          }`}
                        >
                          {q4Feedback}
                        </div>
                      )}
                    </div>
                  )}

                  {/* PAGE 5: Sắp xếp */}
                  {t1ActivePage === 4 && (
                    <div className="space-y-1.5">
                      {q5Order.map((stepNum, index) => {
                        const labels: Record<number, string> = {
                          1: 'Vận dụng kiến thức vào tình huống thực tế.',
                          2: 'Lắng nghe và tìm hiểu kiến thức.',
                          3: 'Chia sẻ, giúp đỡ người khác khi phù hợp.',
                          4: 'Tự luyện tập để hiểu sâu hơn.',
                        };
                        return (
                          <div
                            key={stepNum}
                            className="p-2 rounded-xl bg-[#fff9eb]/95 border border-[#8c622b]/45 flex items-center justify-between gap-2 text-[13px] font-bold text-[#2b1704]"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-full bg-[#5c3a18] text-[#f7ead0] font-black text-[12px] flex items-center justify-center shrink-0">
                                {index + 1}
                              </span>
                              <span className="leading-snug">{labels[stepNum]}</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                disabled={index === 0}
                                onClick={() => moveQ5(index, 'up')}
                                className="p-1 rounded bg-[#e6d2aa] border border-[#8c622b]/50 text-[#3d1e05] disabled:opacity-30 cursor-pointer"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                disabled={index === q5Order.length - 1}
                                onClick={() => moveQ5(index, 'down')}
                                className="p-1 rounded bg-[#e6d2aa] border border-[#8c622b]/50 text-[#3d1e05] disabled:opacity-30 cursor-pointer"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {q5Feedback && (
                        <div
                          className={`p-2 rounded-xl border text-[12.5px] font-bold ${
                            isCurrentT1PageSolved
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

                {/* Action Bar đáy trang phải */}
                <div className="pt-2 mt-1.5 border-t border-[#8c622b]/40 flex flex-col gap-1.5 shrink-0">
                  {t1FailedThreshold && (
                    <div className="p-1.5 rounded-lg bg-rose-900 border border-rose-400 text-[12px] font-black text-rose-100 text-center">
                      Bạn đạt {t1CorrectCount}/5 câu đúng (cần tối thiểu 70% - 4/5 câu đúng). Hãy nhấn Thử lại nhé!
                    </div>
                  )}
                  <div className="flex items-center justify-end gap-2">
                    {t1FailedThreshold ? (
                      <button
                        onClick={handleRetryTask1}
                        className="px-5 py-2 rounded-full bg-rose-700 text-white border border-rose-300 font-black text-[12.5px] hover:bg-rose-600 transition-all shadow-md cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <span>THỬ LẠI</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : !isCurrentT1PageAnswered ? (
                      <button
                        onClick={() => {
                          if (t1ActivePage === 0) verifyQ1();
                          else if (t1ActivePage === 1) verifyQ2();
                          else if (t1ActivePage === 2) verifyQ3();
                          else if (t1ActivePage === 3) verifyQ4();
                          else if (t1ActivePage === 4) verifyQ5();
                        }}
                        className="px-5 py-2 rounded-full bg-[#001833] text-[#ADEFD1] border border-[#ADEFD1] font-black text-[12.5px] hover:bg-[#002447] transition-all shadow-md cursor-pointer uppercase tracking-wider"
                      >
                        KIỂM TRA ĐÁP ÁN
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (t1ActivePage < 4) {
                            flipToT1Page(t1ActivePage + 1);
                          } else if (task1Passed) {
                            handleCloseTask1Modal();
                          } else {
                            const nextUnanswered = [0, 1, 2, 3, 4].find((i) => !(i in t1Results));
                            if (nextUnanswered !== undefined) flipToT1Page(nextUnanswered);
                          }
                        }}
                        className="px-6 py-2 rounded-full bg-emerald-700 text-white border border-emerald-300 font-black text-[12.5px] hover:bg-emerald-600 transition-all shadow-md cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <span>{t1ActivePage === 4 && task1Passed ? 'HOÀN THÀNH' : 'TIẾP TỤC'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TASK 2 MODAL: CÂY TRI ÂN (TRÊN MẶT BÀN GỖ) */}
      {/* ========================================================================= */}
      {activeModal === 'task2_tree' && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-1 sm:p-2 overflow-hidden animate-pop">
          <div className="relative w-full max-w-6xl bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl p-2 sm:p-3 shadow-2xl flex flex-col h-full max-h-[92vh] overflow-hidden text-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#ADEFD1]/30 pb-1.5 mb-1.5 shrink-0 px-1">
              <div className="min-w-0">
                <h3 className="text-xs sm:text-base font-black text-white uppercase truncate">
                  NHIỆM VỤ 2: LỜI CẢM ƠN TỪ HÀNH ĐỘNG
                </h3>
                <p className="text-[10px] sm:text-xs text-[#ADEFD1] truncate">
                  Giải quyết 5 tình huống ứng xử để làm 5 bông hoa vàng trên Cây Tri Ân nở rộ!
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

            {/* Thanh tiến trình: 5 vòng tròn gắn số */}
            <div className="mb-1 bg-[#002447]/60 border border-[#ADEFD1]/30 rounded-2xl p-1.5 shrink-0">
              <div className="flex items-center justify-around gap-2">
                {[0, 1, 2, 3, 4].map((lIdx) => {
                  const isAnswered = lIdx in t2Results || task2Passed;
                  const isCorrect = t2Results[lIdx] === true || task2Passed;
                  const isActive = t2ActiveLeaf === lIdx;
                  const circleStyle = isAnswered
                    ? isCorrect
                      ? 'bg-emerald-600 text-white border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                      : 'bg-rose-600 text-white border-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                    : 'bg-[#001833] text-[#ADEFD1] border-[#ADEFD1]/40';

                  return (
                    <button
                      key={lIdx}
                      onClick={() => flipToT2Leaf(lIdx)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-black text-xs transition-all flex items-center justify-center border cursor-pointer ${circleStyle} ${
                        isActive ? 'ring-2 ring-[#FFD700] scale-110' : 'opacity-90 hover:opacity-100'
                      }`}
                      title={`Bông hoa ${lIdx + 1}`}
                    >
                      {lIdx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CUỐN SÁCH SVG MỞ ĐÔI VỚI HIỆU ỨNG LẬT TRANG 3D GIỐNG NHIỆM VỤ 1 PHÒNG 4 */}
            {renderOpenBookFrame(
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#2b1704] overflow-hidden select-none">
                <span className="text-[20px] font-bold text-[#5c3a18] tracking-wide mb-2">
                  Trang {t2ActiveLeaf + 1}
                </span>
                <h4 className="text-[24px] font-black uppercase text-[#3d1e05] leading-snug tracking-wide max-w-[360px]">
                  {TASK2_LEAVES[t2ActiveLeaf].title.split(':')[1]?.trim() || TASK2_LEAVES[t2ActiveLeaf].title}
                </h4>
              </div>,
              <div className="w-full h-full flex flex-col justify-between p-2 text-[#2b1704] overflow-hidden select-none">
                <div className="flex-1 min-h-0 flex flex-col justify-start space-y-2 overflow-y-auto pr-0.5 custom-scrollbar">
                  {/* Tình huống & Câu hỏi */}
                  <div className="bg-[#efe0c2]/95 border border-[#8c622b]/50 rounded-xl p-3 shadow-xs shrink-0 space-y-1">
                    <p className="text-[13.5px] font-semibold text-[#2b1704] leading-snug">
                      {TASK2_LEAVES[t2ActiveLeaf].situation}
                    </p>
                    <h4 className="text-[14.5px] font-black text-[#3d1e05] leading-snug">
                      {TASK2_LEAVES[t2ActiveLeaf].question}
                    </h4>
                  </div>

                  {/* LEAF 1: ABCD */}
                  {t2ActiveLeaf === 0 && (
                    <div className="space-y-2">
                      {t2q1Options.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => {
                            soundManager.playClick();
                            setT2q1Selected(opt.key);
                            setT2q1Feedback(null);
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left text-[13.5px] font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                            t2q1Selected === opt.key
                              ? 'bg-[#002447] border-[#001833] text-[#ADEFD1] shadow-md'
                              : 'bg-[#fff9eb]/95 hover:bg-[#f3e2be] border-[#8c622b]/45 text-[#2b1704]'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full font-black text-[12px] flex items-center justify-center shrink-0 ${
                              t2q1Selected === opt.key
                                ? 'bg-[#ADEFD1] text-[#00203F]'
                                : 'bg-[#5c3a18] text-[#f7ead0]'
                            }`}
                          >
                            {opt.displayLetter}
                          </span>
                          <span className="leading-snug">{opt.text}</span>
                        </button>
                      ))}
                      {t2q1Feedback && (
                        <div
                          className={`p-2 rounded-xl border text-[13px] font-bold ${
                            isCurrentT2LeafSolved
                              ? 'bg-emerald-900 border-emerald-400 text-emerald-100'
                              : 'bg-rose-900 border-rose-400 text-rose-100'
                          }`}
                        >
                          {t2q1Feedback}
                        </div>
                      )}
                    </div>
                  )}

                  {/* LEAF 2: Chọn nhiều */}
                  {t2ActiveLeaf === 1 && (
                    <div className="space-y-1.5">
                      {t2q2Options.map((opt) => {
                        const isSel = t2q2Selected.includes(opt.key);
                        return (
                          <button
                            key={opt.key}
                            onClick={() => {
                              soundManager.playClick();
                              if (isSel) {
                                setT2q2Selected((prev) => prev.filter((k) => k !== opt.key));
                              } else {
                                setT2q2Selected((prev) => [...prev, opt.key]);
                              }
                            }}
                            className={`w-full p-2 rounded-xl border text-left text-[13px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                              isSel
                                ? 'bg-[#002447] border-[#001833] text-[#ADEFD1] shadow-md'
                                : 'bg-[#fff9eb]/95 hover:bg-[#f3e2be] border-[#8c622b]/45 text-[#2b1704]'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                                isSel
                                  ? 'bg-[#ADEFD1] text-[#00203F] border-[#ADEFD1]'
                                  : 'border-[#8c622b] bg-[#e6d2aa]'
                              }`}
                            >
                              {isSel && <Check className="w-3.5 h-3.5" />}
                            </span>
                            <span className="leading-snug">{opt.displayLetter}. {opt.text}</span>
                          </button>
                        );
                      })}
                      {t2q2Feedback && (
                        <div
                          className={`p-2 rounded-xl border text-[12.5px] font-bold ${
                            isCurrentT2LeafSolved
                              ? 'bg-emerald-900 border-emerald-400 text-emerald-100'
                              : 'bg-rose-900 border-rose-400 text-rose-100'
                          }`}
                        >
                          {t2q2Feedback}
                        </div>
                      )}
                    </div>
                  )}

                  {/* LEAF 3: Sắp xếp */}
                  {t2ActiveLeaf === 2 && (
                    <div className="space-y-1.5">
                      {t2q3Order.map((stepNum, index) => {
                        const labels: Record<number, string> = {
                          1: 'Chú ý lắng nghe, không tiếp tục làm mất trật tự.',
                          2: 'Nhận ra hành động của mình đã ảnh hưởng đến tiết học.',
                          3: 'Duy trì ý thức học tập nghiêm túc trong những tiết học sau.',
                          4: 'Chân thành xin lỗi cô giáo và các bạn.',
                        };
                        return (
                          <div
                            key={stepNum}
                            className="p-2 rounded-xl bg-[#fff9eb]/95 border border-[#8c622b]/45 flex items-center justify-between gap-2 text-[13px] font-bold text-[#2b1704]"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-full bg-[#5c3a18] text-[#f7ead0] font-black text-[12px] flex items-center justify-center shrink-0">
                                {index + 1}
                              </span>
                              <span className="leading-snug">{labels[stepNum]}</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                disabled={index === 0}
                                onClick={() => moveT2Q3(index, 'up')}
                                className="p-1 rounded bg-[#e6d2aa] border border-[#8c622b]/50 text-[#3d1e05] disabled:opacity-30 cursor-pointer"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                disabled={index === t2q3Order.length - 1}
                                onClick={() => moveT2Q3(index, 'down')}
                                className="p-1 rounded bg-[#e6d2aa] border border-[#8c622b]/50 text-[#3d1e05] disabled:opacity-30 cursor-pointer"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {t2q3Feedback && (
                        <div
                          className={`p-2 rounded-xl border text-[12.5px] font-bold ${
                            isCurrentT2LeafSolved
                              ? 'bg-emerald-900 border-emerald-400 text-emerald-100'
                              : 'bg-rose-900 border-rose-400 text-rose-100'
                          }`}
                        >
                          {t2q3Feedback}
                        </div>
                      )}
                    </div>
                  )}

                  {/* LEAF 4: Đúng / Sai */}
                  {t2ActiveLeaf === 3 && (
                    <div className="space-y-1.5">
                      {[
                        { id: 1, text: '1. Linh nên hướng dẫn bạn cách suy nghĩ và tìm lời giải.' },
                        { id: 2, text: '2. Linh nên làm hộ toàn bộ bài tập để bạn có điểm cao.' },
                        { id: 3, text: '3. Linh có thể khuyến khích bạn tự làm và giải thích thêm khi cần.' },
                        { id: 4, text: '4. Linh nên chế giễu bạn vì chưa hiểu kiến thức.' },
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
                                setT2q4Answers((prev) => ({ ...prev, [item.id]: true }));
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[12px] font-black cursor-pointer transition-all border ${
                                t2q4Answers[item.id] === true
                                  ? 'bg-emerald-700 border-emerald-400 text-white shadow-xs'
                                  : 'bg-[#e6d2aa] border-[#8c622b]/50 text-[#3d1e05]'
                              }`}
                            >
                              Đúng
                            </button>
                            <button
                              onClick={() => {
                                soundManager.playClick();
                                setT2q4Answers((prev) => ({ ...prev, [item.id]: false }));
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[12px] font-black cursor-pointer transition-all border ${
                                t2q4Answers[item.id] === false
                                  ? 'bg-rose-700 border-rose-400 text-white shadow-xs'
                                  : 'bg-[#e6d2aa] border-[#8c622b]/50 text-[#3d1e05]'
                              }`}
                            >
                              Sai
                            </button>
                          </div>
                        </div>
                      ))}
                      {t2q4Feedback && (
                        <div
                          className={`p-2 rounded-xl border text-[12.5px] font-bold ${
                            isCurrentT2LeafSolved
                              ? 'bg-emerald-900 border-emerald-400 text-emerald-100'
                              : 'bg-rose-900 border-rose-400 text-rose-100'
                          }`}
                        >
                          {t2q4Feedback}
                        </div>
                      )}
                    </div>
                  )}

                  {/* LEAF 5: ABCD */}
                  {t2ActiveLeaf === 4 && (
                    <div className="space-y-1.5">
                      {t2q5Options.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => {
                            soundManager.playClick();
                            setT2q5Selected(opt.key);
                            setT2q5Feedback(null);
                          }}
                          className={`w-full p-2 rounded-xl border text-left text-[13px] font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                            t2q5Selected === opt.key
                              ? 'bg-[#002447] border-[#001833] text-[#ADEFD1] shadow-md'
                              : 'bg-[#fff9eb]/95 hover:bg-[#f3e2be] border-[#8c622b]/45 text-[#2b1704]'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full font-black text-[12px] flex items-center justify-center shrink-0 ${
                              t2q5Selected === opt.key
                                ? 'bg-[#ADEFD1] text-[#00203F]'
                                : 'bg-[#5c3a18] text-[#f7ead0]'
                            }`}
                          >
                            {opt.displayLetter}
                          </span>
                          <span className="leading-snug">{opt.text}</span>
                        </button>
                      ))}
                      {t2q5Feedback && (
                        <div
                          className={`p-2 rounded-xl border text-[12.5px] font-bold ${
                            isCurrentT2LeafSolved
                              ? 'bg-emerald-900 border-emerald-400 text-emerald-100'
                              : 'bg-rose-900 border-rose-400 text-rose-100'
                          }`}
                        >
                          {t2q5Feedback}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Bar đáy trang phải */}
                <div className="pt-2 mt-1.5 border-t border-[#8c622b]/40 flex flex-col gap-1.5 shrink-0">
                  {t2FailedThreshold && (
                    <div className="p-1.5 rounded-lg bg-rose-900 border border-rose-400 text-[12px] font-black text-rose-100 text-center">
                      Bạn đạt {t2CorrectCount}/5 tình huống đúng (cần tối thiểu 70% - 4/5 câu đúng). Hãy nhấn Thử lại nhé!
                    </div>
                  )}
                  <div className="flex items-center justify-end gap-2">
                    {t2FailedThreshold ? (
                      <button
                        onClick={handleRetryTask2}
                        className="px-5 py-2 rounded-full bg-rose-700 text-white border border-rose-300 font-black text-[12.5px] hover:bg-rose-600 transition-all shadow-md cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <span>THỬ LẠI</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : !isCurrentT2LeafAnswered ? (
                      <button
                        onClick={() => {
                          if (t2ActiveLeaf === 0) verifyT2Q1();
                          else if (t2ActiveLeaf === 1) verifyT2Q2();
                          else if (t2ActiveLeaf === 2) verifyT2Q3();
                          else if (t2ActiveLeaf === 3) verifyT2Q4();
                          else if (t2ActiveLeaf === 4) verifyT2Q5();
                        }}
                        className="px-5 py-2 rounded-full bg-[#001833] text-[#ADEFD1] border border-[#ADEFD1] font-black text-[12.5px] hover:bg-[#002447] transition-all shadow-md cursor-pointer uppercase tracking-wider"
                      >
                        KIỂM TRA ĐÁP ÁN
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (t2ActiveLeaf < 4) {
                            flipToT2Leaf(t2ActiveLeaf + 1);
                          } else if (task2Passed) {
                            handleCloseTask2Modal();
                          } else {
                            const nextUnanswered = [0, 1, 2, 3, 4].find((i) => !(i in t2Results));
                            if (nextUnanswered !== undefined) flipToT2Leaf(nextUnanswered);
                          }
                        }}
                        className="px-6 py-2 rounded-full bg-emerald-700 text-white border border-emerald-300 font-black text-[12.5px] hover:bg-emerald-600 transition-all shadow-md cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <span>{t2ActiveLeaf === 4 && task2Passed ? 'HOÀN THÀNH' : 'TIẾP TỤC'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECRET KEY 5 REWARD SEQUENCE (MANH MỐI 5/5 - ĐỒNG BỘ STYLE HÌNH 4 & TÚI ĐỒ) */}
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
                BẠN ĐÃ NHẬN ĐƯỢC CHÌA KHÓA BÍ MẬT SỐ 5!
              </h3>
              <p className="text-xs text-[#FFFFE3]/90 leading-relaxed mb-6">
                Một chiếc chìa khóa pha lê vàng đồng tỏa sáng từ Cây Tri Ân bay lên cùng mảnh giấy cổ phát sáng!
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
                CHÌA KHÓA BÍ MẬT SỐ 5
              </h3>
              <p className="text-[11px] font-bold text-[#ADEFD1] uppercase tracking-widest mb-4">
                ✦ GỢI Ý CUỐI CÙNG (MANH MỐI 5/5) ✦
              </p>

              <div className="bg-[#002447] text-white p-4 rounded-2xl border border-[#ADEFD1]/50 shadow-inner mb-5 text-left">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#ADEFD1] uppercase mb-1.5">
                  <span>📜</span>
                  <span>LỜI GỢI Ý TỪ PHÒNG TRI ÂN</span>
                </div>
                <p className="text-xs sm:text-sm font-bold leading-relaxed text-[#FFFFE3]">
                  “Học sinh cần giữ gìn cách chào hỏi, thưa gửi lễ phép với thầy cô vì đây là một trong những nếp sống văn minh và truyền thống tốt đẹp trong nhà trường. Mỗi lời chào lễ phép là một cách giản dị mà chân thành để bày tỏ lòng kính trọng với thầy cô.”
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
