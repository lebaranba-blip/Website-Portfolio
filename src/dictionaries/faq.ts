/**
 * FAQ. Ответы — со слов Дмитрия (2026-11-16).
 * Вопрос без ответа (пустое `a`) на сайте не показывается.
 */
export const faqDict = {
  ru: {
    eyebrow: "— 06 Вопросы",
    heading: "Частые вопросы",
    items: [
      { q: "Сколько правок входит в работу?", a: "Три круга правок входят в стоимость. Дальше — по ставке." },
      { q: "Какие сроки?", a: "От одного до трёх дней, иногда дольше. Зависит от сложности проекта." },
      { q: "Кому принадлежат права на готовый ролик?", a: "Заказчику, который его оплатил." },
      { q: "Можно ли использовать AI-видео в коммерческой рекламе?", a: "Да, можно." },
      { q: "Как устроена оплата?", a: "Предоплата 50%. Работаю по договору через ЭДО, можно оплатить криптовалютой." },
    ],
  },
  en: {
    eyebrow: "— 06 FAQ",
    heading: "Questions",
    items: [
      { q: "How many revisions are included?", a: "Three rounds of revisions are included in the price. After that, at my rate." },
      { q: "What are the timelines?", a: "One to three days, sometimes longer. It depends on the complexity of the project." },
      { q: "Who owns the rights to the final film?", a: "The client who paid for it." },
      { q: "Can AI video be used in commercial advertising?", a: "Yes, it can." },
      { q: "How does payment work?", a: "50% upfront. I work under a contract signed electronically, and crypto payments are accepted too." },
    ],
  },
} as const
