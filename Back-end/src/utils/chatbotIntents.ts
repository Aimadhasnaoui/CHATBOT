export const LANGS = ["fr", "en", "ar"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "fr";

/** Une réponse par langue supportée. */
export type LocalizedResponse = Record<Lang, string>;

export const fallbackResponse: LocalizedResponse = {
  fr: "Désolé, je n'ai pas bien compris votre message. 🤔 Pouvez-vous reformuler, ou choisir une option ci-dessous ?",
  en: "Sorry, I didn't quite understand your message. 🤔 Could you rephrase, or pick an option below?",
  ar: "عذراً، لم أفهم رسالتك جيداً. 🤔 هل يمكنك إعادة الصياغة، أو اختيار أحد الخيارات أدناه؟",
};

type Intent = {
  topic: string;
  phrases: string[];
  response: LocalizedResponse;
};

export const intents: Intent[] = [
  {
    topic: "greeting",
    phrases: [
      "bonjour",
      "salut",
      "bonsoir",
      "coucou",
      "hello",
      "hi",
      "bonjour a tous",
      "salam",
      "hey",
      "good morning",
      "good evening",
      "مرحبا",
      "السلام عليكم",
      "صباح الخير",
      "مساء الخير",
      "اهلا",
    ],
    response: {
      fr: "Bonjour ! 👋 Comment puis-je vous aider aujourd'hui ?",
      en: "Hello! 👋 How can I help you today?",
      ar: "مرحباً! 👋 كيف يمكنني مساعدتك اليوم؟",
    },
  },
  {
    topic: "thanks",
    phrases: [
      "merci",
      "merci beaucoup",
      "je vous remercie",
      "thanks",
      "thank you",
      "merci bcp",
      "thx",
      "thanks a lot",
      "شكرا",
      "شكرا جزيلا",
      "متشكر",
    ],
    response: {
      fr: "Avec plaisir ! 😊 N'hésitez pas si vous avez d'autres questions.",
      en: "You're welcome! 😊 Feel free to ask if you have any other questions.",
      ar: "على الرحب والسعة! 😊 لا تتردد في طرح أي أسئلة أخرى.",
    },
  },
  {
    topic: "small_talk_how_are_you",
    phrases: [
      "comment ca va",
      "ca va",
      "comment vas tu",
      "comment allez vous",
      "tu vas bien",
      "comment tu vas",
      "how are you",
      "how's it going",
      "how are you doing",
      "كيف حالك",
      "كيفك",
      "شلونك",
    ],
    response: {
      fr: "Je vais très bien, merci ! 😄 Et vous, comment puis-je vous aider aujourd'hui ?",
      en: "I'm doing great, thanks! 😄 And you — how can I help you today?",
      ar: "أنا بخير، شكراً لك! 😄 وأنت، كيف يمكنني مساعدتك اليوم؟",
    },
  },
  {
    topic: "who_are_you",
    phrases: [
      "qui es tu",
      "c'est quoi ce chatbot",
      "tu es qui",
      "qui es-tu",
      "t'es qui",
      "c'est quoi ton nom",
      "comment tu t'appelles",
      "who are you",
      "what is this bot",
      "what's your name",
      "من أنت",
      "ما هذا البوت",
      "ما اسمك",
    ],
    response: {
      fr: "Je suis l'assistant virtuel d'AgroTech 🌱 — je peux vous aider à trouver des infos sur vos stations, prévisions, cumuls et risques de maladies. Comment puis-je vous aider aujourd'hui ?",
      en: "I'm the AgroTech virtual assistant 🌱 — I can help you find information about your stations, forecasts, accumulations and disease risks. How can I help you today?",
      ar: "أنا المساعد الافتراضي لـ AgroTech 🌱 — يمكنني مساعدتك في الحصول على معلومات حول محطاتك، التوقعات الجوية، التراكمات ومخاطر الأمراض. كيف يمكنني مساعدتك اليوم؟",
    },
  },
  {
    topic: "what_can_you_do",
    phrases: [
      "que peux tu faire",
      "tu peux faire quoi",
      "aide",
      "help",
      "qu'est ce que tu sais faire",
      "comment ca marche",
      "what can you do",
      "how does this work",
      "what do you know",
      "ماذا يمكنك أن تفعل",
      "مساعدة",
      "كيف يعمل هذا",
    ],
    response: {
      fr: "Je peux vous renseigner sur : l'état actuel de vos stations, les prévisions météo, les cumuls (degrés-jours), et les risques de maladies. Que voulez-vous savoir ?",
      en: "I can tell you about: the current state of your stations, weather forecasts, accumulations (degree-days), and disease risks. What would you like to know?",
      ar: "يمكنني إخبارك عن: الحالة الحالية لمحطاتك، توقعات الطقس، التراكمات (الدرجات اليومية)، ومخاطر الأمراض. ماذا تريد أن تعرف؟",
    },
  },
  {
    topic: "goodbye",
    phrases: [
      "au revoir",
      "bye",
      "a bientot",
      "a plus",
      "bonne journee",
      "je m'en vais",
      "ciao",
      "goodbye",
      "see you",
      "bye bye",
      "مع السلامة",
      "إلى اللقاء",
      "وداعا",
    ],
    response: {
      fr: "Au revoir ! 👋 N'hésitez pas à revenir si vous avez besoin d'aide.",
      en: "Goodbye! 👋 Feel free to come back if you need any help.",
      ar: "إلى اللقاء! 👋 لا تتردد في العودة إذا احتجت إلى أي مساعدة.",
    },
  },
];
