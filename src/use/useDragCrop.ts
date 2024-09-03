
import { usePointer } from '@vueuse/core'
import { useMousePressed } from '@vueuse/core'
import { ref, Ref, watchEffect } from 'vue';

interface XY {
  x: number;
  y: number;
}

export function useDragCrop(canvas: Ref<HTMLCanvasElement | undefined>, patch: Ref<HTMLCanvasElement | undefined>) {
  const { pressed } = useMousePressed();
  const { x, y } = usePointer();

  const url = ref<string>();
  let start: undefined | XY;

  const calcAndDraw = (start: XY, now: XY) => {
    const w = Math.abs(start.x - now.x);
    const h = Math.abs(start.y - now.y);

    if (!canvas.value) return;
    const cSize = { w: canvas.value.width, h: canvas.value.height };
    const pSize = { w: w * cSize.w, h: h * cSize.h };

    if (!patch.value) return;
    patch.value.width = pSize.w;
    patch.value.height = pSize.h;
    const patchContext = patch.value.getContext('2d');
    if (!patchContext) return;
    patchContext.drawImage(canvas.value,
      start.x * cSize.w, start.y * cSize.h, pSize.w, pSize.h,
      0, 0, patch.value.width, patch.value.height);
    patchContext.stroke();
  }

  watchEffect(async () => {
    if (!canvas.value) return;
    const rect = canvas.value.getBoundingClientRect()
    // use normalized coordinates
    const ux = (x.value - rect.left) / rect.width
    const uy = (y.value - rect.top) / rect.height

    if (!start && pressed.value) {
      start = { x: ux, y: uy };
    }
    else if (start && !pressed.value) {
      calcAndDraw(start, { x: ux, y: uy });
      start = undefined;

      url.value = patch.value?.toDataURL();
    }
  })

  return { url }
}