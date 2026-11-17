"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils/cn";

const ZOOM_LEVELS = [1, 2, 3, 4] as const;
const PADDING_X = 48;
const PADDING_Y = 72;

interface ImageZoomLightboxProps {
  open: boolean;
  src: string;
  alt: string;
  onClose: () => void;
}

interface Frame {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Pan {
  x: number;
  y: number;
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Size {
  width: number;
  height: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function sameSize(current: Size | null, next: Size) {
  return current?.width === next.width && current.height === next.height;
}

function fitFrame(stageWidth: number, stageHeight: number, imageWidth: number, imageHeight: number): Frame | null {
  const availableWidth = stageWidth - PADDING_X * 2;
  const availableHeight = stageHeight - PADDING_Y * 2;
  if (availableWidth <= 0 || availableHeight <= 0 || imageWidth <= 0 || imageHeight <= 0) {
    return null;
  }

  const scale = Math.min(availableWidth / imageWidth, availableHeight / imageHeight);
  const width = imageWidth * scale;
  const height = imageHeight * scale;

  return {
    width,
    height,
    left: (stageWidth - width) / 2,
    top: (stageHeight - height) / 2,
  };
}

function visualRect(frame: Frame, zoom: number, pan: Pan): Rect {
  const width = frame.width * zoom;
  const height = frame.height * zoom;

  return {
    width,
    height,
    left: frame.left + frame.width / 2 + pan.x - width / 2,
    top: frame.top + frame.height / 2 + pan.y - height / 2,
  };
}

function clampPan(pan: Pan, zoom: number, frame: Frame, viewport: Size): Pan {
  const width = frame.width * zoom;
  const height = frame.height * zoom;
  if (width <= viewport.width && height <= viewport.height) {
    return { x: 0, y: 0 };
  }

  const centerX = frame.left + frame.width / 2;
  const centerY = frame.top + frame.height / 2;

  const minLeft = width <= viewport.width ? 0 : viewport.width - width;
  const maxLeft = width <= viewport.width ? viewport.width - width : 0;
  const minTop = height <= viewport.height ? 0 : viewport.height - height;
  const maxTop = height <= viewport.height ? viewport.height - height : 0;
  const panXForLeft = (left: number) => left - centerX + width / 2;
  const panYForTop = (top: number) => top - centerY + height / 2;

  return {
    x: clamp(
      pan.x,
      Math.min(panXForLeft(minLeft), panXForLeft(maxLeft)),
      Math.max(panXForLeft(minLeft), panXForLeft(maxLeft)),
    ),
    y: clamp(
      pan.y,
      Math.min(panYForTop(minTop), panYForTop(maxTop)),
      Math.max(panYForTop(minTop), panYForTop(maxTop)),
    ),
  };
}

function stepZoom(current: number, direction: 1 | -1) {
  if (direction > 0) {
    return ZOOM_LEVELS.find((level) => level > current + 0.001) ?? ZOOM_LEVELS[ZOOM_LEVELS.length - 1];
  }

  const lower = [...ZOOM_LEVELS].reverse().find((level) => level < current - 0.001);
  return lower ?? ZOOM_LEVELS[0];
}

function controlPosition(visual: Rect, viewport: Size) {
  const inset = 8;
  const button = 22;
  const gap = 4;
  const groupWidth = button * 2 + gap;
  const groupHeight = button;
  const visibleLeft = clamp(visual.left, 0, viewport.width);
  const visibleTop = clamp(visual.top, 0, viewport.height);
  const visibleRight = clamp(visual.left + visual.width, 0, viewport.width);
  const visibleBottom = clamp(visual.top + visual.height, 0, viewport.height);

  let left = visibleRight - inset - groupWidth;
  let top = visibleTop + inset;
  left = clamp(left, visibleLeft + 4, Math.max(visibleLeft + 4, visibleRight - groupWidth - 4));
  top = clamp(top, visibleTop + 4, Math.max(visibleTop + 4, visibleBottom - groupHeight - 4));

  const closeLeft = viewport.width - 16 - 36;
  const closeBottom = 16 + 36;
  if (top < closeBottom + 4 && left + groupWidth > closeLeft - 4) {
    const belowClose = closeBottom + 8;
    if (belowClose + groupHeight <= visibleBottom - 4) {
      top = belowClose;
    } else {
      left = Math.min(left, closeLeft - groupWidth - 8);
    }
  }

  return { left, top };
}

function pointInRect(x: number, y: number, rect: DOMRect) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

export function ImageZoomLightbox({ open, src, alt, onClose }: ImageZoomLightboxProps) {
  if (!open || typeof document === "undefined") return null;

  return createPortal(<ZoomStage key={src} src={src} alt={alt} onClose={onClose} />, document.body);
}

function ZoomStage({ src, alt, onClose }: Omit<ImageZoomLightboxProps, "open">) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const [natural, setNatural] = useState<Size | null>(null);
  const [stageSize, setStageSize] = useState<Size>({ width: 0, height: 0 });
  const [zoom, setZoom] = useState<number>(ZOOM_LEVELS[0]);
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [canHover, setCanHover] = useState(() =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );

  const rememberSize = useCallback((image: HTMLImageElement) => {
    if (image.naturalWidth <= 0 || image.naturalHeight <= 0) return;
    const next = { width: image.naturalWidth, height: image.naturalHeight };
    setNatural((current) => (sameSize(current, next) ? current : next));
  }, []);

  const setStageNode = useCallback((node: HTMLDivElement | null) => {
    stageRef.current = node;
    if (!node) return;

    const publish = () => {
      const next = { width: node.clientWidth, height: node.clientHeight };
      setStageSize((current) => (sameSize(current, next) ? current : next));
    };
    publish();

    const observer = new ResizeObserver(publish);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const setImageNode = useCallback(
    (node: HTMLImageElement | null) => {
      imageRef.current = node;
      if (node?.complete) rememberSize(node);
    },
    [rememberSize],
  );

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    stageRef.current?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!canHover) return;

    const onPointerMove = (event: PointerEvent) => {
      const image = imageRef.current;
      const target = event.target;
      const overControls = target instanceof Node && (controlsRef.current?.contains(target) ?? false);
      const overImage = image ? pointInRect(event.clientX, event.clientY, image.getBoundingClientRect()) : false;
      const next = overControls || overImage;
      setShowControls((current) => (current === next ? current : next));
    };

    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [canHover]);

  const frame = useMemo(() => {
    if (!natural) return null;
    return fitFrame(stageSize.width, stageSize.height, natural.width, natural.height);
  }, [natural, stageSize.height, stageSize.width]);

  const safePan = frame ? clampPan(pan, zoom, frame, stageSize) : pan;
  const visual = frame ? visualRect(frame, zoom, safePan) : null;

  const changeZoom = (direction: 1 | -1) => {
    if (!frame) return;
    const nextZoom = stepZoom(zoom, direction);
    setZoom(nextZoom);
    setPan((current) => clampPan(current, nextZoom, frame, stageSize));
  };

  const onImagePointerDown = (event: ReactPointerEvent<HTMLImageElement>) => {
    if (zoom <= 1 || !frame) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: safePan.x,
      originY: safePan.y,
    };
    setDragging(true);
  };

