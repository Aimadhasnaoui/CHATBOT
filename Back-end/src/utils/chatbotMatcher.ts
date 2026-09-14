import Fuse from "fuse.js";
import { intents } from "./chatbotIntents";

type PhraseEntry = { topic: string; phrase: string };

const corpus: PhraseEntry[] = intents.flatMap((intent) =>
  intent.phrases.map((phrase) => ({ topic: intent.topic, phrase })),
);

const fuse = new Fuse(corpus, {
  keys: ["phrase"],
  threshold: 0.4,
  includeScore: true,
  ignoreLocation: true,
});

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export const matchIntent = (userMessage: string): string | null => {
  const results = fuse.search(normalize(userMessage));
  return results.length > 0 ? results[0].item.topic : null;
};
