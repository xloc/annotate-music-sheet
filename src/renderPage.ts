import { PDFPageProxy } from "pdfjs-dist";

export async function render(canvas: HTMLCanvasElement, page: PDFPageProxy) {
  const canvasContext = canvas.getContext('2d');
  if (!canvasContext) return;

  const scale = 1;
  const viewport = page.getViewport({ scale });
  const outputScale = window.devicePixelRatio || 1; // for HiDPI-screens
  const transform = [outputScale, 0, 0, outputScale, 0, 0];

  canvas.width = Math.floor(viewport.width * outputScale);
  canvas.height = Math.floor(viewport.height * outputScale);

  page.render({ canvasContext, transform, viewport })
}