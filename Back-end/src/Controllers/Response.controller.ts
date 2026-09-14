import { Request, Response } from "express";
// import { matchIntent } from "../utils/chatbotMatcher";
import { matchIntent, generateFallbackReply, generateTitle } from "../utils/chatOpenIA";
import { intents } from "../utils/chatbotIntents";
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

  const { topic, lang } = await matchIntent(message);
  const matchedIntent = topic
    ? intents.find((i) => i.topic === topic)
    : undefined;

  // Sujet connu → réponse figée, jamais générée. Sujet inconnu, ou topic
  // valide sans intent défini (etat_actuel, previsions, cumulateur,
  // maladies) → réponse générée mais encadrée.
  const responseText = matchedIntent
    ? matchedIntent.response[lang]
    : await generateFallbackReply(message, lang);

  let conversationId = requestConversationId;
  if (!conversationId) {
    // Le titre n'est généré qu'à la création : les messages suivants de la
    // même conversation réutilisent conversationId et ne le régénèrent pas.
    const title = await generateTitle(message, lang);
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
      lang,
      response: responseText,
      createdAt: repondeAt.toDate(),
    },
  });

  res.status(200).json({
    matched: Boolean(matchedIntent),
    topic: topic ?? null,
    lang,
    response: responseText,
    showMainMenu: !matchedIntent, // indice pour le frontend : réafficher le menu
    repondeAt,
    conversationId,
  });
};
