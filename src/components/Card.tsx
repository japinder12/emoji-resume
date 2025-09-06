import { forwardRef } from "react";
import { clsx } from "clsx";

type Props = { text: string; showWatermark?: boolean };
const Card = forwardRef<HTMLDivElement, Props>(({ text, showWatermark }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        "rounded-2xl p-6 whitespace-pre-wrap font-mono select-text relative",
        "card card-shadow max-w-[480px]"
      )}
      style={{ fontSize: "1.02rem", lineHeight: 1.7 }}
      aria-label="Emoji resume preview"
    >
      {text || "📋 Paste or upload your resume to preview"}

      {showWatermark && (
        <div className={clsx("absolute bottom-2 right-3 text-xs opacity-70 font-sans")}>        
          cvmoji
        </div>
      )}
    </div>
  );
});
export default Card;
