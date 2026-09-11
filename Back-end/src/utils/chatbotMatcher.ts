import Fuse from 'fuse.js'
import {intents} from './chatbotIntents'

const fuse = new Fuse(intents, {
  keys: ['phrases'],
  threshold: 0.4,
  includeScore: true,
  ignoreLocation: true
})

export const matchIntent = (userMessage: string) => {
  const normalized = userMessage
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const results = fuse.search(normalized);

  if (results.length > 0) {
    return results[0].item; 
  }
  return null;
};

