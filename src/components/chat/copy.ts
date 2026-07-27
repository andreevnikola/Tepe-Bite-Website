import type { PageType } from "@/lib/i18n/metadata";
import type { Lang } from "@/store/lang";

/**
 * Every visitor-facing string of the assistant, in one place.
 *
 * Bulgarian is primary and English is written natively rather than translated,
 * because BG runs longer and the two versions need different rhythm to fit the
 * same panel. Deliberately free of `server-only` — this is a client module.
 *
 * The assistant speaks as ТЕПЕ bite ("ние"/"нашият"), so the surrounding UI
 * copy uses the same voice. It never states a product fact, price, donation,
 * partner or result: those can only come from the server's grounded answer.
 */

type Pair = { bg: string; en: string };

const t = (bg: string, en: string): Pair => ({ bg, en });

export const CHAT_COPY = {
  // ─── Launcher ──────────────────────────────────────────────────────────────
  launcherLabel: t("Питай ТЕПЕ bite", "Ask ТЕПЕ bite"),
  launcherAria: t("Отвори чата с ТЕПЕ bite", "Open the ТЕПЕ bite chat"),

  // ─── Window chrome ─────────────────────────────────────────────────────────
  windowTitle: t("ТЕПЕ bite Асистент", "ТЕПЕ bite Assistant"),
  windowSubtitle: t(
    "Питайте ни за барчето, Пловдив и ТЕПЕ bite Impact.",
    "Ask us about the bar, Plovdiv and ТЕПЕ bite Impact.",
  ),
  windowAria: t("Чат с ТЕПЕ bite", "Chat with ТЕПЕ bite"),
  close: t("Затвори", "Close"),
  closeAria: t("Затвори чата", "Close chat"),
  conversationAria: t("Разговор", "Conversation"),

  // ─── Opening ───────────────────────────────────────────────────────────────
  greeting: t(
    "Здравейте! Ние сме ТЕПЕ bite — барчето на Пловдив. Питайте ни за продукта, за историята ни или за ТЕПЕ bite Impact.",
    "Hello! We are ТЕПЕ bite — the snack bar from Plovdiv. Ask us about the product, our story or ТЕПЕ bite Impact.",
  ),
  /**
   * The one honest AI disclosure. Shown once, under the greeting — not repeated
   * on every message, where it would read as a legal shout instead of a note.
   */
  aiNote: t(
    "Отговаря AI асистент, само въз основа на публикуваното в този сайт. Когато нещо липсва, ви свързваме с екипа.",
    "You are talking to an AI assistant that answers only from what is published on this site. When something is missing, we put you in touch with the team.",
  ),
  suggestionsLabel: t("Започнете с:", "Start with:"),
  suggestions: {
    bg: [
      "Какво е ТЕПЕ bite Impact?",
      "Къде мога да купя барчето?",
      "Каква е историята зад ТЕПЕ bite?",
    ],
    en: [
      "What is ТЕПЕ bite Impact?",
      "Where can I buy the bar?",
      "What is the story behind ТЕПЕ bite?",
    ],
  } satisfies Record<Lang, string[]>,

  // ─── Composer ──────────────────────────────────────────────────────────────
  placeholder: t("Напишете въпроса си…", "Write your question…"),
  send: t("Изпрати", "Send"),
  sendAria: t("Изпрати въпроса", "Send question"),
  composerHint: t(
    "Enter изпраща · Shift+Enter нов ред",
    "Enter to send · Shift+Enter for a new line",
  ),
  thinking: t("Пишем отговор…", "Writing an answer…"),

  // ─── Availability & failures ───────────────────────────────────────────────
  unavailableTemporary: t(
    "Асистентът е временно недостъпен. Запазихме разговора ви. Моля, опитайте отново по-късно.",
    "The assistant is temporarily unavailable. We have kept your conversation. Please try again later.",
  ),
  unavailableToday: t(
    "Асистентът е временно недостъпен за днес. Моля, опитайте отново утре.",
    "The assistant is unavailable for the rest of today. Please try again tomorrow.",
  ),
  rateLimited: t(
    "Малко прекалено бързо. Изчакайте момент и опитайте отново.",
    "That was a little too quick. Give it a moment and try again.",
  ),
  rateLimitedIn: t("Опитайте отново след {s} сек.", "Try again in {s} s."),
  networkFailed: t(
    "Отговорът се забави и прекъснахме опита. Проверете връзката си и опитайте отново.",
    "The answer took too long, so we stopped waiting. Check your connection and try again.",
  ),
  noAnswerButSources: t(
    "Точният отговор не е наличен в момента. Ето страниците, които съдържат тази информация.",
    "The written answer is not available right now. Here are the pages that hold this information.",
  ),
  retry: t("Опитай отново", "Try again"),

  // ─── Source cards ──────────────────────────────────────────────────────────
  sourcesHeading: t("Източници от сайта", "Sources from the site"),
  sourceCited: t("Източник", "Source"),
  sourceLearnMore: t("Научи повече", "Learn more"),

  // ─── Contact escalation ────────────────────────────────────────────────────
  contactTrigger: t("Попитай екипа вместо мен", "Ask the team for me"),
  contactTitle: t("Попитай екипа", "Ask the team"),
  contactIntro: t(
    "Ще предадем въпроса ви на екипа на ТЕПЕ bite. Прегледайте и редактирайте съобщението, преди да го изпратите.",
    "We will pass your question to the ТЕПЕ bite team. Review and edit the message before you send it.",
  ),
  contactRecipient: t("До", "To"),
  contactName: t("Вашето име", "Your name"),
  contactNamePh: t("Иван Иванов", "Alex Smith"),
  contactEmail: t("Вашият имейл", "Your email"),
  contactEmailPh: t("ivan@example.com", "alex@example.com"),
  contactSubject: t("Тема", "Subject"),
  contactBody: t("Съобщение", "Message"),
  contactSend: t("Изпрати съобщението", "Send message"),
  contactSending: t("Изпращаме…", "Sending…"),
  contactCancel: t("Отказ", "Cancel"),
  contactSent: t(
    "Благодарим! Съобщението тръгна към екипа. Ще ви отговорим на посочения имейл.",
    "Thank you! Your message is on its way to the team. We will reply to the email you gave us.",
  ),
  contactFailed: t(
    "Съобщението не беше изпратено. Опитайте отново.",
    "The message was not sent. Please try again.",
  ),
  contactRejected: t(
    "Не успяхме да приемем съобщението. Проверете данните и опитайте отново.",
    "We could not accept the message. Check the details and try again.",
  ),
  /** Shown when the server reports that automatic sending is switched off. */
  contactManual: t(
    "Автоматичното изпращане е временно недостъпно. Копирайте съобщението по-долу и ни пишете на:",
    "Automatic sending is temporarily unavailable. Copy the message below and email us at:",
  ),
  contactCopy: t("Копирай съобщението", "Copy the message"),
  contactCopied: t("Копирано", "Copied"),
  contactOpenMail: t("Отвори в имейл приложение", "Open in email app"),
  /** `{q}` is replaced with a trimmed version of the visitor's question. */
  contactSubjectPrefill: t("Въпрос от сайта: {q}", "Question from the website: {q}"),
  contactBodyPrefill: t(
    "Здравейте,\n\nПисах на асистента в сайта и той не можа да ми отговори на този въпрос:\n\n{q}\n\nБлагодаря предварително!",
    "Hello,\n\nI asked the assistant on your website and it could not answer this question:\n\n{q}\n\nThank you in advance!",
  ),

  // ─── Validation ────────────────────────────────────────────────────────────
  required: t("Задължително поле", "Required"),
  emailInvalid: t("Невалиден имейл адрес", "Invalid email address"),
} as const;

/** Resolves one entry of `CHAT_COPY` for the active language. */
export function say(lang: Lang, pair: Pair): string {
  return lang === "en" ? pair.en : pair.bg;
}

/** `say` plus a single `{token}` substitution, for the two templated strings. */
export function sayWith(
  lang: Lang,
  pair: Pair,
  token: string,
  value: string,
): string {
  return say(lang, pair).replace(`{${token}}`, value);
}

/**
 * Human labels for the page types the retriever returns, so a card can say what
 * kind of page it links to. Keys mirror `PAGE_TYPES` exactly.
 */
export const PAGE_TYPE_LABELS: Record<PageType, Pair> = {
  home: t("Начало", "Home"),
  listing: t("Преглед", "Overview"),
  about: t("За нас", "About us"),
  product: t("Продукт", "Product"),
  impact: t("Impact", "Impact"),
  links: t("Връзки", "Links"),
  legal: t("Правна информация", "Legal"),
  initiative: t("Инициатива", "Initiative"),
  partner: t("Партньор", "Partner"),
  news: t("Новини", "News"),
  location: t("Локация", "Location"),
};
