import OpenAI from "openai";
import { env } from "../config/env.config";
import {
  LANGS,
  DEFAULT_LANG,
  fallbackResponse,
  type Lang,
} from "./chatbotIntents";

const client = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
  // Par défaut le SDK attend 10 min et réessaie 2 fois (soit 30 min et
  // 3 appels facturés). La classification prend ~1 s : on coupe court.
  timeout: 8000,
  maxRetries: 1,
});

// Groq a retiré llama-3.3-70b-versatile. Vérifier les modèles disponibles avec :
// curl https://api.groq.com/openai/v1/models -H "Authorization: Bearer $GROQ_API_KEY"
const MODEL = "openai/gpt-oss-20b";

const VALID_TOPICS = [
  "etat_actuel",
  "previsions",
  "cumulateur",
  "maladies",
  "greeting",
  "thanks",
  "small_talk_how_are_you",
  "who_are_you",
  "what_can_you_do",
  "goodbye",
  "unknown",
];

export type IntentMatch = {
  topic: string | null;
  lang: Lang;
};

const SYSTEM_PROMPT = `Tu classes le message d'un utilisateur et tu détectes sa langue.

Réponds UNIQUEMENT avec un objet JSON de cette forme, sans explication :
{"topic": "<topic>", "lang": "<lang>"}

"topic" doit être exactement l'une de ces valeurs :
${VALID_TOPICS.join(", ")}

- etat_actuel: questions sur l'état actuel ou l'historique d'une station (température, humidité, etc.)
- previsions: questions sur la météo à venir (demain, cette semaine, pluie prévue...)
- cumulateur: questions sur les degrés-jours, heures de froid, cumuls
- maladies: questions sur les risques de maladies (cératite, feu bactérien)
- greeting: salutations (bonjour, salut, hello, مرحبا...)
- thanks: remerciements
- small_talk_how_are_you: questions du type "comment ça va"
- who_are_you: questions sur l'identité du bot
- what_can_you_do: questions sur les capacités du bot
- goodbye: au revoir
- unknown: si le message ne correspond à aucune catégorie

"lang" doit être exactement l'une de ces valeurs : ${LANGS.join(", ")}
C'est la langue DU MESSAGE DE L'UTILISATEUR (fr = français, en = anglais, ar = arabe).`;
/** Le modèle suit mal un code ISO ; il lui faut le nom de la langue. */
const LANG_NAMES: Record<Lang, string> = {
  fr: "FRANÇAIS",
  en: "ENGLISH (anglais)",
  ar: "ARABIC / العربية (arabe)",
};

const FALLBACK_SYSTEM_PROMPT = `Tu es l'assistant du chatbot AgroTech.
Réponds brièvement et amicalement (1-2 phrases max) au message de l'utilisateur.

RÈGLE ABSOLUE — LANGUE : ta réponse doit être rédigée entièrement en {LANG}.
Peu importe la langue de ces instructions : réponds en {LANG}, et uniquement en {LANG}.

Règles strictes :
- Ne donne AUCUNE information technique sur les stations, prévisions, cumuls ou maladies — 
  pour ces sujets, dis seulement que tu peux les aider via le menu
- Reste dans le ton d'un assistant agricole professionnel mais chaleureux
- Si le message n'a rien à voir avec de la conversation normale, reste vague et redirige poliment vers le menu

Rappel : la réponse doit être en {LANG}.`;
const isLang = (value: unknown): value is Lang =>
  typeof value === "string" && (LANGS as readonly string[]).includes(value);

const TITLE_SYSTEM_PROMPT = `Tu résumes le premier message d'une conversation en un titre court.

RÈGLE ABSOLUE — LANGUE : le titre doit être rédigé entièrement en {LANG}.

Règles strictes :
- 3 à 6 mots maximum
- Pas de ponctuation finale, pas de guillemets
- Pas de préfixe du type "Titre :"
- Résume le sujet du message, ce n'est pas une réponse

Réponds UNIQUEMENT avec le titre, rien d'autre.`;


// src/services/chatbotMatcher.ts (add this to the same file, below matchIntent)

export const generateFallbackReply = async (
  userMessage: string,
  lang: Lang
): Promise<string> => {
  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: FALLBACK_SYSTEM_PROMPT.replaceAll("{LANG}", LANG_NAMES[lang]),
        },
        { role: "user", content: userMessage },
      ],
      max_tokens: 256,
      reasoning_effort: "low",
      temperature: 0.7, // a bit of natural variation is fine here, unlike classification
    });

    const reply = response.choices[0].message.content?.trim();
    // Si le modèle ne renvoie rien d'exploitable, on retombe sur le texte figé.
    return reply || fallbackResponse[lang];
  } catch (error) {
    console.error("Groq fallback generation failed:", error);
    return fallbackResponse[lang];
  }
};



/** Titre court généré à partir du tout premier message d'une conversation. */
export const generateTitle = async (
  userMessage: string,
  lang: Lang,
): Promise<string> => {
  const fallbackTitle = userMessage.trim().slice(0, 40);
  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: TITLE_SYSTEM_PROMPT.replaceAll("{LANG}", LANG_NAMES[lang]),
        },
        { role: "user", content: userMessage },
      ],
      max_tokens: 32,
      reasoning_effort: "low",
      temperature: 0.3,
    });

    const title = response.choices[0].message.content
      ?.trim()
      .replace(/^["'«]+|["'»]+$/g, "");
    return title || fallbackTitle;
  } catch (error) {
    console.error("Groq title generation failed:", error);
    return fallbackTitle;
  }
};

export const matchIntent = async (userMessage: string): Promise<IntentMatch> => {
  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
      // gpt-oss consomme des tokens de raisonnement avant d'écrire sa réponse :
      // en dessous de ~100, le contenu revient vide.
      max_tokens: 256,
      reasoning_effort: "low",
      temperature: 0,
    });

    const raw = response.choices[0].message.content;
    if (!raw) return { topic: null, lang: DEFAULT_LANG };

    const parsed = JSON.parse(raw) as { topic?: unknown; lang?: unknown };

    // La langue est conservée même quand le topic est inconnu : le message
    // d'erreur doit rester dans la langue de l'utilisateur.
    const lang = isLang(parsed.lang) ? parsed.lang : DEFAULT_LANG;

    const topic =
      typeof parsed.topic === "string" &&
      VALID_TOPICS.includes(parsed.topic) &&
      parsed.topic !== "unknown"
        ? parsed.topic
        : null;

    return { topic, lang };
  } catch (error) {
    console.error("Groq intent matching failed:", error);
    // fail safe — fallback dans la langue par défaut
    return { topic: null, lang: DEFAULT_LANG };
  }
};
