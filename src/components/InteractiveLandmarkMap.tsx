import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Landmark, LandmarkCategory } from '../types/landmark';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  Compass, 
  Maximize2, 
  ExternalLink, 
  Sparkles, 
  Eye, 
  Search,
  Filter,
  X
} from 'lucide-react';

interface InteractiveLandmarkMapProps {
  landmarks: Landmark[];
  selectedLandmarkId?: string;
  onSelectLandmark: (landmark: Landmark) => void;
  heightClass?: string;
  standalone?: boolean;
}

type MapLayerType = 'editorial' | 'satellite' | 'topo' | 'osm';

export const InteractiveLandmarkMap: React.FC<InteractiveLandmarkMapProps> = ({
  landmarks,
  selectedLandmarkId,
  onSelectLandmark,
  heightClass = 'h-[640px]',
  standalone = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeLayer, setActiveLayer] = useState<MapLayerType>('editorial');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePopupLandmark, setActivePopupLandmark] = useState<Landmark | null>(null);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  // Filtered landmarks
  const filteredLandmarks = landmarks.filter((lm) => {
    const matchesCat = activeCategory === 'all' || lm.category === activeCategory;
    const matchesQuery = 
      lm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lm.location.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lm.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Layer URL sources
  const getTileUrl = (type: MapLayerType): { url: string; attribution: string; maxZoom: number } => {
    switch (type) {
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri, Maxar, Earthstar Geographics',
          maxZoom: 18,
        };
      case 'topo':
        return {
          url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
          attribution: '&copy; OpenTopoMap contributors',
          maxZoom: 17,
        };
      case 'osm':
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        };
      case 'editorial':
      default:
        return {
          url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
          attribution: '&copy; OpenStreetMap &copy; CARTO',
          maxZoom: 19,
        };
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Vietnam center approximate
    const map = L.map(mapContainerRef.current, {
      center: [16.0544, 107.5],
      zoom: 6,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    // Custom zoom control in bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial tile layer
    const tileConfig = getTileUrl(activeLayer);
    const tileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: tileConfig.maxZoom,
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update tile layer when activeLayer changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileConfig = getTileUrl(activeLayer);
    const newTileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: tileConfig.maxZoom,
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [activeLayer]);

  // Marker creation helper
  const createCustomIcon = (landmark: Landmark, isSelected: boolean) => {
    const isUnesco = Boolean(landmark.unescoStatus);
    const badgeColor = isUnesco 
      ? 'bg-amber-600 border-amber-300 text-white shadow-amber-500/40' 
      : 'bg-emerald-700 border-emerald-300 text-white shadow-emerald-500/40';

    const html = `
      <div class="custom-map-pin flex flex-col items-center cursor-pointer group select-none">
        <div class="relative flex items-center justify-center">
          ${isSelected ? '<span class="absolute -inset-2 rounded-full bg-amber-400/40 animate-ping"></span>' : ''}
          <div class="w-9 h-9 rounded-full ${badgeColor} border-2 shadow-lg flex items-center justify-center transform transition-transform group-hover:scale-110">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          ${isUnesco ? '<span class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border border-white rounded-full flex items-center justify-center text-[9px] font-bold text-stone-900">★</span>' : ''}
        </div>
        <div class="mt-1 px-2 py-0.5 rounded-md bg-stone-900/85 backdrop-blur-sm text-white text-[11px] font-medium whitespace-nowrap shadow border border-white/20 max-w-[130px] truncate text-center pointer-events-none group-hover:bg-stone-900">
          ${landmark.name}
        </div>
      </div>
    `;

    return L.divIcon({
      html,
      className: '',
      iconSize: [40, 56],
      iconAnchor: [20, 42],
      popupAnchor: [0, -38],
    });
  };

  // Sync markers with filteredLandmarks
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const bounds = L.latLngBounds([]);

    filteredLandmarks.forEach((landmark) => {
      const { lat, lng } = landmark.location.coordinates;
      if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) return;

      const isSelected = landmark.id === selectedLandmarkId;
      const icon = createCustomIcon(landmark, isSelected);

      const marker = L.marker([lat, lng], { icon }).addTo(map);

      // Popup content with rich styling & actions
      const popupDiv = document.createElement('div');
      popupDiv.className = 'w-[280px] p-0 font-sans text-stone-900';
      popupDiv.innerHTML = `
        <div class="relative h-28 w-full overflow-hidden bg-stone-200">
          <img src="${landmark.heroImage}" alt="${landmark.name}" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent"></div>
          <span class="absolute bottom-2 left-2 px-2 py-0.5 bg-amber-600/90 text-white text-[10px] font-semibold rounded uppercase tracking-wider backdrop-blur-sm">
            ${landmark.categoryLabel}
          </span>
          ${landmark.unescoStatus ? '<span class="absolute top-2 right-2 px-1.5 py-0.5 bg-stone-900/80 text-amber-300 text-[10px] font-medium rounded border border-amber-400/40 backdrop-blur-sm">UNESCO</span>' : ''}
        </div>
        <div class="p-3.5">
          <h4 class="font-serif font-bold text-base text-stone-900 leading-snug line-clamp-1">${landmark.name}</h4>
          <p class="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
            <span class="truncate">${landmark.location.address}</span>
          </p>
          <p class="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">${landmark.overview}</p>
          
          <div class="mt-3 pt-2.5 border-t border-stone-200/80 grid grid-cols-2 gap-2">
            <button id="view-btn-${landmark.id}" class="w-full py-1.5 px-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium flex items-center justify-center gap-1 transition shadow-sm">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              Xem chi tiết
            </button>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" rel="noopener noreferrer" class="w-full py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded text-xs font-medium flex items-center justify-center gap-1 transition text-center">
              <svg class="w-3.5 h-3.5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
              Chỉ đường
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupDiv, { maxWidth: 300, minWidth: 260 });

      // Click listener for details button inside popup
      marker.on('popupopen', () => {
        setActivePopupLandmark(landmark);
        const btn = document.getElementById(`view-btn-${landmark.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectLandmark(landmark);
          };
        }
      });

      marker.on('popupclose', () => {
        if (activePopupLandmark?.id === landmark.id) {
          setActivePopupLandmark(null);
        }
      });

      markersRef.current[landmark.id] = marker;
      bounds.extend([lat, lng]);
    });

    // If there is a selected landmark, center on it and open popup
    if (selectedLandmarkId && markersRef.current[selectedLandmarkId]) {
      const selMarker = markersRef.current[selectedLandmarkId];
      const latlng = selMarker.getLatLng();
      map.setView(latlng, 10, { animate: true });
      selMarker.openPopup();
    } else if (bounds.isValid() && filteredLandmarks.length > 0) {
      // Fit to all visible markers with padding
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [filteredLandmarks, selectedLandmarkId]);

  // Center on Vietnam or all landmarks
  const handleResetBounds = () => {
    if (!mapInstanceRef.current) return;
    const bounds = L.latLngBounds([]);
    filteredLandmarks.forEach((lm) => {
      bounds.extend([lm.location.coordinates.lat, lm.location.coordinates.lng]);
    });
    if (bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    } else {
      mapInstanceRef.current.setView([16.0544, 107.5], 6);
    }
  };

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'natural_wonder', label: 'Kỳ quan tự nhiên' },
    { id: 'cultural_heritage', label: 'Di sản văn hóa' },
    { id: 'mountain_eco', label: 'Sinh thái núi rừng' },
    { id: 'historic_monument', label: 'Di tích lịch sử' },
  ];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-stone-200/90 shadow-xl bg-stone-100 flex flex-col">
      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-[500] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Search & Filter pill */}
        <div className="pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-stone-200/80 max-w-md w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc tỉnh thành..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-7 py-1.5 text-xs text-stone-800 bg-stone-50 rounded-lg border-0 focus:ring-1 focus:ring-amber-500 placeholder-stone-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="h-4 w-px bg-stone-200 hidden sm:block"></div>

          {/* Category selection */}
          <div className="hidden md:flex items-center gap-1 overflow-x-auto">
            {categories.slice(0, 3).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  activeCategory === cat.id
                    ? 'bg-amber-800 text-white shadow-sm'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Map Layers & Reset View buttons */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Layer switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
              className="p-2.5 bg-white/95 backdrop-blur-md hover:bg-white text-stone-700 hover:text-amber-800 rounded-xl shadow-lg border border-stone-200/80 transition flex items-center gap-1.5 text-xs font-semibold"
              title="Đổi kiểu bản đồ"
            >
              <Layers className="w-4 h-4 text-amber-700" />
              <span className="hidden sm:inline">Kiểu bản đồ</span>
            </button>

            {isLayerMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2 py-1">
                  Lớp hiển thị
                </div>
                <button
                  onClick={() => { setActiveLayer('editorial'); setIsLayerMenuOpen(false); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                    activeLayer === 'editorial' ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>📜 Cổ điển & Tinh tế</span>
                  {activeLayer === 'editorial' && <span className="text-amber-600">✓</span>}
                </button>
                <button
                  onClick={() => { setActiveLayer('satellite'); setIsLayerMenuOpen(false); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                    activeLayer === 'satellite' ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>🛰️ Vệ tinh & Địa hình</span>
                  {activeLayer === 'satellite' && <span className="text-amber-600">✓</span>}
                </button>
                <button
                  onClick={() => { setActiveLayer('topo'); setIsLayerMenuOpen(false); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                    activeLayer === 'topo' ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>⛰️ Đường đồng mức núi</span>
                  {activeLayer === 'topo' && <span className="text-amber-600">✓</span>}
                </button>
                <button
                  onClick={() => { setActiveLayer('osm'); setIsLayerMenuOpen(false); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                    activeLayer === 'osm' ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>🗺️ Bản đồ tiêu chuẩn</span>
                  {activeLayer === 'osm' && <span className="text-amber-600">✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* Reset bounds */}
          <button
            onClick={handleResetBounds}
            className="p-2.5 bg-white/95 backdrop-blur-md hover:bg-white text-stone-700 hover:text-amber-800 rounded-xl shadow-lg border border-stone-200/80 transition flex items-center gap-1.5 text-xs font-semibold"
            title="Xem toàn bộ các điểm danh thắng"
          >
            <Maximize2 className="w-4 h-4 text-stone-600" />
            <span className="hidden sm:inline">Toàn cảnh</span>
          </button>
        </div>
      </div>

      {/* Main Leaflet Map Canvas */}
      <div ref={mapContainerRef} className={`w-full ${heightClass} z-10`} />

      {/* Bottom Attraction Strip / Drawer for Quick Jumping */}
      {standalone && (
        <div className="bg-stone-900/90 backdrop-blur-md border-t border-stone-800 px-4 py-3 z-20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-stone-300 text-xs">
              <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span className="font-semibold text-white">Điểm danh lam nổi bật trên bản đồ:</span>
              <span className="bg-stone-800 text-amber-400 text-[11px] px-2 py-0.5 rounded-full font-mono">
                {filteredLandmarks.length} địa điểm
              </span>
            </div>
            <div className="text-[11px] text-stone-400 hidden sm:block">
              Nhấp vào biểu tượng ghim để xem thông tin và chỉ đường trực tiếp
            </div>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
            {filteredLandmarks.map((lm) => {
              const isSelected = lm.id === selectedLandmarkId;
              return (
                <button
                  key={lm.id}
                  onClick={() => {
                    const marker = markersRef.current[lm.id];
                    if (marker && mapInstanceRef.current) {
                      mapInstanceRef.current.setView(
                        [lm.location.coordinates.lat, lm.location.coordinates.lng],
                        11,
                        { animate: true }
                      );
                      marker.openPopup();
                    }
                  }}
                  className={`flex-shrink-0 flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-left transition group ${
                    isSelected
                      ? 'bg-amber-600/30 border-amber-500 text-white'
                      : 'bg-stone-800/80 hover:bg-stone-800 border-stone-700/80 text-stone-200'
                  }`}
                >
                  <img
                    src={lm.heroImage}
                    alt={lm.name}
                    className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-white/20"
                  />
                  <div className="min-w-0 pr-1">
                    <p className="text-xs font-semibold truncate group-hover:text-amber-300">
                      {lm.name}
                    </p>
                    <p className="text-[10px] text-stone-400 truncate">
                      {lm.location.province}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
