import { Request, Response } from "express";
// import { matchIntent } from "../utils/chatbotMatcher";
import { matchIntent,generateFallbackReply } from "../utils/chatOpenIA";
import { intents } from "../utils/chatbotIntents";
import dayjs from 'dayjs'
// const fallbackResponse =
//   "Désolé, je n'ai pas bien compris votre message. 🤔 Pouvez-vous reformuler, ou choisir une option ci-dessous ?";
// export const ResponseLogic = (req: Request, res: Response) => {
//   const userMessage = req.body?.message;
//   const repondeAt = dayjs()
//   if (typeof userMessage !== "string" || userMessage.trim() === "") {
//     res.status(400).json({ error: "Le champ 'message' est requis." });
//     return;
//   }

//   const UnderstandMessage = matchIntent(userMessage);

//   let result;
//   if (
//     UnderstandMessage?.topic 
//   ) {
//     result = UnderstandMessage.response;
//   } else {
//     result = fallbackResponse;
//   }

//   res.status(200).json({ response: result,repondeAt});
// };



// export const ResponseLogic = async (req: Request, res: Response) => {
//   const message = req.body?.message;
//   const repondeAt = dayjs();

//   if (typeof message !== "string" || message.trim() === "") {
//     res.status(400).json({ error: "Le champ 'message' est requis." });
//     return;
//   }

//   // Un seul appel au modèle renvoie à la fois le sujet et la langue.
//   const { topic, lang } = await matchIntent(message);
//   const matchedIntent = topic ? intents.find((i) => i.topic === topic) : undefined;

//   // Groq peut renvoyer un topic valide qui n'a pas encore d'intent défini
//   // (etat_actuel, previsions, cumulateur, maladies) : on retombe sur le fallback,
//   // mais toujours dans la langue de l'utilisateur.
//   const response = matchedIntent?.response[lang] ?? fallbackResponse[lang];

//   res.status(200).json({
//     matched: Boolean(matchedIntent),
//     topic: topic ?? null,
//     lang,
//     response,
//     repondeAt,
//   });
// };


export const ResponseLogic = async (req: Request, res: Response) => {
  const message = req.body?.message;
  const repondeAt = dayjs();

  if (typeof message !== "string" || message.trim() === "") {
    res.status(400).json({ error: "Le champ 'message' est requis." });
    return;
  }

  const { topic, lang } = await matchIntent(message);
  const matchedIntent = topic
    ? intents.find((i) => i.topic === topic)
    : undefined;

  // Sujet connu → réponse figée, jamais générée.
  if (matchedIntent) {
    res.status(200).json({
      matched: true,
      topic,
      lang,
      // response est un objet {fr, en, ar} : on choisit la bonne langue.
      response: matchedIntent.response[lang],
      repondeAt,
    });
    return;
  }

  // Sujet inconnu, ou topic valide sans intent défini (etat_actuel,
  // previsions, cumulateur, maladies) → réponse générée mais encadrée.
  const generated = await generateFallbackReply(message, lang);

  res.status(200).json({
    matched: false,
    topic: topic ?? null,
    lang,
    response: generated,
    showMainMenu: true, // indice pour le frontend : réafficher le menu
    repondeAt,
  });
};
