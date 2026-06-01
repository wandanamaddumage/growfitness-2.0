import * as path from 'node:path';

/** Directory containing `assets/` (package root), whether loaded from `src` or `dist`. */
export function resolveInvoicePrintPackageRoot(): string {
  if (typeof __dirname === 'string') {
    const fromDist = path.join(__dirname, '..');
    return fromDist;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const entry = require.resolve('@grow-fitness/invoice-print');
    return path.join(path.dirname(entry), '..');
  } catch {
    return path.join(process.cwd(), 'packages', 'invoice-print');
  }
}
