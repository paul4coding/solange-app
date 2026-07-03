import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export default function SectionHeader({
  label,
  title,
  titleHighlight,
  subtitle,
  centered = true,
  light = false,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(centered && "text-center", className)}>
      {label && (
        <p className={cn("text-xs font-semibold tracking-[0.2em] uppercase mb-2", light ? "text-yellow-300" : "text-[#C9A96E]")}>
          {label}
        </p>
      )}
      <h2 className={cn("text-3xl lg:text-4xl font-bold font-serif mb-3", light ? "text-white" : "text-gray-900")}
        style={{ fontFamily: "'Playfair Display', serif" }}>
        {title}
        {titleHighlight && (
          <span className={light ? " text-yellow-300" : " text-[#8B1A1A]"}> {titleHighlight}</span>
        )}
      </h2>
      {subtitle && (
        <p className={cn("text-sm max-w-xl leading-relaxed", centered && "mx-auto", light ? "text-white/70" : "text-gray-500")}>
          {subtitle}
        </p>
      )}

      {/* Gold ornament */}
      <div className={cn("flex items-center gap-2 mt-3", centered && "justify-center")}>
        <div className={cn("h-px w-12", light ? "bg-yellow-300/50" : "bg-[#C9A96E]/40")} />
        <span className={light ? "text-yellow-300" : "text-[#C9A96E]"}>✦</span>
        <div className={cn("h-px w-12", light ? "bg-yellow-300/50" : "bg-[#C9A96E]/40")} />
      </div>
    </div>
  );
}
