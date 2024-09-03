<script setup lang="ts">
import { ref, shallowRef, watch, } from 'vue';
import * as pdfjs from 'pdfjs-dist';
// @ts-ignore
import pdfWorkerURL from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { useDragCrop } from './use/useDragCrop'
import { render } from './renderPage'
import { logImage } from './util'

// load pdf from src
const src = ref("sheet/Prelude and Fugue No.1 C major BWV 846.pdf");
const pdf = shallowRef<pdfjs.PDFDocumentProxy>();
watch(src, async () => {
  pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerURL;
  const loadingTask = pdfjs.getDocument(src.value)
  pdf.value = await loadingTask.promise
}, { immediate: true })

// render pdf to canvas
const canvas = ref<HTMLCanvasElement>();
watch([pdf, canvas], async () => {
  if (!pdf.value) return;
  if (!canvas.value) return;

  render(canvas.value, await pdf.value.getPage(1))
})

// drag crop
const patch = ref<HTMLCanvasElement>();
const { url } = useDragCrop(canvas, patch);
watch(url, (url) => {
  if (url) logImage(url)
})
</script>

<template>
  <div class="w-screen h-screen border-2">
    <canvas ref="canvas" class="h-full w-full"></canvas>

    <!-- hidden canvas for exporting cropped image -->
    <canvas ref="patch" hidden></canvas>
  </div>
</template>

<style></style>
