import LZString from 'lz-string';
import QRCode from 'qrcode';
import { Landmark } from '../types/landmark';

/**
 * Returns the base public URL for visitor links
 * If on localhost, falls back to the shared deployment URL so phone scanners can access
 */
export function getBaseAppUrl(): string {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  const hostname = window.location.hostname;

  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
    return 'https://ais-pre-sfhabfm6ybuqrw2aykdo5u-270677612383.europe-west2.run.app';
  }
  return origin;
}

/**
 * Compresses landmark data into a compact URL-safe string using LZ-String
 */
export function compressLandmark(landmark: Landmark): string {
  try {
    const jsonStr = JSON.stringify(landmark);
    return LZString.compressToEncodedURIComponent(jsonStr);
  } catch (error) {
    console.error('Failed to compress landmark:', error);
    return '';
  }
}

/**
 * Decompresses landmark data from an encoded URL fragment
 */
export function decompressLandmark(encodedString: string): Landmark | null {
  try {
    const jsonStr = LZString.decompressFromEncodedURIComponent(encodedString);
    if (!jsonStr) return null;
    const parsed = JSON.parse(jsonStr) as Landmark;
    // Validate minimal structure
    if (parsed && parsed.name && (parsed.overview || parsed.tagline)) {
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('Failed to decompress landmark:', error);
    return null;
  }
}

/**
 * Creates the clean, shareable URL for visitors and QR codes
 * Uses #landmark=ID which is short, reliable, and easily parsed by mobile devices
 */
export function generateShareableUrl(landmark: Landmark): string {
  const base = getBaseAppUrl();
  const pathname = window.location.pathname;
  return `${base}${pathname}#landmark=${encodeURIComponent(landmark.id)}`;
}

/**
 * Creates export URL (aliases to standard visitor URL for clean sharing)
 */
export function generateFullExportUrl(landmark: Landmark): string {
  return generateShareableUrl(landmark);
}

/**
 * Exports landmark data as a downloadable .json file
 */
export function exportLandmarkToJsonFile(landmark: Landmark): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(landmark, null, 2));
  const downloadAnchor = document.createElement('a');
  const safeFilename = landmark.name.toLowerCase().replace(/[^a-z0-9]/gi, '_');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `danh_thang_${safeFilename}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Copies text to clipboard safely
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for non-secure contexts
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch (err) {
    console.error('Copy to clipboard failed:', err);
    return false;
  }
}

/**
 * Generates an authentic, standard-compliant QR code as a PNG Data URL
 * Scannable by 100% of smartphones, Zalo, camera apps, and barcode scanners
 */
export async function generateQrDataUrl(url: string, size = 300): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      width: size,
      margin: 2,
      color: {
        dark: '#1c1917', // High contrast stone-900
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (error) {
    console.error('Failed to generate QR data URL:', error);
    return '';
  }
}

/**
 * Generates a real standard-compliant SVG QR code string
 */
export async function generateSimpleQrSvg(url: string, size = 260): Promise<string> {
  try {
    return await QRCode.toString(url, {
      type: 'svg',
      width: size,
      margin: 2,
      color: {
        dark: '#1c1917',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (error) {
    console.error('Failed to generate QR svg:', error);
    return '';
  }
}
