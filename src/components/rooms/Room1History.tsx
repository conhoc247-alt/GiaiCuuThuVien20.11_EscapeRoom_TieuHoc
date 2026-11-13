import React, { useState } from 'react';
import { Sparkles, Key, ChevronRight, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ANCIENT_SCROLL_URL } from '../../utils/assets';
import { StoryPanel } from '../StoryPanel';
import { LumiSpeech } from '../LumiSpeech';

interface Room1HistoryProps {
  task1Done: boolean;
  task2Done: boolean;
  onCompleteTask1: (score: number) => void;
  onCompleteTask2: (score: number) => void;
  activeMode: 'explore' | 'practice';
  onNavigateToRoom2: () => void;
}

// 7 Mốc lịch sử chuẩn cho Nhiệm vụ 1
interface Milestone {
  id: string;
  order: number;
  time: string;
  yearShort: string;
  location: string;
  event: string;
  description: string;
}

const MILESTONES_7: Milestone[] = [
  {
    id: 's1',
    order: 1,
    time: 'Tháng 7/1946',
    yearShort: 'Tháng 7/1946',
    location: 'Paris, Pháp',
    event: 'Thành lập tổ chức quốc tế của các thầy cô (FISE)',
    description: 'Tại thủ đô Paris nước Pháp, các thầy cô giáo tiến bộ trên khắp thế giới đã họp mặt và cùng nhau thành lập tổ chức FISE.',
  },
  {
    id: 's2',
    order: 2,
    time: 'Năm 1949',
    yearShort: 'Năm 1949',
    location: 'Warszawa, Ba Lan',
    event: 'Ra đời bản Hiến chương 15 chương',
    description: 'Bản Hiến chương gồm 15 chương ý nghĩa được viết nên tại Ba Lan nhằm tôn vinh nghề dạy học và bảo vệ các thầy cô giáo.',
  },
  {
    id: 's3',
    order: 3,
    time: 'Mùa xuân 1953',
    yearShort: 'Mùa xuân 1953',
    location: 'Viên, Áo',
    event: 'Thầy cô Việt Nam bắt tay bạn bè thế giới',
    description: 'Công đoàn Giáo dục Việt Nam chính thức được kết nạp vào tổ chức quốc tế FISE trong sự chào đón nồng nhiệt của bạn bè năm châu.',
  },
  {
    id: 's4',
    order: 4,
    time: 'Tháng 8/1957',
    yearShort: 'Tháng 8/1957',
    location: 'Warszawa, Ba Lan',
    event: 'Hội nghị chọn ngày 20/11 làm ngày hội',
    description: 'Hội nghị với 57 quốc gia tham dự đã nhất trí chọn ngày 20/11/1958 là ngày hội tri ân các thầy cô giáo đầu tiên.',
  },
  {
    id: 's5',
    order: 5,
    time: 'Ngày 20/11/1958',
    yearShort: '20/11/1958',
    location: 'Trường học miền Bắc',
    event: 'Ngày hội 20/11 đầu tiên tại mái trường Việt Nam',
    description: 'Các bạn học sinh miền Bắc lần đầu tiên được hân hoan cài hoa và chúc mừng các thầy cô giáo nhân ngày 20/11.',
  },
  {
    id: 's6',
    order: 6,
    time: 'Ngày 28/09/1982',
    yearShort: '28/09/1982',
    location: 'Hà Nội',
    event: 'Ký quyết định mang tên "Ngày Nhà giáo Việt Nam"',
    description: 'Bác Võ Nguyên Giáp ký Quyết định số 167-HĐBT, chính thức lấy ngày 20/11 hằng năm làm Ngày Nhà giáo Việt Nam.',
  },
  {
    id: 's7',
    order: 7,
    time: 'Ngày 20/11/1982',
    yearShort: '20/11/1982',
    location: 'Hội trường Ba Đình, Hà Nội',
    event: 'Ngày hội tri ân tưng bừng khắp cả nước',
    description: 'Lễ kỷ niệm được tổ chức trang trọng tại Hội trường Ba Đình, học sinh cả nước cùng chung vui trong ngày hội lớn mang tên chính thức.',
  },
];

const shuffleMilestonesList = (arr: Milestone[]): Milestone[] => {
  const correct = ['s1', 's2', 's3', 's4', 's5', 's6', 's7'];
  let shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  if (shuffled.every((item, idx) => item.id === correct[idx])) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }
  return shuffled;
};

// 10 Câu hỏi tương ứng 10 Phong ấn trên văn bản cổ (Nhiệm vụ 2)
interface RawScrollQuestion {
  id: number;
  question: string;
  options: string[]; // text thuần không cố định tiền tố A, B, C, D
  correctText: string;
  explanation: string;
}

export interface ShuffledQuizQuestion {
  id: number;
  question: string;
  options: {
    letter: string;
    text: string;
    display: string;
    isCorrect: boolean;
  }[];
  correctIndex: number;
  explanation: string;
}

const RAW_QUIZ_QUESTIONS: RawScrollQuestion[] = [
  {
    id: 1,
    question:
      'Sự kiện đặt nền móng quốc tế đầu tiên cho hành trình dẫn tới ngày 20/11 là sự ra đời của Liên hiệp Quốc tế các Công đoàn Giáo dục (FISE). Sự kiện này diễn ra tại đâu và vào thời gian nào?',
    options: [
      'Tháng 7/1946 tại Paris (Pháp)',
      'Năm 1949 tại Warszawa (Ba Lan)',
      'Mùa xuân 1953 tại Viên (Áo)',
      'Tháng 8/1957 tại Warszawa (Ba Lan)',
    ],
    correctText: 'Tháng 7/1946 tại Paris (Pháp)',
    explanation:
      'Đáp án đúng: Tháng 7/1946, tổ chức FISE chính thức được thành lập tại thủ đô Paris (Pháp) nhằm bảo vệ quyền lợi và nâng cao vị thế của người thầy.',
  },
  {
    id: 2,
    question:
      'Năm 1949, tại Warszawa (Ba Lan), tổ chức FISE đã xây dựng bản "Hiến chương các nhà giáo" gồm bao nhiêu chương nhằm khẳng định vị trí của nghề dạy học và bảo vệ quyền lợi chính đáng của giáo viên?',
    options: ['10 chương', '12 chương', '15 chương', '20 chương'],
    correctText: '15 chương',
    explanation:
      'Đáp án đúng: Bản Hiến chương các nhà giáo gồm đúng 15 chương, đặt ra các nguyên tắc bảo vệ nghề dạy học và thúc đẩy nền giáo dục tiến bộ.',
  },
  {
    id: 3,
    question:
      'Mùa xuân năm 1953, đoàn đại biểu Việt Nam do ai dẫn đầu đã tham dự hội nghị tại Viên (Áo), đánh dấu việc Công đoàn Giáo dục Việt Nam chính thức kết nạp vào FISE?',
    options: [
      'Đại tướng Võ Nguyên Giáp',
      'Thứ trưởng Bộ Quốc gia Giáo dục Nguyễn Khánh Toàn',
      'Giáo sư Đặng Thai Mai',
      'Bộ trưởng Nguyễn Văn Huyên',
    ],
    correctText: 'Thứ trưởng Bộ Quốc gia Giáo dục Nguyễn Khánh Toàn',
    explanation:
      'Đáp án đúng: Đoàn đại biểu do Thứ trưởng Bộ Quốc gia Giáo dục Nguyễn Khánh Toàn dẫn đầu đã đưa giáo dục kháng chiến Việt Nam kết nối và hòa nhập với cộng đồng giáo dục tiến bộ thế giới.',
  },
  {
    id: 4,
    question:
      'Con số lịch sử 20/11 chính thức được hội nghị FISE tại Warszawa (Ba Lan) thống nhất lựa chọn làm "Ngày Quốc tế Hiến chương các nhà giáo" vào thời gian nào?',
    options: [
      'Tháng 7/1946',
      'Năm 1949',
      'Tháng 8/1957 (ngày 26–30/8/1957)',
      'Ngày 20/11/1958',
    ],
    correctText: 'Tháng 8/1957 (ngày 26–30/8/1957)',
    explanation:
      'Đáp án đúng: Từ ngày 26 đến 30/8/1957, đại biểu của 57 quốc gia (có Việt Nam tham dự) đã nhất trí chọn ngày 20/11/1958 làm ngày tổ chức đầu tiên của Ngày Quốc tế Hiến chương các nhà giáo.',
  },
  {
    id: 5,
    question:
      'Ngày 20/11 lần đầu tiên được tổ chức trang trọng tại các trường học ở Việt Nam là vào thời điểm nào?',
    options: [
      'Ngày 20/11/1957',
      'Ngày 20/11/1958 trên toàn miền Bắc',
      'Ngày 20/11/1975 sau khi đất nước thống nhất',
      'Ngày 20/11/1982 tại Hà Nội',
    ],
    correctText: 'Ngày 20/11/1958 trên toàn miền Bắc',
    explanation:
      'Đáp án đúng: Đúng ngày 20/11/1958, ngày hội nhà giáo lần đầu tiên được tổ chức trên toàn miền Bắc, sau đó tiếp tục được duy trì ở vùng giải phóng miền Nam.',
  },
  {
    id: 6,
    question:
      'Văn bản pháp lý nào của Nhà nước đã chính thức quyết định lấy ngày 20/11 hằng năm làm "Ngày Nhà giáo Việt Nam"?',
    options: [
      'Quyết định số 167-HĐBT ban hành ngày 28/9/1982',
      'Thông tư số 26-TT ban hành ngày 14/10/1982',
      'Hiến chương các nhà giáo ban hành năm 1949',
      'Nghị định giáo dục toàn quốc năm 1958',
    ],
    correctText: 'Quyết định số 167-HĐBT ban hành ngày 28/9/1982',
    explanation:
      'Đáp án đúng: Ngày 28/9/1982, Hội đồng Bộ trưởng ban hành Quyết định số 167-HĐBT (do Phó Chủ tịch Võ Nguyên Giáp ký), chính thức xác lập tên gọi "Ngày Nhà giáo Việt Nam".',
  },
  {
    id: 7,
    question:
      'Lễ kỷ niệm Ngày Nhà giáo Việt Nam lần đầu tiên được tổ chức trọng thể với tên gọi chính thức trên phạm vi toàn quốc diễn ra vào thời gian nào và tại địa điểm lịch sử nào?',
    options: [
      'Ngày 20/11/1958 tại Quảng trường Ba Đình',
      'Ngày 28/9/1982 tại Nhà hát Lớn Hà Nội',
      'Ngày 20/11/1982 tại Hội trường Ba Đình (Hà Nội)',
      'Ngày 20/11/1983 tại Dinh Độc Lập',
    ],
    correctText: 'Ngày 20/11/1982 tại Hội trường Ba Đình (Hà Nội)',
    explanation:
      'Đáp án đúng: Ngày 20/11/1982 là dấu mốc đầu tiên Ngày Nhà giáo Việt Nam được tổ chức thống nhất, mít tinh trọng thể tại Hội trường Ba Đình, khép lại hành trình 36 năm lịch sử (1946–1982).',
  },
  {
    id: 8,
    question:
      'Truyền thống văn hóa tốt đẹp nào của dân tộc Việt Nam luôn gắn liền mật thiết và được tôn vinh sâu sắc nhất trong Ngày Nhà giáo Việt Nam 20/11?',
    options: [
      'Tinh thần dũng cảm, kiên cường chống ngoại xâm',
      'Đạo lý "Tôn sư trọng đạo" gắn liền với truyền thống hiếu học',
      'Tinh thần tương thân tương ái, lá lành đùm lá rách',
      'Truyền thống cần cù, sáng tạo trong lao động sản xuất',
    ],
    correctText: 'Đạo lý "Tôn sư trọng đạo" gắn liền với truyền thống hiếu học',
    explanation:
      'Đáp án đúng: Từ bao đời nay, lòng kính trọng và biết ơn người thầy là truyền thống "tôn sư trọng đạo" trường tồn, trở thành nét đẹp tiêu biểu trong truyền thống hiếu học của người Việt.',
  },
  {
    id: 9,
    question:
      'Bên cạnh việc truyền thụ tri thức học thuật, sứ mệnh đặc biệt và cao quý nhất của người thầy đối với mỗi học sinh là gì?',
    options: [
      'Quyết định kết quả thi đua và các kỳ thi chuẩn hóa',
      'Mua sắm trang thiết bị và cơ sở vật chất học đường',
      'Nuôi dưỡng ước mơ, khơi dậy tiềm năng và bồi dưỡng nhân cách',
      'Lựa chọn và định hướng nghề nghiệp thay cho gia đình học sinh',
    ],
    correctText: 'Nuôi dưỡng ước mơ, khơi dậy tiềm năng và bồi dưỡng nhân cách',
    explanation:
      'Đáp án đúng: Người thầy không chỉ dạy chữ mà còn có sứ mệnh thiêng liêng là đánh thức tiềm năng, chắp cánh ước mơ và bồi dưỡng đạo đức, nhân cách toàn diện cho học trò.',
  },
  {
    id: 10,
    question:
      'Trong đời sống tinh thần của học sinh và xã hội, ngày 20/11 mang lại giá trị nhân văn bền vững nào sau đây?',
    options: [
      'Là cơ hội để học sinh được nghỉ ngơi dài ngày và giảm bớt bài tập',
      'Tạo ra các cuộc thi đua thành tích ngắn hạn giữa các trường học',
      'Là nhịp cầu kết nối các thế hệ học trò trở về tri ân thầy cô, giữ gìn và lan tỏa đạo lý kính trọng người thầy',
      'Là dịp duy nhất trong năm nhắc nhở học sinh cần tôn trọng thầy cô',
    ],
    correctText:
      'Là nhịp cầu kết nối các thế hệ học trò trở về tri ân thầy cô, giữ gìn và lan tỏa đạo lý kính trọng người thầy',
    explanation:
      'Đáp án đúng: Ngày 20/11 là dịp đặc biệt để các thế hệ học sinh có cơ hội trở về mái trường xưa thăm lại thầy cô, tiếp nối ngọn lửa tri ân và gắn kết tình thầy trò bền chặt qua thời gian.',
  },
];

