import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { InvoicePdfViewModel } from './types';
import { InvoiceTemplatePrint } from './InvoiceTemplatePrint';
import { INVOICE_PRINT_CSS } from './invoice-print-styles';
import { resolveInvoicePrintPackageRoot } from './resolve-package-root';

export type InvoicePrintAssetDataUris = {
  mascotSrc?: string;
  logoSrc?: string;
};

function readAssetAsDataUri(filePath: string, mime: string): string | undefined {
  try {
    if (!fs.existsSync(filePath)) {
      return undefined;
    }
    const buf = fs.readFileSync(filePath);
    return `data:${mime};base64,${buf.toString('base64')}`;
  } catch {
    return undefined;
  }
}

function assetPathCandidates(fileName: string): string[] {
  const root = resolveInvoicePrintPackageRoot();
  return [
    path.join(root, 'assets', fileName),
    path.join(root, 'dist', 'assets', fileName),
  ];
}

function readMascotDataUri(): string | undefined {
  for (const filePath of assetPathCandidates('invoice-mascot.png')) {
    const uri = readAssetAsDataUri(filePath, 'image/png');
    if (uri) {
      return uri;
    }
  }
  return undefined;
}

function readInvoiceLogoDataUri(): string | undefined {
  for (const filePath of assetPathCandidates('grow-invoice-wordmark-white.svg')) {
    const uri = readAssetAsDataUri(filePath, 'image/svg+xml');
    if (uri) {
      return uri;
    }
  }
  return undefined;
}

/**
 * Full HTML document for Puppeteer `page.setContent` / print preview.
 * Styles are in &lt;head&gt;; body matches {@link InvoiceTemplatePrint} without duplicate &lt;style&gt;.
 */
export function renderInvoicePrintToFullHtml(
  data: InvoicePdfViewModel,
  assetOverrides?: InvoicePrintAssetDataUris
): string {
  const bodyInner = renderToStaticMarkup(
    createElement(InvoiceTemplatePrint, {
      data,
      renderMode: 'pdf',
      includeStyles: false,
      mascotSrc: assetOverrides?.mascotSrc ?? readMascotDataUri() ?? '',
      logoSrc: assetOverrides?.logoSrc ?? readInvoiceLogoDataUri() ?? '',
    })
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Invoice</title>
<style>${INVOICE_PRINT_CSS}</style>
</head>
<body>
${bodyInner}
</body>
</html>`;
}
