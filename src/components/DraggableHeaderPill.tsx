// A pill in the chat's top bar that the person can slide anywhere along the bar. Each pill keeps its own place in
// this browser. It stays in the flow's top row, over the header, so it can pass the centre or either edge freely.
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const STORAGE_PREFIX = "omb-chathead-pill:";

function readPlace(key: string): number | null {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_PREFIX + key);
    if (raw === null || raw === undefined) return null;
    const value = Number(raw);
    return Number.isFinite(value) && value >= 0 && value <= 1 ? value : null;
  } catch {
    return null;
  }
}

function savePlace(key: string, value: number): void {
  try {
    globalThis.localStorage?.setItem(STORAGE_PREFIX + key, String(value));
  } catch {
  }
}

const EDGE = 8;

/** Keeps a pill fully inside its bar, leaving EDGE px at both ends. */
export function clampPillLeft(left: number, pillWidth: number, barWidth: number): number {
  if (!(barWidth > 0)) return left;
  const max = Math.max(EDGE / barWidth, 1 - (pillWidth + EDGE) / barWidth);
  return Math.min(Math.max(left, EDGE / barWidth), max);
}

export function DraggableHeaderPill({
  storageKey,
  defaultRight,
  children,
  className,
}: {
  storageKey: string;
  /** Where it rests before the person moves it: that many px from the bar's right edge. */
  defaultRight: number;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ startX: number; startLeft: number; barWidth: number; pillWidth: number; moved: boolean } | null>(null);
  const swallowClick = useRef(false);

  const measure = () => {
    const el = ref.current;
    const bar = el?.parentElement;
    if (!el || !bar) return;
    const barWidth = bar.clientWidth;
    const pillWidth = el.offsetWidth;
    setLeft((current) => {
      const base = current ?? readPlace(storageKey) ?? 1 - (defaultRight + pillWidth) / barWidth;
      return clampPillLeft(base, pillWidth, barWidth);
    });
  };

  useLayoutEffect(measure, [storageKey, defaultRight]);

  useEffect(() => {
    const el = ref.current;
    const bar = el?.parentElement;
    if (!el || !bar || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    observer.observe(el);
    return () => observer.disconnect();
  }, [storageKey, defaultRight]);

  const end = (save: boolean) => {
    const state = drag.current;
    drag.current = null;
    setDragging(false);
    if (!state) return;
    if (state.moved) swallowClick.current = true;
    if (save) setLeft((current) => {
      if (current !== null) savePlace(storageKey, current);
      return current;
    });
  };

  const style: CSSProperties = {
    position: "absolute",
    top: "50%",
    left: left === null ? "100%" : `${left * 100}%`,
    transform: "translateY(-50%)",
    visibility: left === null ? "hidden" : undefined,
    touchAction: "none",
  };

  return (
    <div
      ref={ref}
      data-header-pill={storageKey}
      data-dragging={dragging ? "" : undefined}
      style={style}
      className={cn("pointer-events-auto select-none", dragging ? "cursor-grabbing" : "cursor-grab", className)}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        const el = ref.current;
        const bar = el?.parentElement;
        if (!el || !bar || left === null) return;
        event.stopPropagation();
        try { event.currentTarget.setPointerCapture(event.pointerId); } catch {}
        drag.current = { startX: event.clientX, startLeft: left, barWidth: bar.clientWidth, pillWidth: el.offsetWidth, moved: false };
        setDragging(true);
      }}
      onPointerMove={(event) => {
        const state = drag.current;
        if (!state) return;
        const dx = event.clientX - state.startX;
        if (!state.moved && Math.abs(dx) < 4) return;
        state.moved = true;
        setLeft(clampPillLeft(state.startLeft + dx / state.barWidth, state.pillWidth, state.barWidth));
      }}
      onPointerUp={() => end(true)}
      onPointerCancel={() => end(true)}
      onClickCapture={(event) => {
        if (!swallowClick.current) return;
        swallowClick.current = false;
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      {children}
    </div>
  );
}
