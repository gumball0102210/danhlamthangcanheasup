import React from 'react';
import { Share2, Plus, Compass, BookOpen, Map, Shield, Eye, Settings } from 'lucide-react';
import { Landmark } from '../types/landmark';

interface NavbarProps {
  currentLandmark?: Landmark | null;
  onSelectLandmark: (landmark: Landmark) => void;
  onOpenEditor: () => void;
  onOpenShareModal: () => void;
  allLandmarks: Landmark[];
  activeView: 'detail' | 'explore' | 'map' | 'editor' | 'admin';
  setActiveView: (view: 'detail' | 'explore' | 'map' | 'editor' | 'admin') => void;
  isAdminMode?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLandmark,
  onSelectLandmark,
  onOpenEditor,
  onOpenShareModal,
  allLandmarks,
  activeView,
  setActiveView,
  isAdminMode = false,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveView('detail')}
            className="text-left group cursor-pointer focus:outline-none flex items-center gap-2"
          >
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 group-hover:text-amber-900 transition-colors">
              DANH THẮNG KÝ
            </span>
          </button>

          {activeView === 'admin' && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 font-bold">
              ADMIN
            </span>
          )}
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveView('detail')}
            className={`transition-colors hover:text-stone-900 focus:outline-none cursor-pointer ${
              activeView === 'detail' ? 'text-amber-900 font-semibold border-b-2 border-amber-900 pb-0.5' : ''
            }`}
          >
            Chi tiết danh thắng
          </button>

          <button
            onClick={() => setActiveView('map')}
            className={`flex items-center gap-1.5 transition-colors hover:text-stone-900 focus:outline-none cursor-pointer ${
              activeView === 'map' ? 'text-amber-900 font-semibold border-b-2 border-amber-900 pb-0.5' : ''
            }`}
          >
            <Map className="w-3.5 h-3.5 text-amber-700" />
            <span>Bản đồ & Chỉ đường</span>
          </button>

          <button
            onClick={() => setActiveView('explore')}
            className={`transition-colors hover:text-stone-900 focus:outline-none cursor-pointer ${
              activeView === 'explore' ? 'text-amber-900 font-semibold border-b-2 border-amber-900 pb-0.5' : ''
            }`}
          >
            Bộ sưu tập ({allLandmarks.length})
          </button>

          {/* Quick link to Itinerary */}
          {activeView === 'detail' && (
            <button
              onClick={() => {
                const el = document.getElementById('itinerary-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="transition-colors hover:text-stone-900 cursor-pointer text-stone-500"
            >
              Lịch trình gợi ý
            </button>
          )}
        </nav>

        {/* Zone 3: Actions Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Share Button (Available for both visitors and admin) */}
          <button
            onClick={onOpenShareModal}
            className="px-3.5 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            title="Chia sẻ hoặc xuất liên kết"
          >
            <Share2 className="w-3.5 h-3.5 text-stone-700" />
            <span className="hidden sm:inline">Chia sẻ link</span>
            <span className="sm:hidden">Chia sẻ</span>
          </button>

          {/* Admin Switcher / Viewer Switcher */}
          {activeView === 'admin' ? (
            <button
              onClick={() => setActiveView('detail')}
              className="px-3.5 py-2 text-xs font-semibold text-stone-50 bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Thoát trang quản trị và xem giao diện khách"
            >
              <Eye className="w-3.5 h-3.5 text-amber-300" />
              <span>Xem như Khách</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveView('admin')}
              className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
              title="Vào trung tâm quản trị để đăng bài & tạo link"
            >
              <Shield className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">Trang Quản trị</span>
              <span className="sm:hidden">Admin</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