const buildShuffledQuestions = (): ShuffledQuizQuestion[] => {
  const letters = ['A', 'B', 'C', 'D'];
  return RAW_QUIZ_QUESTIONS.map((q) => {
    const rawList = [...q.options];
    for (let i = rawList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rawList[i], rawList[j]] = [rawList[j], rawList[i]];
    }
    const options = rawList.map((text, idx) => ({
      letter: letters[idx],
      text,
      display: `${letters[idx]}. ${text}`,
      isCorrect: text === q.correctText,
    }));
    const correctIndex = options.findIndex((o) => o.isCorrect);
    return {
      id: q.id,
      question: q.question,
      options,
      correctIndex: correctIndex >= 0 ? correctIndex : 0,
      explanation: q.explanation,
    };
  });
};

// 1. Lời dẫn vào phòng (2 đoạn xuất hiện lần lượt trên StoryPanel kiểu Hình 1)
const NARRATOR_PARAGRAPHS = [
  'Cánh cửa cổ kính chậm rãi mở ra… Trước mắt bạn là một căn phòng bí ẩn, nơi chiếc đồng hồ khổng lồ đã ngừng chuyển động, những cuộn văn bản cổ bị phong ấn và các dấu mốc lịch sử biến mất một cách kỳ lạ!',
  'Không gian chìm trong tĩnh lặng, chỉ còn những tia sáng phép thuật le lói giữa các trang sử phủ bụi. Dường như thời gian đã ngừng trôi, che giấu một bí mật đang chờ được khám phá…',
];

// 2. Lời thoại Người Gác Thư Viện - Lumi (4 đoạn xuất hiện lần lượt trên LumiSpeech)
const LUMI_DIALOGUE_PARAGRAPHS = [
  'Chào mừng cậu đến với Phòng Lịch Sử!',
  'Ôi không! Những dấu mốc quan trọng về Ngày Nhà giáo Việt Nam đã bị xáo trộn, khiến dòng thời gian nơi đây ngừng chuyển động!',
  'Hãy cùng ta khám phá cuộn văn bản cổ, khôi phục các sự kiện lịch sử và giải mã bí mật trong chiếc rương kia nhé!',
  'Biết đâu, chìa khóa bí mật đầu tiên đang được cất giấu ở đó!',
];

// 3. Lời thoại của Lumi sau khi hoàn thành Nhiệm vụ 1
const LUMI_AFTER_TASK1_PARAGRAPHS = [
  'Giỏi lắm! Nhưng chúng ta vẫn chưa tìm thấy Mảnh Sáng Nguồn Cội. Hình như chiếc chìa khóa này có thể mở một vật gì đó trong căn phòng. Hãy thử tìm xem!',
];

/**
 * Biểu tượng Chìa Khóa Pha Lê Vàng Đồng có hình Cuốn Sách Cổ & Hoa Văn Ánh Sáng (Không khắc chữ cái)
 */
