import { cn } from "@/lib/utils/cn";

interface TabProps {
  label: string;
  subLabel?: string;
  isActive: boolean;
  onClick: () => void;
}

export function Tab({ label, subLabel, isActive, onClick }: TabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-1 py-2 text-sm tracking-wide transition-colors duration-200",
        isActive ? "text-text" : "text-text-muted hover:text-text",
      )}
      aria-pressed={isActive}
    >
      <span className="font-[family-name:var(--font-display)]">{label}</span>
      {subLabel ? (
        <span className="ml-2 text-xs text-text-muted">{subLabel}</span>
      ) : null}
    </button>
  );
}
