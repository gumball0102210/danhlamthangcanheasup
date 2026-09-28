import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  QrCode,
  Download,
  Share2,
  ExternalLink,
  FileText,
  Upload,
  Globe,
  MessageCircle,
  Mail,
  Printer
} from 'lucide-react';
import { Landmark } from '../types/landmark';
import {
  generateFullExportUrl,
  copyToClipboard,
  exportLandmarkToJsonFile,
  generateSimpleQrSvg,
  generateQrDataUrl
} from '../utils/urlSharing';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  landmark: Landmark | null;
  onImportLandmark?: (imported: Landmark) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  landmark,
  onImportLandmark,
}) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [qrSvg, setQrSvg] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'link' | 'qr' | 'json'>('link');

  useEffect(() => {
    if (isOpen && landmark) {
      const url = generateFullExportUrl(landmark);
      setShareUrl(url);
      setCopied(false);
      generateQrDataUrl(url, 340).then((dataUri) => {
        setQrDataUrl(dataUri);
      });
      generateSimpleQrSvg(url, 260).then((svg) => {
        setQrSvg(svg);
      });
    }
  }, [isOpen, landmark]);

  if (!isOpen || !landmark) return null;

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${landmark.name} - Danh Thắng Ký`,
          text: landmark.tagline,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const content = evt.target?.result as string;
        const parsed = JSON.parse(content) as Landmark;
        if (parsed && parsed.name && onImportLandmark) {
          onImportLandmark(parsed);
          onClose();
        }
      } catch (error) {
        alert('File JSON không hợp lệ hoặc bị lỗi định dạng.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#F7F4EE] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-900 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-900 leading-snug">
                Xuất & Chia Sẻ Danh Lam Thắng Cảnh
              </h3>
              <p className="text-xs text-stone-500 font-sans">
                {landmark.name} · Người nhận chỉ cần mở link để xem toàn bộ nội dung
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-200 px-6 pt-3 bg-stone-50/50 text-xs font-semibold text-stone-600 gap-6">
          <button
            onClick={() => setActiveTab('link')}
            className={`pb-2.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'link'
                ? 'border-amber-700 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            Liên kết trực tiếp (URL)
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`pb-2.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'qr'
                ? 'border-amber-700 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            Mã QR Di động
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`pb-2.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'json'
                ? 'border-amber-700 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            Sao lưu / Tệp JSON
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-6">
          {activeTab === 'link' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Đường dẫn xem chi tiết (Đã nén toàn bộ nội dung tùy chỉnh):
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="w-full text-xs font-mono bg-stone-100 border border-stone-300 rounded-lg py-2.5 pl-3 pr-24 text-stone-700 select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`absolute right-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                      copied
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-stone-900 text-white hover:bg-stone-800'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã chép!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3.5 text-xs text-amber-950 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  ✨ Cơ chế hoạt động tức thì:
                </p>
                <p className="leading-relaxed text-stone-700">
                  Toàn bộ văn bản, hình ảnh, lịch trình và cẩm nang bạn đã tùy chỉnh được mã hóa an toàn trực tiếp vào liên kết. Bất kỳ ai mở link đều có thể xem ngay lập tức mà không cần tạo tài khoản hay đăng nhập.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Mở thử trong tab mới</span>
                </a>

                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    onClick={handleNativeShare}
                    className="px-3.5 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Chia sẻ qua ứng dụng máy</span>
                  </button>
                )}

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Facebook</span>
                </a>

                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Khám phá danh thắng ${landmark.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Telegram</span>
                </a>

                <a
                  href={`mailto:?subject=${encodeURIComponent(`Giới thiệu danh thắng: ${landmark.name}`)}&body=${encodeURIComponent(`Chào bạn,\n\nMời bạn xem chi tiết danh thắng ${landmark.name} qua liên kết này:\n${shareUrl}\n\nChúc bạn có chuyến đi tuyệt vời!`)}`}
                  className="px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Gửi Email</span>
                </a>
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Genuine QR Code Container */}
              <div className="p-4 bg-white border-2 border-stone-200 rounded-2xl shadow-md inline-block">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`Mã QR ${landmark.name}`}
                    className="w-56 h-56 object-contain rounded-lg"
                  />
                ) : (
                  <div
                    className="w-56 h-56 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: qrSvg }}
                  />
                )}
              </div>

              <div>
                <h4 className="text-base font-bold text-stone-900 font-serif">
                  Quét Mã QR Bằng Điện Thoại
                </h4>
                <p className="text-xs text-stone-600 max-w-sm mt-1 leading-relaxed">
                  Mở <strong>Zalo</strong> hoặc <strong>Camera điện thoại</strong> (iPhone, Android, Google Lens) quét mã để mở ngay trang giới thiệu.
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mã QR tiêu chuẩn quốc tế – Quét cực nhanh</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 w-full max-w-sm">
                {qrDataUrl && (
                  <a
                    href={qrDataUrl}
                    download={`qr_${landmark.name.toLowerCase().replace(/[^a-z0-9]/gi, '_')}.png`}
                    className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải ảnh QR về máy</span>
                  </a>
                )}

                <button
                  onClick={handleCopyLink}
                  className="flex-1 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã chép link!' : 'Sao chép liên kết'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600 leading-relaxed">
                Bạn có thể lưu trữ danh lam thắng cảnh thành tệp tin JSON trên máy tính để lưu trữ lâu dài hoặc nạp lại để chỉnh sửa bất kỳ lúc nào.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => exportLandmarkToJsonFile(landmark)}
                  className="p-4 border border-stone-200 rounded-xl hover:border-amber-600 hover:bg-amber-50/30 transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center mb-2 group-hover:bg-amber-100 group-hover:text-amber-900 transition-colors">
                      <Download className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-bold text-stone-900">
                      Tải Tệp JSON (.json)
                    </h5>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Lưu trữ hồ sơ dữ liệu danh lam thắng cảnh về thiết bị
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-800 mt-3 block">
                    Bấm để tải về →
                  </span>
                </button>

                <label className="p-4 border border-dashed border-stone-300 rounded-xl hover:border-amber-600 hover:bg-amber-50/30 transition-all text-left flex flex-col justify-between group cursor-pointer">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleJsonUpload}
                    className="hidden"
                  />
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center mb-2 group-hover:bg-amber-100 group-hover:text-amber-900 transition-colors">
                      <Upload className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-bold text-stone-900">
                      Nhập Tệp JSON Có Sẵn
                    </h5>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Tải lên bản sao lưu để khôi phục hoặc tiếp tục chỉnh sửa
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-800 mt-3 block">
                    Chọn tệp từ máy tính →
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Danh Thắng Ký · Tự do chia sẻ & kết nối di sản</span>
          <button
            onClick={onClose}
            className="text-stone-700 hover:text-stone-900 font-semibold cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
