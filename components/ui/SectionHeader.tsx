import { Reveal } from "./Reveal";

type Props = {
  eyebrow: string;
  index: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  id?: string;
};

export function SectionHeader({ eyebrow, index, title, intro, tone = "light", align = "left", id }: Props) {
  const dark = tone === "dark";
  return (
    <Reveal className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className={`eyebrow ${dark ? "text-electric-400" : "text-electric"} ${align === "center" ? "justify-center" : ""}`}>
        <span className={dark ? "text-white/40" : "text-ink/40"}>{index}</span>
        <span aria-hidden className={`h-px w-6 ${dark ? "bg-white/25" : "bg-ink/20"}`} />
        {eyebrow}
      </p>
      <h2
        id={id}
        className={`display mt-5 text-[2.15rem] leading-[1.04] sm:text-5xl lg:text-[3.6rem] ${dark ? "text-white" : "text-ink"}`}
      >
        {title}
      </h2>
      {intro && (
        <p className={`text-pretty mt-6 text-lg leading-relaxed ${dark ? "text-white/60" : "text-ink/60"} ${align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
          {intro}
        </p>
      )}
    </Reveal>
  );
}
