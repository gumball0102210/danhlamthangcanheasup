import React, { useState, useEffect } from 'react';
import {
  Plus,
  Share2,
  Edit3,
  Trash2,
  Eye,
  QrCode,
  Download,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
  Map,
  LogOut,
  Users,
  UserCheck,
  Key,
  X,
  AlertCircle,
  UserMinus,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { Landmark } from '../types/landmark';
import { generateShareableUrl, exportLandmarkToJsonFile } from '../utils/urlSharing';
import { ResilientImage } from './ResilientImage';
import {
  AdminProfile,
  UserRole,
  assignUserRoleByEmail,
  updateUserRoleByUid,
  revokeUserRole,
  listAuthorizedUsers,
  MASTER_ADMIN_EMAIL
} from '../firebase/authService';

interface AdminDashboardProps {
  landmarks: Landmark[];
  adminProfile: AdminProfile | null;
  onLogout: () => void;
  onCreateNew: () => void;
  onEditLandmark: (landmark: Landmark) => void;
  onDeleteLandmark: (id: string) => void;
  onDeleteAllLandmarks?: () => void;
  onRestoreSamples?: () => void;
  onPreviewAsVisitor: (landmark: Landmark) => void;
  onOpenShareModal: (landmark: Landmark) => void;
  onImportLandmark: (landmark: Landmark) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  landmarks,
  adminProfile,
  onLogout,
  onCreateNew,
  onEditLandmark,
  onDeleteLandmark,
  onDeleteAllLandmarks,
  onRestoreSamples,
  onPreviewAsVisitor,
  onOpenShareModal,
  onImportLandmark,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // User management modal state
  const [isManageUsersOpen, setIsManageUsersOpen] = useState(false);
  const [targetEmail, setTargetEmail] = useState('');
  const [grantSuccessMsg, setGrantSuccessMsg] = useState<string | null>(null);
  const [grantErrorMsg, setGrantErrorMsg] = useState<string | null>(null);
  const [grantLoading, setGrantLoading] = useState(false);
  const [authorizedUsersList, setAuthorizedUsersList] = useState<AdminProfile[]>([]);

  const [selectedGrantRole, setSelectedGrantRole] = useState<UserRole>('admin');
  const [roleActionLoading, setRoleActionLoading] = useState(false);

  useEffect(() => {
    if (isManageUsersOpen) {
      loadUsers();
    }
  }, [isManageUsersOpen]);

  const loadUsers = async () => {
    const list = await listAuthorizedUsers();
    setAuthorizedUsersList(list);
  };

  const handleGrantRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setGrantSuccessMsg(null);
    setGrantErrorMsg(null);

    const cleanEmail = targetEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setGrantErrorMsg('Vui lòng nhập định dạng email hợp lệ.');
      return;
    }

    setGrantLoading(true);
    const success = await assignUserRoleByEmail(cleanEmail, selectedGrantRole);
    setGrantLoading(false);

    if (success) {
      const roleLabel =
        selectedGrantRole === 'admin'
          ? 'Quản trị viên'
          : selectedGrantRole === 'editor'
          ? 'Biên tập viên'
          : 'Người xem';
      setGrantSuccessMsg(`Đã cấp quyền "${roleLabel}" cho tài khoản "${cleanEmail}".`);
      setTargetEmail('');
      loadUsers();
    } else {
      setGrantErrorMsg(`Không thể phân quyền cho "${cleanEmail}". Vui lòng thử lại.`);
    }
  };

  const handleUpdateRole = async (user: AdminProfile, newRole: UserRole) => {
    setGrantSuccessMsg(null);
    setGrantErrorMsg(null);

    if (user.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase() && newRole !== 'admin') {
      setGrantErrorMsg('Không thể thay đổi quyền của Chủ sở hữu chính (Master Owner).');
      return;
    }

    setRoleActionLoading(true);
    try {
      const success = await updateUserRoleByUid(user.uid, user.email, newRole);
      if (success) {
        const roleLabel =
          newRole === 'admin'
            ? 'Quản trị viên'
            : newRole === 'editor'
            ? 'Biên tập viên'
            : 'Người xem';
        setGrantSuccessMsg(`Đã cập nhật vai trò của "${user.email}" thành "${roleLabel}".`);
        loadUsers();
      } else {
        setGrantErrorMsg('Không thể cập nhật quyền lúc này.');
      }
    } catch (err: any) {
      setGrantErrorMsg(err?.message || 'Có lỗi xảy ra khi đổi quyền.');
    } finally {
      setRoleActionLoading(false);
    }
  };

  const handleRevokeRole = async (user: AdminProfile) => {
    setGrantSuccessMsg(null);
    setGrantErrorMsg(null);

    if (user.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()) {
      setGrantErrorMsg('Không thể xóa quyền của Chủ sở hữu chính (Master Owner).');
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa quyền của tài khoản "${user.email}"? Tài khoản này sẽ không thể truy cập quản trị.`)) {
      return;
    }

    setRoleActionLoading(true);
    try {
      const success = await revokeUserRole(user.uid, user.email);
      if (success) {
        setGrantSuccessMsg(`Đã xóa quyền thành công của tài khoản "${user.email}".`);
        loadUsers();
      } else {
        setGrantErrorMsg(`Không thể xóa quyền của "${user.email}". Vui lòng thử lại.`);
      }
    } catch (err: any) {
      setGrantErrorMsg(err?.message || 'Có lỗi xảy ra khi xóa quyền.');
    } finally {
      setRoleActionLoading(false);
    }
  };

  // Filter landmarks
  const filteredLandmarks = landmarks.filter((lm) => {
    const matchSearch =
      lm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lm.location.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lm.tagline.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory = selectedCategory === 'all' || lm.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  const customCount = landmarks.filter((l) => l.isCustom).length;
  const unescoCount = landmarks.filter((l) => Boolean(l.unescoStatus)).length;

  const handleCopyVisitorLink = (landmark: Landmark) => {
    const url = generateShareableUrl(landmark);
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(landmark.id);
      setTimeout(() => setCopiedId(null), 3500);
    });
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && json.name && json.overview) {
          onImportLandmark(json);
        } else {
          alert('Tệp JSON không hợp lệ hoặc thiếu thông tin danh lam thắng cảnh.');
        }
      } catch (err) {
        alert('Không thể đọc tệp JSON. Vui lòng kiểm tra lại định dạng tệp.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F5F0] text-stone-900 pb-24">
      
      {/* Top Admin Account Bar */}
      <div className="bg-stone-950 border-b border-stone-800 text-stone-300 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-stone-400">Tài khoản Quản trị:</span>
            <span className="font-semibold text-white font-mono">
              {adminProfile?.email || 'admin@danhthangky.vn'}
            </span>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Đã cấp quyền ({adminProfile?.role || 'admin'})
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsManageUsersOpen(true)}
              className="text-stone-400 hover:text-stone-100 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Phân quyền thêm tài khoản nhân viên / quản trị"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Phân quyền tài khoản</span>
            </button>
            <span className="text-stone-700">|</span>
            <button
              onClick={onLogout}
              className="text-stone-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Header */}
      <div className="bg-stone-900 text-stone-100 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Cổng Quản Trị Hệ Thống
                </span>
                <span className="text-stone-400 text-xs">·</span>
                <span className="text-stone-400 text-xs flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Đã xác thực danh tính
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight">
                Quản Trị Danh Lam Thắng Cảnh
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
                Đăng bài giới thiệu danh lam mới, chỉnh sửa thông tin và xuất bản đường liên kết trực tiếp để người xem truy cập xem đầy đủ mọi chi tiết.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-2">
                <Upload className="w-4 h-4 text-stone-400" />
                <span>Nạp tệp JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>

              {landmarks.length > 0 && (
                <button
                  onClick={() => onPreviewAsVisitor(landmarks[0])}
                  className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer"
                  title="Chuyển sang giao diện người xem"
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>Xem như Khách</span>
                </button>
              )}

              {landmarks.length > 0 && onDeleteAllLandmarks && (
                <button
                  onClick={() => {
                    if (confirm(`Bạn có chắc chắn muốn xóa toàn bộ ${landmarks.length} trang danh lam thắng cảnh?`)) {
                      onDeleteAllLandmarks();
                    }
                  }}
                  className="px-3.5 py-2.5 bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-800 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Xóa toàn bộ các trang danh lam"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Xóa tất cả ({landmarks.length})</span>
                </button>
              )}

              <button
                onClick={onCreateNew}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-stone-950 stroke-[2.5]" />
                <span>Đăng tải danh lam mới</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-stone-800/80">
            <div className="bg-stone-800/60 p-3.5 rounded-lg border border-stone-700/50">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
                Tổng số danh thắng
              </span>
              <span className="text-2xl font-serif font-bold text-white mt-1 block">
                {landmarks.length}
              </span>
            </div>

            <div className="bg-stone-800/60 p-3.5 rounded-lg border border-stone-700/50">
              <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold block">
                Bài do Admin đăng tải
              </span>
              <span className="text-2xl font-serif font-bold text-amber-300 mt-1 block">
                {customCount}
              </span>
            </div>

            <div className="bg-stone-800/60 p-3.5 rounded-lg border border-stone-700/50">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
                Di sản UNESCO
              </span>
              <span className="text-2xl font-serif font-bold text-white mt-1 block">
                {unescoCount}
              </span>
            </div>

            <div className="bg-stone-800/60 p-3.5 rounded-lg border border-stone-700/50">
              <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold block">
                Cơ chế chia sẻ link
              </span>
              <span className="text-xs font-medium text-emerald-300 mt-1.5 block">
                Tự nén URL an toàn (1-Click)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Admin Quick Guide Banner */}
        <div className="bg-white border border-amber-200/80 rounded-xl p-5 mb-8 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-amber-100 text-amber-900 rounded-lg shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-base">
                  Quy trình xuất bản & Gửi link cho người xem
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm mt-0.5 leading-relaxed">
                  1. Nhấn <strong className="text-stone-900">"Đăng tải danh lam mới"</strong> để nhập nội dung, ảnh bìa, lịch trình và audio thuyết minh.
                  <br />
                  2. Bấm nút <strong className="text-amber-800">"Sao chép link gửi khách"</strong> tại danh lam bạn muốn chia sẻ.
                  <br />
                  3. Người nhận nhấp vào link là xem được <strong className="text-stone-900">ngay lập tức, đầy đủ chi tiết</strong> mà hoàn toàn không thấy các nút chỉnh sửa/quản trị.
                </p>
              </div>
            </div>

            <button
              onClick={onCreateNew}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Đăng bài mới ngay</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm danh thắng, tỉnh thành, từ khóa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-stone-500 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              Lọc:
            </span>
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'scenic_landscape', label: 'Danh lam Thắng cảnh' },
              { id: 'natural_wonder', label: 'Kỳ quan Thiên nhiên' },
              { id: 'cultural_heritage', label: 'Di sản Văn hóa' },
              { id: 'mountain_eco', label: 'Miền Núi & Sinh Thái' },
              { id: 'island_beach', label: 'Biển Đảo & Nghỉ Dưỡng' },
              { id: 'historic_monument', label: 'Di tích Lịch sử Cổ' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Landmarks Table / Grid */}
        <div className="space-y-4">
          {filteredLandmarks.map((landmark) => {
            const isCopied = copiedId === landmark.id;

            return (
              <div
                key={landmark.id}
                className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-xs hover:border-amber-400/80 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group"
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden shrink-0 border border-stone-200 bg-stone-100 relative">
                    <ResilientImage
                      src={landmark.heroImage}
                      alt={landmark.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {landmark.isCustom && (
                      <span className="absolute top-1 left-1 bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                        Admin tạo
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
                        {landmark.categoryLabel}
                      </span>
                      {landmark.unescoStatus && (
                        <span className="text-[10px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                          {landmark.unescoStatus}
                        </span>
                      )}
                      <span className="text-xs text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {landmark.location.province}
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                      {landmark.name}
                    </h2>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {landmark.tagline || landmark.overview}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-stone-500 pt-1">
                      <span>{landmark.itinerary?.length || 0} ngày lịch trình</span>
                      <span>·</span>
                      <span>{landmark.gastronomy?.length || 0} đặc sản</span>
                      <span>·</span>
                      <span>{landmark.gallery?.length || 0} ảnh bộ sưu tập</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                  
                  {/* Shareable Link Button */}
                  <button
                    onClick={() => handleCopyVisitorLink(landmark)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 hover:bg-amber-700 text-white hover:shadow-md'
                    }`}
                    title="Sao chép đường link gửi cho khách xem"
                  >
                    {isCopied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đã chép link!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép link gửi khách</span>
                      </>
                    )}
                  </button>

                  {/* Preview as Visitor */}
                  <button
                    onClick={() => onPreviewAsVisitor(landmark)}
                    className="p-2 text-stone-600 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                    title="Xem thử bài đăng (Chế độ người xem)"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* QR Code */}
                  <button
                    onClick={() => onOpenShareModal(landmark)}
                    className="p-2 text-stone-600 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                    title="Mã QR & Tùy chọn chia sẻ"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>

                  {/* Export JSON backup */}
                  <button
                    onClick={() => exportLandmarkToJsonFile(landmark)}
                    className="p-2 text-stone-600 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                    title="Tải tệp JSON sao lưu"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => onEditLandmark(landmark)}
                    className="p-2 text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer font-medium"
                    title="Chỉnh sửa nội dung danh lam này"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete button (available for any landmark) */}
                  <button
                    onClick={() => {
                      if (confirm(`Bạn có chắc muốn xóa trang danh lam "${landmark.name}" khỏi danh sách?`)) {
                        onDeleteLandmark(landmark.id);
                      }
                    }}
                    className="p-2 text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                    title="Xóa danh lam này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredLandmarks.length === 0 && (
            <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-700">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-lg">
                  {landmarks.length === 0 ? 'Chưa có trang danh lam nào' : 'Không tìm thấy danh thắng phù hợp'}
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  {landmarks.length === 0
                    ? 'Bạn đã xóa sạch các trang. Bắt đầu tạo mới trang danh thắng của riêng bạn ngay bây giờ!'
                    : 'Không tìm thấy danh thắng nào phù hợp với từ khóa hoặc bộ lọc đã chọn.'}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={onCreateNew}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Đăng tải danh lam mới</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Phân quyền tài khoản quản trị (Role Management) */}
      {isManageUsersOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 border border-stone-200 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif font-bold text-stone-900 text-lg">
                  Phân Quyền Quản Trị Viên
                </h3>
              </div>
              <button
                onClick={() => setIsManageUsersOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Bạn có thể cấp quyền <strong>Quản trị viên (Admin)</strong> cho các email nhân sự hoặc đối tác để họ có thể đăng nhập vào cổng quản trị này.
            </p>

            {grantSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{grantSuccessMsg}</span>
              </div>
            )}

            {grantErrorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{grantErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleGrantRole} className="space-y-2">
              <label className="block text-xs font-semibold text-stone-700">
                Thêm tài khoản & Phân quyền truy cập
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="nhanvien@domain.com"
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:bg-white font-mono"
                />
                <select
                  value={selectedGrantRole}
                  onChange={(e) => setSelectedGrantRole(e.target.value as UserRole)}
                  className="px-2.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-800 focus:outline-none font-medium cursor-pointer"
                >
                  <option value="admin">Quản trị viên</option>
                  <option value="editor">Biên tập viên</option>
                  <option value="viewer">Người xem</option>
                </select>
                <button
                  type="submit"
                  disabled={grantLoading}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{grantLoading ? 'Đang cấp...' : 'Cấp quyền'}</span>
                </button>
              </div>
            </form>

            <div className="pt-2 border-t border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-700 block">
                  Danh sách tài khoản trong hệ thống ({authorizedUsersList.length})
                </span>
                <span className="text-[11px] text-stone-500">
                  Có thể đổi vai trò hoặc xóa quyền bất kỳ lúc nào
                </span>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {authorizedUsersList.map((u) => {
                  const isOwner = u.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();
                  return (
                    <div
                      key={u.uid}
                      className="flex items-center justify-between p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs gap-3 hover:bg-stone-100/60 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-900 font-mono truncate block">
                            {u.email}
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-500 block truncate">
                          {u.displayName || 'Thành viên'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isOwner ? (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                            Chủ sở hữu
                          </span>
                        ) : (
                          <>
                            {/* Role changer dropdown */}
                            <select
                              value={u.role || 'editor'}
                              disabled={roleActionLoading}
                              onChange={(e) => handleUpdateRole(u, e.target.value as UserRole)}
                              className="px-2.5 py-1 text-xs font-medium bg-white border border-stone-300 rounded-lg text-stone-800 cursor-pointer focus:ring-1 focus:ring-amber-500"
                              title="Thay đổi quyền hạn"
                            >
                              <option value="admin">Quản trị viên</option>
                              <option value="editor">Biên tập viên</option>
                              <option value="viewer">Người xem</option>
                            </select>

                            {/* Revoke / Delete Role Button */}
                            <button
                              type="button"
                              disabled={roleActionLoading}
                              onClick={() => handleRevokeRole(u)}
                              className="p-1.5 text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                              title={`Xóa quyền của ${u.email}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setIsManageUsersOpen(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
