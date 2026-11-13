/**
 * Types and Constants for Escape Room: Giải Cứu Thư Viện 20/11
 */

export type RoomId = 1 | 2 | 3 | 4 | 5;

export interface TaskState {
  completed: boolean;
  score: number;
  hintsUsed: number;
  wrongAttempts: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: 'key' | 'shard' | 'letter' | 'scroll' | 'item';
  letter?: string;
  shardNumber?: number;
}

export interface TeacherCard {
  teacherName: string;
  studentName: string;
  message: string;
  theme: 'flower' | 'book' | 'star';
  createdAt: string;
}

export interface KeyClueInfo {
  keyNumber: number;
  title: string;
  subtitle: string;
  roomName: string;
  roomHeader: string;
  summary: string;
  fullLetter: string;
  hintSignificance: string;
}

export interface QuizSubQuestion {
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  id: number;
  type: 'mcq' | 'tf' | 'input';
  question: string;
  options?: string[];
  correct?: number | string;
  subQuestions?: QuizSubQuestion[];
  explanation: string;
}

export const KEY_CLUES_DATA: KeyClueInfo[] = [
  {
    keyNumber: 1,
    title: 'MẢNH GIẤY CỔ PHÁT SÁNG',
    subtitle: '✦ GỢI Ý ĐẦU TIÊN (MANH MỐI 1/5) ✦',
    roomName: 'Phòng 1: Lịch Sử',
    roomHeader: 'LỜI GỢI Ý TỪ PHÒNG LỊCH SỬ',
    summary: 'Truyền thống đạo lí tốt đẹp của dân tộc Việt Nam, đề cao sự kính trọng thầy cô',
    fullLetter:
      'Một truyền thống đạo lí tốt đẹp của dân tộc Việt Nam, đề cao sự kính trọng thầy cô. Đó không chỉ là lòng biết ơn mà còn là sự trân trọng những giá trị tốt đẹp được truyền dạy qua bao thế hệ.',
    hintSignificance: 'Truyền thống ngàn đời tôn vinh người thầy.',
  },
  {
    keyNumber: 2,
    title: 'MẢNH GIẤY CỔ PHÁT SÁNG',
    subtitle: '✦ GỢI Ý THỨ HAI (MANH MỐI 2/5) ✦',
    roomName: 'Phòng 2: Danh Sư',
    roomHeader: 'LỜI GỢI Ý TỪ PHÒNG DANH SƯ',
    summary: 'Vị trí cao quý của người thầy trong xã hội',
    fullLetter:
      'Người thầy không chỉ truyền dạy kiến thức mà còn bồi dưỡng nhân cách cho các thế hệ học trò.',
    hintSignificance: 'Đề cao vị trí tôn quý của các bậc danh sư lỗi lạc.',
  },
  {
    keyNumber: 3,
    title: 'MẢNH GIẤY CỔ PHÁT SÁNG',
    subtitle: '✦ GỢI Ý THỨ BA (MANH MỐI 3/5) ✦',
    roomName: 'Phòng 3: Văn Học',
    roomHeader: 'LỜI GỢI Ý TỪ PHÒNG VĂN HỌC',
    summary: 'Vai trò của người thầy: Không thầy đố mày làm nên',
    fullLetter:
      'Tục ngữ "Không thầy đố mày làm nên" đề cao vai trò của người thầy trong việc truyền dạy kiến thức và giúp học trò học tập, tiến bộ.',
    hintSignificance: 'Đề cao vai trò của người thầy trong việc khai sáng và dẫn lối học trò.',
  },
  {
    keyNumber: 4,
    title: 'MẢNH GIẤY CỔ PHÁT SÁNG',
    subtitle: '✦ GỢI Ý THỨ TƯ (MANH MỐI 4/5) ✦',
    roomName: 'Phòng 4: Ký Ức',
    roomHeader: 'LỜI GỢI Ý TỪ PHÒNG KÝ ỨC',
    summary: 'Tinh thần kính thầy, yêu bạn & đạo lý tri ân',
    fullLetter:
      'Học sinh thể hiện tinh thần "kính thầy, yêu bạn" qua việc lễ phép với thầy cô, chăm chú nghe giảng, đoàn kết và sẵn sàng giúp đỡ bạn bè. Kính trọng thầy cô, yêu thương bạn bè để mỗi ngày đến trường đều đong đầy niềm vui và những điều tốt đẹp nhé!',
    hintSignificance: 'Kính trọng thầy cô, yêu thương giúp đỡ bạn bè để mỗi ngày đến trường đong đầy niềm vui.',
  },
  {
    keyNumber: 5,
    title: 'MẢNH GIẤY CỔ PHÁT SÁNG',
    subtitle: '✦ GỢI Ý CUỐI CÙNG (MANH MỐI 5/5) ✦',
    roomName: 'Phòng 5: Tri Ân',
    roomHeader: 'LỜI GỢI Ý TỪ PHÒNG TRI ÂN',
    summary: 'Lời nhắc nhở khắc ghi công ơn & Hành động tri ân',
    fullLetter:
      'Học sinh cần giữ gìn cách chào hỏi, thưa gửi lễ phép với thầy cô vì đây là một trong những nếp sống văn minh và truyền thống tốt đẹp trong nhà trường. Mỗi lời chào lễ phép là một cách giản dị mà chân thành để bày tỏ lòng kính trọng với thầy cô.',
    hintSignificance: 'Mật mã mở khóa Trái Tim Thư Viện: TÔN SƯ TRỌNG ĐẠO.',
  },
];
