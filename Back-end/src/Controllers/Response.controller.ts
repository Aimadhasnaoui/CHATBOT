import { Request, Response } from "express";
import { matchIntent } from "../utils/chatbotMatcher";
import {
  intents,
  fallbackResponse,
  getMenuOptions,
  MENU_ACTION_LABEL,
} from "../utils/chatbotIntents";
import dayjs from "dayjs";

import { prisma } from "../config/db.config";

export const ResponseLogic = async (req: Request, res: Response) => {
  const message = req.body?.message;
  const requestConversationId = req.body?.conversationId;
  const repondeAt = dayjs();

  if (typeof message !== "string" || message.trim() === "") {
    res.status(400).json({ error: "Le champ 'message' est requis." });
    return;
  }

  const topic = matchIntent(message);
  const matchedIntent = topic ? intents.find((i) => i.topic === topic) : undefined;

  // Sujet connu → réponse figée. Sujet inconnu, ou intent d'accueil → réponse
  // accompagnée d'un bouton qui révèle le menu d'options pour guider l'utilisateur.
  const responseText = matchedIntent ? matchedIntent.response : fallbackResponse;
  const action =
    !matchedIntent || matchedIntent.intro
      ? { label: MENU_ACTION_LABEL, options: getMenuOptions() }
      : undefined;

  let conversationId = requestConversationId;
  if (!conversationId) {
    // Le titre n'est généré qu'à la création : les messages suivants de la
    // même conversation réutilisent conversationId et ne le régénèrent pas.
    const title = matchedIntent ? matchedIntent.label : message.trim().slice(0, 40);
    const newConversation = await prisma.conversation.create({
      data: { userId: "11", Title: title },
    });
    conversationId = newConversation.id;
  }

  await prisma.exchange.create({
    data: {
      conversationId,
      message,
      matched: Boolean(matchedIntent),
      topic: topic ?? null,
      response: responseText,
      createdAt: repondeAt.toDate(),
    },
  });

  res.status(200).json({
    matched: Boolean(matchedIntent),
    topic: topic ?? null,
    response: responseText,
    action,
    repondeAt,
    conversationId,
  });
};
