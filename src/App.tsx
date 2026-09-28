import React, { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { Landmark } from './types/landmark';
import { DEFAULT_LANDMARKS, SAMPLE_LANDMARKS } from './data/defaultLandmarks';
import { decompressLandmark, generateShareableUrl, compressLandmark } from './utils/urlSharing';
import { Navbar } from './components/Navbar';
import { AudioTourBar } from './components/AudioTourBar';
import { LandmarkHero } from './components/LandmarkHero';
import { LandmarkDetailView } from './components/LandmarkDetailView';
import { LandmarkEditor } from './components/LandmarkEditor';
import { ShareModal } from './components/ShareModal';
import { LandmarkExplorer } from './components/LandmarkExplorer';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import {
  subscribeToAuthState,
  verifyAdminStatus,
  logoutAdmin,
  getStoredAdminSession,
  AdminProfile
} from './firebase/authService';
import {
  fetchLandmarksFromFirestore,
  saveLandmarkToFirestore,
  deleteLandmarkFromFirestore
} from './firebase/landmarkFirestore';
import {
  Share2,
  Edit3,
  Sparkles,
  Compass,
  CheckCircle2,
  Bookmark,
  Shield,
  Eye,
  Copy,
  ExternalLink,
  QrCode,
  MapPin,
  X,
  Loader2
} from 'lucide-react';

const STORAGE_KEY = 'danhthangky_custom_landmarks_v2';

export default function App() {
  const [allLandmarks, setAllLandmarks] = useState<Landmark[]>([]);
  const [currentLandmark, setCurrentLandmark] = useState<Landmark | null>(null);
  const [activeView, setActiveView] = useState<'detail' | 'explore' | 'map' | 'editor' | 'admin'>('detail');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareTargetLandmark, setShareTargetLandmark] = useState<Landmark | null>(null);
  const [publishedLandmarkForModal, setPublishedLandmarkForModal] = useState<Landmark | null>(null);
  const [justCopiedLink, setJustCopiedLink] = useState(false);
  const [audioPlayTrigger, setAudioPlayTrigger] = useState(0);

  // Authentication & Admin state
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Load custom landmarks from localStorage & sync Firestore & parse URL hash on mount
  useEffect(() => {
    const sampleIds = new Set(SAMPLE_LANDMARKS.map((s) => s.id));
    const isCleared = localStorage.getItem('danh_thang_cleared_by_user') === 'true';

    let storedLandmarks: Landmark[] = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        storedLandmarks = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load stored landmarks:', e);
    }

    // Filter out the 6 sample template pages that user requested to delete
    let initialLandmarks: Landmark[] = isCleared
      ? []
      : storedLandmarks.filter((l) => !sampleIds.has(l.id));

    setAllLandmarks(initialLandmarks);
    if (initialLandmarks.length > 0) {
      setCurrentLandmark(initialLandmarks[0]);
      setShareTargetLandmark(initialLandmarks[0]);
    }

    // Sync cloud landmarks from Firestore (excluding sample deleted ones)
    fetchLandmarksFromFirestore().then((cloudLandmarks) => {
      const filteredCloud = cloudLandmarks.filter((l) => !sampleIds.has(l.id));
      if (filteredCloud.length > 0) {
        setAllLandmarks((prev) => {
          const merged = [...prev];
          filteredCloud.forEach((cloudLm) => {
            const idx = merged.findIndex((m) => m.id === cloudLm.id);
            if (idx >= 0) {
              merged[idx] = cloudLm;
            } else {
              merged.push(cloudLm);
            }
          });
          return merged;
        });

        // Check if there is a target landmark requested in URL
        const currentHash = window.location.hash;
        const currentSearch = window.location.search;
        const targetMatch = currentHash.match(/landmark=([^&]+)/) || currentSearch.match(/landmark=([^&]+)/);
        if (targetMatch && targetMatch[1]) {
          const targetId = decodeURIComponent(targetMatch[1]);
          const found = filteredCloud.find((l) => l.id === targetId);
          if (found) {
            setCurrentLandmark(found);
            setShareTargetLandmark(found);
            setActiveView('detail');
            return;
          }
        }

        if (!currentLandmark && filteredCloud[0]) {
          setCurrentLandmark(filteredCloud[0]);
          setShareTargetLandmark(filteredCloud[0]);
        }
      }
    });

    // Check stored session on mount
    const initialStored = getStoredAdminSession();
    if (initialStored && initialStored.role === 'admin') {
      setIsAdminAuthenticated(true);
      setAdminProfile(initialStored);
      setIsAuthLoading(false);
    }

    // Subscribe to Firebase Auth state
    const unsubscribeAuth = subscribeToAuthState(async (user) => {
      setCurrentUser(user);
      if (user) {
        const status = await verifyAdminStatus(user);
        setIsAdminAuthenticated(status.isAdmin);
        setAdminProfile(status.profile);
      } else {
        const activeStored = getStoredAdminSession();
        if (activeStored && activeStored.role === 'admin') {
          setIsAdminAuthenticated(true);
          setAdminProfile(activeStored);
        } else {
          setIsAdminAuthenticated(false);
          setAdminProfile(null);
        }
      }
      setIsAuthLoading(false);
    });

    // Parse URL Hash or Query params
    const handleUrlHash = () => {
      const hash = window.location.hash;
      const search = window.location.search;

      // Case 0: #admin -> Admin Portal
      if (hash === '#admin') {
        setActiveView('admin');
        return;
      }

      // Case 1: #custom=ENCODED_PAYLOAD or ?custom=ENCODED_PAYLOAD
      if (hash.includes('custom=') || search.includes('custom=')) {
        const match = hash.match(/custom=([^&]+)/) || search.match(/custom=([^&]+)/);
        if (match && match[1]) {
          const decompressed = decompressLandmark(match[1]);
          if (decompressed) {
            setCurrentLandmark(decompressed);
            setShareTargetLandmark(decompressed);
            setActiveView('detail');

            // Also add to combined if not present
            setAllLandmarks((prev) => {
              if (!prev.some((l) => l.id === decompressed.id)) {
                return [decompressed, ...prev];
              }
              return prev;
            });
            return;
          }
        }
      }

      // Case 2: #landmark=LANDMARK_ID or ?landmark=LANDMARK_ID
      if (hash.includes('landmark=') || search.includes('landmark=')) {
        const match = hash.match(/landmark=([^&]+)/) || search.match(/landmark=([^&]+)/);
        if (match && match[1]) {
          const targetId = decodeURIComponent(match[1]);
          const found = initialLandmarks.find((lm: Landmark) => lm.id === targetId);
          if (found) {
            setCurrentLandmark(found);
            setShareTargetLandmark(found);
            setActiveView('detail');
            return;
          } else {
            // Also fetch directly from Firestore if newly opened by scanning a QR code
            fetchLandmarksFromFirestore().then((cloudLandmarks) => {
              const cloudFound = cloudLandmarks.find((l) => l.id === targetId);
              if (cloudFound) {
                setCurrentLandmark(cloudFound);
                setShareTargetLandmark(cloudFound);
                setActiveView('detail');
              }
            });
          }
        }
      }

      // Default to detail view if not specified
      if (!hash && !search) {
        setActiveView('detail');
      }
    };

    handleUrlHash();
    window.addEventListener('hashchange', handleUrlHash);

    return () => {
      window.removeEventListener('hashchange', handleUrlHash);
      unsubscribeAuth();
    };
  }, []);

  // Save custom landmarks to localStorage
  const saveCustomLandmarksToStorage = (landmarks: Landmark[]) => {
    try {
      const customs = landmarks.filter((l) => l.isCustom);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customs));
    } catch (e) {
      console.error('Failed to save landmarks to localStorage:', e);
    }
  };

  const handleSelectLandmark = (landmark: Landmark) => {
    setCurrentLandmark(landmark);
    setShareTargetLandmark(landmark);
    setActiveView('detail');
    window.location.hash = `#landmark=${encodeURIComponent(landmark.id)}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEditor = (target?: Landmark) => {
    if (target) {
      setCurrentLandmark(target);
    }
    setIsEditorOpen(true);
  };

  const handleCreateNew = () => {
    const newId = `danh-lam-${Date.now().toString(36)}`;
    const blankLandmark: Landmark = {
      id: newId,
      name: 'Danh Lam Mới',
      tagline: 'Vẻ đẹp di sản đất Việt',
      category: 'cultural_heritage',
      categoryLabel: 'Di sản Văn hóa',
      theme: 'parchment',
      location: {
        province: 'Hà Nội',
        country: 'Việt Nam',
        address: 'Địa chỉ danh thắng',
        coordinates: { lat: 21.0285, lng: 105.8542 },
      },
      heroImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=2000&q=85',
      gallery: [
        {
          id: 'p1',
          url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
          caption: 'Góc nhìn danh thắng',
        },
      ],
      quickFacts: {
        bestSeason: 'Mùa thu (tháng 9 - tháng 11)',
        idealDuration: '1 ngày trải nghiệm',
        ticketPrice: 'Miễn phí / Vé vào cổng',
        difficultyLevel: 'Dễ dàng',
        suitableFor: 'Gia đình, du khách mọi lứa tuổi',
        openingHours: '07:30 - 17:30 hàng ngày',
        weatherNote: 'Thời tiết ôn hòa, thoáng mát',
      },
      overview: 'Nhập bài viết mô tả chi tiết, toàn cảnh và những trải nghiệm đặc sắc của danh thắng này...',
      historyLore: 'Những dấu mốc lịch sử, sự tích truyền đời và các câu chuyện văn hóa gắn liền với danh lam.',
      culturalSignificance: 'Giá trị di sản, kiến trúc độc đáo hoặc ý nghĩa tâm linh tín ngưỡng.',
      pullQuote: 'Một nét chấm phá tuyệt mỹ của thiên nhiên và con người Việt Nam.',
      highlights: [
        {
          id: 'h1',
          title: 'Điểm nhấn số 1',
          description: 'Mô tả chi tiết về điểm nhấn kiến trúc, phong cảnh hoặc di tích nổi bật nhất.',
        },
      ],
      itinerary: [
        {
          id: 'day1',
          dayNumber: 1,
          title: 'Khám phá trọn vẹn danh thắng',
          summary: 'Hành trình trải nghiệm các điểm tham quan chủ chốt',
          activities: [
            {
              id: 'act1',
              time: '08:30',
              title: 'Bắt đầu hành trình tham quan',
              description: 'Khu vực cổng chính và điểm ngắm cảnh',
              tip: 'Nên chuẩn bị giày êm và máy ảnh.',
            },
          ],
        },
      ],
      gastronomy: [
        {
          id: 'g1',
          name: 'Món ngon địa phương',
          description: 'Món ăn truyền thống đậm đà phong vị bản địa.',
        },
      ],
      practicalTips: [
        {
          id: 't1',
          category: 'transport',
          title: 'Di chuyển thuận tiện',
          details: 'Đường đi thuận tiện, có thể di chuyển bằng ô tô hoặc xe máy.',
        },
      ],
      audioGuide: {
        title: 'Thuyết minh Danh Lam Mới',
        durationEstimateMinutes: 3,
        script: 'Chào mừng quý khách đến với danh lam thắng cảnh...',
      },
      updatedAt: new Date().toISOString(),
      isCustom: true,
    };

    setCurrentLandmark(blankLandmark);
    setIsEditorOpen(true);
  };

  const handlePreviewAsVisitor = (landmark: Landmark) => {
    setCurrentLandmark(landmark);
    setShareTargetLandmark(landmark);
    setActiveView('detail');
    window.location.hash = `#landmark=${encodeURIComponent(landmark.id)}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveLandmark = (saved: Landmark, andExport?: boolean) => {
    saved.isCustom = true;
    const updatedList = [...allLandmarks];
    const existingIndex = updatedList.findIndex((lm) => lm.id === saved.id);

    if (existingIndex >= 0) {
      updatedList[existingIndex] = saved;
    } else {
      updatedList.unshift(saved);
    }

    setAllLandmarks(updatedList);
    saveCustomLandmarksToStorage(updatedList);
    setCurrentLandmark(saved);
    setShareTargetLandmark(saved);
    setIsEditorOpen(false);

    // Sync to Firestore cloud database if authenticated admin
    if (currentUser) {
      saveLandmarkToFirestore(saved, currentUser.uid, currentUser.email || '').catch((e) => {
        console.warn('Firestore background save sync notice:', e);
      });
    }

    // Show publication success modal with 1-click link
    setPublishedLandmarkForModal(saved);

    if (andExport) {
      setIsShareModalOpen(true);
    }
  };

  const handleDeleteLandmark = (id: string) => {
    const updated = allLandmarks.filter((l) => l.id !== id);
    setAllLandmarks(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (updated.length === 0) {
      localStorage.setItem('danh_thang_cleared_by_user', 'true');
    }
    if (currentLandmark && currentLandmark.id === id) {
      const nextLandmark = updated.length > 0 ? updated[0] : null;
      setCurrentLandmark(nextLandmark);
      setShareTargetLandmark(nextLandmark);
    }

    // Delete from Firestore
    deleteLandmarkFromFirestore(id).catch((e) => {
      console.warn('Firestore background delete sync notice:', e);
    });
  };

  const handleDeleteAllLandmarks = () => {
    const idsToDelete = allLandmarks.map((l) => l.id);
    setAllLandmarks([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    localStorage.setItem('danh_thang_cleared_by_user', 'true');
    setCurrentLandmark(null);
    setShareTargetLandmark(null);

    // Also delete all from Firestore
    idsToDelete.forEach((id) => {
      deleteLandmarkFromFirestore(id).catch(() => {});
    });
  };

  const handleRestoreDefaultLandmarks = () => {
    localStorage.removeItem('danh_thang_cleared_by_user');
    setAllLandmarks(SAMPLE_LANDMARKS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_LANDMARKS));
    if (SAMPLE_LANDMARKS.length > 0) {
      setCurrentLandmark(SAMPLE_LANDMARKS[0]);
      setShareTargetLandmark(SAMPLE_LANDMARKS[0]);
    }
  };

  const handleOpenShare = (target?: Landmark) => {
    setShareTargetLandmark(target || currentLandmark);
    setIsShareModalOpen(true);
  };

  const handleImportLandmark = (imported: Landmark) => {
    imported.isCustom = true;
    const updated = [imported, ...allLandmarks.filter((l) => l.id !== imported.id)];
    setAllLandmarks(updated);
    saveCustomLandmarksToStorage(updated);
    setCurrentLandmark(imported);
    setShareTargetLandmark(imported);
    setActiveView('detail');

    if (currentUser) {
      saveLandmarkToFirestore(imported, currentUser.uid, currentUser.email || '').catch((e) => {
        console.warn('Firestore sync note:', e);
      });
    }
  };

  const handleAdminLogout = async () => {
    await logoutAdmin();
    setIsAdminAuthenticated(false);
    setAdminProfile(null);
    setActiveView('detail');
  };

  const publishedVisitorUrl = publishedLandmarkForModal
    ? generateShareableUrl(publishedLandmarkForModal)
    : '';

  const handleCopyPublishedUrl = () => {
    if (!publishedVisitorUrl) return;
    navigator.clipboard.writeText(publishedVisitorUrl).then(() => {
      setJustCopiedLink(true);
      setTimeout(() => setJustCopiedLink(false), 3000);
    });
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 flex flex-col font-sans">
      
      {/* Top Navigation - ONLY displayed in Explore or Map views; completely HIDDEN in Detail (for clean link viewing) and Admin modes */}
      {activeView !== 'detail' && activeView !== 'admin' && (
        <Navbar
          currentLandmark={currentLandmark}
          onSelectLandmark={handleSelectLandmark}
          onOpenEditor={() => handleOpenEditor(currentLandmark || undefined)}
          onOpenShareModal={() => handleOpenShare(currentLandmark || undefined)}
          allLandmarks={allLandmarks}
          activeView={activeView}
          setActiveView={setActiveView}
          isAdminMode={false}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1">
        
        {/* VIEW 1: ADMIN PORTAL WITH EMAIL/PASSWORD AUTHORIZATION GUARD */}
        {activeView === 'admin' && (
          isAuthLoading ? (
            <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3 text-stone-600">
              <Loader2 className="w-8 h-8 text-amber-700 animate-spin" />
              <p className="text-xs font-semibold">Đang xác thực quyền truy cập Quản trị viên...</p>
            </div>
          ) : !isAdminAuthenticated ? (
            <AdminLogin
              onSuccess={(profile) => {
                setAdminProfile(profile);
                setIsAdminAuthenticated(true);
              }}
              onBackToVisitor={() => setActiveView('detail')}
            />
          ) : (
            <AdminDashboard
              landmarks={allLandmarks}
              adminProfile={adminProfile}
              onLogout={handleAdminLogout}
              onCreateNew={handleCreateNew}
              onEditLandmark={handleOpenEditor}
              onDeleteLandmark={handleDeleteLandmark}
              onDeleteAllLandmarks={handleDeleteAllLandmarks}
              onRestoreSamples={handleRestoreDefaultLandmarks}
              onPreviewAsVisitor={handlePreviewAsVisitor}
              onOpenShareModal={handleOpenShare}
              onImportLandmark={handleImportLandmark}
            />
          )
        )}

        {/* VIEW 2: VISITOR DETAIL VIEW (100% Clean, Zero Top Bar, Pure Editorial) */}
        {activeView === 'detail' && (
          !currentLandmark || allLandmarks.length === 0 ? (
            <div className="min-h-[75vh] flex items-center justify-center py-20 px-4 bg-[#F7F4EE]">
              <div className="max-w-md w-full text-center space-y-5 bg-white p-8 sm:p-10 rounded-2xl border border-stone-200 shadow-lg animate-fade-in">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-700">
                  <Compass className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  Hệ Thống Đang Trống
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Các trang danh lam mẫu đã được xóa sạch. Hãy đăng nhập vào Cổng Quản Trị để bắt đầu đăng tải danh lam đầu tiên của bạn.
                </p>
                <div className="pt-2 flex items-center justify-center">
                  <button
                    onClick={() => setActiveView('admin')}
                    className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Mở Cổng Quản Trị</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Landmark Hero Section - Starts immediately at top of page (y = 0) with zero bars */}
              <LandmarkHero
                landmark={currentLandmark}
                onOpenShareModal={() => handleOpenShare(currentLandmark)}
                onOpenEditor={() => handleOpenEditor(currentLandmark)}
                onPlayAudio={() => setAudioPlayTrigger((prev) => prev + 1)}
                isAdmin={false}
              />

              {/* Comprehensive Detail View */}
              <LandmarkDetailView
                landmark={currentLandmark}
                onOpenShareModal={() => handleOpenShare(currentLandmark)}
                onOpenEditor={() => handleOpenEditor(currentLandmark)}
                onPlayAudio={() => setAudioPlayTrigger((prev) => prev + 1)}
              />

              {/* Audio Guide - Only displays when activated, with close button and 0 idle obstruction */}
              <AudioTourBar
                landmark={currentLandmark}
                playTrigger={audioPlayTrigger}
              />
            </>
          )
        )}

        {/* VIEW 3: EXPLORE & INTERACTIVE MAP VIEW */}
        {(activeView === 'explore' || activeView === 'map') && (
          <LandmarkExplorer
            key={activeView}
            landmarks={allLandmarks}
            currentLandmarkId={currentLandmark?.id || ''}
            onSelectLandmark={handleSelectLandmark}
            onCreateNew={handleCreateNew}
            onOpenShareModal={handleOpenShare}
            initialViewMode={activeView === 'map' ? 'map' : 'grid'}
          />
        )}
      </main>

      {/* Editor Modal (Full-Screen Admin Form for creating/editing) */}
      {isEditorOpen && (
        <LandmarkEditor
          initialLandmark={currentLandmark || undefined}
          onSave={handleSaveLandmark}
          onClose={() => setIsEditorOpen(false)}
        />
      )}

      {/* Share / Export Modal */}
      {isShareModalOpen && (
        <ShareModal
          isOpen={isShareModalOpen}
          landmark={shareTargetLandmark}
          onClose={() => setIsShareModalOpen(false)}
          onImportLandmark={handleImportLandmark}
        />
      )}

      {/* Publication Success Modal with 1-Click Shareable Link */}
      {publishedLandmarkForModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-serif font-bold text-lg text-stone-900">
                  Xuất Bản Thành Công!
                </span>
              </div>
              <button
                onClick={() => setPublishedLandmarkForModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="font-serif font-bold text-xl text-stone-900">
                {publishedLandmarkForModal.name}
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Bài viết đã được lưu vào hệ thống. Bạn có thể gửi đường liên kết dưới đây cho bất kỳ ai; người nhận sẽ mở ra xem đầy đủ mọi chi tiết, lịch trình và audio mà không cần đăng nhập hay thấy các nút chỉnh sửa.
              </p>
            </div>

            {/* Generated Link Box */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                Liên kết Người Xem Trực Tiếp:
              </span>
              <div className="p-2.5 bg-white border border-stone-300 rounded-lg text-xs font-mono text-stone-800 break-all select-all max-h-24 overflow-y-auto">
                {publishedVisitorUrl}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleCopyPublishedUrl}
                className="w-full sm:flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                {justCopiedLink ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Đã sao chép link!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Sao chép link gửi khách</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setPublishedLandmarkForModal(null);
                  handlePreviewAsVisitor(publishedLandmarkForModal);
                }}
                className="w-full sm:w-auto py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Xem thử ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-200/90 bg-[#F7F4EE] py-10 px-4 sm:px-6 lg:px-8 text-xs text-stone-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-900 text-sm">
              DANH THẮNG KÝ
            </span>
            <span>·</span>
            <span>Cẩm nang Di sản & Du lịch Trực tuyến Việt Nam</span>
          </div>

          <div className="flex items-center gap-4 text-stone-500">
            <button
              onClick={() => setActiveView('detail')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Trang xem
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveView('map')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Bản đồ
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveView('explore')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Tất cả danh thắng ({allLandmarks.length})
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveView('admin')}
              className="hover:text-amber-900 font-semibold transition-colors cursor-pointer text-amber-800 flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Khu vực Quản trị (Admin)</span>
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
