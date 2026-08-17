import Link from "next/link";
import { ReactNode } from "react";

interface PillButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "solid" | "outline";
  type?: "button" | "submit";
  disabled?: boolean;
}

export default function PillButton({
  href,
  onClick,
  children,
  variant = "solid",
  type = "button",
  disabled,
}: PillButtonProps) {
  const classes = [
    "type-label-sm inline-flex items-center gap-2.5 rounded-pill px-6 py-3.5",
    "transition-all duration-500 ease-lusion",
    "hover:scale-[1.03] active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-30",
    variant === "solid"
      ? "bg-ink text-bg hover:opacity-85"
      : "border border-line text-ink hover:border-lineStrong",
  ].join(" ");

  if (href) {
    return (
      <Link href={href} data-cursor-grow className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-cursor-grow
      className={classes}
    >
      {children}
    </button>
  );
}
