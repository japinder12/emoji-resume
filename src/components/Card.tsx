import { forwardRef } from "react";
import { clsx } from "clsx";

type Props = { text: string; theme: "light" | "dark"; showWatermark?: boolean };
const Card = forwardRef<HTMLDivElement, Props>(({ text, theme, showWatermark }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        "rounded-2xl p-6 whitespace-pre-wrap font-mono leading-7 select-text relative",
        theme === "dark" ? "bg-[#0f172a] text-white" : "bg-white text-black",
        "shadow-xl border border-black/5 max-w-[560px]"
      )}
      aria-label="Emoji résumé preview"
    >
      {text || "👋 Paste or upload your resume to preview"}

      {showWatermark && (
        <div
          className={clsx(
            "absolute bottom-2 right-3 text-xs opacity-70 font-sans",
            theme === "dark" ? "text-slate-300" : "text-slate-600"
          )}
        >
          cvmoji.xyz
        </div>
      )}
    </div>
  );
});
export default Card;
