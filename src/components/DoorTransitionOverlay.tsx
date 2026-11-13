import React, { useEffect, useState } from 'react';
import { soundManager } from '../utils/audio';

interface DoorTransitionOverlayProps {
  isTransitioning: boolean;
  targetRoomName?: string;
}

export const DoorTransitionOverlay: React.FC<DoorTransitionOverlayProps> = ({
  isTransitioning,
  targetRoomName = 'ĐANG MỞ: PHÒNG LỊCH SỬ',
}) => {
  const [gatePhase, setGatePhase] = useState<'sealing' | 'unlocking' | 'open'>('sealing');

  useEffect(() => {
    if (!isTransitioning) {
      setGatePhase('sealing');
      return;
    }

    setGatePhase('sealing');

    // Bước 1: Sau 2.2s giải mã ấn chú -> thêm class 'unlocking' để bùng sáng vòng tròn ma thuật (0.6s)
    const unlockTimer = setTimeout(() => {
      soundManager.playSparkle();
      setGatePhase('unlocking');
    }, 2200);

    // Bước 2: Đợi vòng tròn bùng sáng xong (0.6s) thì kéo 2 cánh cửa ra (1.8s)
    const openTimer = setTimeout(() => {
      soundManager.playDoorTransition();
      setGatePhase('open');
    }, 2800);

    return () => {
      clearTimeout(unlockTimer);
      clearTimeout(openTimer);
    };
  }, [isTransitioning]);

  if (!isTransitioning) return null;

  const phaseClass =
    gatePhase === 'unlocking' ? 'unlocking' : gatePhase === 'open' ? 'open' : '';

  return (
    <div id="gate-container" className={`gate-container ${phaseClass}`}>
      <div className="door door-left"></div>
      <div className="door door-right"></div>

      <div className="center-console">
        {/* Vòng tròn ma thuật (Magic Seal SVG) */}
        <div className="magic-seal" id="magic-seal">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Vòng tròn ngoài cùng */}
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#ffd700"
              strokeWidth="1.5"
              strokeDasharray="5 5"
            />
            <circle cx="50" cy="50" r="43" fill="none" stroke="#ffd700" strokeWidth="1" />

            {/* Ngôi sao 6 cánh (Hexagram) */}
            <polygon points="50,10 85,70 15,70" fill="none" stroke="#ffd700" strokeWidth="1.5" />
            <polygon points="50,90 15,30 85,30" fill="none" stroke="#ffd700" strokeWidth="1.5" />

            {/* Vòng tròn trong */}
            <circle cx="50" cy="50" r="23" fill="none" stroke="#ffd700" strokeWidth="2" />

            {/* Lõi năng lượng */}
            <circle cx="50" cy="50" r="8" fill="#ffd700" />

            {/* Các ký tự cổ (Trang trí bằng các hình khối nhỏ) */}
            <circle cx="50" cy="18" r="2" fill="#ffd700" />
            <circle cx="50" cy="82" r="2" fill="#ffd700" />
            <circle cx="23" cy="50" r="2" fill="#ffd700" />
            <circle cx="77" cy="50" r="2" fill="#ffd700" />
          </svg>
        </div>

        {/* Thanh trạng thái */}
        <div className="loading-badge">
          <span>
            {targetRoomName}
            <span className="dots"></span>
          </span>
        </div>
      </div>
    </div>
  );
};

