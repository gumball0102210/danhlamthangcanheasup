import React from 'react';
import { MapPin, Calendar, Clock, Ticket, Award, Share2, Edit3, Compass, Headphones } from 'lucide-react';
import { Landmark } from '../types/landmark';
import { ResilientImage } from './ResilientImage';

interface LandmarkHeroProps {
  landmark: Landmark;
  onOpenShareModal: () => void;
  onOpenEditor: () => void;
  onPlayAudio?: () => void;
  isAdmin?: boolean;
}

export const LandmarkHero: React.FC<LandmarkHeroProps> = ({
  landmark,
  onOpenShareModal,
  onOpenEditor,
  onPlayAudio,
  isAdmin = false,
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-[#FBF9F5] border-b border-stone-200">
      {/* Visual Anchor: Full-bleed Hero Media Container with Scrim */}
      <div className="relative w-full h-[52vh] min-h-[380px] max-h-[560px] bg-stone-900">
        <ResilientImage
          src={landmark.heroImage}
          alt={landmark.name}
          fallbackTitle={landmark.name}
          fallbackSubtitle={`${landmark.location.province}, ${landmark.location.country}`}
          aspectRatioClass="h-full w-full"
          className="h-full w-full object-cover"
        />

        {/* Measured dark scrim for high-contrast legible typography */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent pointer-events-none" />

        {/* In-Hero Editorial Header Lockup */}
        <div className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 z-10">
          
          {/* Metadata Row: Clean Unboxed Text with typographic separators (Zero-Pill Discipline) */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-stone-300 mb-3 tracking-wide">
            <span className="font-semibold text-amber-300 uppercase tracking-widest text-[11px]">
              {landmark.categoryLabel}
            </span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              {landmark.location.province}, {landmark.location.country}
            </span>
            {landmark.unescoStatus && (
              <>
                <span aria-hidden="true" className="text-stone-500">·</span>
                <span className="flex items-center gap-1 text-stone-200">
                  <Award className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  {landmark.unescoStatus}
                </span>
              </>
            )}
          </div>

          {/* Primary Landmark Title (Editorial Serif, No Orphan Headlines) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight max-w-4xl text-balance">
            {landmark.name}
          </h1>

          {/* Optional Original / Alternate Name */}
          {landmark.originalName && (
            <p className="text-stone-300 font-sans text-sm sm:text-base font-light italic mt-1 tracking-wide">
              {landmark.originalName}
            </p>
          )}

          {/* Tagline / Subtitle */}
          <p className="text-stone-300 font-sans text-sm sm:text-lg max-w-3xl mt-2 leading-relaxed font-normal">
            {landmark.tagline}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={onOpenShareModal}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs sm:text-sm rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-stone-900" />
              <span>Chia sẻ danh lam</span>
            </button>

            {isAdmin ? (
              <button
                onClick={onOpenEditor}
                className="px-4 py-2.5 bg-stone-900/80 hover:bg-stone-800 text-stone-100 border border-stone-700/80 font-medium text-xs sm:text-sm rounded-lg transition-all backdrop-blur-sm flex items-center gap-2 cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-amber-300" />
                <span>Chỉnh sửa thông tin này</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  const el = document.getElementById('map-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2.5 bg-stone-900/80 hover:bg-stone-800 text-stone-100 border border-stone-700/80 font-medium text-xs sm:text-sm rounded-lg transition-all backdrop-blur-sm flex items-center gap-2 cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Bản đồ & Dẫn đường</span>
              </button>
            )}

            <button
              onClick={() => {
                const el = document.getElementById('itinerary-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-stone-200 border border-white/20 font-medium text-xs sm:text-sm rounded-lg transition-all backdrop-blur-sm flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-stone-300" />
              <span>Lịch trình chi tiết</span>
            </button>

            {onPlayAudio && (
              <button
                onClick={onPlayAudio}
                className="px-4 py-2.5 bg-amber-950/70 hover:bg-amber-900/80 text-amber-200 border border-amber-600/50 font-medium text-xs sm:text-sm rounded-lg transition-all backdrop-blur-sm flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Headphones className="w-4 h-4 text-amber-400" />
                <span>Nghe thuyết minh audio</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Pattern A: Operational Utility Ribbon (Hours, Ticket, Season, Duration) */}
      <div className="bg-[#F7F4EE] border-t border-stone-200/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-stone-700">
          
          <div className="flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Mùa lý tưởng
              </span>
              <span className="text-xs sm:text-sm font-medium text-stone-900 leading-snug">
                {landmark.quickFacts.bestSeason}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Thời lượng đề xuất
              </span>
              <span className="text-xs sm:text-sm font-medium text-stone-900 leading-snug">
                {landmark.quickFacts.idealDuration}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Ticket className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Chi phí / Vé vào cổng
              </span>
              <span className="text-xs sm:text-sm font-medium text-stone-900 leading-snug">
                {landmark.quickFacts.ticketPrice}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Tọa độ địa lý
              </span>
              <span className="text-xs sm:text-sm font-medium text-stone-900 font-mono tabular-nums leading-snug">
                {landmark.location.coordinates.lat.toFixed(4)}° N, {landmark.location.coordinates.lng.toFixed(4)}° E
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
