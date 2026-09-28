import React, { useState } from 'react';
import {
  X,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Compass,
  Sparkles,
  BookOpen,
  Calendar,
  Utensils,
  Lightbulb,
  Share2,
  Upload,
  Check,
  Camera,
  UploadCloud,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { compressImageFile } from '../utils/imageCompressor';
import {
  Landmark,
  LandmarkCategory,
  LandmarkTheme,
  HighlightItem,
  ItineraryDay,
  GastronomyItem,
  PracticalTip,
  GalleryPhoto
} from '../types/landmark';

interface LandmarkEditorProps {
  initialLandmark?: Landmark;
  onSave: (updatedLandmark: Landmark, andExport?: boolean) => void;
  onClose: () => void;
}

const CATEGORIES: { value: LandmarkCategory; label: string }[] = [
  { value: 'scenic_landscape', label: 'Danh lam Thắng cảnh' },
  { value: 'natural_wonder', label: 'Kỳ quan Thiên nhiên' },
  { value: 'cultural_heritage', label: 'Di sản Văn hóa' },
  { value: 'mountain_eco', label: 'Miền Núi & Sinh Thái' },
  { value: 'island_beach', label: 'Biển Đảo & Nghỉ Dưỡng' },
  { value: 'historic_monument', label: 'Di tích Lịch sử Cổ' },
];

const THEMES: { value: LandmarkTheme; label: string; bg: string }[] = [
  { value: 'parchment', label: 'Giấy Cổ & Đá Vôi (Parchment)', bg: 'bg-[#FBF9F5] border-amber-300' },
  { value: 'emerald', label: 'Ngọc Bích & Rừng Núi (Emerald)', bg: 'bg-emerald-950 text-white' },
  { value: 'amber', label: 'Hổ Phách & Đèn Lồng (Amber)', bg: 'bg-amber-900 text-white' },
  { value: 'lapis', label: 'Đại Dương Biếc (Lapis)', bg: 'bg-blue-950 text-white' },
  { value: 'imperial', label: 'Hoàng Cung & Tơ Lụa (Imperial)', bg: 'bg-red-950 text-white' },
  { value: 'charcoal', label: 'Triển Lãm Hiện Đại (Charcoal)', bg: 'bg-stone-900 text-white' },
];

const SAMPLE_PHOTO_PRESETS = [
  { label: 'Vịnh non nước', url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Phố cổ rêu phong', url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Hang động kỳ vĩ', url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Biển mây núi cao', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80' },
];

export const LandmarkEditor: React.FC<LandmarkEditorProps> = ({
  initialLandmark,
  onSave,
  onClose,
}) => {
  const blankFallback: Landmark = {
    id: `danh-lam-${Date.now().toString(36)}`,
    name: 'Danh Lam Mới',
    tagline: 'Vẻ đẹp di sản đất Việt',
    category: 'scenic_landscape',
    categoryLabel: 'Danh lam Thắng cảnh',
    theme: 'parchment',
    location: {
      province: 'Hà Nội',
      country: 'Việt Nam',
      address: 'Địa chỉ danh thắng',
      coordinates: { lat: 21.0285, lng: 105.8542 },
    },
    heroImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=2000&q=85',
    gallery: [],
    quickFacts: {
      bestSeason: 'Mùa thu (tháng 9 - tháng 11)',
      idealDuration: '1 ngày trải nghiệm',
      ticketPrice: 'Miễn phí / Vé vào cổng',
      difficultyLevel: 'Dễ dàng',
      suitableFor: 'Mọi lứa tuổi',
      openingHours: '07:30 - 17:30 hàng ngày',
      weatherNote: 'Thời tiết ôn hòa',
    },
    overview: 'Nhập bài viết mô tả chi tiết danh thắng...',
    highlights: [],
    itinerary: [],
    gastronomy: [],
    practicalTips: [],
    audioGuide: {
      title: 'Thuyết minh Danh Lam Mới',
      durationEstimateMinutes: 3,
      script: 'Chào mừng quý khách đến với danh lam thắng cảnh...',
    },
    updatedAt: new Date().toISOString().slice(0, 10),
    isCustom: true,
  };

  const [landmark, setLandmark] = useState<Landmark>({
    ...(initialLandmark || blankFallback),
    isCustom: true,
    updatedAt: new Date().toISOString().slice(0, 10),
  });

  const [activeTab, setActiveTab] = useState<
    'general' | 'overview' | 'highlights' | 'itinerary' | 'gastronomy' | 'tips' | 'gallery' | 'audio'
  >('general');

  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [uploadToast, setUploadToast] = useState<string | null>(null);

  // Handle local image upload for hero image with canvas compression
  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingHero(true);
    try {
      const dataUrl = await compressImageFile(file, 1600, 0.82);
      setLandmark((prev) => ({ ...prev, heroImage: dataUrl }));
      setUploadToast('Đã tải ảnh lên thành công!');
      setTimeout(() => setUploadToast(null), 3500);
    } catch (err) {
      console.error('Error optimizing hero image:', err);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const fallbackUrl = evt.target?.result as string;
        if (fallbackUrl) {
          setLandmark((prev) => ({ ...prev, heroImage: fallbackUrl }));
          setUploadToast('Đã nạp ảnh!');
          setTimeout(() => setUploadToast(null), 3500);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingHero(false);
      e.target.value = '';
    }
  };

  // Handle image upload for individual highlight items
  const handleHighlightImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 1200, 0.82);
      const updated = [...landmark.highlights];
      updated[idx].imageUrl = dataUrl;
      setLandmark((prev) => ({ ...prev, highlights: updated }));
    } catch (err) {
      console.error('Error uploading highlight photo:', err);
    } finally {
      e.target.value = '';
    }
  };

  // Handle multi-image upload for gallery
  const handleMultiGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const newItems: GalleryPhoto[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const dataUrl = await compressImageFile(file, 1400, 0.82);
        newItems.push({
          id: `p-${Date.now()}-${i}`,
          url: dataUrl,
          caption: file.name.replace(/\.[^/.]+$/, ''),
          author: 'Ban Quản trị',
        });
      }
      setLandmark((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...newItems],
      }));
    } catch (err) {
      console.error('Error uploading gallery photos:', err);
    } finally {
      e.target.value = '';
    }
  };

  // Handle single photo replacement in gallery
  const handleSingleGalleryPhotoUpload = async (pIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 1400, 0.82);
      const updated = [...landmark.gallery];
      updated[pIdx].url = dataUrl;
      setLandmark((prev) => ({ ...prev, gallery: updated }));
    } catch (err) {
      console.error('Error replacing gallery photo:', err);
    } finally {
      e.target.value = '';
    }
  };

  // Highlights handlers
  const handleAddHighlight = () => {
    const newItem: HighlightItem = {
      id: `hl-${Date.now()}`,
      title: 'Điểm trải nghiệm mới',
      description: 'Mô tả chi tiết về trải nghiệm độc đáo này...',
      tag: 'Nổi bật',
    };
    setLandmark((prev) => ({ ...prev, highlights: [...prev.highlights, newItem] }));
  };

  const handleUpdateHighlight = (idx: number, field: keyof HighlightItem, val: string) => {
    const updated = [...landmark.highlights];
    updated[idx] = { ...updated[idx], [field]: val };
    setLandmark((prev) => ({ ...prev, highlights: updated }));
  };

  const handleRemoveHighlight = (idx: number) => {
    setLandmark((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== idx),
    }));
  };

  // Itinerary handlers
  const handleAddItineraryDay = () => {
    const newDay: ItineraryDay = {
      id: `day-${Date.now()}`,
      dayNumber: landmark.itinerary.length + 1,
      title: `Ngày ${landmark.itinerary.length + 1}: Hành trình mới`,
      summary: 'Tóm lược trải nghiệm ngày...',
      activities: [
        {
          id: `act-${Date.now()}-1`,
          time: '08:30 - 11:30',
          title: 'Khám phá địa danh chính',
          description: 'Mô tả hoạt động cụ thể và những điều thú vị...',
          tip: 'Lời khuyên khi tham gia',
        },
      ],
    };
    setLandmark((prev) => ({ ...prev, itinerary: [...prev.itinerary, newDay] }));
  };

  const handleAddActivity = (dayIndex: number) => {
    const updated = [...landmark.itinerary];
    updated[dayIndex].activities.push({
      id: `act-${Date.now()}`,
      time: '14:00 - 17:00',
      title: 'Hoạt động tiếp theo',
      description: 'Chi tiết lịch trình...',
    });
    setLandmark((prev) => ({ ...prev, itinerary: updated }));
  };

  const handleRemoveActivity = (dayIndex: number, actIndex: number) => {
    const updated = [...landmark.itinerary];
    updated[dayIndex].activities = updated[dayIndex].activities.filter((_, i) => i !== actIndex);
    setLandmark((prev) => ({ ...prev, itinerary: updated }));
  };

  // Gastronomy handlers
  const handleAddGastronomy = () => {
    const newItem: GastronomyItem = {
      id: `f-${Date.now()}`,
      name: 'Món ngon đặc sản',
      description: 'Hương vị, cách chế biến và nét độc đáo của món ăn...',
      recommendedPlaces: 'Địa chỉ quán ngon nổi tiếng',
    };
    setLandmark((prev) => ({ ...prev, gastronomy: [...prev.gastronomy, newItem] }));
  };

  const handleRemoveGastronomy = (idx: number) => {
    setLandmark((prev) => ({
      ...prev,
      gastronomy: prev.gastronomy.filter((_, i) => i !== idx),
    }));
  };

  // Tips handlers
  const handleAddTip = () => {
    const newItem: PracticalTip = {
      id: `tip-${Date.now()}`,
      category: 'transport',
      title: 'Lưu ý cần biết',
      details: 'Hướng dẫn cụ thể cho du khách...',
    };
    setLandmark((prev) => ({ ...prev, practicalTips: [...prev.practicalTips, newItem] }));
  };

  const handleRemoveTip = (idx: number) => {
    setLandmark((prev) => ({
      ...prev,
      practicalTips: prev.practicalTips.filter((_, i) => i !== idx),
    }));
  };

  // Gallery handlers
  const handleAddPhoto = () => {
    const newPhoto: GalleryPhoto = {
      id: `photo-${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      caption: 'Khoảnh khắc tuyệt đẹp tại danh thắng',
      author: 'Nhiếp ảnh gia',
    };
    setLandmark((prev) => ({ ...prev, gallery: [...prev.gallery, newPhoto] }));
  };

  const handleRemovePhoto = (idx: number) => {
    setLandmark((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (andExport = false) => {
    // Generate id if empty or needed
    const finalLandmark: Landmark = {
      ...landmark,
      id: landmark.id.startsWith('vn-') && landmark.name !== initialLandmark?.name
        ? `custom-${Date.now().toString(36)}`
        : landmark.id,
      categoryLabel: CATEGORIES.find((c) => c.value === landmark.category)?.label || landmark.categoryLabel,
    };
    onSave(finalLandmark, andExport);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        className="bg-white rounded-2xl max-w-4xl w-full border border-stone-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Editor Top Bar */}
        <div className="px-6 py-4 bg-[#F7F4EE] border-b border-stone-200 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-amber-800 font-semibold block">
              Biên tập viên Di sản
            </span>
            <h2 className="text-xl font-serif font-bold text-stone-900 leading-tight">
              Tùy Chỉnh Danh Lam Thắng Cảnh
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSubmit(false)}
              className="px-3.5 py-2 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu & Xem</span>
            </button>

            <button
              onClick={() => handleSubmit(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Lưu & Xuất Link</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 px-6 bg-stone-50/70 overflow-x-auto text-xs font-semibold text-stone-600 gap-4 shrink-0 no-scrollbar">
          {[
            { id: 'general', label: '1. Thông tin chung' },
            { id: 'overview', label: '2. Giới thiệu & Lịch sử' },
            { id: 'highlights', label: '3. Điểm nhấn nổi bật' },
            { id: 'itinerary', label: '4. Lịch trình khám phá' },
            { id: 'gastronomy', label: '5. Ẩm thực đặc sản' },
            { id: 'tips', label: '6. Cẩm nang du khách' },
            { id: 'gallery', label: '7. Hình ảnh & Thư viện' },
            { id: 'audio', label: '8. Audio thuyết minh' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? 'border-amber-700 text-stone-900 font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Tên danh lam thắng cảnh *
                  </label>
                  <input
                    type="text"
                    value={landmark.name}
                    onChange={(e) => setLandmark({ ...landmark, name: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900 font-serif text-sm focus:border-amber-600 focus:outline-none"
                    placeholder="VD: Vịnh Hạ Long, Chùa Tam Chúc..."
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Tên phụ / Tên quốc tế (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={landmark.originalName || ''}
                    onChange={(e) => setLandmark({ ...landmark, originalName: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-800 focus:border-amber-600 focus:outline-none"
                    placeholder="VD: Ha Long Bay, Trang An Complex..."
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Khẩu hiệu / Câu đề từ (Tagline) *
                </label>
                <input
                  type="text"
                  value={landmark.tagline}
                  onChange={(e) => setLandmark({ ...landmark, tagline: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-800 focus:border-amber-600 focus:outline-none"
                  placeholder="Một câu thơ hoặc mô tả ngắn gọn gây ấn tượng sâu sắc..."
                />
              </div>

              {/* Ảnh Đại Diện & Bìa Giới Thiệu Chính (Hero Banner) */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-50/70 via-stone-50 to-amber-50/30 border-2 border-dashed border-amber-300 rounded-2xl space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-2">
                        <span>Ảnh Bìa & Hình Giới Thiệu Chính *</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-amber-200 text-amber-900 rounded font-bold">
                          Đầu trang
                        </span>
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Tải ảnh phong cảnh đẹp nhất từ máy tính hoặc điện thoại để giới thiệu danh lam này.
                      </p>
                    </div>
                  </div>

                  {uploadToast && (
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300 animate-fade-in flex items-center gap-1.5 self-start sm:self-auto">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{uploadToast}</span>
                    </span>
                  )}
                </div>

                {/* Visual Image Preview */}
                {landmark.heroImage && (
                  <div className="relative aspect-[16/9] sm:aspect-[21/9] max-h-60 w-full rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shadow-inner group">
                    <img
                      src={landmark.heroImage}
                      alt="Ảnh giới thiệu danh lam"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end justify-between p-3.5 text-white">
                      <span className="text-[11px] font-medium bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md">
                        Xem trước ảnh bìa đang chọn
                      </span>
                      <label className="text-[11px] font-semibold bg-white hover:bg-stone-100 text-stone-900 px-3 py-1.5 rounded-lg shadow-md cursor-pointer flex items-center gap-1.5 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-amber-700" />
                        <span>Thay ảnh khác</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploadingHero}
                          onChange={handleHeroImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Upload & Link Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Direct File Upload Button */}
                  <label className="flex items-center justify-center gap-2 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm hover:shadow-md">
                    {isUploadingHero ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang tối ưu & nạp ảnh...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4 stroke-[2.5]" />
                        <span>Tải ảnh từ máy tính / điện thoại</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingHero}
                      onChange={handleHeroImageUpload}
                      className="hidden"
                    />
                  </label>

                  {/* URL Input */}
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={landmark.heroImage}
                      onChange={(e) => setLandmark({ ...landmark, heroImage: e.target.value })}
                      placeholder="Hoặc dán liên kết ảnh (https://...)"
                      className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-stone-800 bg-white focus:border-amber-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="text-stone-500 font-medium">Gợi ý ảnh mẫu đẹp:</span>
                  {SAMPLE_PHOTO_PRESETS.map((p, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setLandmark({ ...landmark, heroImage: p.url })}
                      className="px-2.5 py-1 bg-white hover:bg-amber-100/70 border border-stone-200 hover:border-amber-400 rounded-lg text-stone-700 hover:text-amber-950 transition-colors cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Phân loại danh lam *
                  </label>
                  <select
                    value={landmark.category}
                    onChange={(e) =>
                      setLandmark({
                        ...landmark,
                        category: e.target.value as LandmarkCategory,
                        categoryLabel: CATEGORIES.find((c) => c.value === e.target.value)?.label || '',
                      })
                    }
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-800 bg-white focus:border-amber-600 focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Trạng thái công nhận (UNESCO / Danh lam cấp Quốc gia)
                  </label>
                  <input
                    type="text"
                    value={landmark.unescoStatus || ''}
                    onChange={(e) => setLandmark({ ...landmark, unescoStatus: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-800 focus:border-amber-600 focus:outline-none"
                    placeholder="VD: Di sản Thiên nhiên Thế giới UNESCO (2000)"
                  />
                </div>
              </div>

              {/* Location info */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <h4 className="font-serif font-bold text-stone-900 text-sm">
                  Địa điểm & Tọa độ
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-600 mb-1">Tỉnh / Thành phố</label>
                    <input
                      type="text"
                      value={landmark.location.province}
                      onChange={(e) =>
                        setLandmark({
                          ...landmark,
                          location: { ...landmark.location, province: e.target.value },
                        })
                      }
                      className="w-full border border-stone-300 rounded-lg p-2 text-stone-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1">Quốc gia</label>
                    <input
                      type="text"
                      value={landmark.location.country}
                      onChange={(e) =>
                        setLandmark({
                          ...landmark,
                          location: { ...landmark.location, country: e.target.value },
                        })
                      }
                      className="w-full border border-stone-300 rounded-lg p-2 text-stone-800 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-600 mb-1">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    value={landmark.location.address}
                    onChange={(e) =>
                      setLandmark({
                        ...landmark,
                        location: { ...landmark.location, address: e.target.value },
                      })
                    }
                    className="w-full border border-stone-300 rounded-lg p-2 text-stone-800 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-600 mb-1">Vĩ độ (Latitude)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={landmark.location.coordinates.lat}
                      onChange={(e) =>
                        setLandmark({
                          ...landmark,
                          location: {
                            ...landmark.location,
                            coordinates: {
                              ...landmark.location.coordinates,
                              lat: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="w-full border border-stone-300 rounded-lg p-2 text-stone-800 font-mono bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1">Kinh độ (Longitude)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={landmark.location.coordinates.lng}
                      onChange={(e) =>
                        setLandmark({
                          ...landmark,
                          location: {
                            ...landmark.location,
                            coordinates: {
                              ...landmark.location.coordinates,
                              lng: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="w-full border border-stone-300 rounded-lg p-2 text-stone-800 font-mono bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Theme selection */}
              <div>
                <label className="block font-semibold text-stone-700 mb-2">
                  Chủ đề mỹ thuật & Bảng màu
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {THEMES.map((th) => (
                    <button
                      key={th.value}
                      type="button"
                      onClick={() => setLandmark({ ...landmark, theme: th.value })}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                        landmark.theme === th.value
                          ? 'border-amber-700 ring-2 ring-amber-500/20 bg-amber-50/50'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <span className="font-medium text-stone-900">{th.label}</span>
                      {landmark.theme === th.value && <Check className="w-4 h-4 text-amber-700" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OVERVIEW & HISTORY */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Bài viết giới thiệu chi tiết (Tổng quan) *
                </label>
                <textarea
                  rows={6}
                  value={landmark.overview}
                  onChange={(e) => setLandmark({ ...landmark, overview: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-3 text-stone-800 leading-relaxed focus:border-amber-600 focus:outline-none"
                  placeholder="Mô tả toàn diện về vị trí địa lý, quá trình hình thành, cảm xúc khi đứng trước danh lam..."
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Trích dẫn đắt giá (Pull Quote)
                </label>
                <input
                  type="text"
                  value={landmark.pullQuote || ''}
                  onChange={(e) => setLandmark({ ...landmark, pullQuote: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-800 font-serif italic focus:border-amber-600 focus:outline-none"
                  placeholder="Một câu trích dẫn mang tính triết lý, cảm xúc thi ca..."
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Dấu tích lịch sử & Truyền thuyết dân gian
                </label>
                <textarea
                  rows={4}
                  value={landmark.historyLore || ''}
                  onChange={(e) => setLandmark({ ...landmark, historyLore: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-3 text-stone-800 leading-relaxed focus:border-amber-600 focus:outline-none"
                  placeholder="Sự tích, tên gọi, các biến cố lịch sử gắn liền với địa danh..."
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Giá trị văn hóa & Đa dạng sinh học
                </label>
                <textarea
                  rows={4}
                  value={landmark.culturalSignificance || ''}
                  onChange={(e) => setLandmark({ ...landmark, culturalSignificance: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-3 text-stone-800 leading-relaxed focus:border-amber-600 focus:outline-none"
                  placeholder="Đặc trưng văn hóa bản địa, lễ hội, hệ sinh thái động thực vật..."
                />
              </div>
            </div>
          )}

          {/* TAB 3: HIGHLIGHTS */}
          {activeTab === 'highlights' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-stone-600">
                  Những trải nghiệm đỉnh cao và góc ngắm đẹp nhất mà du khách nhất định phải thử.
                </p>
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm điểm nhấn</span>
                </button>
              </div>

              <div className="space-y-3">
                {landmark.highlights.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 border border-stone-200 rounded-xl bg-stone-50/50 space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-500 font-mono">
                        Điểm nhấn #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(idx)}
                        className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-600 mb-1">Tiêu đề điểm nhấn</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateHighlight(idx, 'title', e.target.value)}
                          className="w-full border border-stone-300 rounded-lg p-2 bg-white text-stone-900 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 mb-1">Gắn thẻ phân loại</label>
                        <input
                          type="text"
                          value={item.tag || ''}
                          onChange={(e) => handleUpdateHighlight(idx, 'tag', e.target.value)}
                          className="w-full border border-stone-300 rounded-lg p-2 bg-white text-stone-800"
                          placeholder="VD: Tuyệt tác địa chất, Góc ảnh Panorama..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1">Mô tả trải nghiệm</label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => handleUpdateHighlight(idx, 'description', e.target.value)}
                        className="w-full border border-stone-300 rounded-lg p-2 bg-white text-stone-800 leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ITINERARY */}
          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-stone-600">
                  Lộ trình thời gian chi tiết theo từng ngày giúp người đi dễ dàng hình dung.
                </p>
                <button
                  type="button"
                  onClick={handleAddItineraryDay}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm ngày mới</span>
                </button>
              </div>

              {landmark.itinerary.map((day, dIdx) => (
                <div
                  key={day.id || dIdx}
                  className="p-5 border border-stone-300 rounded-xl bg-[#F7F4EE] space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-stone-300/80 pb-3">
                    <div className="flex-1 mr-4">
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => {
                          const updated = [...landmark.itinerary];
                          updated[dIdx].title = e.target.value;
                          setLandmark({ ...landmark, itinerary: updated });
                        }}
                        className="font-serif font-bold text-base text-stone-900 bg-transparent border-b border-stone-300 focus:border-stone-900 focus:outline-none w-full"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setLandmark({
                          ...landmark,
                          itinerary: landmark.itinerary.filter((_, i) => i !== dIdx),
                        });
                      }}
                      className="text-red-600 hover:text-red-800 text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa ngày</span>
                    </button>
                  </div>

                  {/* Activities inside this day */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-stone-600 font-semibold">
                      <span>Các mốc lịch trình</span>
                      <button
                        type="button"
                        onClick={() => handleAddActivity(dIdx)}
                        className="text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Thêm hoạt động</span>
                      </button>
                    </div>

                    {day.activities.map((act, aIdx) => (
                      <div
                        key={act.id || aIdx}
                        className="p-3 bg-white border border-stone-200 rounded-lg space-y-2 relative"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={act.time}
                            onChange={(e) => {
                              const updated = [...landmark.itinerary];
                              updated[dIdx].activities[aIdx].time = e.target.value;
                              setLandmark({ ...landmark, itinerary: updated });
                            }}
                            className="font-mono text-xs font-semibold text-amber-900 border border-stone-200 rounded px-2 py-1 w-32 bg-stone-50"
                            placeholder="08:00 - 11:30"
                          />
                          <input
                            type="text"
                            value={act.title}
                            onChange={(e) => {
                              const updated = [...landmark.itinerary];
                              updated[dIdx].activities[aIdx].title = e.target.value;
                              setLandmark({ ...landmark, itinerary: updated });
                            }}
                            className="flex-1 font-serif font-bold text-stone-900 border border-stone-200 rounded px-2 py-1"
                            placeholder="Tiêu đề hoạt động"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveActivity(dIdx, aIdx)}
                            className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <textarea
                          rows={2}
                          value={act.description}
                          onChange={(e) => {
                            const updated = [...landmark.itinerary];
                            updated[dIdx].activities[aIdx].description = e.target.value;
                            setLandmark({ ...landmark, itinerary: updated });
                          }}
                          className="w-full border border-stone-200 rounded p-2 text-stone-800"
                          placeholder="Mô tả nội dung chi tiết..."
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: GASTRONOMY */}
          {activeTab === 'gastronomy' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-stone-600">
                  Danh sách đặc sản địa phương mà người du lịch không nên bỏ qua.
                </p>
                <button
                  type="button"
                  onClick={handleAddGastronomy}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm món ăn</span>
                </button>
              </div>

              <div className="space-y-3">
                {landmark.gastronomy.map((food, fIdx) => (
                  <div
                    key={food.id || fIdx}
                    className="p-4 border border-stone-200 rounded-xl bg-stone-50/50 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={food.name}
                        onChange={(e) => {
                          const updated = [...landmark.gastronomy];
                          updated[fIdx].name = e.target.value;
                          setLandmark({ ...landmark, gastronomy: updated });
                        }}
                        className="font-serif font-bold text-sm text-stone-900 border border-stone-200 rounded px-2.5 py-1 w-full max-w-sm bg-white"
                        placeholder="Tên món ăn đặc sản"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGastronomy(fIdx)}
                        className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={food.description}
                      onChange={(e) => {
                        const updated = [...landmark.gastronomy];
                        updated[fIdx].description = e.target.value;
                        setLandmark({ ...landmark, gastronomy: updated });
                      }}
                      className="w-full border border-stone-200 rounded p-2 text-stone-800 bg-white"
                      placeholder="Mô tả hương vị, nguyên liệu đặc biệt..."
                    />

                    <input
                      type="text"
                      value={food.recommendedPlaces || ''}
                      onChange={(e) => {
                        const updated = [...landmark.gastronomy];
                        updated[fIdx].recommendedPlaces = e.target.value;
                        setLandmark({ ...landmark, gastronomy: updated });
                      }}
                      className="w-full border border-stone-200 rounded p-2 text-stone-700 bg-white"
                      placeholder="Địa chỉ quán ngon gợi ý (VD: Quán bà Tuyết, chợ đêm...)"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: TIPS & PRACTICAL FACTS */}
          {activeTab === 'tips' && (
            <div className="space-y-4">
              {/* Quick facts */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <h4 className="font-serif font-bold text-stone-900 text-sm">
                  Thông số thực tế nhanh
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-600 mb-1">Mùa đẹp nhất</label>
                    <input
                      type="text"
                      value={landmark.quickFacts.bestSeason}
                      onChange={(e) =>
                        setLandmark({
                          ...landmark,
                          quickFacts: { ...landmark.quickFacts, bestSeason: e.target.value },
                        })
                      }
                      className="w-full border border-stone-300 rounded p-2 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1">Thời lượng lý tưởng</label>
                    <input
                      type="text"
                      value={landmark.quickFacts.idealDuration}
                      onChange={(e) =>
                        setLandmark({
                          ...landmark,
                          quickFacts: { ...landmark.quickFacts, idealDuration: e.target.value },
                        })
                      }
                      className="w-full border border-stone-300 rounded p-2 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1">Giá vé / Chi phí vào cổng</label>
                    <input
                      type="text"
                      value={landmark.quickFacts.ticketPrice}
                      onChange={(e) =>
                        setLandmark({
                          ...landmark,
                          quickFacts: { ...landmark.quickFacts, ticketPrice: e.target.value },
                        })
                      }
                      className="w-full border border-stone-300 rounded p-2 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1">Giờ mở cửa</label>
                    <input
                      type="text"
                      value={landmark.quickFacts.openingHours}
                      onChange={(e) =>
                        setLandmark({
                          ...landmark,
                          quickFacts: { ...landmark.quickFacts, openingHours: e.target.value },
                        })
                      }
                      className="w-full border border-stone-300 rounded p-2 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Practical tips items */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-stone-900 text-sm">
                    Lời khuyên & Lưu ý cần nhớ
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddTip}
                    className="text-amber-800 hover:text-amber-950 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm lưu ý</span>
                  </button>
                </div>

                {landmark.practicalTips.map((tip, tIdx) => (
                  <div
                    key={tip.id || tIdx}
                    className="p-3 border border-stone-200 rounded-lg bg-white space-y-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <select
                        value={tip.category}
                        onChange={(e) => {
                          const updated = [...landmark.practicalTips];
                          updated[tIdx].category = e.target.value as PracticalTip['category'];
                          setLandmark({ ...landmark, practicalTips: updated });
                        }}
                        className="border border-stone-200 rounded p-1 text-xs bg-stone-50"
                      >
                        <option value="transport">Vận chuyển</option>
                        <option value="packing">Hành lý</option>
                        <option value="cost">Chi phí</option>
                        <option value="etiquette">Văn hóa</option>
                      </select>
                      <input
                        type="text"
                        value={tip.title}
                        onChange={(e) => {
                          const updated = [...landmark.practicalTips];
                          updated[tIdx].title = e.target.value;
                          setLandmark({ ...landmark, practicalTips: updated });
                        }}
                        className="flex-1 font-medium border border-stone-200 rounded px-2 py-1"
                        placeholder="Tiêu đề lưu ý"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveTip(tIdx)}
                        className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={tip.details}
                      onChange={(e) => {
                        const updated = [...landmark.practicalTips];
                        updated[tIdx].details = e.target.value;
                        setLandmark({ ...landmark, practicalTips: updated });
                      }}
                      className="w-full border border-stone-200 rounded p-2 text-stone-700"
                      placeholder="Chi tiết kinh nghiệm..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: GALLERY & HERO IMAGE */}
          {activeTab === 'gallery' && (
            <div className="space-y-5">
              {/* Hero Image */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <label className="block font-serif font-bold text-stone-900 text-sm">
                  Ảnh bìa chính (Hero Banner) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={landmark.heroImage}
                    onChange={(e) => setLandmark({ ...landmark, heroImage: e.target.value })}
                    className="flex-1 border border-stone-300 rounded-lg p-2.5 text-stone-800 bg-white"
                    placeholder="Dán đường dẫn ảnh (URL) hoặc chọn bên dưới..."
                  />
                  <label className="px-3.5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg flex items-center gap-1.5 cursor-pointer font-semibold whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải ảnh từ máy</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Quick Presets */}
                <div className="pt-2">
                  <span className="text-stone-500 text-[11px] block mb-1.5">
                    Hoặc chọn nhanh ảnh mẫu có sẵn:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_PHOTO_PRESETS.map((p, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setLandmark({ ...landmark, heroImage: p.url })}
                        className="px-2.5 py-1 bg-white border border-stone-200 rounded hover:border-amber-600 transition-colors text-stone-700 cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gallery Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-stone-900 text-sm">
                    Bộ sưu tập ảnh chi tiết
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm ảnh vào bộ sưu tập</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {landmark.gallery.map((photo, pIdx) => (
                    <div
                      key={photo.id || pIdx}
                      className="p-3 border border-stone-200 rounded-xl bg-white space-y-2 relative"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(pIdx)}
                        className="absolute top-2 right-2 text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="text"
                        value={photo.url}
                        onChange={(e) => {
                          const updated = [...landmark.gallery];
                          updated[pIdx].url = e.target.value;
                          setLandmark({ ...landmark, gallery: updated });
                        }}
                        className="w-full border border-stone-200 rounded p-1.5 text-xs text-stone-800"
                        placeholder="URL hình ảnh"
                      />
                      <input
                        type="text"
                        value={photo.caption}
                        onChange={(e) => {
                          const updated = [...landmark.gallery];
                          updated[pIdx].caption = e.target.value;
                          setLandmark({ ...landmark, gallery: updated });
                        }}
                        className="w-full border border-stone-200 rounded p-1.5 text-xs text-stone-700"
                        placeholder="Chú thích ảnh"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: AUDIO GUIDE */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Tiêu đề thuyết minh
                </label>
                <input
                  type="text"
                  value={landmark.audioGuide?.title || ''}
                  onChange={(e) =>
                    setLandmark({
                      ...landmark,
                      audioGuide: {
                        ...(landmark.audioGuide || { durationEstimateMinutes: 3 }),
                        title: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  placeholder={`VD: Thuyết minh Di sản ${landmark.name}`}
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Kịch bản đọc Audio Guide (Được phát thanh tự động bằng giọng nói tiếng Việt)
                </label>
                <textarea
                  rows={8}
                  value={landmark.audioGuide?.script || ''}
                  onChange={(e) =>
                    setLandmark({
                      ...landmark,
                      audioGuide: {
                        ...(landmark.audioGuide || { durationEstimateMinutes: 3 }),
                        script: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-stone-300 rounded-lg p-3 text-stone-800 leading-relaxed font-sans"
                  placeholder="Viết kịch bản truyền cảm giới thiệu danh lam để người dùng có thể bấm nghe phát thanh trực tiếp..."
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-[#F7F4EE] border-t border-stone-200 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold cursor-pointer"
          >
            Hủy bỏ
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSubmit(false)}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu thay đổi</span>
            </button>

            <button
              onClick={() => handleSubmit(true)}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Lưu & Xuất Link chia sẻ</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
