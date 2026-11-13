import React, { useState, useEffect } from 'react';
import { RoomId, InventoryItem, TeacherCard, TaskState } from './types/game';
import { soundManager } from './utils/audio';

// Components
import { StartScreen } from './components/StartScreen';
import { StoryCutscene } from './components/StoryCutscene';
import { BottomNav } from './components/BottomNav';
import { LumiGuide } from './components/LumiGuide';
import { InventoryModal } from './components/InventoryModal';
import { RoomMapModal } from './components/RoomMapModal';
import { HeartUnlockModal } from './components/HeartUnlockModal';
import { CardViewModal } from './components/CardViewModal';
import { VictoryScreen } from './components/VictoryScreen';
import { DoorTransitionOverlay } from './components/DoorTransitionOverlay';
import { MagicDustOverlay } from './components/MagicDustOverlay';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { RotateOrientationPrompt } from './components/RotateOrientationPrompt';

// Rooms
import { Room1History } from './components/rooms/Room1History';
import { Room2Teachers } from './components/rooms/Room2Teachers';
import { Room3Literature } from './components/rooms/Room3Literature';
import { Room4Memories } from './components/rooms/Room4Memories';
import { Room5Gratitude } from './components/rooms/Room5Gratitude';
import { PracticeQuizTab } from './components/rooms/PracticeQuizTab';
import { BookOpen, X } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'escape_room_2011_save_v1';

const ROOM_NAMES: Record<RoomId, string> = {
  1: 'PHÒNG LỊCH SỬ',
  2: 'PHÒNG DANH SƯ',
  3: 'PHÒNG VĂN HỌC',
  4: 'PHÒNG KÝ ỨC',
  5: 'PHÒNG TRI ÂN',
};

