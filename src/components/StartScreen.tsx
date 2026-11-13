import React, { useState } from 'react';
import { FireworksCanvas } from './FireworksCanvas';
import { soundManager } from '../utils/audio';
import { RoomId } from '../types/game';

interface StartScreenProps {
  onStartCutscene: () => void;
  onEnterRoom: (roomId: RoomId) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenInstructions: () => void;
}

interface MagicDoorSvgProps {
  uid: string;
  isOpen: boolean;
}

const MagicDoorSvg: React.FC<MagicDoorSvgProps> = ({ uid, isOpen }) => {
  const glowId = `magic-glow-${uid}`;
  const portalBgId = `portal-bg-${uid}`;
  const archGradId = `arch-grad-${uid}`;
  const doorWoodId = `door-wood-${uid}`;
  const goldGradId = `gold-grad-${uid}`;
  const gemCyanId = `gem-cyan-${uid}`;
  const clipId = `inner-arch-clip-${uid}`;
  const sparkleId = `sparkle-${uid}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 450"
      className={`w-full h-full select-none pointer-events-none magic-door-svg ${
        isOpen ? 'is-open' : ''
      }`}
    >
      <defs>
        <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <radialGradient id={portalBgId} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#fff9ae" />
          <stop offset="35%" stopColor="#ff7eb3" />
          <stop offset="70%" stopColor="#7afcff" />
          <stop offset="100%" stopColor="#5b247a" />
        </radialGradient>

        <linearGradient id={archGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a18cd1" />
          <stop offset="50%" stopColor="#7b5fac" />
          <stop offset="100%" stopColor="#543884" />
        </linearGradient>

        <linearGradient id={doorWoodId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff9a44" />
          <stop offset="100%" stopColor="#fc6076" />
        </linearGradient>

        <linearGradient id={goldGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffe259" />
          <stop offset="100%" stopColor="#ffa751" />
        </linearGradient>

        <radialGradient id={gemCyanId} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#00f2fe" />
          <stop offset="100%" stopColor="#4facfe" />
        </radialGradient>

        <clipPath id={clipId}>
          <path d="M 110,360 L 110,200 A 90,90 0 0,1 290,200 L 290,360 Z" />
        </clipPath>

        <g id={sparkleId}>
          <path d="M 0,-10 Q 0,0 10,0 Q 0,0 0,10 Q 0,0 -10,0 Q 0,0 0,-10 Z" fill="#fff9ae" />
          <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
        </g>
      </defs>

      {/* 1. Hào quang lấp lánh phía ngoài vòm cổng */}
      <use href={`#${sparkleId}`} x="55" y="150" transform="scale(0.8)" className="crown-gem" />
      <use href={`#${sparkleId}`} x="345" y="140" transform="scale(0.9)" className="crown-gem" />
      <use href={`#${sparkleId}`} x="70" y="75" transform="scale(0.6)" />
      <use href={`#${sparkleId}`} x="330" y="70" transform="scale(0.7)" />

      {/* 2. Không gian phép thuật bên trong (hiện ra khi cửa mở) */}
      <g clipPath={`url(#${clipId})`}>
        {/* Nền vũ trụ cổ tích */}
        <rect x="105" y="105" width="190" height="260" fill={`url(#${portalBgId})`} className="portal-light" />

        {/* Vòng xoáy ánh sáng */}
        <g className="vortex" opacity="0.75">
          <circle cx="200" cy="235" r="85" fill="none" stroke="#ffffff" strokeWidth="6" strokeDasharray="25 18" />
          <circle cx="200" cy="235" r="60" fill="none" stroke="#fff9ae" strokeWidth="5" strokeDasharray="18 14" />
          <circle cx="200" cy="235" r="35" fill="none" stroke="#7afcff" strokeWidth="4" strokeDasharray="12 10" />
          <circle cx="200" cy="235" r="14" fill="#ffffff" filter={`url(#${glowId})`} />
        </g>

        {/* Các ngôi sao bay lên khi cửa mở */}
        <g className="floating-star-1">
          <use href={`#${sparkleId}`} x="165" y="250" transform="scale(1.1)" />
          <circle cx="220" cy="280" r="4" fill="#fff9ae" />
        </g>
        <g className="floating-star-2">
          <use href={`#${sparkleId}`} x="230" y="210" transform="scale(0.9)" />
          <circle cx="175" cy="190" r="3.5" fill="#ffffff" />
        </g>
        <g className="floating-star-3">
          <use href={`#${sparkleId}`} x="195" y="165" transform="scale(1.3)" />
          <circle cx="205" cy="240" r="5" fill="#7afcff" />
        </g>

        {/* 3. HAI CÁNH CỬA MA THUẬT */}
        {/* Cánh cửa bên trái */}
        <g className="door-left">
          <path
            d="M 110,360 L 110,200 A 90,90 0 0,1 200,110 L 200,360 Z"
            fill={`url(#${doorWoodId})`}
            stroke={`url(#${goldGradId})`}
            strokeWidth="5"
          />
          <path
            d="M 124,342 L 124,205 A 74,74 0 0,1 186,132 L 186,342 Z"
            fill="none"
            stroke="#ffe259"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            opacity="0.85"
          />
          <path
            d="M 165,205 A 18,18 0 1,0 165,240 A 13,13 0 1,1 165,205 Z"
            fill={`url(#${goldGradId})`}
          />
          <rect x="110" y="195" width="16" height="8" rx="4" fill={`url(#${goldGradId})`} />
          <rect x="110" y="305" width="16" height="8" rx="4" fill={`url(#${goldGradId})`} />
          <circle cx="184" cy="255" r="8" fill={`url(#${goldGradId})`} />
          <circle cx="184" cy="255" r="4.5" fill={`url(#${gemCyanId})`} />
        </g>

        {/* Cánh cửa bên phải */}
        <g className="door-right">
          <path
            d="M 200,110 A 90,90 0 0,1 290,200 L 290,360 L 200,360 Z"
            fill={`url(#${doorWoodId})`}
            stroke={`url(#${goldGradId})`}
            strokeWidth="5"
          />
          <path
            d="M 214,132 A 74,74 0 0,1 276,205 L 276,342 L 214,342 Z"
            fill="none"
            stroke="#ffe259"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            opacity="0.85"
          />
          <path
            d="M 245,204 Q 245,222 263,222 Q 245,222 245,240 Q 245,222 227,222 Q 245,222 245,204 Z"
            fill={`url(#${goldGradId})`}
          />
          <rect x="274" y="195" width="16" height="8" rx="4" fill={`url(#${goldGradId})`} />
          <rect x="274" y="305" width="16" height="8" rx="4" fill={`url(#${goldGradId})`} />
          <circle cx="216" cy="255" r="8" fill={`url(#${goldGradId})`} />
          <circle cx="216" cy="255" r="4.5" fill={`url(#${gemCyanId})`} />
        </g>
      </g>

      {/* 4. Khung vòm đá cổ tích bao quanh */}
      <path
        d="M 74,360 L 74,200 A 126,126 0 0,1 326,200 L 326,360 L 290,360 L 290,200 A 90,90 0 0,0 110,200 L 110,360 Z"
        fill={`url(#${archGradId})`}
        stroke={`url(#${goldGradId})`}
        strokeWidth="5"
        strokeLinejoin="round"
      />

      {/* Họa tiết vạch đá & ngọc nhỏ gắn trên vòm */}
      <circle cx="92" cy="260" r="6" fill={`url(#${gemCyanId})`} stroke={`url(#${goldGradId})`} strokeWidth="2" />
      <circle cx="308" cy="260" r="6" fill={`url(#${gemCyanId})`} stroke={`url(#${goldGradId})`} strokeWidth="2" />
      <circle cx="115" cy="145" r="6" fill={`url(#${gemCyanId})`} stroke={`url(#${goldGradId})`} strokeWidth="2" />
      <circle cx="285" cy="145" r="6" fill={`url(#${gemCyanId})`} stroke={`url(#${goldGradId})`} strokeWidth="2" />

      {/* 5. Vương miện ngôi sao & Viên ngọc chủ đạo trên đỉnh cổng */}
      <g className="crown-gem">
        <polygon
          points="200,52 212,76 238,80 219,98 224,124 200,111 176,124 181,98 162,80 188,76"
          fill={`url(#${goldGradId})`}
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="200" cy="90" r="12" fill={`url(#${gemCyanId})`} />
      </g>

      {/* 6. Bậc thềm đá cổ tích phía dưới */}
      <rect x="60" y="360" width="280" height="22" rx="11" fill={`url(#${archGradId})`} stroke={`url(#${goldGradId})`} strokeWidth="4" />
      <rect x="40" y="382" width="320" height="24" rx="12" fill={`url(#${archGradId})`} stroke={`url(#${goldGradId})`} strokeWidth="4" />

      {/* Chấm cỏ/hoa nhỏ trang trí bậc thềm */}
      <circle cx="75" cy="394" r="4" fill="#ffe259" />
      <circle cx="325" cy="394" r="4" fill="#ffe259" />
    </svg>
  );
};

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartCutscene,
  onEnterRoom,
}) => {
  const [openingDoorId, setOpeningDoorId] = useState<string | number | null>(null);

  const handleDoorClick = (id: string | number, action: () => void) => {
    if (openingDoorId !== null) return;
    setOpeningDoorId(id);

    soundManager.playClick();
    soundManager.playSparkle();

    setTimeout(() => {
      action();
    }, 1500);
  };

  const roomButtons = [
    {
      id: 'story',
      name: 'Bắt đầu',
      action: () => onStartCutscene(),
      isPrimary: true,
    },
    {
      id: 1,
      name: 'Phòng 1',
      action: () => onEnterRoom(1 as RoomId),
      isPrimary: false,
    },
    {
      id: 2,
      name: 'Phòng 2',
      action: () => onEnterRoom(2 as RoomId),
      isPrimary: false,
    },
    {
      id: 3,
      name: 'Phòng 3',
      action: () => onEnterRoom(3 as RoomId),
      isPrimary: false,
    },
    {
      id: 4,
      name: 'Phòng 4',
      action: () => onEnterRoom(4 as RoomId),
      isPrimary: false,
    },
    {
      id: 5,
      name: 'Phòng 5',
      action: () => onEnterRoom(5 as RoomId),
      isPrimary: false,
    },
  ];

  return (
    <section className="absolute inset-0 w-full h-full bg-[#00203F] z-[100] flex flex-col items-center justify-start md:justify-center overflow-y-auto overflow-x-hidden py-8 md:py-4 text-[#FFFFE3]">
      {/* Upward White Fireworks Canvas */}
      <FireworksCanvas active={true} />

      {/* Main Content Container */}
      <div className="z-10 flex flex-col items-center text-center px-4 max-w-5xl w-full my-auto">
        {/* Main Title with exact .sim-title styling */}
        <h1 className="sim-title">
          GIẢI CỨU THƯ VIỆN 20/11
        </h1>

        {/* Italic Subtitle */}
        <p className="text-sm sm:text-lg md:text-xl text-[#ADEFD1] italic max-w-2xl mb-6 md:mb-8 drop-shadow">
          Dấu ấn người thầy – Phiêu lưu giải mã 5 căn phòng tri thức
        </p>

        {/* Doors & Map Line Container */}
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Desktop / iPad Map Trail SVG (2 rows x 3 columns: md and up) */}
          <svg
            className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 600 400"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="desktop-map-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#ADEFD1" />
                <stop offset="100%" stopColor="#FFD700" />
              </linearGradient>
              <filter id="desktop-map-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Soft glowing background track */}
            <path
              d="M 100 90 L 300 90 L 500 90 C 565 90, 565 200, 480 200 L 120 200 C 35 200, 35 290, 100 290 L 300 290 L 500 290"
              fill="none"
              stroke="#FFD700"
              strokeOpacity="0.22"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#desktop-map-glow)"
            />

            {/* Animated dashed treasure map line leading from Bắt đầu -> Phòng 5 */}
            <path
              d="M 100 90 L 300 90 L 500 90 C 565 90, 565 200, 480 200 L 120 200 C 35 200, 35 290, 100 290 L 300 290 L 500 290"
              fill="none"
              stroke="url(#desktop-map-grad)"
              strokeWidth="4"
              strokeDasharray="10 8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-map-dash"
            />

            {/* Waypoint direction markers between rooms */}
            <circle cx="200" cy="90" r="5" fill="#FFD700" filter="url(#desktop-map-glow)" />
            <circle cx="400" cy="90" r="5" fill="#FFD700" filter="url(#desktop-map-glow)" />
            <circle cx="300" cy="200" r="5" fill="#ADEFD1" filter="url(#desktop-map-glow)" />
            <circle cx="200" cy="290" r="5" fill="#FFD700" filter="url(#desktop-map-glow)" />
            <circle cx="400" cy="290" r="5" fill="#FFD700" filter="url(#desktop-map-glow)" />
          </svg>

          {/* Mobile Map Trail SVG (1 column x 6 rows: below md) */}
          <svg
            className="block md:hidden absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 200 600"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="mobile-map-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#ADEFD1" />
                <stop offset="100%" stopColor="#FFD700" />
              </linearGradient>
              <filter id="mobile-map-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Soft glowing background track */}
            <path
              d="M 100 45 C 138 80, 62 110, 100 145 C 138 180, 62 210, 100 245 C 138 280, 62 310, 100 345 C 138 380, 62 410, 100 445 C 138 480, 62 510, 100 545"
              fill="none"
              stroke="#FFD700"
              strokeOpacity="0.22"
              strokeWidth="10"
              strokeLinecap="round"
              filter="url(#mobile-map-glow)"
            />

            {/* Animated dashed vertical map line */}
            <path
              d="M 100 45 C 138 80, 62 110, 100 145 C 138 180, 62 210, 100 245 C 138 280, 62 310, 100 345 C 138 380, 62 410, 100 445 C 138 480, 62 510, 100 545"
              fill="none"
              stroke="url(#mobile-map-grad)"
              strokeWidth="3.5"
              strokeDasharray="9 7"
              strokeLinecap="round"
              className="animate-map-dash"
            />
          </svg>

          {/* Responsive Grid: 1 col x 6 rows on mobile, 3 cols x 2 rows on iPad & up */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 justify-items-center items-center w-full">
            {roomButtons.map((btn) => {
              const isOpening = openingDoorId === btn.id;
              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => handleDoorClick(btn.id, btn.action)}
                  className={`flex flex-col items-center justify-center py-3 md:py-4 px-4 cursor-pointer group transition-transform duration-500 focus:outline-none ${
                    isOpening ? 'scale-115 z-20' : 'hover:scale-110'
                  }`}
                >
                  <div
                    className={`relative w-28 h-32 md:w-32 md:h-36 lg:w-36 lg:h-40 flex items-center justify-center transition-all duration-500 ${
                      isOpening
                        ? 'drop-shadow-[0_0_28px_rgba(255,215,0,1)]'
                        : btn.isPrimary
                        ? 'drop-shadow-[0_0_18px_rgba(255,215,0,0.85)]'
                        : 'drop-shadow-[0_6px_14px_rgba(0,0,0,0.65)] group-hover:drop-shadow-[0_0_18px_rgba(173,239,209,0.85)]'
                    }`}
                  >
                    <MagicDoorSvg uid={String(btn.id)} isOpen={isOpening} />
                  </div>
                  <span
                    className={`mt-1 px-3 py-0.5 rounded-full bg-[#00203F]/85 border text-sm md:text-base font-bold italic transition-colors shadow-md ${
                      isOpening
                        ? 'text-[#FFD700] border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.7)]'
                        : 'border-[#ADEFD1]/30 text-[#FFFFE3] group-hover:text-[#FFD700] group-hover:border-[#FFD700]'
                    }`}
                  >
                    {btn.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};


