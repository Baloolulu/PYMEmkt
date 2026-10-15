import { forwardRef } from "react";

type Variant = "primary" | "glass" | "dark" | "outline" | "light";
type Size = "md" | "lg";

const base =
  "group relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[transform,background-color,box-shadow,color,border-color] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-electric text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_10px_30px_-10px_rgba(37,99,235,0.8)] hover:bg-[#1d4fd8] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.18)_inset,0_14px_40px_-10px_rgba(37,99,235,0.95)]",
  glass: "border border-white/15 bg-white/[0.04] text-white backdrop-blur hover:border-white/30 hover:bg-white/[0.08]",
  dark: "bg-ink text-white hover:bg-ink-700",
  outline: "border border-ink/15 bg-white text-ink hover:border-ink/40",
  light: "bg-white text-ink hover:bg-mist",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.92rem]",
  lg: "h-12 px-6 text-[0.98rem] sm:h-[3.25rem] sm:px-7",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className = "", type = "button", ...props },
  ref,
) {
  return <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...props} />;
});

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; size?: Size };

export function ButtonLink({ variant = "primary", size = "md", className = "", ...props }: LinkProps) {
  return <a className={buttonClass(variant, size, className)} {...props} />;
}
