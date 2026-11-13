import React from 'react';
import { X, Map, Lock, CheckCircle2, Sparkles, Compass, MapPin } from 'lucide-react';
import { RoomId } from '../types/game';
import { soundManager } from '../utils/audio';

interface RoomMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoom: RoomId;
  unlockedRooms: RoomId[];
  completedRooms: RoomId[];
  onSelectRoom: (roomId: RoomId) => void;
}

const DOOR_SVG_PATH = './assets/aistudio/gemini-svg__4__cf6bf49b.svg';

export const RoomMapModal: React.FC<RoomMapModalProps> = ({
  isOpen,
  onClose,
  currentRoom,
  unlockedRooms,
  completedRooms,
  onSelectRoom,
}) => {
  if (!isOpen) return null;

  const roomsData = [
    {
      id: 1 as RoomId,
      name: 'Phòng Lịch Sử',
      subtitle: 'Giải Mã Dấu Mốc',
      icon: 'fa-landmark',
      // Desktop map coordinates (in % of map canvas)
      desktopPos: 'md:left-[11%] md:top-[64%]',
    },
    {
      id: 2 as RoomId,
      name: 'Phòng Danh Sư',
      subtitle: 'Chân Dung Bí Ẩn',
      icon: 'fa-user-graduate',
      desktopPos: 'md:left-[30.5%] md:top-[30%]',
    },
    {
      id: 3 as RoomId,
      name: 'Phòng Văn Học',
      subtitle: 'Vần Thơ Thất Lạc',
      icon: 'fa-feather',
      desktopPos: 'md:left-[50%] md:top-[64%]',
    },
    {
      id: 4 as RoomId,
      name: 'Phòng Ký Ức',
      subtitle: 'Hộp Thời Gian',
      icon: 'fa-box-archive',
      desktopPos: 'md:left-[69.5%] md:top-[30%]',
    },
    {
      id: 5 as RoomId,
      name: 'Phòng Tri Ân',
      subtitle: 'Mật Mã Cuối Cùng',
      icon: 'fa-heart',
      desktopPos: 'md:left-[89%] md:top-[64%]',
    },
  ];

  // Path segments in viewBox="0 0 1000 420" matching (110, 268), (305, 126), (500, 268), (695, 126), (890, 268)
  const desktopSegments = [
    {
      from: 1 as RoomId,
      to: 2 as RoomId,
      d: 'M 110 250 C 190 250, 225 115, 305 115',
      midX: 208,
      midY: 182,
    },
    {
      from: 2 as RoomId,
      to: 3 as RoomId,
      d: 'M 305 115 C 385 115, 420 250, 500 250',
      midX: 402,
      midY: 182,
    },
    {
      from: 3 as RoomId,
      to: 4 as RoomId,
      d: 'M 500 250 C 580 250, 615 115, 695 115',
      midX: 598,
      midY: 182,
    },
    {
      from: 4 as RoomId,
      to: 5 as RoomId,
      d: 'M 695 115 C 775 115, 810 250, 890 250',
      midX: 792,
      midY: 182,
    },
  ];

  return (
    <div className="fixed top-0 bottom-[60px] left-0 right-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-40 p-3 sm:p-4 overflow-y-auto animate-pop">
      <div className="bg-[#001833] border-2 border-[#ADEFD1] rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.95)] relative text-[#FFFFE3] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ADEFD1]/30 relative z-20">
          <div className="flex items-center gap-2.5">
            <Map className="w-6 h-6 text-[#FFD700]" />
            <h2 className="text-base sm:text-lg md:text-xl font-black text-[#FFD700] uppercase tracking-wider">
              Bản Đồ 5 Căn Phòng Thư Viện
            </h2>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="text-[#ADEFD1] hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Interactive Map Canvas */}
        <div className="relative my-4 rounded-2xl border border-[#FFD700]/30 bg-[radial-gradient(ellipse_at_center,_#062c54_0%,_#021329_75%,_#010a17_100%)] shadow-inner overflow-hidden md:h-[360px] p-4 md:p-0">
          {/* Subtle Cartographic Grid & Map Rings */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, #ADEFD1 1px, transparent 1px), linear-gradient(to bottom, #ADEFD1 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="hidden md:block absolute -left-20 -bottom-20 w-72 h-72 rounded-full border border-[#FFD700]/15 pointer-events-none" />
          <div className="hidden md:block absolute -right-16 -top-16 w-64 h-64 rounded-full border border-[#ADEFD1]/15 pointer-events-none" />

          {/* Decorative Compass Rose (Top Right of Map) */}
          <div className="hidden md:flex absolute top-3 right-4 items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#001226]/80 border border-[#FFD700]/30 text-[#FFD700]/80 text-[11px] font-semibold pointer-events-none z-10">
            <Compass className="w-4 h-4 text-[#FFD700] animate-spin" style={{ animationDuration: '16s' }} />
            <span>Hành trình Tri Thức</span>
          </div>

          {/* Desktop Winding Map Trail SVG */}
          <svg
            className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 1000 420"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="room-map-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="unlocked-trail-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#ADEFD1" />
                <stop offset="100%" stopColor="#FFD700" />
              </linearGradient>
            </defs>

            {desktopSegments.map((seg, idx) => {
              const isSegUnlocked = unlockedRooms.includes(seg.to);
              return (
                <g key={idx}>
                  {/* Outer glow for unlocked path */}
                  {isSegUnlocked && (
                    <path
                      d={seg.d}
                      fill="none"
                      stroke="#FFD700"
                      strokeOpacity="0.28"
                      strokeWidth="14"
                      strokeLinecap="round"
                      filter="url(#room-map-glow)"
                    />
                  )}
                  {/* Base track */}
                  <path
                    d={seg.d}
                    fill="none"
                    stroke={isSegUnlocked ? 'url(#unlocked-trail-grad)' : '#334155'}
                    strokeWidth={isSegUnlocked ? '4.5' : '3'}
                    strokeDasharray={isSegUnlocked ? '12 9' : '6 8'}
                    strokeLinecap="round"
                    className={isSegUnlocked ? 'animate-map-dash' : ''}
                  />
                  {/* Midpoint milestone dot */}
                  <circle
                    cx={seg.midX}
                    cy={seg.midY}
                    r={isSegUnlocked ? 5.5 : 4}
                    fill={isSegUnlocked ? '#FFD700' : '#475569'}
                    filter={isSegUnlocked ? 'url(#room-map-glow)' : undefined}
                  />
                </g>
              );
            })}
          </svg>

          {/* Mobile Vertical Map Trail SVG */}
          <svg
            className="block md:hidden absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 200 500"
            preserveAspectRatio="none"
          >
            <path
              d="M 100 45 C 135 85, 65 115, 100 150 C 135 190, 65 220, 100 255 C 135 295, 65 325, 100 360 C 135 400, 65 430, 100 460"
              fill="none"
              stroke="#FFD700"
              strokeOpacity="0.35"
              strokeWidth="3.5"
              strokeDasharray="9 7"
              strokeLinecap="round"
              className="animate-map-dash"
            />
          </svg>

          {/* 5 Room Waypoint Nodes */}
          <div className="relative z-10 flex flex-col gap-5 md:block w-full h-full">
            {roomsData.map((room) => {
              const isUnlocked = unlockedRooms.includes(room.id);
              const isCompleted = completedRooms.includes(room.id);
              const isCurrent = currentRoom === room.id;

              return (
                <div
                  key={room.id}
                  onClick={() => {
                    if (isUnlocked) {
                      soundManager.playClick();
                      onSelectRoom(room.id);
                      onClose();
                    } else {
                      soundManager.playWrong();
                    }
                  }}
                  className={`group relative md:absolute ${room.desktopPos} md:-translate-x-1/2 md:-translate-y-1/2 flex flex-col items-center transition-all duration-300 ${
                    isUnlocked
                      ? 'cursor-pointer hover:scale-110'
                      : 'cursor-not-allowed opacity-65'
                  }`}
                >
                  {/* Floating "Đang ở đây" Pin Badge for Current Room */}
                  {isCurrent && (
                    <div className="mb-1 px-2.5 py-0.5 rounded-full bg-[#FFD700] text-[#001833] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-[0_0_15px_#FFD700] animate-bounce">
                      <MapPin className="w-3 h-3 fill-[#001833]" />
                      <span>Đang ở đây</span>
                    </div>
                  )}

                  {/* Door Landmark Icon & Pedestal */}
                  <div className="relative flex items-center justify-center">
                    {/* Glowing Pedestal Ring on the Map Floor */}
                    <div
                      className={`absolute -bottom-1.5 w-20 h-6 rounded-full border-2 transition-all ${
                        isCurrent
                          ? 'bg-[#FFD700]/30 border-[#FFD700] shadow-[0_0_20px_#FFD700] animate-pulse'
                          : isCompleted
                          ? 'bg-emerald-500/25 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)]'
                          : isUnlocked
                          ? 'bg-[#ADEFD1]/20 border-[#ADEFD1] group-hover:shadow-[0_0_15px_#ADEFD1]'
                          : 'bg-slate-900/80 border-slate-600'
                      }`}
                    />

                    {/* Magical Door Image */}
                    <div
                      className={`relative w-20 h-24 sm:w-22 sm:h-26 flex items-center justify-center transition-all ${
                        isUnlocked
                          ? 'drop-shadow-[0_6px_14px_rgba(0,0,0,0.85)]'
                          : 'grayscale brightness-50'
                      }`}
                    >
                      <img
                        src={DOOR_SVG_PATH}
                        alt={room.name}
                        className="w-full h-full object-contain select-none pointer-events-none"
                      />

                      {/* Status Overlay Badge on top-right of Door */}
                      <div
                        className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border shadow-md ${
                          isCompleted
                            ? 'bg-emerald-500 border-white text-white'
                            : isUnlocked
                            ? 'bg-[#00203F] border-[#FFD700] text-[#FFD700]'
                            : 'bg-slate-800 border-slate-500 text-slate-300'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : isUnlocked ? (
                          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        ) : (
                          <Lock className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Map Node Banner Label */}
                  <div
                    className={`mt-2 px-3 py-1 rounded-xl border text-center min-w-[130px] backdrop-blur-xs transition-all shadow-lg ${
                      isCurrent
                        ? 'bg-[#002855]/95 border-[#FFD700] ring-2 ring-[#FFD700]/50'
                        : isCompleted
                        ? 'bg-[#002447]/95 border-emerald-400/70'
                        : isUnlocked
                        ? 'bg-[#00203F]/95 border-[#ADEFD1]/60 group-hover:border-[#FFD700]'
                        : 'bg-[#001224]/90 border-slate-700'
                    }`}
                  >
                    <div className="text-[10px] font-black uppercase tracking-wider text-[#FFD700]">
                      Phòng {room.id}
                    </div>
                    <div className="text-xs font-bold text-white leading-tight">
                      {room.name}
                    </div>
                    <div
                      className={`text-[10px] font-semibold mt-0.5 ${
                        isCompleted
                          ? 'text-emerald-300'
                          : isUnlocked
                          ? 'text-[#ADEFD1]'
                          : 'text-slate-400'
                      }`}
                    >
                      {isCompleted ? '✓ Đã hoàn thành' : isUnlocked ? 'ĐANG MỞ • Vào' : 'Đang khóa'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map Legend & Footer */}
        <div className="pt-2 border-t border-[#ADEFD1]/30 flex flex-wrap items-center justify-between gap-2 text-xs text-[#ADEFD1]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
              <span>Đã giải mã</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD700] inline-block animate-pulse"></span>
              <span>ĐANG MỞ</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block"></span>
              <span>Đang khóa</span>
            </span>
          </div>
          <span className="italic text-[#FFFFE3]/80">
            Nhấp vào cánh cửa đã mở trên bản đồ để di chuyển nhanh
          </span>
        </div>
      </div>
    </div>
  );
};