const CrystalBronzeBookKeySvg: React.FC<{ className?: string }> = ({ className = 'w-36 h-36' }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="crystal-aura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ADEFD1" stopOpacity="0.8" />
        <stop offset="60%" stopColor="#4FC3F7" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#00203F" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="bronze-gold-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFE3" />
        <stop offset="40%" stopColor="#ADEFD1" />
        <stop offset="80%" stopColor="#4FC3F7" />
        <stop offset="100%" stopColor="#00355E" />
      </linearGradient>
      <linearGradient id="crystal-gem" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#ADEFD1" />
        <stop offset="100%" stopColor="#4FC3F7" />
      </linearGradient>
      <filter id="key-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <circle cx="100" cy="100" r="88" fill="url(#crystal-aura)" />

    <g filter="url(#key-glow)">
      {/* Thân trục chìa khóa */}
      <rect x="93" y="88" width="14" height="86" rx="6" fill="url(#bronze-gold-body)" stroke="#FFFFE3" strokeWidth="1.5" />

      {/* Hoa văn ánh sáng */}
      <path d="M 100,94 L 100,168" stroke="#FFFFE3" strokeWidth="1.8" strokeDasharray="5 4" />
      <circle cx="100" cy="115" r="3" fill="#ffffff" />
      <circle cx="100" cy="135" r="3" fill="#ffffff" />
      <circle cx="100" cy="155" r="3" fill="#ffffff" />

      {/* Răng chìa khóa */}
      <path
        d="M 107,138 L 128,138 L 128,148 L 116,148 L 116,156 L 132,156 L 132,168 L 107,168 Z"
        fill="url(#bronze-gold-body)"
        stroke="#FFFFE3"
        strokeWidth="1.2"
      />

      {/* Đầu vòm chìa khóa */}
      <circle cx="100" cy="58" r="36" fill="#001833" stroke="url(#bronze-gold-body)" strokeWidth="5" />
      <circle cx="100" cy="58" r="29" fill="none" stroke="#ADEFD1" strokeWidth="1.2" strokeDasharray="4 3" />

      {/* 4 Cánh ngọc */}
      <polygon points="100,14 106,24 100,29 94,24" fill="url(#crystal-gem)" />
      <polygon points="144,58 134,64 129,58 134,52" fill="url(#crystal-gem)" />
      <polygon points="56,58 66,64 71,58 66,52" fill="url(#crystal-gem)" />

      {/* Cuốn sách cổ ở trung tâm */}
      <g transform="translate(100, 58)">
        <path
          d="M -18,-10 Q -9,-14 0,-8 L 0,12 Q -9,6 -18,10 Z"
          fill="url(#crystal-gem)"
          stroke="#FFFFE3"
          strokeWidth="1.5"
        />
        <path
          d="M 18,-10 Q 9,-14 0,-8 L 0,12 Q 9,6 18,10 Z"
          fill="url(#crystal-gem)"
          stroke="#FFFFE3"
          strokeWidth="1.5"
        />
        <line x1="0" y1="-9" x2="0" y2="12" stroke="#00203F" strokeWidth="2" />
        <line x1="-13" y1="-4" x2="-4" y2="-2" stroke="#00203F" strokeWidth="1.2" />
        <line x1="-13" y1="1" x2="-4" y2="3" stroke="#00203F" strokeWidth="1.2" />
        <line x1="4" y1="-2" x2="13" y2="-4" stroke="#00203F" strokeWidth="1.2" />
        <line x1="4" y1="3" x2="13" y2="1" stroke="#00203F" strokeWidth="1.2" />
      </g>
    </g>
  </svg>
);

export const Room1History: React.FC<Room1HistoryProps> = ({
  task1Done,
  task2Done,
  onCompleteTask1,
  onCompleteTask2,
  onNavigateToRoom2,
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
  const [modalState, setModalState] = useState<string | null>(null);

  // =========================================================================
  // NHIỆM VỤ 1: CUỘN THÁNH CHỈ VỚI 7 SỰ KIỆN LỊCH SỬ (KÉO THẢ / CHỌN GHÉP VÀO 7 MỐC)
  // =========================================================================
  const [scrollStep, setScrollStep] = useState<
    | 'step1_levitate'
    | 'step2_unroll'
    | 'step3_questions'
    | 'complete_lines'
    | 'complete_roll_close'
  >('step1_levitate');

  // 7 Ô trống tương ứng 7 mốc thời gian lịch sử
  const [matchedSlots7, setMatchedSlots7] = useState<Record<string, string | null>>({
    s1: null,
    s2: null,
    s3: null,
    s4: null,
    s5: null,
    s6: null,
    s7: null,
  });
  const [shuffledRightMilestones, setShuffledRightMilestones] = useState<Milestone[]>(() =>
    shuffleMilestonesList(MILESTONES_7)
  );
  const [draggedMilestoneId, setDraggedMilestoneId] = useState<string | null>(null);
  const [selectedRightMilestoneId, setSelectedRightMilestoneId] = useState<string | null>(null);
  const [task1Error, setTask1Error] = useState<string | null>(null);
  const [task1SuccessMsg, setTask1SuccessMsg] = useState<string | null>(null);
  const [task1Verified, setTask1Verified] = useState<boolean>(task1Done);
  const [task1Failed, setTask1Failed] = useState<boolean>(false);
  const [task1Checked, setTask1Checked] = useState<boolean>(false);
  const [glowingLineCount, setGlowingLineCount] = useState<number>(0);
  const [keyCollectingAnim, setKeyCollectingAnim] = useState<boolean>(false);

  const handleOpenScroll = () => {
    if (!isRoomInteractive) {
      soundManager.playWrong();
      return;
    }
    soundManager.playSparkle();
    setTask1Error(null);
    setTask1SuccessMsg(null);
    setTask1Checked(false);
    setSelectedRightMilestoneId(null);

    if (task1Done) {
      setMatchedSlots7({ s1: 's1', s2: 's2', s3: 's3', s4: 's4', s5: 's5', s6: 's6', s7: 's7' });
      setTask1Verified(true);
      setGlowingLineCount(7);
    } else {
      setMatchedSlots7({ s1: null, s2: null, s3: null, s4: null, s5: null, s6: null, s7: null });
      setShuffledRightMilestones(shuffleMilestonesList(MILESTONES_7));
      setTask1Verified(false);
      setTask1Failed(false);
      setGlowingLineCount(0);
    }

    setModalState('scroll_task1');
    setScrollStep('step1_levitate');

    setTimeout(() => {
      soundManager.playDoorTransition();
      setScrollStep('step2_unroll');
    }, 350);

    setTimeout(() => {
      soundManager.playClick();
      setScrollStep(task1Done ? 'complete_lines' : 'step3_questions');
    }, 1550);
  };

  const handleAssignMilestoneToSlot = (slotId: string, cardId: string) => {
    if (scrollStep !== 'step3_questions' || task1Verified) return;
    soundManager.playClick();
    setTask1Error(null);
    setTask1SuccessMsg(null);
    setTask1Checked(false);
    setTask1Failed(false);

    setMatchedSlots7((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (next[k] === cardId) next[k] = null;
      });
      next[slotId] = cardId;
      return next;
    });
    setSelectedRightMilestoneId(null);
    setDraggedMilestoneId(null);
  };

  const handleRemoveMilestoneFromSlot = (slotId: string) => {
    if (scrollStep !== 'step3_questions' || task1Verified) return;
    soundManager.playClick();
    setTask1Error(null);
    setTask1SuccessMsg(null);
    setTask1Checked(false);
    setTask1Failed(false);
    setMatchedSlots7((prev) => ({ ...prev, [slotId]: null }));
  };

  // Trình tự hoàn thành khi trả lời đúng 7/7 mốc
  const runTask1CompletionSequence = () => {
    setTask1Error(null);
    setTask1Failed(false);
    setTask1Verified(true);
    setTask1Checked(true);
    setTask1SuccessMsg('🎉 Xuất sắc! Bạn đã khôi phục chính xác toàn bộ 7 mốc lịch sử trên thánh chỉ!');
    soundManager.playCorrect();
    soundManager.playSparkle();

    setScrollStep('complete_lines');
    for (let i = 1; i <= 7; i++) {
      setTimeout(() => {
        soundManager.playSparkle();
        setGlowingLineCount(i);
      }, i * 160);
    }
  };

  // Cơ chế kiểm tra đúng sai rõ ràng cho Nhiệm vụ 1
  const verifyTask1Matching = () => {
    if (scrollStep !== 'step3_questions' || task1Verified) return;
    const filledCount = MILESTONES_7.filter((m) => matchedSlots7[m.id] !== null).length;
    if (filledCount < MILESTONES_7.length) {
      soundManager.playWrong();
      setTask1Error(`Vui lòng kéo hoặc chọn đủ cả 7 thẻ sự kiện vào 7 mốc thời gian trước khi kiểm tra (hiện mới có ${filledCount}/7 mốc)!`);
      return;
    }

    const correctMilestones = MILESTONES_7.filter((m) => matchedSlots7[m.id] === m.id);
    const correctCount = correctMilestones.length;
    setTask1Checked(true);

    if (correctCount === MILESTONES_7.length) {
      // Đúng toàn bộ 7/7
      window.parent.postMessage(
        {
          answerTrue: 7,
          totalQuestion: MILESTONES_7.length,
          command: 'submit_result',
        },
        '*'
      );
      runTask1CompletionSequence();
    } else {
      // Có mốc bị sai -> KHÔNG BÁO XANH HẾT, BÁO SAI RÕ RÀNG
      setTask1Verified(false);
      setTask1Failed(true);
      setTask1SuccessMsg(null);
      soundManager.playWrong();

      setTask1Error(
        `Kết quả: Bạn đã ghép đúng ${correctCount}/7 mốc. Các ô có viền đỏ (✕ Chưa đúng) đang bị đặt sai sự kiện. Hãy nhấp vào ô đỏ để đổi hoặc bấm "Gỡ các ô chưa đúng" để sắp xếp lại!`
      );

      window.parent.postMessage(
        {
          answerTrue: correctCount,
          totalQuestion: MILESTONES_7.length,
          command: 'submit_result',
        },
        '*'
      );
    }
  };

  // Chỉ gỡ những ô bị sai, giữ lại các ô đã đúng
  const handleClearWrongSlotsOnly = () => {
    soundManager.playClick();
    setMatchedSlots7((prev) => {
      const next = { ...prev };
      MILESTONES_7.forEach((m) => {
        if (next[m.id] !== m.id) {
          next[m.id] = null;
        }
      });
      return next;
    });
    setTask1Checked(false);
    setTask1Failed(false);
    setTask1Error(null);
    setTask1SuccessMsg(null);
  };

  const handleRetryTask1 = () => {
    soundManager.playClick();
    setMatchedSlots7({ s1: null, s2: null, s3: null, s4: null, s5: null, s6: null, s7: null });
    setShuffledRightMilestones(shuffleMilestonesList(MILESTONES_7));
    setSelectedRightMilestoneId(null);
    setDraggedMilestoneId(null);
    setTask1Checked(false);
    setTask1Failed(false);
    setTask1Error(null);
    setTask1SuccessMsg(null);
  };

  const handleQuickTestTask1 = () => {
    setMatchedSlots7({ s1: 's1', s2: 's2', s3: 's3', s4: 's4', s5: 's5', s6: 's6', s7: 's7' });
    runTask1CompletionSequence();
  };

  const handleClaimBronzeKey = () => {
    soundManager.playSparkle();
    setKeyCollectingAnim(true);
    setTimeout(() => {
      setKeyCollectingAnim(false);
      onCompleteTask1(100);
      setModalState(null);
      setDialoguePhase('lumi_after_task1');
    }, 900);
  };

  // =========================================================================
  // NHIỆM VỤ 2: 10 PHONG ẤN (VĂN BẢN CỔ CÓ TÍNH NĂNG XÁO TRỘN CÁC PHƯƠNG ÁN)
  // =========================================================================
  const [chestAnimPhase, setChestAnimPhase] = useState<'flying' | 'unlocking' | 'radiating'>('flying');
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [quizQuestions, setQuizQuestions] = useState<ShuffledQuizQuestion[]>(() =>
    buildShuffledQuestions()
  );

  // Lưu đáp án đã chọn cho từng câu hỏi (id câu hỏi 1..10 -> index đáp án 0..3)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>(() => {
    if (task2Done) {
      const initial: Record<number, number> = {};
      RAW_QUIZ_QUESTIONS.forEach((q) => {
        initial[q.id] = 0; // index placeholder
      });
      return initial;
    }
    return {};
  });

  const [rewardPhase, setRewardPhase] = useState<
    'seals_dissolving' | 'secret_compartment' | 'floating_key' | 'clue_scroll' | 'collecting'
  >('seals_dissolving');
  const [dissolvedSealCount, setDissolvedSealCount] = useState<number>(0);

  const handleOpenChestHotspot = () => {
    if (!isRoomInteractive) {
      soundManager.playWrong();
      return;
    }
    soundManager.playClick();
    if (!task1Done) {
      soundManager.playWrong();
      return;
    }
    if (task2Done) {
      // Mở lại bảng 10 câu hỏi để xem lại
      const completedMap: Record<number, number> = {};
      quizQuestions.forEach((q) => {
        completedMap[q.id] = q.correctIndex;
      });
      setQuizAnswers(completedMap);
      setCurrentQuizIndex(0);
      setModalState('quiz_task2');
      return;
    }
    setModalState('chest_prompt');
  };

  const handleConfirmOpenChest = () => {
    soundManager.playClick();
    setModalState('chest_unlock_anim');
    setChestAnimPhase('flying');
    soundManager.playDoorTransition();

    setTimeout(() => {
      setChestAnimPhase('unlocking');
      soundManager.playClick();
    }, 1400);

    setTimeout(() => {
      setChestAnimPhase('radiating');
      soundManager.playSparkle();
    }, 2800);

    setTimeout(() => {
      setCurrentQuizIndex(0);
      if (!task2Done) {
        setQuizAnswers({});
        setQuizQuestions(buildShuffledQuestions());
      }
      setModalState('quiz_task2');
    }, 4200);
  };

  // Mỗi câu chỉ được nhấn 1 lần duy nhất
  const handleSelectQuizOption = (optIndex: number) => {
    const q = quizQuestions[currentQuizIndex];
    if (quizAnswers[q.id] !== undefined) return;

    const nextAnswers = { ...quizAnswers, [q.id]: optIndex };
    setQuizAnswers(nextAnswers);

    if (optIndex === q.correctIndex) {
      soundManager.playCorrect();
      soundManager.playSparkle();
    } else {
      soundManager.playWrong();
    }

    if (Object.keys(nextAnswers).length === quizQuestions.length) {
      const correctCount = quizQuestions.filter((item) => nextAnswers[item.id] === item.correctIndex).length;
      window.parent.postMessage(
        {
          answerTrue: correctCount, // Cái này là câu trả lời đúng
          totalQuestion: quizQuestions.length, // 10 câu hỏi
          command: 'submit_result', //Không được đổi
        },
        '*'
      );
    }
  };

  const triggerSecretKeyRewardSequence = () => {
    soundManager.playSparkle();
    setModalState('secret_key_reward');
    setRewardPhase('seals_dissolving');
    setDissolvedSealCount(0);

    for (let i = 1; i <= 10; i++) {
      setTimeout(() => {
        setDissolvedSealCount(i);
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

  const handleContinueAfterExplanation = () => {
    soundManager.playClick();
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
    }
  };

  const handleQuickTestTask2 = () => {
    soundManager.playSparkle();
    const allCorrectMap: Record<number, number> = {};
    quizQuestions.forEach((q) => {
      allCorrectMap[q.id] = q.correctIndex;
    });
    setQuizAnswers(allCorrectMap);
    setCurrentQuizIndex(quizQuestions.length - 1);
  };

  const handleCloseQuizTask2Modal = () => {
    soundManager.playClick();
    const allAnswered = Object.keys(quizAnswers).length === quizQuestions.length;
    if (allAnswered && !task2Done) {
      triggerSecretKeyRewardSequence();
    } else {
      setModalState(null);
    }
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
      setModalState(null);
      setDialoguePhase('explore');
    }, 1800);
  };

  return (
    <div className="relative w-full h-full min-h-full overflow-hidden flex flex-col justify-between p-3 md:p-5 text-[#FFFFE3]">
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/Th%C6%B0%20vi%E1%BB%87n%20%C4%91%E1%BB%93ng%20h%E1%BB%93%20steampunk%20huy%E1%BB%81n%20%E1%BA%A3o.png"
          alt="Steampunk Library Background"
          className="w-full h-full object-cover object-center filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001020]/85 via-transparent to-[#001020]/40"></div>
      </div>

      {/* 1. LỜI DẪN VÀO PHÒNG (StoryPanel - Hộp thoại cổ điển viền vàng kim, nền xanh đậm) */}
      {!(task1Done && task2Done) && dialoguePhase === 'narrator' && (
        <StoryPanel
          title="BỐI CẢNH PHÒNG LỊCH SỬ"
          lines={NARRATOR_PARAGRAPHS}
          onComplete={() => setDialoguePhase('lumi')}
        />
      )}

      {/* 2. LỜI THOẠI CỦA LUMI ĐẦU PHÒNG (LumiSpeech - Trượt từ góc phải, bong bóng trên đầu, xong tự hủy) */}
      {!(task1Done && task2Done) && dialoguePhase === 'lumi' && !modalState && (
        <LumiSpeech
          key="lumi-intro"
          lines={LUMI_DIALOGUE_PARAGRAPHS}
          onComplete={() => setDialoguePhase('explore')}
        />
      )}

      {/* 3. LỜI THOẠI CỦA LUMI SAU KHI HOÀN THÀNH NHIỆM VỤ 1 */}
      {!(task1Done && task2Done) && dialoguePhase === 'lumi_after_task1' && !modalState && (
        <LumiSpeech
          key="lumi-after-task1"
          lines={LUMI_AFTER_TASK1_PARAGRAPHS}
          onComplete={() => setDialoguePhase('explore')}
        />
      )}

      {/* CENTRAL ROOM SCENE - RESPONSIVE ACROSS PHONE, IPAD, LAPTOP, TV */}
      <div className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 flex items-end justify-between pb-[clamp(2rem,10vh,5rem)] pointer-events-none">
        {/* HOTSPOT 1: CUỘN GIẤY THÁNH CHỈ */}
        <div
          onClick={handleOpenScroll}
          className={`absolute left-[10%] sm:left-[18%] md:left-[24%] bottom-[16%] sm:bottom-[20%] pointer-events-auto group flex flex-col items-center transition-all duration-300 ${
            !isRoomInteractive
              ? 'opacity-40 cursor-not-allowed filter grayscale pointer-events-none'
              : 'cursor-pointer hover:scale-110'
          } ${isRoomInteractive && !task1Done ? 'animate-pulse' : ''}`}
          title={
            !isRoomInteractive
              ? 'Hoàn thành lời dẫn và lời thoại của Lumi để mở khóa đồ vật'
              : 'Cuộn Giấy Thánh Chỉ'
          }
        >
          <div className="relative flex items-center justify-center p-1">
            <img
              src={ANCIENT_SCROLL_URL}
              alt="Cuộn Giấy Thánh Chỉ"
              className={`w-28 h-20 sm:w-36 sm:h-26 md:w-44 md:h-30 object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] transition-all ${
                task1Done
                  ? 'filter drop-shadow-[0_0_20px_#28a745]'
                  : 'group-hover:drop-shadow-[0_0_25px_#ADEFD1]'
              }`}
            />
          </div>
          {task1Done ? (
            <div className="mt-1 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#001c38] border border-emerald-400 text-emerald-300 font-black text-[10px] sm:text-xs md:text-sm shadow-md flex items-center gap-1.5 animate-pop whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span>ĐÃ HOÀN THÀNH</span>
            </div>
          ) : (
            <span className="mt-1 px-3 sm:px-3.5 py-1 rounded-full bg-[#001833]/90 border border-[#ADEFD1]/50 text-[#ADEFD1] font-black text-[10px] sm:text-xs shadow-lg whitespace-nowrap">
              Cuộn Giấy Thánh Chỉ
            </span>
          )}
        </div>

        {/* HOTSPOT 2: HỘP RƯƠNG CỔ */}
        <div
          onClick={handleOpenChestHotspot}
          className={`absolute right-[8%] sm:right-[12%] md:right-[14%] bottom-[8%] sm:bottom-[10%] pointer-events-auto group flex flex-col items-center transition-all duration-300 ${
            !isRoomInteractive
              ? 'opacity-40 cursor-not-allowed filter grayscale pointer-events-none'
              : 'cursor-pointer hover:scale-110'
          } ${isRoomInteractive && task1Done && !task2Done ? 'animate-pulse' : ''}`}
          title={
            !isRoomInteractive
              ? 'Hoàn thành lời dẫn và lời thoại của Lumi để mở khóa đồ vật'
              : !task1Done
              ? 'Hoàn thành Cuộn Giấy Thánh Chỉ trước để lấy Chìa Khóa Đồng Cổ'
              : 'Hộp Rương Cổ'
          }
        >
          <div className="relative flex items-center justify-center p-1">
            <img
              src="https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/R%C6%B0%C6%A1ng%20kho%20b%C3%A1u%20c%E1%BB%95%20%C4%91%E1%BA%A1i%20ph%C3%A1t%20s%C3%A1ng%20xanh-3.png"
              alt="Hộp Rương Cổ"
              className={`w-32 h-24 sm:w-40 sm:h-30 md:w-48 md:h-34 object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] transition-all ${
                task2Done
                  ? 'filter drop-shadow-[0_0_20px_#28a745]'
                  : task1Done
                  ? 'group-hover:drop-shadow-[0_0_25px_#ADEFD1]'
                  : 'opacity-70 filter brightness-75'
              }`}
            />
          </div>
          {task2Done ? (
            <div className="mt-1 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#001c38] border border-emerald-400 text-emerald-300 font-black text-[10px] sm:text-xs md:text-sm shadow-md flex items-center gap-1.5 animate-pop whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span>ĐÃ HOÀN THÀNH</span>
            </div>
          ) : (
            <span className="mt-1 px-3 sm:px-3.5 py-1 rounded-full bg-[#001833]/90 border border-[#ADEFD1]/50 text-[#ADEFD1] font-black text-[10px] sm:text-xs shadow-lg whitespace-nowrap">
              Hộp Rương Cổ
            </span>
          )}
        </div>
      </div>

      {/* ROOM COMPLETE NOTIFICATION (STYLE ĐỒNG BỘ HÌNH 4) */}
      {task1Done && task2Done && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-pop">
          <div className="bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative text-white">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#002447] border border-[#ADEFD1] flex items-center justify-center text-[#ADEFD1] shadow-md animate-bounce-slow">
              <Sparkles className="w-9 h-9 text-[#FFD700]" />
            </div>

            <h3 className="text-xl font-black text-white uppercase tracking-wider mb-1">
              CHÚC MỪNG! BẠN ĐÃ VƯỢT QUA PHÒNG LỊCH SỬ!
            </h3>

            <div className="flex items-center justify-center gap-2.5 my-3">
              <span className="px-3 py-1 rounded-full bg-[#002447] border border-emerald-400 text-xs font-bold text-emerald-300 flex items-center gap-1">
                <span className="text-emerald-400 font-black">✓</span> 2/2 nhiệm vụ
              </span>
              <span className="px-3 py-1 rounded-full bg-[#002447] border border-[#ADEFD1] text-xs font-bold text-[#ADEFD1] flex items-center gap-1">
                <span>🔑</span> Chìa khóa bí mật 1/5
              </span>
            </div>

            <p className="text-xs text-[#FFFFE3]/90 leading-relaxed mb-6">
              Bạn đã khôi phục thành công những dấu mốc lịch sử và thu thập được manh mối đầu tiên để giải mã Trái Tim Thư Viện!
            </p>

            <button
              onClick={() => {
                soundManager.playSparkle();
                onNavigateToRoom2();
              }}
              className="w-full py-3 rounded-full bg-[#ADEFD1] text-[#00203F] font-black text-sm hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase"
            >
              <Sparkles className="w-5 h-5 fill-[#00203F]" />
              <span>TIẾP TỤC ĐẾN PHÒNG DANH SƯ</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NHIỆM VỤ 1: GIAO DIỆN CUỘN THÁNH CHỈ SVG (KHÔNG DÙNG KHUNG, CUỘN RA VÀO TRỰC TIẾP) */}
      {/* ========================================================================= */}
      {modalState === 'scroll_task1' && (() => {
        const isScrollUnrolled =
          scrollStep === 'step2_unroll' ||
          scrollStep === 'step3_questions' ||
          scrollStep === 'complete_lines';

        const handleCloseScrollAnimated = () => {
          soundManager.playDoorTransition();
          setScrollStep('complete_roll_close');
          setTimeout(() => {
            if (task1Verified && !task1Done) {
              soundManager.playSparkle();
              setModalState('key_reward_modal');
            } else {
              setModalState(null);
            }
          }, 1150);
        };

        return (
          <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-1 sm:p-3 overflow-hidden">
            {/* Hạt bụi phép thuật lấp lánh xung quanh cuộn thánh chỉ */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(14)].map((_, i) => (
                <span
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-[#FFD700] shadow-[0_0_12px_#FFD700] animate-ping"
                  style={{
                    left: `${12 + ((i * 19) % 76)}%`,
                    top: `${15 + ((i * 23) % 70)}%`,
                    animationDuration: `${1.2 + (i % 3) * 0.45}s`,
                  }}
                />
              ))}
            </div>

            {/* HÌNH SVG CUỘN THÁNH CHỈ CÓ HIỆU ỨNG CUỘN RA VÀO */}
            <div className="relative w-full max-w-[1220px] h-full max-h-[680px] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 660"
                className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)] select-none"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Gradient cho mặt trong của giấy (màu lụa vàng) */}
                  <linearGradient id="paperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff8dc" />
                    <stop offset="50%" stopColor="#ffe4b5" />
                    <stop offset="100%" stopColor="#fff8dc" />
                  </linearGradient>

                  {/* Gradient cho mặt ngoài của cuộn (lụa đỏ) */}
                  <linearGradient id="outerWrapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b0000" />
                    <stop offset="50%" stopColor="#d70000" />
                    <stop offset="100%" stopColor="#8b0000" />
                  </linearGradient>

                  {/* Gradient cho trục cuộn bằng vàng */}
                  <linearGradient id="rollerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#b8860b" />
                    <stop offset="30%" stopColor="#ffd700" />
                    <stop offset="70%" stopColor="#ffd700" />
                    <stop offset="100%" stopColor="#8b6508" />
                  </linearGradient>

                  {/* Đổ bóng bên trong trục để tạo độ sâu */}
                  <linearGradient id="shadowLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#000" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#000" stopOpacity="0" />
                  </linearGradient>

                  <linearGradient id="shadowRight" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#000" stopOpacity="0" />
                    <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
                  </linearGradient>

                  {/* ClipPath tạo hiệu ứng giấy mở ra từ giữa và cuộn lại */}
                  <clipPath id="scrollClip">
                    <rect
                      x="90"
                      y="0"
                      width="1020"
                      height="660"
                      style={{
                        transformOrigin: '600px 330px',
                        transform: isScrollUnrolled ? 'scaleX(1)' : 'scaleX(0)',
                        transition: 'transform 1.15s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                  </clipPath>
                </defs>

                {/* NỘI DUNG THÁNH CHỈ (Bị cắt bởi clip-path để hiện dần ra khi mở và thu lại khi đóng) */}
                <g clipPath="url(#scrollClip)">
                  {/* Nền giấy lụa vàng */}
                  <rect x="90" y="42" width="1020" height="576" fill="url(#paperGrad)" />

                  {/* Viền hoa văn cung đình */}
                  <rect
                    x="104"
                    y="54"
                    width="992"
                    height="552"
                    fill="none"
                    stroke="#d4af37"
                    strokeWidth="4"
                  />
                  <rect
                    x="110"
                    y="60"
                    width="980"
                    height="540"
                    fill="none"
                    stroke="#b8860b"
                    strokeWidth="1.5"
                  />

                  {/* 4 Góc trang trí thánh chỉ */}
                  <path d="M 104 54 L 142 54 L 104 92 Z" fill="#b8860b" />
                  <path d="M 1096 54 L 1058 54 L 1096 92 Z" fill="#b8860b" />
                  <path d="M 104 606 L 142 606 L 104 568 Z" fill="#b8860b" />
                  <path d="M 1096 606 L 1058 606 L 1096 568 Z" fill="#b8860b" />

                  {/* BỘ CÂU HỎI 7 DẤU MỐC LỊCH SỬ TRÊN MẶT GIẤY THÁNH CHỈ */}
                  <foreignObject x="122" y="66" width="956" height="528">
                    <div className="w-full h-full flex flex-col justify-between px-3 py-1.5 text-[#3b2308] overflow-hidden">
                      {/* Tiêu đề trên mặt giấy thánh chỉ */}
                      <div className="flex items-center justify-between border-b-2 border-[#b8860b]/40 pb-1.5 mb-1.5 shrink-0">
                        <div>
                          <h3 className="text-sm sm:text-base font-black text-[#7a1c1c] uppercase tracking-wider leading-tight">
                            NHIỆM VỤ 1: KHÔI PHỤC 7 DẤU MỐC LỊCH SỬ TRÊN THÁNH CHỈ
                          </h3>
                          <p className="text-[11px] font-semibold text-[#5c3a10]">
                            Kéo hoặc nhấp chọn thẻ sự kiện bên phải để ghép vào ô trống tương ứng 7 mốc thời gian bên trái
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={handleCloseScrollAnimated}
                            className="w-7 h-7 rounded-full bg-[#8b0000] border border-[#ffd700] text-[#fff8dc] font-black hover:bg-[#a80000] flex items-center justify-center cursor-pointer text-xs shadow"
                            title="Cuộn lại và đóng"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* 2 Cột: 7 Mốc thời gian bên trái | 7 Thẻ sự kiện bên phải */}
                      <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-12 gap-3 items-start">
                        {/* Cột trái (7/12): 7 Mốc thời gian */}
                        <div className="col-span-7 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-[#7a1c1c] mb-1">
                            <span>7 MỐC THỜI GIAN LỊCH SỬ</span>
                            {task1Checked && (
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                task1Verified
                                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-400/40'
                                  : 'bg-rose-900/60 text-rose-300 border border-rose-400/40'
                              }`}>
                                {task1Verified
                                  ? '✓ Hoàn thành 7/7'
                                  : `Đúng ${MILESTONES_7.filter(m => matchedSlots7[m.id] === m.id).length}/7 mốc`}
                              </span>
                            )}
                          </div>

                          {MILESTONES_7.map((milestone, idx) => {
                            const assignedCardId = matchedSlots7[milestone.id];
                            const assignedMilestone = MILESTONES_7.find(
                              (m) => m.id === assignedCardId
                            );
                            const isSlotCorrect = assignedCardId === milestone.id;
                            const isSlotWrong = task1Checked && !task1Verified && assignedCardId !== null && !isSlotCorrect;
                            const isSlotRight = (task1Checked && isSlotCorrect) || task1Verified;
                            const isLineGlowing =
                              task1Verified && scrollStep === 'complete_lines' && glowingLineCount >= idx + 1;

                            return (
                              <div key={milestone.id} className="flex items-center gap-2">
                                {/* Hộp Mốc thời gian bên trái */}
                                <div
                                  className={`w-28 shrink-0 px-2 py-1.5 rounded-lg border-2 text-center transition-all duration-300 ${
                                    isLineGlowing || isSlotRight
                                      ? 'bg-emerald-950 border-emerald-400 text-[#fff8dc] shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                                      : isSlotWrong
                                      ? 'bg-rose-950 border-rose-500 text-rose-100 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                                      : 'bg-[#001833] border-[#d4af37] text-[#FFFFE3]'
                                  }`}
                                >
                                  <div className="text-[11px] font-black text-[#FFD700] leading-tight">
                                    {milestone.yearShort}
                                  </div>
                                  <div className="text-[9px] text-[#ADEFD1] leading-tight truncate">
                                    {milestone.location}
                                  </div>
                                </div>

                                {/* Đường nối */}
                                <div className="w-5 flex items-center justify-center shrink-0">
                                  <div
                                    className={`w-full h-1 rounded-full transition-all duration-300 ${
                                      isLineGlowing || isSlotRight
                                        ? 'bg-[#ffd700] shadow-[0_0_10px_#ffd700]'
                                        : isSlotWrong
                                        ? 'bg-rose-500 border-b border-dashed border-rose-400'
                                        : assignedMilestone
                                        ? 'bg-[#8b6508]'
                                        : 'bg-[#b8860b]/40 border-b border-dashed border-[#8b6508]'
                                    }`}
                                  />
                                </div>

                                {/* Ô trống ghép thẻ */}
                                <div
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={() => {
                                    if (draggedMilestoneId) {
                                      handleAssignMilestoneToSlot(milestone.id, draggedMilestoneId);
                                    }
                                  }}
                                  onClick={() => {
                                    if (selectedRightMilestoneId) {
                                      handleAssignMilestoneToSlot(
                                        milestone.id,
                                        selectedRightMilestoneId
                                      );
                                    } else if (assignedMilestone && !task1Verified) {
                                      handleRemoveMilestoneFromSlot(milestone.id);
                                    }
                                  }}
                                  className={`flex-1 min-h-[48px] px-2.5 py-1.5 rounded-lg border-2 transition-all flex items-center justify-between gap-2 ${
                                    task1Verified ? 'cursor-default' : 'cursor-pointer'
                                  } ${
                                    isSlotRight
                                      ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100 shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                                      : isSlotWrong
                                      ? 'bg-rose-950/90 border-rose-500 text-rose-100 shadow-[0_0_12px_rgba(244,63,94,0.5)] ring-2 ring-rose-500/30'
                                      : assignedMilestone
                                      ? 'bg-[#00203F] border-[#d4af37] text-[#FFFFE3] shadow-sm'
                                      : selectedRightMilestoneId
                                      ? 'bg-[#fff8dc] border-dashed border-[#8b0000] animate-pulse'
                                      : 'bg-[#fff8dc]/75 border-dashed border-[#b8860b] hover:border-[#8b0000]'
                                  }`}
                                >
                                  {assignedMilestone ? (
                                    <div className="text-left flex-1 min-w-0">
                                      <div className="text-[11px] font-bold text-[#FFD700] leading-tight truncate">
                                        {assignedMilestone.event}
                                      </div>
                                      <div className="text-[10px] text-[#FFFFE3]/90 leading-tight mt-0.5 line-clamp-1">
                                        {assignedMilestone.description}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="w-full text-center text-[10px] text-[#7a4b12] font-semibold italic">
                                      {selectedRightMilestoneId
                                        ? 'Nhấp để đặt sự kiện vào đây'
                                        : 'Thả hoặc nhấp chọn thẻ vào đây'}
                                    </div>
                                  )}

                                  {/* Nhãn trạng thái kiểm tra đúng / sai rõ ràng */}
                                  {assignedMilestone && (
                                    <div className="shrink-0 flex items-center gap-1">
                                      {isSlotRight ? (
                                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-700 border border-emerald-400 text-emerald-100 font-black flex items-center gap-1 shadow-sm">
                                          <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                                          Đúng
                                        </span>
                                      ) : isSlotWrong ? (
                                        <div className="flex items-center gap-1">
                                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-700 border border-rose-400 text-white font-black flex items-center gap-0.5 shadow-sm">
                                            ✕ Chưa đúng
                                          </span>
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleRemoveMilestoneFromSlot(milestone.id);
                                            }}
                                            className="text-[9px] px-1.5 py-0.5 rounded bg-rose-800 hover:bg-rose-700 text-rose-100 border border-rose-400/50 font-bold cursor-pointer"
                                            title="Gỡ thẻ này ra để ghép lại"
                                          >
                                            Gỡ
                                          </button>
                                        </div>
                                      ) : !task1Verified ? (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveMilestoneFromSlot(milestone.id);
                                          }}
                                          className="text-[9px] px-1.5 py-0.5 rounded bg-[#00152B] hover:bg-rose-900/60 text-[#ADEFD1] hover:text-rose-200 border border-[#ADEFD1]/40 shrink-0 cursor-pointer"
                                          title="Nhấp để gỡ thẻ"
                                        >
                                          Đổi / Gỡ
                                        </button>
                                      ) : null}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Cột phải (5/12): 7 Thẻ thông tin */}
                        <div className="col-span-5 space-y-1.5">
                          <div className="text-[11px] font-black uppercase tracking-wider text-[#7a1c1c] mb-1">
                            7 THẺ SỰ KIỆN THÔNG TIN
                          </div>

                          {shuffledRightMilestones.map((milestone) => {
                            const isPlaced = Object.values(matchedSlots7).includes(milestone.id);
                            const isSelected = selectedRightMilestoneId === milestone.id;

                            return (
                              <div
                                key={milestone.id}
                                draggable={!isPlaced && scrollStep === 'step3_questions' && !task1Verified}
                                onDragStart={() => setDraggedMilestoneId(milestone.id)}
                                onDragEnd={() => setDraggedMilestoneId(null)}
                                onClick={() => {
                                  if (isPlaced || scrollStep !== 'step3_questions' || task1Verified) return;
                                  soundManager.playClick();
                                  setSelectedRightMilestoneId((prev) =>
                                    prev === milestone.id ? null : milestone.id
                                  );
                                }}
                                className={`px-2.5 py-1.5 rounded-lg border-2 transition-all text-left ${
                                  isPlaced
                                    ? 'bg-[#e6cfa3]/40 border-[#b8860b]/30 opacity-40 cursor-default'
                                    : isSelected
                                    ? 'bg-[#8b0000] border-[#ffd700] text-white shadow-md scale-[1.01] cursor-pointer'
                                    : 'bg-[#001833] border-[#d4af37] text-[#FFFFE3] hover:border-[#8b0000] cursor-grab active:cursor-grabbing hover:bg-[#002447]'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-1.5">
                                  <span className="text-[11px] font-bold text-[#FFD700] leading-tight">
                                    {milestone.event}
                                  </span>
                                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-black/30 text-[#ADEFD1] border border-[#ADEFD1]/30 shrink-0">
                                    {isPlaced ? 'Đã ghép' : isSelected ? 'Đang chọn' : 'Chọn'}
                                  </span>
                                </div>
                                <p className="text-[10px] text-[#FFFFE3]/85 leading-tight mt-0.5 line-clamp-2">
                                  {milestone.description}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Chân thánh chỉ: Thông báo lỗi/thành công & Nút KIỂM TRA / SỬA Ô SAI / THỬ LẠI / TIẾP TỤC */}
                      <div className="pt-1.5 mt-1 border-t border-[#b8860b]/40 flex flex-wrap items-center justify-between gap-2 shrink-0">
                        <div className="flex-1 min-w-[200px]">
                          {task1SuccessMsg && (
                            <div className="px-3 py-1 bg-emerald-950/95 border-2 border-emerald-400 rounded-lg text-[11px] font-black text-emerald-200 flex items-center gap-1.5 shadow-sm">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>{task1SuccessMsg}</span>
                            </div>
                          )}
                          {task1Error && (
                            <div className="px-3 py-1 bg-rose-950/95 border-2 border-rose-500 rounded-lg text-[11px] font-bold text-rose-200 flex items-center gap-1.5 shadow-sm">
                              <span className="text-rose-400 font-black text-xs shrink-0">⚠️</span>
                              <span>{task1Error}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {!task1Verified && scrollStep === 'step3_questions' && (
                            <>
                              {task1Failed ? (
                                <>
                                  <button
                                    onClick={handleClearWrongSlotsOnly}
                                    className="px-3.5 py-1.5 rounded-full bg-amber-700 hover:bg-amber-600 border border-[#ffd700] text-white text-[11px] font-black hover:scale-105 active:scale-95 transition-all shadow cursor-pointer uppercase tracking-wider shrink-0"
                                    title="Chỉ gỡ các ô sai để sửa lại, giữ nguyên các ô đã đúng"
                                  >
                                    GỠ CÁC Ô CHƯA ĐÚNG
                                  </button>
                                  <button
                                    onClick={handleRetryTask1}
                                    className="px-3.5 py-1.5 rounded-full bg-rose-700 hover:bg-rose-600 border border-[#ffd700] text-white text-[11px] font-black hover:scale-105 active:scale-95 transition-all shadow cursor-pointer uppercase tracking-wider shrink-0"
                                    title="Đặt lại toàn bộ và xáo trộn lại thẻ"
                                  >
                                    LÀM LẠI TẤT CẢ
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={verifyTask1Matching}
                                  className="px-7 py-1.5 rounded-full bg-gradient-to-r from-[#8b0000] via-[#b30000] to-[#8b0000] border-2 border-[#ffd700] text-[#fff8dc] text-xs font-black hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer uppercase tracking-wider shrink-0"
                                >
                                  KIỂM TRA
                                </button>
                              )}
                            </>
                          )}

                          {task1Verified && (
                            <button
                              onClick={handleCloseScrollAnimated}
                              className="px-7 py-1.5 rounded-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 border-2 border-[#ffd700] text-white text-xs font-black hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer uppercase tracking-wider shrink-0"
                            >
                              TIẾP TỤC
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </foreignObject>
                </g>

                {/* TRỤC CUỘN BÊN TRÁI */}
                <g
                  style={{
                    transform: isScrollUnrolled ? 'translateX(0px)' : 'translateX(510px)',
                    transition: 'transform 1.15s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {/* Bóng mờ tạo độ cong cho giấy sát trục */}
                  <rect x="90" y="42" width="18" height="576" fill="url(#shadowLeft)" />

                  {/* Núm cuộn trên/dưới */}
                  <circle cx="72" cy="18" r="18" fill="url(#rollerGrad)" />
                  <circle cx="72" cy="642" r="18" fill="url(#rollerGrad)" />

                  {/* Thân trục cuộn */}
                  <rect x="54" y="24" width="36" height="612" fill="url(#rollerGrad)" rx="5" />

                  {/* Mặt ngoài của cuộn giấy (Lụa đỏ, nhìn thấy khi cuộn lại) */}
                  <rect x="66" y="40" width="24" height="580" fill="url(#outerWrapGrad)" />

                  {/* Vết cắt sáng/tối tạo khối 3D cho cuộn */}
                  <rect x="84" y="40" width="6" height="580" fill="#000" opacity="0.2" />
                  <rect x="66" y="40" width="2.5" height="580" fill="#fff" opacity="0.15" />
                </g>

                {/* TRỤC CUỘN BÊN PHẢI */}
                <g
                  style={{
                    transform: isScrollUnrolled ? 'translateX(0px)' : 'translateX(-510px)',
                    transition: 'transform 1.15s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {/* Bóng mờ tạo độ cong cho giấy sát trục */}
                  <rect x="1092" y="42" width="18" height="576" fill="url(#shadowRight)" />

                  {/* Núm cuộn trên/dưới */}
                  <circle cx="1128" cy="18" r="18" fill="url(#rollerGrad)" />
                  <circle cx="1128" cy="642" r="18" fill="url(#rollerGrad)" />

                  {/* Thân trục cuộn */}
                  <rect x="1110" y="24" width="36" height="612" fill="url(#rollerGrad)" rx="5" />

                  {/* Mặt ngoài của cuộn giấy (Lụa đỏ) */}
                  <rect x="1110" y="40" width="24" height="580" fill="url(#outerWrapGrad)" />

                  {/* Vết cắt sáng/tối tạo khối 3D cho cuộn */}
                  <rect x="1110" y="40" width="6" height="580" fill="#000" opacity="0.3" />
                  <rect x="1131" y="40" width="2.5" height="580" fill="#fff" opacity="0.15" />
                </g>
              </svg>
            </div>
          </div>
        );
      })()}

      {/* MODAL NHẬN CHÌA KHÓA ĐỒNG CỔ */}
      {modalState === 'key_reward_modal' && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-pop">
          <div className="bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative text-white">
            <div
              className={`w-24 h-24 mx-auto mb-4 rounded-full bg-[#002447] border border-[#ADEFD1] flex items-center justify-center text-4xl shadow-md transition-all duration-700 ${
                keyCollectingAnim ? 'scale-0 translate-y-[300px] opacity-0' : 'animate-bounce-slow'
              }`}
            >
              🗝️
            </div>

            <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">
              BẠN ĐÃ NHẬN ĐƯỢC CHÌA KHÓA ĐỒNG CỔ!
            </h3>
            <p className="text-xs text-[#FFFFE3]/90 leading-relaxed mb-6">
              Cuộn thánh chỉ đã hoàn tất và trao cho bạn <span className="text-[#ADEFD1] font-bold">Chìa Khóa Đồng Cổ</span>. Hãy cất vào Túi đồ để mở chiếc Rương cổ!
            </p>

            <button
              onClick={handleClaimBronzeKey}
              className="w-full py-3 rounded-full bg-[#ADEFD1] text-[#00203F] font-black text-sm hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 fill-[#00203F]" />
              <span>NHẬN CHÌA KHÓA VÀO TÚI ĐỒ</span>
            </button>
          </div>
        </div>
      )}

      {/* XÁC NHẬN MỞ RƯƠNG CỔ (ĐỒNG BỘ STYLE HÌNH 4) */}
      {modalState === 'chest_prompt' && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-pop">
          <div className="bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative text-white">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#002447] border border-[#ADEFD1] flex items-center justify-center text-[#ADEFD1] shadow-md">
              <Key className="w-9 h-9 text-[#FFD700] animate-bounce-slow" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">
              SỬ DỤNG CHÌA KHÓA ĐỒNG CỔ?
            </h3>
            <p className="text-xs text-[#FFFFE3]/90 leading-relaxed mb-6">
              Dùng <span className="text-[#ADEFD1] font-bold">Chìa Khóa Đồng Cổ</span> để mở khóa chiếc rương và đánh thức tấm văn bản cổ chứa 10 phong ấn?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setModalState(null)}
                className="px-6 py-3 rounded-full bg-[#002447] border border-[#ADEFD1]/40 text-[#FFFFE3] hover:bg-[#003366] text-xs font-bold transition-colors cursor-pointer uppercase"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmOpenChest}
                className="flex-1 py-3 rounded-full bg-[#ADEFD1] text-[#00203F] text-sm font-black hover:bg-white transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 uppercase"
              >
                <Sparkles className="w-4 h-4 fill-[#00203F]" />
                <span>MỞ RƯƠNG CỔ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HIỆU ỨNG MỞ RƯƠNG (ĐỒNG BỘ STYLE HÌNH 4) */}
      {modalState === 'chest_unlock_anim' && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-hidden animate-pop">
          <div className="bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative text-white flex flex-col items-center">
            <div
              className={`relative transition-all duration-1000 my-4 flex items-center justify-center ${
                chestAnimPhase === 'radiating'
                  ? 'scale-110 filter drop-shadow-[0_0_30px_#ADEFD1]'
                  : chestAnimPhase === 'unlocking'
                  ? 'scale-105 filter drop-shadow-[0_0_18px_#ADEFD1]'
                  : 'scale-100'
              }`}
            >
              <img
                src="https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/R%C6%B0%C6%A1ng%20kho%20b%C3%A1u%20c%E1%BB%95%20%C4%91%E1%BA%A1i%20ph%C3%A1t%20s%C3%A1ng%20xanh-3.png"
                alt="Chest"
                className="w-36 h-28 object-contain"
              />

              <div
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out ${
                  chestAnimPhase === 'flying'
                    ? '-translate-y-20 -translate-x-24 scale-125 rotate-[-25deg] opacity-90'
                    : chestAnimPhase === 'unlocking'
                    ? '-translate-x-1/2 translate-x-8 -translate-y-1 scale-105 rotate-90 opacity-100'
                    : 'scale-0 opacity-0 transition-all duration-500'
                }`}
              >
                <span className="text-5xl select-none">🗝️</span>
              </div>
            </div>

            <h3 className="text-lg font-black text-white uppercase tracking-wider mt-2">
              {chestAnimPhase === 'flying' && 'CHÌA KHÓA ĐỒNG CỔ ĐANG BAY TỚI Ổ KHÓA...'}
              {chestAnimPhase === 'unlocking' && 'ĐANG MỞ KHÓA CHIẾC RƯƠNG CỔ...'}
              {chestAnimPhase === 'radiating' && 'TẤM VĂN BẢN CỔ 10 PHONG ẤN ĐANG NỔI LÊN!'}
            </h3>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NHIỆM VỤ 2 MODAL: GIAO DIỆN VĂN BẢN CỔ SVG TRÊN NỀN BÓNG TỐI NHƯ NHIỆM VỤ 1 */}
      {/* ========================================================================= */}
      {modalState === 'quiz_task2' && (() => {
        const currentQ = quizQuestions[currentQuizIndex];
        const currentSelectedOpt = quizAnswers[currentQ.id];
        const isCurrentAnswered = currentSelectedOpt !== undefined;
        const all10Answered = Object.keys(quizAnswers).length === quizQuestions.length;
        const correctCount = quizQuestions.filter((q) => quizAnswers[q.id] === q.correctIndex).length;
        const isTask2Passed = all10Answered;
        const isTask2Failed = false;

        const handleRetryQuizTask2 = () => {
          soundManager.playClick();
          setQuizAnswers({});
          setQuizQuestions(buildShuffledQuestions());
          setCurrentQuizIndex(0);
        };

        return (
          <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-1 sm:p-3 overflow-hidden animate-pop">
            {/* Hạt bụi phép thuật lấp lánh trên nền bóng tối giống Nhiệm vụ 1 */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(14)].map((_, i) => (
                <span
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-[#FFD700] shadow-[0_0_12px_#FFD700] animate-ping"
                  style={{
                    left: `${12 + ((i * 19) % 76)}%`,
                    top: `${15 + ((i * 23) % 70)}%`,
                    animationDuration: `${1.2 + (i % 3) * 0.45}s`,
                  }}
                />
              ))}
            </div>

            <div className="relative w-full max-w-[1220px] h-full max-h-[680px] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 660"
                className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)] select-none"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Bóng viền nâu sẫm bao quanh tờ văn bản cổ */}
                  <filter id="parchmentShadow" x="-8%" y="-8%" width="116%" height="116%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="16" result="blur1" />
                    <feOffset in="blur1" dx="0" dy="6" result="offsetBlur" />
                    <feFlood floodColor="#000000" floodOpacity="0.85" result="color" />
                    <feComposite in="color" in2="offsetBlur" operator="in" result="shadow" />
                    <feMerge>
                      <feMergeNode in="shadow" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Gradient mặt giấy văn bản cổ */}
                  <linearGradient id="ancientPaperFill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f5e7c6" />
                    <stop offset="45%" stopColor="#edd7ab" />
                    <stop offset="80%" stopColor="#e2c58e" />
                    <stop offset="100%" stopColor="#d9b87c" />
                  </linearGradient>
                </defs>

                {/* Vệt viền gỗ/da nâu sẫm bao quanh mép giấy trên nền bóng tối */}
                <path
                  d="M 42,38 Q 330,58 600,36 Q 870,14 1158,38 Q 1180,330 1160,622 Q 870,644 600,624 Q 330,604 44,622 Q 24,330 42,38 Z"
                  fill="#4e3015"
                  filter="url(#parchmentShadow)"
                />

                {/* Tờ giấy Văn Bản Cổ lượn sóng nhẹ */}
                <path
                  d="M 60,56 Q 335,74 600,54 Q 865,34 1140,56 Q 1156,330 1142,604 Q 865,622 600,604 Q 335,588 62,604 Q 48,330 60,56 Z"
                  fill="url(#ancientPaperFill)"
                />

                {/* Các nếp gấp giấy mờ (2 đường dọc, 1 đường ngang) */}
                <g stroke="#c4a574" strokeWidth="1.5" opacity="0.55">
                  <line x1="402" y1="62" x2="392" y2="598" />
                  <line x1="802" y1="48" x2="794" y2="610" />
                  <line x1="56" y1="330" x2="1144" y2="318" />
                </g>

                {/* Hoa văn Ngôi Sao La Bàn 8 cánh chìm ở chính giữa Văn Bản Cổ */}
                <g transform="translate(600, 330)" opacity="0.28">
                  <circle cx="0" cy="0" r="155" fill="none" stroke="#9c7a4c" strokeWidth="2" />
                  <circle cx="0" cy="0" r="120" fill="none" stroke="#9c7a4c" strokeWidth="1.5" strokeDasharray="7 7" />
                  <line x1="-120" y1="-120" x2="120" y2="120" stroke="#9c7a4c" strokeWidth="2.5" />
                  <line x1="120" y1="-120" x2="-120" y2="120" stroke="#9c7a4c" strokeWidth="2.5" />
                  <polygon points="0,-195 30,-30 195,0 30,30 0,195 -30,30 -195,0 -30,-30" fill="#a88656" />
                  <circle cx="0" cy="0" r="26" fill="#edd7ab" />
                  <circle cx="0" cy="0" r="11" fill="#a88656" />
                </g>

                {/* Khung viền đôi cổ điển và 4 góc trang trí */}
                <g stroke="#8c673e" fill="none">
                  <rect x="98" y="88" width="1004" height="484" strokeWidth="2.5" />
                  <rect x="105" y="95" width="990" height="470" strokeWidth="1.2" />

                  {/* Góc trên - trái */}
                  <path d="M 84,126 L 84,74 L 136,74" strokeWidth="3" />
                  <circle cx="98" cy="88" r="6.5" fill="#8c673e" />

                  {/* Góc trên - phải */}
                  <path d="M 1064,74 L 1116,74 L 1116,126" strokeWidth="3" />
                  <circle cx="1102" cy="88" r="6.5" fill="#8c673e" />

                  {/* Góc dưới - trái */}
                  <path d="M 84,534 L 84,586 L 136,586" strokeWidth="3" />
                  <circle cx="98" cy="572" r="6.5" fill="#8c673e" />

                  {/* Góc dưới - phải */}
                  <path d="M 1064,586 L 1116,586 L 1116,534" strokeWidth="3" />
                  <circle cx="1102" cy="572" r="6.5" fill="#8c673e" />
                </g>

                {/* NỘI DUNG NHIỆM VỤ 2 TRÊN MẶT VĂN BẢN CỔ */}
                <foreignObject x="114" y="102" width="972" height="456">
                  <div className="w-full h-full flex flex-col justify-between px-3 py-1.5 text-[#3b2308] overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-[#8c673e]/40 pb-1.5 mb-2 shrink-0">
                      <div className="min-w-0 flex-1 pr-2">
                        <h3 className="text-sm sm:text-base font-black text-[#6b1d1d] uppercase tracking-wider truncate">
                          NHIỆM VỤ 2: TẤM VĂN BẢN CỔ 10 PHONG ẤN
                        </h3>
                        <p className="text-[11px] font-bold text-[#5c3a10] truncate">
                          Mỗi câu chỉ chọn đáp án 1 lần • Hoàn thành 10 câu hỏi để mở khóa rương cổ và nhận Chìa Khóa Bí Mật!
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={handleCloseQuizTask2Modal}
                          className="w-7 h-7 rounded-full bg-[#6b1d1d] border border-[#ffd700] text-[#fff8dc] font-black hover:bg-[#8b0000] flex items-center justify-center cursor-pointer text-xs shadow"
                          title="Đóng bảng"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Dãy 10 Vòng tròn gắn số 1-10 (Đúng: Xanh, Sai: Đỏ) */}
                    <div className="bg-[#001833]/90 border border-[#8c673e] rounded-2xl py-2 px-4 mb-2.5 shrink-0 shadow-sm">
                      <div className="flex items-center justify-between gap-2">
                        {quizQuestions.map((q, idx) => {
                          const userOpt = quizAnswers[q.id];
                          const isAnswered = userOpt !== undefined;
                          const isRight = isAnswered && userOpt === q.correctIndex;
                          const isWrong = isAnswered && userOpt !== q.correctIndex;
                          const isActive = currentQuizIndex === idx;

                          let circleClass =
                            'bg-[#002447] border border-[#ADEFD1]/50 text-[#ADEFD1] hover:border-[#ADEFD1]';

                          if (isRight) {
                            circleClass =
                              'bg-emerald-600 border-2 border-emerald-300 text-white shadow-[0_0_12px_rgba(16,185,129,0.85)]';
                          } else if (isWrong) {
                            circleClass =
                              'bg-rose-600 border-2 border-rose-300 text-white shadow-[0_0_12px_rgba(244,63,94,0.85)]';
                          } else if (isActive) {
                            circleClass =
                              'bg-[#003366] border-2 border-white text-white shadow-[0_0_10px_rgba(173,239,209,0.6)]';
                          }

                          return (
                            <button
                              key={q.id}
                              type="button"
                              onClick={() => {
                                if (isAnswered || all10Answered || idx <= Object.keys(quizAnswers).length) {
                                  soundManager.playClick();
                                  setCurrentQuizIndex(idx);
                                }
                              }}
                              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 cursor-pointer ${circleClass} ${
                                isActive ? 'scale-110 ring-2 ring-[#FFD700]' : ''
                              }`}
                              title={`Câu ${q.id}`}
                            >
                              {q.id}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Nội dung câu hỏi & phương án đã được xáo trộn */}
                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                      <h4 className="text-xs sm:text-sm font-black text-[#2b1804] leading-snug">
                        Câu {currentQ.id}: {currentQ.question}
                      </h4>

                      {/* 4 Phương án */}
                      <div className="grid grid-cols-2 gap-2.5">
                        {currentQ.options.map((opt, idx) => {
                          const isSelected = currentSelectedOpt === idx;
                          let btnStyle =
                            'bg-[#001833] border-[#8c673e] hover:border-[#002855] hover:bg-[#002447] text-[#FFFFE3]';

                          if (isCurrentAnswered) {
                            if (idx === currentQ.correctIndex) {
                              btnStyle =
                                'bg-emerald-900 border-2 border-emerald-400 text-white font-bold shadow-sm';
                            } else if (isSelected) {
                              btnStyle = 'bg-rose-950 border-2 border-rose-500 text-rose-200';
                            } else {
                              btnStyle = 'bg-[#001833]/55 border-[#8c673e]/40 text-slate-300 opacity-65';
                            }
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => handleSelectQuizOption(idx)}
                              disabled={isCurrentAnswered}
                              className={`px-3.5 py-2.5 rounded-xl border text-left text-xs font-semibold transition-all leading-snug flex items-start gap-2 ${
                                isCurrentAnswered ? 'cursor-default' : 'cursor-pointer hover:scale-[1.01]'
                              } ${btnStyle}`}
                            >
                              <span className="font-black text-[#FFD700] shrink-0">{opt.letter}.</span>
                              <span className="flex-1">{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Giải thích chi tiết hiện ngay sau khi chọn */}
                      {isCurrentAnswered && (
                        <div className="p-3 bg-[#001833] border border-[#ADEFD1] rounded-xl text-xs text-[#FFFFE3] leading-snug animate-pop">
                          <div className="font-black text-[#ADEFD1] uppercase mb-0.5 flex items-center gap-1.5 text-[11px]">
                            <BookOpen className="w-3.5 h-3.5 text-[#ADEFD1]" />
                            <span>Giải thích chi tiết:</span>
                          </div>
                          <p className="text-[#FFFFE3]/95">{currentQ.explanation}</p>
                        </div>
                      )}
                    </div>

                    {/* Thanh điều hướng dưới cùng */}
                    {isCurrentAnswered && (
                      <div className="pt-2 mt-1 border-t border-[#8c673e]/40 flex items-center justify-between gap-2 shrink-0">
                        <div className="text-[11px] font-bold text-[#4e3015]">
                          {isTask2Failed && (
                            <span className="text-rose-800 font-black">
                              Bạn đạt {correctCount}/10 câu đúng (cần tối thiểu 7/10 câu để hoàn thành). Hãy nhấn Thử lại nhé!
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-auto">
                          {isTask2Failed ? (
                            <button
                              onClick={handleRetryQuizTask2}
                              className="px-6 py-2 rounded-full bg-rose-700 text-white text-xs font-black hover:bg-rose-600 hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                            >
                              <span>THỬ LẠI</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={
                                currentQuizIndex < quizQuestions.length - 1
                                  ? handleContinueAfterExplanation
                                  : isTask2Passed
                                  ? handleCloseQuizTask2Modal
                                  : handleContinueAfterExplanation
                              }
                              className="px-7 py-2 rounded-full bg-[#ADEFD1] text-[#00203F] border border-[#00203F]/20 text-xs font-black hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                            >
                              <span>TIẾP TỤC</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </foreignObject>
              </svg>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* PHẦN THƯỞNG SAU NHIỆM VỤ 2: ĐỒNG BỘ STYLE HÌNH 4 (KHUNG VỪA NỘI DUNG, DƯỚI NỀN TỐI CÓ ÁNH SAO) */}
      {/* ========================================================================= */}
      {modalState === 'secret_key_reward' && (
        <div className="fixed top-0 bottom-[60px] left-0 right-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-hidden animate-pop">
          {rewardPhase === 'seals_dissolving' && (
            <div className="bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative text-white animate-pop">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#002447] border border-[#ADEFD1] flex items-center justify-center shadow-md">
                <Sparkles className="w-9 h-9 text-[#FFD700] animate-spin" style={{ animationDuration: '5s' }} />
              </div>

              <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">
                10 PHONG ẤN HÓA THÀNH HẠT SÁNG!
              </h3>
              <p className="text-xs text-[#FFFFE3]/90 leading-relaxed mb-4">
                Năng lượng tri thức đang giải phóng toàn bộ 10 phong ấn ngàn năm trên tấm văn bản cổ...
              </p>

              {/* 10 Vòng tròn Phong Ấn gọn trong khung */}
              <div className="grid grid-cols-5 gap-2.5 bg-[#002447]/80 border border-[#ADEFD1]/40 rounded-2xl p-3.5 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const isDissolved = dissolvedSealCount >= num;
                  return (
                    <div
                      key={num}
                      className={`h-11 rounded-xl border flex items-center justify-center font-black text-xs transition-all duration-300 ${
                        isDissolved
                          ? 'bg-[#ADEFD1] border-white text-[#00203F] scale-105 shadow-[0_0_12px_rgba(173,239,209,0.8)]'
                          : 'bg-[#001833] border-[#ADEFD1]/30 text-[#ADEFD1]/60'
                      }`}
                    >
                      {isDissolved ? <Sparkles className="w-4 h-4 fill-[#00203F]" /> : num}
                    </div>
                  );
                })}
              </div>

              <div className="w-full h-2.5 rounded-full bg-[#001020] border border-[#ADEFD1]/40 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-[#ADEFD1] transition-all duration-300"
                  style={{ width: `${dissolvedSealCount * 10}%` }}
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
                VĂN BẢN CỔ MỞ ĐẾN TRANG CUỐI!
              </h3>
              <p className="text-xs text-[#FFFFE3]/90 leading-relaxed">
                Trang cuối cùng của văn bản cổ phát sáng và dịch chuyển, để lộ một <span className="text-[#ADEFD1] font-bold">ngăn bí mật dưới đáy rương</span>!
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
                BẠN ĐÃ NHẬN ĐƯỢC CHÌA KHÓA BÍ MẬT SỐ 1!
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
                ✦ GỢI Ý ĐẦU TIÊN (MANH MỐI 1/5) ✦
              </p>

              <div className="bg-[#002447] text-white p-4 rounded-2xl border border-[#ADEFD1]/50 shadow-inner mb-5 text-left">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#ADEFD1] uppercase mb-1.5">
                  <span>📜</span>
                  <span>LỜI GỢI Ý TỪ PHÒNG LỊCH SỬ</span>
                </div>
                <p className="text-xs sm:text-sm font-bold italic leading-relaxed text-[#FFFFE3]">
                  “Một truyền thống đạo lí tốt đẹp của dân tộc Việt Nam, đề cao sự kính trọng thầy cô. Đó không chỉ là lòng biết ơn mà còn là sự trân trọng những giá trị tốt đẹp được truyền dạy qua bao thế hệ.”
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
