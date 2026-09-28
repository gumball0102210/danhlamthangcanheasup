import React, { useState } from 'react';
import { Search, MapPin, Award, Plus, Share2, Compass, ArrowRight, LayoutGrid, Map as MapIcon } from 'lucide-react';
import { Landmark, LandmarkCategory } from '../types/landmark';
import { ResilientImage } from './ResilientImage';
import { InteractiveLandmarkMap } from './InteractiveLandmarkMap';

interface LandmarkExplorerProps {
  landmarks: Landmark[];
  currentLandmarkId: string;
  onSelectLandmark: (landmark: Landmark) => void;
  onCreateNew: () => void;
  onOpenShareModal: (landmark: Landmark) => void;
  initialViewMode?: 'grid' | 'map';
}

export const LandmarkExplorer: React.FC<LandmarkExplorerProps> = ({
  landmarks,
  currentLandmarkId,
  onSelectLandmark,
  onCreateNew,
  onOpenShareModal,
  initialViewMode = 'grid',
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>(initialViewMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tất cả danh thắng' },
    { id: 'natural_wonder', label: 'Kỳ quan Thiên nhiên' },
    { id: 'cultural_heritage', label: 'Di sản Văn hóa' },
    { id: 'mountain_eco', label: 'Miền Núi & Sinh Thái' },
    { id: 'historic_monument', label: 'Di tích Lịch sử' },
  ];

  const filteredLandmarks = landmarks.filter((lm) => {
    const matchesSearch =
      lm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lm.location.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lm.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || lm.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Editorial Title Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-stone-200 gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold font-sans block mb-1">
            Bản Đồ Danh Thắng & Di Sản
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            Kho Tàng Danh Lam Thắng Cảnh
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-2xl">
            Khám phá các kỳ quan thiên nhiên thế giới, di sản văn hóa và những miền đất tuyệt tác của non sông Việt Nam trên bản đồ tương tác.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-stone-100 rounded-lg border border-stone-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-stone-600" />
              <span>Thẻ danh sách</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white text-amber-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MapIcon className="w-4 h-4 text-amber-700" />
              <span>Bản đồ tương tác</span>
            </button>
          </div>

          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">Tạo & Giới thiệu danh lam mới</span>
            <span className="sm:hidden">Thêm mới</span>
          </button>
        </div>
      </div>

      {/* When in Map Mode */}
      {viewMode === 'map' && (
        <div className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-stone-600">
              Nhấp vào bất kỳ điểm đánh dấu nào trên bản đồ để xem tóm tắt, mở trang chi tiết hoặc nhấn <strong className="text-amber-800 font-semibold">Chỉ đường</strong> để dẫn đường qua Google Maps.
            </p>
          </div>
          <InteractiveLandmarkMap
            landmarks={filteredLandmarks}
            selectedLandmarkId={currentLandmarkId}
            onSelectLandmark={onSelectLandmark}
            heightClass="h-[620px]"
            standalone={true}
          />
        </div>
      )}

      {/* Filter and Search Controls (Functional Segmented Control) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg overflow-x-auto w-full sm:w-auto border border-stone-200">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-white text-stone-900 shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên hoặc tỉnh thành..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600"
          />
        </div>

      </div>

      {/* Grid of Landmarks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredLandmarks.map((lm) => (
          <article
            key={lm.id}
            className={`group bg-white border rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-md cursor-pointer ${
              lm.id === currentLandmarkId
                ? 'border-amber-600 ring-1 ring-amber-600/30'
                : 'border-stone-200 hover:border-stone-400'
            }`}
            onClick={() => onSelectLandmark(lm)}
          >
            <div>
              {/* Media Thumbnail */}
              <div className="relative overflow-hidden aspect-[16/10] bg-stone-900">
                <ResilientImage
                  src={lm.heroImage}
                  alt={lm.name}
                  fallbackTitle={lm.name}
                  fallbackSubtitle={lm.location.province}
                  aspectRatioClass="aspect-[16/10]"
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />

                {/* Badge unboxed text overlay */}
                <div className="absolute top-3 left-3 text-[11px] font-semibold text-amber-300 bg-stone-900/80 backdrop-blur-sm px-2.5 py-1 rounded">
                  {lm.categoryLabel}
                </div>

                {lm.isCustom && (
                  <div className="absolute top-3 right-3 text-[10px] font-semibold text-emerald-300 bg-stone-900/80 backdrop-blur-sm px-2 py-0.5 rounded">
                    Tùy chỉnh của bạn
                  </div>
                )}
              </div>

              {/* Card Content (Zero-Pill discipline) */}
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                  <span className="flex items-center gap-1 font-medium text-stone-700">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    {lm.location.province}
                  </span>
                  {lm.unescoStatus && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="truncate text-amber-800 font-medium">UNESCO</span>
                    </>
                  )}
                </div>

                <h3 className="text-xl font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors leading-snug">
                  {lm.name}
                </h3>

                <p className="text-stone-600 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed">
                  {lm.tagline}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-5 py-3.5 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium flex items-center gap-1 group-hover:text-stone-900 transition-colors">
                <span>Xem chi tiết</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenShareModal(lm);
                }}
                className="p-1.5 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-200 transition-colors cursor-pointer"
                title="Xuất qua liên kết chia sẻ"
              >
                <Share2 className="w-4 h-4 text-amber-700" />
              </button>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
};
