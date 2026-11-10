const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// next/image and plain <img> do not apply basePath to string sources.
export function assetPath(src: string) {
  return src.startsWith("/") ? `${basePath}${src}` : src;
}