export default function App() {
  const isTestPoemMode =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('test') === 'poem';

  const [showStartScreen, setShowStartScreen] = useState(!isTestPoemMode);
  const [showCutscene, setShowCutscene] = useState(false);
  const [activeTab, setActiveTab] = useState<'explore' | 'practice' | 'quiz' | 'inventory'>('explore');

  // Core Game Progress States
  const [currentRoom, setCurrentRoom] = useState<RoomId>(isTestPoemMode ? 3 : 1);
  const [unlockedRooms, setUnlockedRooms] = useState<RoomId[]>(isTestPoemMode ? [1, 2, 3] : [1]);
  const [completedRooms, setCompletedRooms] = useState<RoomId[]>([]);
  const [score, setScore] = useState<number>(0);
  const [taskStates, setTaskStates] = useState<Record<string, TaskState>>({});
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [collectedShards, setCollectedShards] = useState<number[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [savedCard, setSavedCard] = useState<TeacherCard | null>(null);

  // Transition State
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTitle, setTransitionTitle] = useState('ĐANG CHUYỂN PHÒNG...');
  const [roomOpenDustKey, setRoomOpenDustKey] = useState<number>(1);

  // Sound
  const [isMuted, setIsMuted] = useState(false);

  // Modals
  const [showLumiModal, setShowLumiModal] = useState(false);
  const [lumiMessage, setLumiMessage] = useState<string>(
    'Chào mừng bạn đến với Escape Room Thư Viện 20/11! Hãy nhấp vào các đồ vật lấp lánh trong căn phòng để giải mã manh mối nhé.'
  );
  const [lumiHint, setLumiHint] = useState<string | undefined>(undefined);

  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showHeartModal, setShowHeartModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showVictoryScreen, setShowVictoryScreen] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Preload all GitHub images across all rooms & Victory scenes on startup for instant loading
  useEffect(() => {
    const preloadUrls = [
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/Th%C6%B0%20vi%E1%BB%87n%20%C4%91%E1%BB%93ng%20h%E1%BB%93%20steampunk%20huy%E1%BB%81n%20%E1%BA%A3o.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/R%C6%B0%C6%A1ng%20kho%20b%C3%A1u%20c%E1%BB%95%20%C4%91%E1%BA%A1i%20ph%C3%A1t%20s%C3%A1ng%20xanh-3.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%202.%20PH%C3%92NG%20DANH%20S%C6%AF%20%E2%80%93%20CH%C3%82N%20DUNG%20B%C3%8D%20%E1%BA%A8N/Ph%C3%B2ng%20Danh%20S%C6%B0_%20Ch%C3%A2n%20Dung%20B%C3%AD%20%E1%BA%A8n.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%203.%20PH%C3%92NG%20V%C4%82N%20H%E1%BB%8CC%20%E2%80%93%20NH%E1%BB%AENG%20V%E1%BA%A6N%20TH%C6%A0%20TH%E1%BA%A4T%20L%E1%BA%A0C/Ph%C3%B2ng%20V%C4%83n%20H%E1%BB%8Dc_%20Nh%E1%BB%AFng%20V%E1%BA%A7n%20Th%C6%A1%20Th%E1%BA%A5t%20L%E1%BA%A1c.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%203.%20PH%C3%92NG%20V%C4%82N%20H%E1%BB%8CC%20%E2%80%93%20NH%E1%BB%AENG%20V%E1%BA%A6N%20TH%C6%A0%20TH%E1%BA%A4T%20L%E1%BA%A0C/Quy%E1%BB%83n%20th%C6%A1%20c%E1%BB%95%20%C4%91ang%20m%E1%BB%9F,%20Nh%E1%BB%AFng%20trang%20th%C6%A1%20bay%20l%C6%A1%20l%E1%BB%ADng.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%203.%20PH%C3%92NG%20V%C4%82N%20H%E1%BB%8CC%20%E2%80%93%20NH%E1%BB%AENG%20V%E1%BA%A6N%20TH%C6%A0%20TH%E1%BA%A4T%20L%E1%BA%A0C/Chi%E1%BA%BFc%20b%C3%BAt%20l%C3%B4ng%20m%E1%BA%A5t%20%C3%A1nh%20s%C3%A1ng.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/NHI%E1%BB%86M%20V%E1%BB%A4/C%C3%A1i%20b%C3%A0n.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%204.%20PH%C3%92NG%20K%C3%9D%20%E1%BB%A8C%20%E2%80%93%20H%E1%BB%98P%20TH%E1%BB%9CI%20GIAN/PH%C3%92NG%204.%20PH%C3%92NG%20K%C3%9D%20%E1%BB%A8C%20%E2%80%93%20H%E1%BB%98P%20TH%E1%BB%9CI%20GIAN.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%204.%20PH%C3%92NG%20K%C3%9D%20%E1%BB%A8C%20%E2%80%93%20H%E1%BB%98P%20TH%E1%BB%9CI%20GIAN/Album%20%E1%BA%A3nh%20ch%C6%B0a%20ho%C3%A0n%20ch%E1%BB%89nh.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%204.%20PH%C3%92NG%20K%C3%9D%20%E1%BB%A8C%20%E2%80%93%20H%E1%BB%98P%20TH%E1%BB%9CI%20GIAN/Nh%E1%BB%AFng%20k%E1%BB%B7%20v%E1%BA%ADt%20h%E1%BB%8Dc%20%C4%91%C6%B0%E1%BB%9Dng.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%204.%20PH%C3%92NG%20K%C3%9D%20%E1%BB%A8C%20%E2%80%93%20H%E1%BB%98P%20TH%E1%BB%9CI%20GIAN/Chi%E1%BA%BFc%20h%E1%BB%99p%20th%E1%BB%9Di%20gian.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/NHI%E1%BB%86M%20V%E1%BB%A4%201/C%C3%B4%20gi%C3%A1o%20%C4%91%C3%B3n%20em%20v%C3%A0o%20l%E1%BB%9Bp-1.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/NHI%E1%BB%86M%20V%E1%BB%A4%201/C%C3%B4%20gi%C3%A1o%20t%E1%BA%ADn%20t%C3%A2m%20b%C3%AAn%20h%E1%BB%8Dc%20tr%C3%B2-2.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/NHI%E1%BB%86M%20V%E1%BB%A4%201/Th%E1%BA%A7y%20c%C3%B4%20kh%C3%ADch%20l%E1%BB%87%20h%E1%BB%8Dc%20tr%C3%B2%20trong%20l%E1%BB%9Bp%20h%E1%BB%8Dc-3.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/NHI%E1%BB%86M%20V%E1%BB%A4%201/Tri%20%C3%A2n%20c%C3%B4%20gi%C3%A1o%20trong%20l%E1%BB%9Bp%20h%E1%BB%8Dc%20t%C6%B0%C6%A1i%20vui-4.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/NHI%E1%BB%86M%20V%E1%BB%A4%201/C%C3%B4%20gi%C3%A1o%20v%C3%A0%20h%E1%BB%8Dc%20tr%C3%B2%20m%E1%BB%ABng%20ng%C3%A0y%20%C4%91%E1%BA%B7c%20bi%E1%BB%87t-5.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%205.%20PH%C3%92NG%20TRI%20%C3%82N%20%E2%80%93%20M%E1%BA%ACT%20M%C3%83%20CU%E1%BB%90I%20C%C3%99NG/PH%C3%92NG%205.%20PH%C3%92NG%20TRI%20%C3%82N%20%E2%80%93%20M%E1%BA%ACT%20M%C3%83%20CU%E1%BB%90I%20C%C3%99NG.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%205.%20PH%C3%92NG%20TRI%20%C3%82N%20%E2%80%93%20M%E1%BA%ACT%20M%C3%83%20CU%E1%BB%90I%20C%C3%99NG/CU%E1%BB%90N%20S%E1%BB%94%20TRI%20TH%E1%BB%A8C.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%205.%20PH%C3%92NG%20TRI%20%C3%82N%20%E2%80%93%20M%E1%BA%ACT%20M%C3%83%20CU%E1%BB%90I%20C%C3%99NG/C%C3%82Y%20TRI%20%C3%82N.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/PH%C3%92NG%205.%20PH%C3%92NG%20TRI%20%C3%82N%20%E2%80%93%20M%E1%BA%ACT%20M%C3%83%20CU%E1%BB%90I%20C%C3%99NG/TR%C3%81I%20TIM%20TH%C6%AF%20VI%E1%BB%86N.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/M%C3%80N%20K%E1%BA%BET%20TH%C3%9AC/PH%C3%92NG%201.%20PH%C3%92NG%20L%E1%BB%8ACH%20S%E1%BB%AC%20-%20GI%E1%BA%A2I%20M%C3%83%20D%E1%BA%A4U%20M%E1%BB%90C%20TH%E1%BB%9CI%20GIAN.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/M%C3%80N%20K%E1%BA%BET%20TH%C3%9AC/PH%C3%92NG%202.%20PH%C3%92NG%20DANH%20S%C6%AF%20%E2%80%93%20CH%C3%82N%20DUNG%20B%C3%8D%20%E1%BA%A8N.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/M%C3%80N%20K%E1%BA%BET%20TH%C3%9AC/PH%C3%92NG%203.%20PH%C3%92NG%20V%C4%82N%20H%E1%BB%8CC%20%E2%80%93%20NH%E1%BB%AENG%20V%E1%BA%A6N%20TH%C6%A0%20TH%E1%BA%A4T%20L%E1%BA%A0C.png',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/M%C3%80N%20K%E1%BA%BET%20TH%C3%9AC/PH%C3%92NG%204.%20PH%C3%92NG%20K%C3%9D%20%E1%BB%A8C%20%E2%80%93%20H%E1%BB%98P%20TH%E1%BB%9CI%20GIAN.png',
      'https://github.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/blob/main/Tri%E1%BB%83n%20l%C3%A3m%20di%20s%E1%BA%A3n%20ng%C6%B0%E1%BB%9Di%20th%E1%BA%A7y%20huy%E1%BB%81n%20%E1%BA%A3o.png?raw=true',
      'https://github.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/blob/main/Th%C6%B0%20vi%E1%BB%87n%20ma%20thu%E1%BA%ADt%20v%C3%A0%20kho%20l%C6%B0u%20tr%E1%BB%AF%20b%C3%AD%20m%E1%BA%ADt.png?raw=true',
      'https://github.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/blob/main/Cu%E1%BB%99n%20th%C6%B0%20c%E1%BB%95%20phong%20c%E1%BA%A3nh%20%C3%81%20%C4%90%C3%B4ng-1.png?raw=true',
      'https://raw.githubusercontent.com/honglinh120624-tech/GiaiCuuThuVien20.11_EscapeRoom/main/M%C3%80N%20K%E1%BA%BET%20TH%C3%9AC/PH%C3%92NG%205.%20PH%C3%92NG%20TRI%20%C3%82N%20M%E1%BA%ACT%20M%C3%83%20CU%E1%BB%90I%20C%C3%99NG.png',
    ];
    preloadUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  // Reset game state on mount so that reloading the page starts fresh
  useEffect(() => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  // Ensure key items are always maintained in inventory if tasks are completed
  useEffect(() => {
    if (taskStates['room4_task1']?.completed) {
      setInventory((prev) => {
        if (!prev.some((i) => i.id === 'calendar_sheet_2011')) {
          return [
            ...prev,
            {
              id: 'calendar_sheet_2011',
              name: 'Tờ Lịch Ngày 20/11',
              icon: 'fa-calendar-days text-[#FFD700]',
              description: 'Mảnh lịch cổ Ngày Nhà giáo Việt Nam 20/11 tìm được trong Album. Nhấp để xem tờ lịch!',
              type: 'item',
            },
          ];
        }
        return prev;
      });
    }
  }, [taskStates]);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
  };

  const changeRoomWithTransition = (targetRoomId: RoomId) => {
    if (isTransitioning) return;
    soundManager.playDoorTransition();
    setTransitionTitle(`ĐANG MỞ: ${ROOM_NAMES[targetRoomId]}`);
    setIsTransitioning(true);
    setRoomOpenDustKey((prev) => prev + 1);

    setTimeout(() => {
      setShowStartScreen(false);
      setShowCutscene(false);
      setCurrentRoom(targetRoomId);
      setActiveTab('explore');
      setRoomOpenDustKey((prev) => prev + 1);
    }, 200);

    setTimeout(() => {
      setIsTransitioning(false);
      setRoomOpenDustKey((prev) => prev + 1);
    }, 4600);
  };

  const handleFinishCutscene = () => {
    setShowCutscene(false);
    changeRoomWithTransition(1);
  };

  const handleResetGame = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setCurrentRoom(1);
    setUnlockedRooms([1]);
    setCompletedRooms([]);
    setScore(0);
    setTaskStates({});
    setCollectedLetters([]);
    setCollectedShards([]);
    setInventory([]);
    setSavedCard(null);
    setShowVictoryScreen(false);
    setShowCutscene(false);
    setShowStartScreen(true);
    soundManager.playClick();
  };

  // Helper to mark task completed and grant rewards
  const completeTask = (
    taskId: string,
    roomId: RoomId,
    taskScore: number,
    letterGranted?: string,
    shardGranted?: number,
    itemGranted?: InventoryItem
  ) => {
    // Always ensure reward items, shards, and letters are added
    if (letterGranted) {
      setCollectedLetters((prev) => (prev.includes(letterGranted) ? prev : [...prev, letterGranted]));
    }

    if (shardGranted) {
      setCollectedShards((prev) => (prev.includes(shardGranted) ? prev : [...prev, shardGranted]));
    }

    if (itemGranted) {
      setInventory((prev) => (prev.some((i) => i.id === itemGranted.id) ? prev : [...prev, itemGranted]));
    }

    if (taskStates[taskId]?.completed) return;

    const nextTaskStates = {
      ...taskStates,
      [taskId]: { completed: true, score: taskScore, hintsUsed: 0, wrongAttempts: 0 },
    };
    setTaskStates(nextTaskStates);
    setScore((prev) => prev + taskScore);

    const roomTask1 = `room${roomId}_task1`;
    const roomTask2 = `room${roomId}_task2`;
    const t1Done = nextTaskStates[roomTask1]?.completed;
    const t2Done = nextTaskStates[roomTask2]?.completed;

    if (t1Done && t2Done) {
      const nextCompletedRooms = completedRooms.includes(roomId)
        ? completedRooms
        : [...completedRooms, roomId];
      if (!completedRooms.includes(roomId)) {
        setCompletedRooms(nextCompletedRooms);
      }
      const nextRoomId = (roomId + 1) as RoomId;
      if (nextRoomId <= 5 && !unlockedRooms.includes(nextRoomId)) {
        setUnlockedRooms((prev) => [...prev, nextRoomId]);
      }
    }

    // Gửi điểm về CMS theo thang 10 nhiệm vụ (5 phòng x 2 nhiệm vụ)
    const completedTasksCount = Object.values(nextTaskStates).filter((t) => t.completed).length;
    window.parent.postMessage(
      {
        answerTrue: completedTasksCount, // Số nhiệm vụ đã hoàn thành đạt chuẩn
        totalQuestion: 10, // Tổng 10 nhiệm vụ
        command: 'submit_result', // Không được đổi
      },
      '*'
    );
  };

  const handleOpenLumiHint = (hint: string) => {
    setLumiHint(hint);
    setLumiMessage('Lumi đã tìm thấy manh mối mở khóa cho căn phòng này! Đọc kỹ gợi ý dưới đây nhé.');
    setShowLumiModal(true);
  };

  const handleUseHintDeductPoints = () => {
    setScore((prev) => Math.max(0, prev - 15));
  };

  // Quick Complete Test Mode helper
  const handleQuickCompleteAllRooms = () => {
    soundManager.playSparkle();
    soundManager.playCorrect();
    setUnlockedRooms([1, 2, 3, 4, 5]);
    setCompletedRooms([1, 2, 3, 4, 5]);
    setCollectedShards([1, 2, 3, 4, 5]);
    setCollectedLetters(['T', 'R', 'I', 'Â', 'N']);
    setScore(1000);
    setTaskStates({
      room1_task1: { completed: true, score: 100, hintsUsed: 0, wrongAttempts: 0 },
      room1_task2: { completed: true, score: 100, hintsUsed: 0, wrongAttempts: 0 },
      room2_task1: { completed: true, score: 100, hintsUsed: 0, wrongAttempts: 0 },
      room2_task2: { completed: true, score: 100, hintsUsed: 0, wrongAttempts: 0 },
      room3_task1: { completed: true, score: 100, hintsUsed: 0, wrongAttempts: 0 },
      room3_task2: { completed: true, score: 100, hintsUsed: 0, wrongAttempts: 0 },
      room4_task1: { completed: true, score: 100, hintsUsed: 0, wrongAttempts: 0 },
      room4_task2: { completed: true, score: 100, hintsUsed: 0, wrongAttempts: 0 },
      room5_task1: { completed: true, score: 100, hintsUsed: 0, wrongAttempts: 0 },
      room5_task2: { completed: true, score: 100, hintsUsed: 0, wrongAttempts: 0 },
    });
    setInventory([
      { id: 'bronze_key', name: 'Chìa Khóa Đồng Cổ', icon: 'fa-key text-amber-500', description: 'Chìa khóa đồng cổ thu được từ Cuộn thánh chỉ Dấu mốc lịch sử.', type: 'key' },
      { id: 'secret_key_1', name: 'Chìa Khóa Bí Mật Số 1', icon: 'fa-book text-[#FFD700]', description: 'Manh mối 1/5: Truyền thống Tôn sư trọng đạo.', type: 'key' },
      { id: 'shard2', name: 'Mảnh Sáng Trí Tuệ (Chìa Khóa 2)', icon: 'fa-brain text-blue-400', description: 'Manh mối 2/5: Đề cao vị trí của người thầy.', type: 'shard', letter: 'R', shardNumber: 2 },
      { id: 'shard3', name: 'Mảnh Sáng Ngôn Từ (Chìa Khóa 3)', icon: 'fa-feather text-purple-400', description: 'Manh mối 3/5: Kính trọng, biết ơn sâu sắc thầy cô.', type: 'shard', letter: 'I', shardNumber: 3 },
      { id: 'shard4', name: 'Mảnh Sáng Kỷ Niệm (Chìa Khóa 4)', icon: 'fa-star text-amber-400', description: 'Manh mối 4/5: Uống nước nhớ nguồn.', type: 'shard', letter: 'Â', shardNumber: 4 },
      { id: 'shard5', name: 'Mảnh Sáng Yêu Thương (Chìa Khóa 5)', icon: 'fa-heart text-rose-400', description: 'Manh mối 5/5: Lời nhắc nhở khắc ghi công ơn.', type: 'shard', letter: 'N', shardNumber: 5 },
    ]);

    window.parent.postMessage(
      {
        answerTrue: 10, // Hoàn thành trọn vẹn cả 10 nhiệm vụ
        totalQuestion: 10, // Thang 10 nhiệm vụ
        command: 'submit_result', // Không được đổi
      },
      '*'
    );
  };

  const handleSuccessFinalUnlock = () => {
    window.parent.postMessage(
      {
        answerTrue: 10, // Hoàn thành trọn vẹn cả 10 nhiệm vụ
        totalQuestion: 10, // Thang 10 nhiệm vụ
        command: 'submit_result', // Không được đổi
      },
      '*'
    );
    setShowVictoryScreen(true);
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#00203F] text-[#FFFFE3] flex flex-col font-sans relative">
      {/* MOBILE & IPAD LANDSCAPE ORIENTATION PROMPT OVERLAY */}
      <RotateOrientationPrompt />

      {/* IMMERSIVE ROOM DOOR CLOSING & FADE TRANSITION OVERLAY */}
      <DoorTransitionOverlay
        isTransitioning={isTransitioning}
        targetRoomName={transitionTitle}
      />

      {/* SPARKLING GOLDEN MAGIC DUST OVERLAY ON ROOM OPENING */}
      {!showStartScreen && !showCutscene && (
        <MagicDustOverlay
          triggerKey={`${currentRoom}-${roomOpenDustKey}`}
          isTransitioning={isTransitioning}
        />
      )}

      {/* STORY CUTSCENE MOVIE PLAYER */}
      {showCutscene && (
        <StoryCutscene onFinishCutscene={handleFinishCutscene} />
      )}

      {/* 1. START SCREEN */}
      {showStartScreen && !showCutscene ? (
        <StartScreen
          onStartCutscene={() => setShowCutscene(true)}
          onEnterRoom={(roomId) => changeRoomWithTransition(roomId)}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onOpenInstructions={() => setShowInstructionsModal(true)}
        />
      ) : !showCutscene ? (
        /* MAIN APPLICATION INTERFACE (Header removed to maximize room view height) */
        <div className="w-full h-full flex flex-col relative z-10 pb-[60px]">
          {/* Room View Container - Full Main Coverage */}
          <main className="flex-1 w-full h-full p-0 overflow-hidden relative">
            {activeTab === 'inventory' ? (
              <div className="w-full h-full flex items-center justify-center">
                <InventoryModal
                  isOpen={true}
                  onClose={() => setActiveTab('explore')}
                  inventory={inventory}
                  collectedLetters={collectedLetters}
                  collectedShards={collectedShards}
                  savedCard={savedCard}
                  onViewCard={() => setShowCardModal(true)}
                />
              </div>
            ) : activeTab === 'quiz' ? (
              <PracticeQuizTab />
            ) : (
              /* Room Exploration Views */
              <div className="w-full h-full flex flex-col justify-center">
                {currentRoom === 1 && (
                  <Room1History
                    task1Done={!!taskStates['room1_task1']?.completed}
                    task2Done={!!taskStates['room1_task2']?.completed}
                    onCompleteTask1={(s) =>
                      completeTask('room1_task1', 1, s, undefined, undefined, {
                        id: 'bronze_key',
                        name: 'Chìa Khóa Đồng Cổ',
                        icon: 'fa-key text-amber-500',
                        description: 'Chìa khóa đồng cổ thu được từ Cuộn thánh chỉ Dấu mốc lịch sử.',
                        type: 'key',
                      })
                    }
                    onCompleteTask2={(s) =>
                      completeTask('room1_task2', 1, s, 'T', 1, {
                        id: 'secret_key_1',
                        name: 'Chìa Khóa Pha Lê Vàng Đồng (Số 1)',
                        icon: 'fa-book text-[#FFD700]',
                        description: 'Gợi ý 1/5: Một truyền thống đạo lí tốt đẹp của dân tộc Việt Nam, đề cao sự kính trọng thầy cô và trân trọng những giá trị tốt đẹp được truyền dạy qua bao thế hệ.',
                        type: 'key',
                      })
                    }
                    activeMode={activeTab as any}
                    onNavigateToRoom2={() => changeRoomWithTransition(2)}
                  />
                )}

                {currentRoom === 2 && (
                  <Room2Teachers
                    task1Done={!!taskStates['room2_task1']?.completed}
                    task2Done={!!taskStates['room2_task2']?.completed}
                    onCompleteTask1={(s) => completeTask('room2_task1', 2, s)}
                    onCompleteTask2={(s) =>
                      completeTask('room2_task2', 2, s, 'R', 2, {
                        id: 'secret_key_2',
                        name: 'Chìa Khóa Bí Mật Số 2',
                        icon: 'fa-user-graduate text-[#FFD700]',
                        description: 'Manh mối 2/5: Người thầy không chỉ truyền dạy kiến thức mà còn bồi dưỡng nhân cách cho các thế hệ học trò.',
                        type: 'key',
                      })
                    }
                    onOpenLumiHint={handleOpenLumiHint}
                    onNavigateToRoom3={() => changeRoomWithTransition(3)}
                  />
                )}

                {currentRoom === 3 && (
                  <Room3Literature
                    task1Done={!!taskStates['room3_task1']?.completed}
                    task2Done={!!taskStates['room3_task2']?.completed}
                    autoOpenTask2={isTestPoemMode}
                    onCompleteTask1={(s) => completeTask('room3_task1', 3, s)}
                    onCompleteTask2={(s) =>
                      completeTask('room3_task2', 3, s, 'I', 3, {
                        id: 'secret_key_3',
                        name: 'Chìa Khóa Bí Mật Số 3',
                        icon: 'fa-feather text-[#FFD700]',
                        description: 'Manh mối 3/5: Tục ngữ "Không thầy đố mày làm nên" đề cao vai trò của người thầy trong việc truyền dạy kiến thức và giúp học trò học tập, tiến bộ.',
                        type: 'key',
                      })
                    }
                    onOpenLumiHint={handleOpenLumiHint}
                    onNavigateToRoom4={() => changeRoomWithTransition(4)}
                  />
                )}

                {currentRoom === 4 && (
                  <Room4Memories
                    task1Done={!!taskStates['room4_task1']?.completed}
                    task2Done={!!taskStates['room4_task2']?.completed}
                    onCompleteTask1={(s) =>
                      completeTask('room4_task1', 4, s, undefined, undefined, {
                        id: 'calendar_sheet_2011',
                        name: 'Tờ Lịch Ngày 20/11',
                        icon: 'fa-calendar-days text-[#FFD700]',
                        description: 'Mảnh lịch cổ Ngày Nhà giáo Việt Nam 20/11 tìm được trong Album. Nhấp để xem tờ lịch!',
                        type: 'item',
                      })
                    }
                    onCompleteTask2={(s) =>
                      completeTask('room4_task2', 4, s, 'Â', 4, {
                        id: 'secret_key_4',
                        name: 'Chìa Khóa Bí Mật Số 4',
                        icon: 'fa-box-archive text-[#FFD700]',
                        description: 'Manh mối 4/5: Học sinh thể hiện tinh thần "kính thầy, yêu bạn" qua việc lễ phép với thầy cô, chăm chú nghe giảng, đoàn kết và sẵn sàng giúp đỡ bạn bè.',
                        type: 'key',
                        letter: 'Â',
                        shardNumber: 4,
                      })
                    }
                    onOpenLumiHint={handleOpenLumiHint}
                    onNavigateToRoom5={() => changeRoomWithTransition(5)}
                  />
                )}

                {currentRoom === 5 && (
                  <Room5Gratitude
                    task1Done={!!taskStates['room5_task1']?.completed}
                    task2Done={!!taskStates['room5_task2']?.completed}
                    onCompleteTask1={(s) =>
                      completeTask('room5_task1', 5, s, undefined, undefined, {
                        id: 'crystal_key',
                        name: 'Chìa Khóa Pha Lê',
                        icon: 'fa-gem text-[#ADEFD1]',
                        description: 'Dùng mở phong ấn Trái Tim Thư Viện.',
                        type: 'key',
                      })
                    }
                    onCompleteTask2={(s) =>
                      completeTask('room5_task2', 5, s, 'N', 5, {
                        id: 'shard5',
                        name: 'Mảnh Sáng Yêu Thương',
                        icon: 'fa-heart text-rose-400',
                        description: 'Nguồn năng lượng tri thức thứ năm (Chữ N).',
                        type: 'shard',
                        letter: 'N',
                        shardNumber: 5,
                      })
                    }
                    onSaveCard={(card) => setSavedCard(card)}
                    onOpenLumiHint={handleOpenLumiHint}
                    onOpenHeartModal={() => setShowHeartModal(true)}
                  />
                )}
              </div>
            )}
          </main>

          {/* Fixed Bottom Bar containing all Controls & Navigation */}
          <BottomNav
            onGoHome={() => setShowStartScreen(true)}
            onOpenMap={() => setShowMapModal(true)}
            onOpenHeartModal={() => setShowHeartModal(true)}
            onOpenInventory={() => setShowInventoryModal(true)}
          />
        </div>
      ) : null}

      {/* MODALS */}

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirmReset={handleResetGame}
      />

      {/* Lumi Guide Modal */}
      <LumiGuide
        isOpen={showLumiModal}
        onClose={() => setShowLumiModal(false)}
        message={lumiMessage}
        hintText={lumiHint}
        onUseHint={handleUseHintDeductPoints}
      />

      {/* Inventory Backpack Modal */}
      <InventoryModal
        isOpen={showInventoryModal}
        onClose={() => setShowInventoryModal(false)}
        inventory={inventory}
        collectedLetters={collectedLetters}
        collectedShards={collectedShards}
        savedCard={savedCard}
        onViewCard={() => setShowCardModal(true)}
      />

      {/* Room Map Navigation Modal */}
      <RoomMapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        currentRoom={currentRoom}
        unlockedRooms={unlockedRooms}
        completedRooms={completedRooms}
        onSelectRoom={(roomId) => {
          changeRoomWithTransition(roomId);
        }}
      />

      {/* Heart of Library Unlocking Secret Code Modal */}
      <HeartUnlockModal
        isOpen={showHeartModal}
        onClose={() => setShowHeartModal(false)}
        collectedLetters={collectedLetters}
        collectedShardsCount={collectedShards.length}
        onSuccessUnlock={handleSuccessFinalUnlock}
      />

      {/* Saved Gratitude Teacher Card Viewer Modal */}
      <CardViewModal
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
        card={savedCard}
      />

      {/* Victory Celebration Screen */}
      {showVictoryScreen && (
        <VictoryScreen
          score={score}
          completedTasksCount={Object.values(taskStates).filter((t) => t.completed).length}
          savedCard={savedCard}
          onViewCard={() => setShowCardModal(true)}
          onPlayAgain={handleResetGame}
          onClose={() => {
            setShowVictoryScreen(false);
            setShowStartScreen(true);
          }}
        />
      )}

      {/* Game Instructions Modal */}
      {showInstructionsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-[2000] p-4 animate-pop">
          <div className="bg-[#00203F] border-2 border-[#ADEFD1] rounded-3xl max-w-lg w-full p-6 text-[#FFFFE3] relative shadow-2xl">
            <button
              onClick={() => setShowInstructionsModal(false)}
              className="absolute top-4 right-4 text-[#ADEFD1] hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-lg font-bold text-[#FFD700] uppercase">
                HƯỚNG DẪN CHƠI ESCAPE ROOM
              </h2>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-[#FFFFE3]">
              <p>
                <strong>1. Cốt truyện:</strong> Đêm 19/11, kho tư liệu 20/11 bị khóa. Bạn là Người Gác Tri Thức Tập Sự cùng Lumi đi qua 5 căn phòng để thu thập 5 Mảnh Sáng Tri Thức.
              </p>
              <p>
                <strong>2. Nhiệm vụ:</strong> Mỗi căn phòng có 2 nhiệm vụ tương tác trực quan (sắp xếp thời gian, giải rương cổ, nhận diện danh sư, ghép thơ, tìm đồ vật ẩn, làm thiệp).
              </p>
              <p>
                <strong>3. Phần thưởng:</strong> Hoàn thành mỗi phòng sẽ cho bạn 1 Chìa Khóa Bí Mật & 1 Bức Thư Manh Mối quý giá.
              </p>
              <p>
                <strong>4. Giải cứu:</strong> Bấm vào <strong>TRÁI TIM THƯ VIỆN</strong> và dùng 5 manh mối để đoán câu nói <strong>"TÔN SƯ TRỌNG ĐẠO"</strong> để chiến thắng!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
