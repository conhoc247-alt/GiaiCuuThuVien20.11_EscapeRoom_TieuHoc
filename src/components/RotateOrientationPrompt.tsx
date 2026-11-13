import React, { useState, useEffect } from 'react';
import { Smartphone, RotateCw } from 'lucide-react';

/**
 * RotateOrientationPrompt:
 * Khóa chặt toàn bộ màn hình khi người dùng sử dụng điện thoại hoặc iPad ở chế độ dọc (portrait).
 * BẮT BUỘC người dùng PHẢI XOAY NGANG (landscape) thiết bị thì màn hình mới tự động mở để chơi,
 * KHÔNG có nút đóng, KHÔNG có nút đã hiểu hay bỏ qua.
 */
export const RotateOrientationPrompt: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState<boolean>(false);

  useEffect(() => {
    const checkOrientation = () => {
      if (typeof window === 'undefined') return;

      // Nhận diện thiết bị di động / iPad / tablet
      const isMobileOrTablet =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (navigator.maxTouchPoints > 1 && window.innerWidth <= 1366) ||
        window.innerWidth <= 1024;

      // Điều kiện màn hình dọc (chiều cao > chiều rộng)
      const isScreenPortrait = window.innerHeight > window.innerWidth;

      setIsPortrait(isMobileOrTablet && isScreenPortrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Chỉ mở khóa khi người dùng xoay ngang (isPortrait = false)
  if (!isPortrait) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-[#001226] flex flex-col items-center justify-center p-6 text-center text-[#FFFFE3] select-none">
      {/* Biểu tượng điện thoại xoay ngang hoạt họa chuyển động liên tục */}
      <div className="relative mb-6">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-[#FFD700]/20 to-[#ADEFD1]/20 border-2 border-[#FFD700] flex items-center justify-center shadow-[0_0_40px_rgba(255,215,0,0.7)] animate-pulse">
          <div className="relative flex items-center justify-center">
            {/* Điện thoại đang xoay */}
            <Smartphone className="w-14 h-14 sm:w-16 sm:h-16 text-[#FFD700] transform -rotate-90 animate-bounce" />
            <RotateCw className="w-7 h-7 sm:w-8 sm:h-8 text-[#ADEFD1] absolute -top-3 -right-3 animate-spin" />
          </div>
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-black text-[#FFD700] uppercase tracking-wider mb-3 leading-snug drop-shadow-md">
        VUI LÒNG XOAY NGANG MÀN HÌNH
      </h2>

      <p className="text-xs sm:text-sm text-[#FFFFE3]/90 max-w-xs sm:max-w-sm mx-auto leading-relaxed mb-4 font-medium">
        Trò chơi yêu cầu <strong className="text-[#FFD700]">chế độ nằm ngang (Landscape)</strong> để hiển thị toàn cảnh thư viện và các câu đố.
      </p>

      {/* Chỉ dẫn hoạt họa xoay */}
      <div className="px-5 py-2.5 rounded-full bg-white/5 border border-[#ADEFD1]/40 flex items-center gap-2 text-xs text-[#ADEFD1] font-bold shadow-sm">
        <RotateCw className="w-4 h-4 text-[#FFD700] animate-spin" />
        <span>Hãy xoay thiết bị của bạn sang ngang để bắt đầu</span>
      </div>
    </div>
  );
};
