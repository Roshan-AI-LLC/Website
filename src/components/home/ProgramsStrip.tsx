import { ClaudeStartupsMark } from '../ClaudeStartupsMark';
import { InceptionBadge } from '../InceptionBadge';

/** Width shared by both marks so their plates match. NVIDIA's minimum is 110. */
const MARK_WIDTH = 120;

/**
 * Programs row, pinned to the bottom of the hero's first screen (rendered as
 * the hero's children). No card: just the label and the two marks as a
 * matched pair. Both trademark lines live in the footer.
 */
export function ProgramsStrip() {
  return (
    <div id="programs" className="enter-fade-up enter-d-5 relative mt-7 scroll-mt-24 sm:mt-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2.5 px-5 sm:flex-row sm:justify-center sm:gap-6 sm:px-8">
        <span className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-muted">
          Member of
        </span>
        <div className="flex items-center gap-3 sm:gap-4">
          <InceptionBadge width={MARK_WIDTH} />
          <ClaudeStartupsMark width={MARK_WIDTH} />
        </div>
      </div>
    </div>
  );
}
