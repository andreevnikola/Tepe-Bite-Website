"use client";

import { useAtomValue } from "jotai";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { langAtom } from "@/store/lang";
import ChatLauncher from "./ChatLauncher";
import ChatWindow from "./ChatWindow";
import { useChatAvailability } from "./useChat";

/**
 * The assistant's only mount point.
 *
 * Its whole job is deciding whether the visitor is offered a chat at all:
 *
 *  - Nothing renders until the server has answered. `useChatAvailability` starts
 *    in `checking`, which returns `null` here — that is what prevents the
 *    launcher from appearing for a moment and then vanishing.
 *  - A failed or negative answer keeps it hidden for the rest of the page view.
 *    The check is never retried on a timer; an assistant that cannot answer must
 *    not advertise itself.
 *  - The window, once open, stays mounted regardless. Availability is a gate in
 *    front of the door, not something that closes it on a visitor mid-sentence —
 *    a provider that fails later surfaces inside the conversation instead.
 */

/** Surfaces that are not the public site and never carry the assistant. */
const HIDDEN_PREFIXES = ["/admin", "/studio"];

export default function ChatWidget() {
  const lang = useAtomValue(langAtom);
  const pathname = usePathname();
  const availability = useChatAvailability();
  const [open, setOpen] = useState(false);
  const launcherRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    // Focus goes back where it came from, so a keyboard visitor is not dropped
    // at the top of the document after closing the panel.
    requestAnimationFrame(() => launcherRef.current?.focus());
  }, []);

  if (HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;
  if (availability.phase !== "resolved") return null;
  if (!availability.value.available) return null;

  return (
    <>
      <ChatLauncher
        lang={lang}
        open={open}
        onOpen={() => setOpen(true)}
        buttonRef={launcherRef}
      />
      {open ? (
        <ChatWindow lang={lang} availability={availability.value} onClose={close} />
      ) : null}
    </>
  );
}
