import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Sparkles,
  BookOpen,
  Calendar,
  Utensils,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  Maximize2,
  X,
  Share2,
  Printer,
  Headphones
} from 'lucide-react';
import { Landmark, GalleryPhoto } from '../types/landmark';
import { ResilientImage } from './ResilientImage';
import { InteractiveLandmarkMap } from './InteractiveLandmarkMap';

interface LandmarkDetailViewProps {
  landmark: Landmark;
  onOpenShareModal: () => void;
  onOpenEditor: () => void;
  onPlayAudio?: () => void;
}

export const LandmarkDetailView: React.FC<LandmarkDetailViewProps> = ({
  landmark,
  onOpenShareModal,
  onOpenEditor,
  onPlayAudio,
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${landmark.name} ${landmark.location.province} ${landmark.location.country}`
  )}`;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      
      {/* ========================================================================= */}
      {/* 1. ASYMMETRIC EDITORIAL OVERVIEW & CURATORIAL SIDEBAR (Pattern D) */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start pb-16 border-b border-stone-200">
        
        {/* Main Reading Column (70% - 8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold font-sans">
              Khái lược & Tinh hoa
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 mt-2 text-balance leading-snug">
              Không gian Di sản & Bản giao hưởng Thiên nhiên
            </h2>
          </div>

          {/* Opening Paragraph with Editorial Drop Cap */}
          <div className="text-stone-700 font-sans text-base sm:text-lg leading-relaxed space-y-6">
            <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-stone-900">
              {landmark.overview}
            </p>

            {/* Editorial Pull Quote */}
            {landmark.pullQuote && (
              <blockquote className="my-8 py-4 px-6 border-l-2 border-amber-600 bg-amber-50/50 text-stone-800 font-serif italic text-lg sm:text-xl leading-relaxed">
                "{landmark.pullQuote}"
              </blockquote>
            )}

            {/* Historical Lore Section */}
            {landmark.historyLore && (
              <div className="pt-2">
                <h3 className="text-xl font-serif font-semibold text-stone-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-700" />
                  <span>Dấu tích Lịch sử & Truyền thuyết Cổ xưa</span>
                </h3>
                <p className="text-stone-700 leading-relaxed text-base">
                  {landmark.historyLore}
                </p>
              </div>
            )}

            {/* Cultural Significance */}
            {landmark.culturalSignificance && (
              <div className="pt-2">
                <h3 className="text-xl font-serif font-semibold text-stone-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-700" />
                  <span>Giá trị Văn hóa & Đa dạng Sinh học</span>
                </h3>
                <p className="text-stone-700 leading-relaxed text-base">
                  {landmark.culturalSignificance}
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Curatorial Sidebar / Accession Metadata (30% - 4 cols) */}
        <div className="lg:col-span-4 bg-[#F7F4EE] border border-stone-200/90 rounded-xl p-6 space-y-6 sticky top-24">
          <div className="border-b border-stone-300/80 pb-4">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
              Hồ sơ Danh thắng
            </span>
            <h3 className="text-xl font-serif font-bold text-stone-900 mt-1">
              {landmark.name}
            </h3>
            <p className="text-xs text-stone-600 font-sans mt-0.5">
              Mã định danh: <span className="font-mono text-stone-800">{landmark.id}</span>
            </p>
          </div>

          <dl className="space-y-4 text-xs">
            <div>
              <dt className="text-stone-500 font-medium">Phân loại & Công nhận</dt>
              <dd className="text-stone-900 font-semibold mt-0.5">
                {landmark.categoryLabel}
                {landmark.unescoStatus ? ` · ${landmark.unescoStatus}` : ''}
              </dd>
            </div>

            <div className="pt-2 border-t border-stone-200">
              <dt className="text-stone-500 font-medium">Địa chỉ hành chính</dt>
              <dd className="text-stone-800 mt-0.5 leading-snug">
                {landmark.location.address}
              </dd>
            </div>

            <div className="pt-2 border-t border-stone-200">
              <dt className="text-stone-500 font-medium">Mức độ vận động / Địa hình</dt>
              <dd className="text-stone-900 font-medium mt-0.5">
                {landmark.quickFacts.difficultyLevel} · Phù hợp {landmark.quickFacts.suitableFor}
              </dd>
            </div>

            <div className="pt-2 border-t border-stone-200">
              <dt className="text-stone-500 font-medium">Giờ hoạt động mở cửa</dt>
              <dd className="text-stone-900 font-medium mt-0.5">
                {landmark.quickFacts.openingHours}
              </dd>
            </div>

            <div className="pt-2 border-t border-stone-200">
              <dt className="text-stone-500 font-medium">Khí hậu & Lưu ý thời tiết</dt>
              <dd className="text-stone-700 mt-0.5 leading-snug">
                {landmark.quickFacts.weatherNote}
              </dd>
            </div>
          </dl>

          <div className="pt-4 border-t border-stone-300/80 flex flex-col gap-2">
            {onPlayAudio && (
              <button
                onClick={onPlayAudio}
                className="w-full py-2.5 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold text-center flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Headphones className="w-3.5 h-3.5 text-amber-200" />
                <span>Nghe thuyết minh ({landmark.audioGuide?.durationEstimateMinutes || 3} phút)</span>
              </button>
            )}

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-lg text-xs font-medium text-center flex items-center justify-center gap-1.5 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Chỉ đường trên Google Maps</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>

            <button
              onClick={() => window.print()}
              className="w-full py-2 px-3 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-lg text-xs font-medium text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In cẩm nang / Xuất PDF</span>
            </button>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. HIGHLIGHTS & MUST-DO EXPERIENCES */}
      {/* ========================================================================= */}
      <section className="py-16 border-b border-stone-200">
        <div className="max-w-3xl mb-10">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold font-sans">
            Điểm nhấn không thể bỏ lỡ
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
            Những Trải Nghiệm Tuyệt Đỉnh
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            Mỗi góc nhìn tại {landmark.name} là một cuộc hạnh ngộ giữa lòng đất mẹ hùng vĩ và tâm hồn người lữ thứ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landmark.highlights.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white border border-stone-200/90 rounded-xl overflow-hidden hover:border-amber-400/80 transition-all flex flex-col justify-between p-5 group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2.5">
                  <span className="font-mono text-stone-400 font-semibold">
                    0{idx + 1}.
                  </span>
                  {item.tag && (
                    <span className="text-amber-800 font-medium">
                      {item.tag}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                  {item.title}
                </h3>

                <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {item.imageUrl && (
                <div className="mt-4 rounded-lg overflow-hidden border border-stone-100">
                  <ResilientImage
                    src={item.imageUrl}
                    alt={item.title}
                    fallbackTitle={item.title}
                    aspectRatioClass="aspect-video"
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SUGGESTED ITINERARY (Pattern E: Horizontal Timeline / Day Tabs) */}
      {/* ========================================================================= */}
      {landmark.itinerary && landmark.itinerary.length > 0 && (
        <section id="itinerary-section" className="py-16 border-b border-stone-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold font-sans">
                Gợi ý lộ trình
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
                Hành Trình Khám Phá Trọn Vẹn
              </h2>
            </div>

            {/* Interactive Day Filter Tabs (Segmented control) */}
            {landmark.itinerary.length > 1 && (
              <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg border border-stone-200">
                {landmark.itinerary.map((day, idx) => (
                  <button
                    key={day.id || idx}
                    onClick={() => setActiveDayIndex(idx)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                      activeDayIndex === idx
                        ? 'bg-white text-stone-900 shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Ngày {day.dayNumber || idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Current Day Schedule */}
          {landmark.itinerary[activeDayIndex] && (
            <div className="bg-[#F7F4EE] border border-stone-200/90 rounded-2xl p-6 sm:p-8">
              <div className="border-b border-stone-300/80 pb-4 mb-6">
                <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
                  Ngày 0{landmark.itinerary[activeDayIndex].dayNumber || activeDayIndex + 1}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1">
                  {landmark.itinerary[activeDayIndex].title}
                </h3>
                {landmark.itinerary[activeDayIndex].summary && (
                  <p className="text-stone-600 text-sm mt-1">
                    {landmark.itinerary[activeDayIndex].summary}
                  </p>
                )}
              </div>

              {/* Timeline activities */}
              <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-3.5 before:w-0.5 before:bg-stone-300">
                {landmark.itinerary[activeDayIndex].activities.map((act, aIdx) => (
                  <div key={act.id || aIdx} className="relative pl-9">
                    {/* Timeline indicator node */}
                    <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-[#F7F4EE] -translate-x-1/2" />

                    <div>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                        <span className="font-mono font-semibold text-amber-900">
                          {act.time}
                        </span>
                      </div>
                      <h4 className="text-base font-serif font-bold text-stone-900">
                        {act.title}
                      </h4>
                      <p className="text-stone-700 text-xs sm:text-sm mt-1 leading-relaxed">
                        {act.description}
                      </p>
                      {act.tip && (
                        <div className="mt-2 text-xs text-amber-800 bg-amber-100/60 rounded px-2.5 py-1.5 inline-block">
                          💡 <strong>Lời khuyên:</strong> {act.tip}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. GASTRONOMY & CULINARY SPECIALTIES */}
      {/* ========================================================================= */}
      {landmark.gastronomy && landmark.gastronomy.length > 0 && (
        <section className="py-16 border-b border-stone-200">
          <div className="max-w-3xl mb-8">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold font-sans">
              Mỹ vị quê hương
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
              Ẩm Thực Đặc Sản Nức Tiếng
            </h2>
            <p className="text-stone-600 text-sm mt-2">
              Thưởng thức phong vị đậm đà được kết tinh từ sông núi, biển trời và bàn tay khéo léo của người dân bản địa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {landmark.gastronomy.map((food, fIdx) => (
              <div
                key={food.id || fIdx}
                className="bg-white border border-stone-200/90 rounded-xl p-5 hover:border-stone-400 transition-colors"
              >
                <div className="flex items-center gap-2 text-amber-800 mb-2">
                  <Utensils className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Đặc sản địa phương
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  {food.name}
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
                  {food.description}
                </p>
                {food.recommendedPlaces && (
                  <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500">
                    <span className="font-semibold text-stone-700">Địa chỉ gợi ý:</span>{' '}
                    {food.recommendedPlaces}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 5. PRACTICAL TRAVEL TIPS */}
      {/* ========================================================================= */}
      {landmark.practicalTips && landmark.practicalTips.length > 0 && (
        <section className="py-16 border-b border-stone-200">
          <div className="max-w-3xl mb-8">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold font-sans">
              Cẩm nang du khách
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
              Lưu Ý Thực Tế & Kinh Nghiệm
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {landmark.practicalTips.map((tip, tIdx) => (
              <div
                key={tip.id || tIdx}
                className="bg-[#F7F4EE] border border-stone-200 rounded-xl p-5"
              >
                <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
                  <span>{tip.category === 'transport' ? 'Di chuyển' : tip.category === 'packing' ? 'Hành lý' : tip.category === 'cost' ? 'Chi phí' : 'Văn hóa'}</span>
                </div>
                <h4 className="text-sm font-serif font-bold text-stone-900 mb-2">
                  {tip.title}
                </h4>
                <p className="text-stone-600 text-xs leading-relaxed">
                  {tip.details}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. PHOTO GALLERY & LIGHTBOX */}
      {/* ========================================================================= */}
      {landmark.gallery && landmark.gallery.length > 0 && (
        <section className="py-16 border-b border-stone-200">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold font-sans">
                Bộ sưu tập thị giác
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
                Khoảnh Khắc Di Sản
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {landmark.gallery.map((photo, pIdx) => (
              <div
                key={photo.id || pIdx}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-stone-200 bg-stone-900"
              >
                <ResilientImage
                  src={photo.url}
                  alt={photo.caption}
                  fallbackTitle={photo.caption}
                  aspectRatioClass="aspect-[4/3]"
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                  <p className="text-xs font-serif leading-snug line-clamp-2">
                    {photo.caption}
                  </p>
                  {photo.author && (
                    <span className="text-[10px] text-stone-400 mt-1">
                      Ảnh: {photo.author}
                    </span>
                  )}
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-stone-900/60 text-white">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 7. GEOGRAPHIC MAP / COORDINATES LOCATION SECTION */}
      {/* ========================================================================= */}
      <section id="map-location-section" className="py-16">
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div>
              <span className="text-amber-800 text-xs uppercase tracking-widest font-semibold font-sans">
                Vị trí địa lý & Dẫn đường
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
                Bản Đồ Tương Tác {landmark.name}
              </h3>
              <p className="text-stone-600 text-sm mt-1">
                {landmark.location.address} · Tọa độ:{' '}
                <span className="font-mono text-amber-800 font-semibold">
                  {landmark.location.coordinates.lat.toFixed(4)}° N, {landmark.location.coordinates.lng.toFixed(4)}° E
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <Compass className="w-4 h-4" />
                <span>Chỉ đường trên Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onOpenShareModal}
                className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Chia sẻ vị trí</span>
              </button>
            </div>
          </div>

          {/* Interactive Map Component */}
          <div className="rounded-xl overflow-hidden border border-stone-200 shadow-inner">
            <InteractiveLandmarkMap
              landmarks={[landmark]}
              selectedLandmarkId={landmark.id}
              onSelectLandmark={() => {}}
              heightClass="h-[440px]"
              standalone={false}
            />
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-white hover:text-amber-400 transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption}
              className="max-h-[75vh] w-auto rounded-lg object-contain"
            />
            <div className="text-center mt-3 text-stone-300 text-sm font-serif">
              <p>{selectedPhoto.caption}</p>
              {selectedPhoto.author && (
                <span className="text-xs text-stone-500 mt-1 block">
                  Tác giả: {selectedPhoto.author}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
