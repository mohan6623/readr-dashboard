import { useEffect, useMemo, useRef, useState } from 'react';

type RGB = { r: number; g: number; b: number };

const cache = new Map<string, RGB>();

function clamp(n: number, min = 0, max = 255) {
  return Math.max(min, Math.min(max, n));
}

function toRGBA({ r, g, b }: RGB, a = 1) {
  return `rgba(${clamp(r)}, ${clamp(g)}, ${clamp(b)}, ${a})`;
}

function toHex({ r, g, b }: RGB) {
  const h = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}

function isNearGray({ r, g, b }: RGB) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max - min < 16; // low chroma
}

function adjustForUI(color: RGB): RGB {
  // If the color is too bright or near-gray, gently push toward a pleasant accent
  let { r, g, b } = color;
  const avg = (r + g + b) / 3;
  if (avg > 220 || isNearGray(color)) {
    // shift slightly toward a warm accent and reduce brightness
    r = clamp(r * 0.85 + 20);
    g = clamp(g * 0.75 + 10);
    b = clamp(b * 0.75);
  }
  return { r, g, b };
}

export function useDominantColor(src?: string) {
  const [color, setColor] = useState<RGB | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!src) {
      setColor(null);
      return;
    }

    if (cache.has(src)) {
      setColor(cache.get(src)!);
      return;
    }

    // Load image and sample pixels via canvas
    const img = new Image();
    // If data URL, no need for CORS; otherwise try anonymous to avoid tainting
    if (!src.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    img.src = src;

    const onLoad = () => {
      try {
        const w = 48;
        const h = 64;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('No 2D context');
        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);

        let r = 0, g = 0, b = 0, count = 0;
        // Sample every 4th pixel to speed up
        for (let i = 0; i < data.length; i += 16) {
          const alpha = data[i + 3];
          if (alpha < 200) continue; // skip transparent
          const pr = data[i];
          const pg = data[i + 1];
          const pb = data[i + 2];
          // Skip pure whites and blacks to avoid extremes
          const max = Math.max(pr, pg, pb);
          const min = Math.min(pr, pg, pb);
          if (max < 20 || min > 235) continue;
          r += pr; g += pg; b += pb; count++;
        }

        if (count === 0) {
          // fallback average of all pixels (may be gray)
          for (let i = 0; i < data.length; i += 16) {
            r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
          }
        }

        const avg: RGB = count
          ? { r: Math.round(r / count), g: Math.round(g / count), b: Math.round(b / count) }
          : { r: 180, g: 180, b: 180 };

        const adjusted = adjustForUI(avg);
        cache.set(src, adjusted);
        if (mounted.current) setColor(adjusted);
      } catch {
        if (mounted.current) setColor({ r: 180, g: 180, b: 180 });
      }
    };

    const onError = () => {
      if (mounted.current) setColor({ r: 180, g: 180, b: 180 });
    };

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);
    return () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };
  }, [src]);

  return useMemo(() => {
    if (!color) {
      return {
        color: null as RGB | null,
        hex: '#b4b4b4',
        rgba: (a = 1) => `rgba(180,180,180,${a})`,
      };
    }
    return {
      color,
      hex: toHex(color),
      rgba: (a = 1) => toRGBA(color, a),
    };
  }, [color]);
}

export type DominantColor = ReturnType<typeof useDominantColor>;
