import { approvalModeFor } from "../../shared/approval-mode";
import { personPin, type Place } from "@/lib/place";
import { t } from "@/lib/i18n";
import type { Bot, Task } from "@/state/store";
import { ApprovalChip, GoalToggle } from "./ComposerPlusMenu";
import { ModelPicker } from "./ModelPicker"; import { isPlaceId } from "@/lib/place-chat"; import { PlacedModelPill } from "./PlacedBotMenu";
import { ComposerEmoji } from "./ComposerEmoji";
import { BookOpen, Paperclip } from "lucide-react";
import { PhonePlus } from "./PhonePlus";
import { PlaceChip } from "./PlaceChip";
import type { ApprovalChoice } from "./thread-approval";

/**
 * The start of Advanced mode's footer under the field: one + holding every tool, the model, and a chip only for what
 * this conversation changes: Work until done while it is on, an approval level other than the bot's own, a pinned place.
 */
export function ComposerAdvancedTools({ profile, bot, task, locked, remoteClient, onAttach, goal, teach, approval, callBotId, onPin, onSetup, canSetup, onEmoji, emojiDisabled }: {
  profile?: Bot;
  /** The bot as this conversation runs it; undefined in a room. */
  bot?: Bot;
  task?: Pick<Task, "surface" | "surfaceAuto"> | null;
  locked: boolean;
  remoteClient: boolean;
  onAttach: () => void;
  goal?: { on: boolean; onToggle: () => void; solo?: boolean };
  teach?: () => void;
  approval?: ApprovalChoice;
  callBotId?: string;
  onPin: (surface: Place | null) => void;
  /** Merkle (A14): the /setup door and the emoji picker live at the end of this row. */
  onSetup?: () => void;
  canSetup?: boolean;
  onEmoji?: (emoji: string) => void;
  emojiDisabled?: boolean;
}) {
  const place = bot && !remoteClient ? { bot, task, disabled: Boolean(bot.busy), onPin } : undefined;
  const ownLevel = approval && profile && bot && approvalModeFor(bot) !== approvalModeFor(profile);
  return (
    <div data-composer-tools className="flex min-w-0 flex-wrap items-center gap-1">
      {!locked && (
        <PhonePlus quiet attachInMenu={false} onAttach={onAttach} goal={goal} teach={teach} callBotId={callBotId}
          approval={approval && bot && { name: bot.name, choice: approval }} place={place} />
      )}
      {bot && (isPlaceId(bot.id) ? <PlacedModelPill bot={bot} quiet /> : <ModelPicker key={bot.threadId} bot={bot} threadId={bot.threadId} quiet />)}
      {!locked && goal?.on && <GoalToggle {...goal} />}
      {!locked && ownLevel && <ApprovalChip choice={approval} quiet />}
      {!locked && place && personPin(task) && <PlaceChip bot={place.bot} task={task} live={place.disabled} disabled={place.disabled} onPin={onPin} />}
      {!locked && canSetup && onSetup && (
        <button
          type="button"
          onClick={onSetup}
          aria-label={t("composer.setupTask")}
          title={t("composer.setupTask")}
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-ink-secondary hover:bg-raised hover:text-ink"
        >
          <BookOpen size={16} strokeWidth={1.75} absoluteStrokeWidth />
        </button>
      )}
      {/* Merkle: Attach stays a button of its own, left of /setup and the emoji picker. The + keeps the rest. */}
      {!locked && (
        <button
          type="button"
          onClick={onAttach}
          aria-label={t("composer.attachFiles")}
          title={t("composer.attachFiles")}
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-ink-secondary hover:bg-raised hover:text-ink"
        >
          <Paperclip size={16} strokeWidth={1.75} absoluteStrokeWidth />
        </button>
      )}
      {!locked && onEmoji && <ComposerEmoji onPick={onEmoji} disabled={emojiDisabled} />}
    </div>
  );
}
