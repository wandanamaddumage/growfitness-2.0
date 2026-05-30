/** Public paths (under app `public/images/`) used for in-browser invoice preview. */
export const INVOICE_MASCOT_PUBLIC_PATH = '/images/invoice-mascot.png';

/** Keep in sync with {@link InvoiceTemplatePrint} LOGO_PUBLIC_CACHE_BUST. */
export const INVOICE_LOGO_PUBLIC_PATH = '/images/grow-invoice-wordmark-white.svg?v=5';

async function fetchPathAsDataUri(baseUrl: string, assetPath: string): Promise<string> {
  const base = baseUrl.replace(/\/$/, '');
  const url = `${base}${assetPath.startsWith('/') ? assetPath : `/${assetPath}`}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load invoice asset: ${url}`);
  }
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error('FileReader failed'));
    reader.readAsDataURL(blob);
  });
}

/** html2canvas does not paint SVG img sources reliably; rasterize for PDF export. */
export async function rasterizeDataUriForCanvas(
  dataUri: string,
  displayHeightPx = 156
): Promise<string> {
  if (!dataUri.startsWith('data:image/svg+xml')) {
    return dataUri;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const height = displayHeightPx * scale;
      const aspect = (img.naturalWidth || 1) / (img.naturalHeight || 1);
      const width = height * aspect;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Invoice logo failed to decode'));
    img.src = dataUri;
  });
}

/** Embed mascot + logo as data URIs (same assets as `/images/*` preview). */
export async function fetchInvoiceAssetDataUris(
  baseUrl = ''
): Promise<{ mascotSrc: string; logoSrc: string }> {
  const [mascotSrc, logoSrc] = await Promise.all([
    fetchPathAsDataUri(baseUrl, INVOICE_MASCOT_PUBLIC_PATH),
    fetchPathAsDataUri(baseUrl, INVOICE_LOGO_PUBLIC_PATH),
  ]);
  return { mascotSrc, logoSrc };
}