  const onImagePointerMove = (event: ReactPointerEvent<HTMLImageElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !frame) return;
    setPan(
      clampPan(
        {
          x: drag.originX + (event.clientX - drag.startX),
          y: drag.originY + (event.clientY - drag.startY),
        },
        zoom,
        frame,
        stageSize,
      ),
    );
  };

  const endDrag = (event: ReactPointerEvent<HTMLImageElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
  };

  const controlsVisible = canHover ? showControls : true;
  const controls = visual ? controlPosition(visual, stageSize) : null;
  const zoomInDisabled = zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1];
  const zoomOutDisabled = zoom <= ZOOM_LEVELS[0];

  return (
    <div
      ref={setStageNode}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      tabIndex={-1}
      className="fixed inset-0 z-[80] bg-[rgba(30,30,30,0.96)] outline-none"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center text-white/80 transition-opacity hover:text-white"
      >
        <CloseIcon />
      </button>

      {/* The zoomed image is sized in pixels and panned outside the layout width. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={setImageNode}
        src={src}
        alt={alt}
        draggable={false}
        onLoad={(event) => rememberSize(event.currentTarget)}
        onPointerDown={onImagePointerDown}
        onPointerMove={onImagePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDragStart={(event) => event.preventDefault()}
        className="absolute select-none"
        style={
          visual
            ? {
                left: visual.left,
                top: visual.top,
                width: visual.width,
                height: visual.height,
                maxWidth: "none",
                maxHeight: "none",
                cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default",
                touchAction: "none",
              }
            : {
                width: 0,
                height: 0,
                maxWidth: "none",
                opacity: 0,
                pointerEvents: "none",
              }
        }
      />

      {controls ? (
        <div
          ref={controlsRef}
          className={cn(
            "absolute z-10 flex items-center gap-1 transition-opacity duration-200",
            controlsVisible
              ? "opacity-80"
              : "pointer-events-none opacity-0 focus-within:pointer-events-auto focus-within:opacity-80",
          )}
          style={{ left: controls.left, top: controls.top }}
        >
          <ZoomButton label="확대" disabled={zoomInDisabled} onClick={() => changeZoom(1)}>
            <PlusIcon />
          </ZoomButton>
          <ZoomButton label="축소" disabled={zoomOutDisabled} onClick={() => changeZoom(-1)}>
            <MinusIcon />
          </ZoomButton>
        </div>
      ) : null}
    </div>
  );
}

function ZoomButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-black/45 text-white shadow-sm backdrop-blur-[2px] transition-opacity hover:bg-black/60 disabled:cursor-default disabled:opacity-35"
    >
      {children}
    </button>
  );
}

function PlusIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M5 1.2v7.6M1.2 5h7.6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M1.2 5h7.6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
