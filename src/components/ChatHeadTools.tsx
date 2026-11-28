// Merkle (A16, v180-r2): ch pieces of the chat's top bar that the v180 port dropped and Jose asked back:
// find in the conversation, the transcript's copy/download, and the usage chip (uncached + ctx %).
import { useState } from "react";
import { Copy, Download, Search } from "lucide-react";

import { cn } from "@/lib/cn";
import { ELEVATED_HEADER_FLOAT, ELEVATED_HEADER_HOVER } from "./elevated";
import { t } from "@/lib/i18n";
import { contextChip, contextDetail, contextShare, formatTokens, lastTurnDetail, uncachedInput, usageChip, usageDetail } from "@/lib/usage";
import { copyTranscriptToClipboard, downloadMarkdownTranscript, formatTranscriptMarkdown, slugifyTranscriptFilename } from "@/lib/export-transcript";
import { useStore, type Bot, type Message } from "@/state/store";

const ICON_BUTTON = "flex size-8 shrink-0 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-raised hover:text-ink disabled:opacity-40 disabled:hover:bg-transparent";

/** Copy as Markdown and download .md, right where the bot's name is. */
export function ChatHeadExport({ bot, messages }: { bot: Bot; messages: readonly Message[] }) {
  const [copyStatus, setCopyStatus] = useState<"copied" | "failed" | null>(null);
  const hasMessages = messages.length > 0;
  const transcript = () => formatTranscriptMarkdown({ title: bot.name, messages, botName: bot.name, isGroup: false });
  return (
    <>
      <button
        type="button"
        data-header-copy
        disabled={!hasMessages}
        onClick={() => { void copyTranscriptToClipboard(transcript()).then((ok) => setCopyStatus(ok ? "copied" : "failed")); }}
        className={cn(ICON_BUTTON, copyStatus === "copied" && "text-accent")}
        title={copyStatus === "copied" ? t("chat.export.copied") : copyStatus === "failed" ? t("chat.export.copyFailed") : t("chat.export.copy")}
        aria-label={t("chat.export.copy")}
      >
        <Copy size={16} strokeWidth={1.75} absoluteStrokeWidth />
      </button>
      <button
        type="button"
        data-header-download
        disabled={!hasMessages}
        onClick={() => downloadMarkdownTranscript(slugifyTranscriptFilename(bot.name), transcript())}
        className={ICON_BUTTON}
        title={t("chat.export.download")}
        aria-label={t("chat.export.download")}
      >
        <Download size={16} strokeWidth={1.75} absoluteStrokeWidth />
      </button>
    </>
  );
}

/** Find in the conversation: opens the find bar under the header. */
export function ChatHeadFind({ findOpen, onFind }: { findOpen: boolean; onFind: () => void }) {
  return (
    <button
      type="button"
      data-header-find
      onClick={onFind}
      aria-label={t("chat.find")}
      aria-pressed={findOpen}
      className={cn(ICON_BUTTON, findOpen && "text-accent")}
      title={t("chat.findShortcut")}
    >
      <Search size={16} strokeWidth={1.75} absoluteStrokeWidth />
    </button>
  );
}

/** The thread's usage, always as uncached tokens plus the context share, never the cost. */
export function HeaderUsageChip({ bot }: { bot: Bot }) {
  const { dispatch } = useStore();
  const usage = bot.tasks?.find((task) => task.threadId === bot.threadId)?.usage;
  if (!usage) return null;
  const ctx = contextChip(usage);
  const share = contextShare(usage);
  const uncached = formatTokens(uncachedInput(usage));
  if (!usageChip(usage) && !ctx) return null;
  const detail = [
    usage.turns === 1 ? t("chat.usage.turnsOne") : t("chat.usage.turnsMany", { count: usage.turns }),
    usageDetail(usage),
    lastTurnDetail(usage),
    contextDetail(usage),
    share?.tone === "danger" ? t("chat.usage.contextNudge") : null,
  ].filter(Boolean).join("\n");
  return (
    <button
      type="button"
      onClick={() => dispatch({ type: "toggleSettings", open: true, section: "usage" })}
      className={cn("flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[12px] tabular-nums text-ink-secondary", ELEVATED_HEADER_FLOAT, ELEVATED_HEADER_HOVER)}
      title={detail}
      data-testid="header-usage"
    >
      <span>{t("chat.usage.uncachedShort", { tokens: uncached })}</span>
      {ctx && <span className={cn(share?.tone === "danger" ? "text-danger" : share?.tone === "warning" ? "text-warning" : "opacity-70")}>{ctx}</span>}
    </button>
  );
}
