import { rasterizeDataUriForCanvas } from '@grow-fitness/invoice-print';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

async function loadHtml2Canvas() {
  const mod = await import('html2canvas');
  return mod.default;
}

async function loadJsPDF() {
  const mod = await import('jspdf');
  return mod.jsPDF;
}

async function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll('img'));
  await Promise.all(
    images.map(
      img =>
        new Promise<void>((resolve, reject) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Invoice image failed to load'));
        })
    )
  );
}

async function waitForInvoiceFonts(): Promise<void> {
  if (!document.fonts?.load) {
    return;
  }
  await Promise.all([
    document.fonts.load('2.8rem Insanibc'),
    document.fonts.load('11px Montserrat'),
  ]);
  await document.fonts.ready;
}

function injectTitleRings(node: HTMLElement): void {
  const titleWrap = node.querySelector('.inv-title-wrap');
  if (!titleWrap || titleWrap.querySelector('.inv-title-ring')) {
    return;
  }

  const outer = document.createElement('span');
  outer.className = 'inv-title-ring inv-title-ring--outer';
  outer.setAttribute('aria-hidden', 'true');

  const inner = document.createElement('span');
  inner.className = 'inv-title-ring inv-title-ring--inner';
  inner.setAttribute('aria-hidden', 'true');

  const sketch = titleWrap.querySelector('.inv-sketch-oval');
  if (sketch) {
    titleWrap.insertBefore(outer, sketch);
    titleWrap.insertBefore(inner, sketch);
  }
}

async function prepareLogoForCapture(node: HTMLElement): Promise<void> {
  const logoImg = node.querySelector('.inv-logo-img');
  if (!(logoImg instanceof HTMLImageElement) || !logoImg.src) {
    return;
  }
  logoImg.src = await rasterizeDataUriForCanvas(logoImg.src);
}

function prepareInvoiceCaptureNode(source: HTMLElement): {
  node: HTMLElement;
  cleanup: () => void;
} {
  const node = source.cloneNode(true) as HTMLElement;
  node.classList.add('inv-root--capture');
  Object.assign(node.style, {
    position: 'fixed',
    left: '-10000px',
    top: '0',
    zIndex: '-1',
    width: `${A4_WIDTH_MM}mm`,
    height: `${A4_HEIGHT_MM}mm`,
    minHeight: `${A4_HEIGHT_MM}mm`,
    maxHeight: `${A4_HEIGHT_MM}mm`,
    overflow: 'hidden',
    boxSizing: 'border-box',
  });

  injectTitleRings(node);
  document.body.appendChild(node);
  return { node, cleanup: () => node.remove() };
}

/** Generate a single-page A4 PDF matching the on-screen invoice preview. */
export async function downloadInvoicePdfFromElement(
  invoiceRoot: HTMLElement,
  filename: string
): Promise<void> {
  const { node, cleanup } = prepareInvoiceCaptureNode(invoiceRoot);

  try {
    await prepareLogoForCapture(node);
    await waitForImages(node);
    await waitForInvoiceFonts();

    const html2canvas = await loadHtml2Canvas();
    const JsPDF = await loadJsPDF();

    const canvas = await html2canvas(node, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#2eb67d',
      width: node.offsetWidth,
      height: node.offsetHeight,
      windowWidth: node.offsetWidth,
      windowHeight: node.offsetHeight,
      scrollX: 0,
      scrollY: 0,
    });

    const pdf = new JsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    pdf.addImage(imgData, 'JPEG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
    pdf.save(filename);
  } finally {
    cleanup();
  }
}
