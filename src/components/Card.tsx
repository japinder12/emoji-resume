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
      data-text={text}
      style={{ fontSize: "1.02rem", lineHeight: 1.7, paddingBottom: showWatermark ? 56 : undefined }}
      aria-label="Emoji resume preview"
    >
      {text || "📋 Paste or upload your resume to preview"}

      {showWatermark && (
        <div className="wm" aria-hidden>
          <div className="wm-pill wm-auto font-sans">
            <span className="wm-emoji">💻</span>
            <span>cvmoji</span>
          </div>
        </div>
      )}
    </div>
  );
});
export default Card;
