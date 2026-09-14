export const fallbackResponse =
  "Désolé, je n'ai pas bien compris votre message. 🤔 Pouvez-vous reformuler, ou choisir une option ci-dessous ?";

export type Intent = {
  topic: string;
  label: string;
  phrases: string[];
  response: string;
  /** Intents "d'accueil" : la réponse est accompagnée du menu d'options. */
  intro?: boolean;
  /** Apparaît comme option proposée dans le menu guidé. */
  menu?: boolean;
};
export type Menu ={
  descepretion:string,
  topic:string
}

export const FirstMenu:Menu[] = [
  {
    descepretion:'les Données station 📡',
    topic:'donnestation'
  },
  {
    descepretion:'les Prévisions des station 🌦️',
    topic:'previsions'
  }
]

export const intents: Intent[] = [
  {
    topic: "greeting",
    label: "Salutation",
    phrases: ["bonjour", "salut", "bonsoir", "coucou", "bonjour a tous"],
    response: "Bonjour ! 👋 Comment puis-je vous aider aujourd'hui ?",
  },
  {
    topic: "thanks",
    label: "Remerciement",
    phrases: ["merci", "merci beaucoup", "je vous remercie", "merci bcp"],
    response: "Avec plaisir ! 😊 N'hésitez pas si vous avez d'autres questions.",
  },
  {
    topic: "Intro",
    label: "Qui es-tu ?",
    phrases: [
      "qui es tu",
      "c'est quoi ce chatbot",
      "tu es qui",
      "qui es-tu",
      "t'es qui",
      "c'est quoi ton nom",
      "comment tu t'appelles",
    ],
    response:
      "Je suis AgroBot 🌱, votre compagnon agricole — je réponds à vos questions 24h/7j sur l'état de vos stations, les prévisions, Comment puis-je vous aider aujourd'hui ?",
    intro: true,
  },
  {
    topic: "donnestation",
    label: "Données station 📡",
    phrases: [
      "etat de la station",
      "etat actuel",
      "donnees de la station",
      "donnees actuelles",
      "temperature actuelle",
      "humidite actuelle",
      "etat de mes stations",
      "quelles sont les donnees de ma station",
    ],
    response:
      "La consultation des données en direct de vos stations arrive bientôt 📡. Cette section affichera prochainement la température, l'humidité et l'état de chaque station en temps réel.",
    menu: true,
  },
  {
    topic: "previsions",
    label: "les Prévisions des station 🌦️",
    phrases: [
      "previsions",
      "previsions meteo",
      "quel temps demain",
      "meteo de demain",
      "quel temps fera t il",
      "previsions de la semaine",
      "va t il pleuvoir",
    ],
    response:
      "Les prévisions météo par parcelle arrivent bientôt 🌦️. Cette section affichera prochainement les prévisions des prochains jours pour vos stations.",
    menu: true,
  },
  {
    topic: "goodbye",
    label: "Au revoir",
    phrases: ["au revoir", "a bientot", "a plus", "bonne journee", "je m'en vais", "ciao"],
    response: "Au revoir ! 👋 N'hésitez pas à revenir si vous avez besoin d'aide.",
  },
];

/** Une option de menu proposée à l'utilisateur pour guider la conversation. */
export type MenuOption = { topic: string; label: string };

/** Bouton joint à une réponse d'accueil ou de secours : révèle le menu d'options. */
export type SuggestedAction = { label: string; options: MenuOption[] };

export const MENU_ACTION_LABEL = "Voir les options";

export const getMenuOptions = (): MenuOption[] =>
  intents
    .filter((intent) => intent.menu)
    .map((intent) => ({ topic: intent.topic, label: intent.label }));

/** Le menu proposé à l'utilisateur dès la création d'une conversation. */
// export const FirstMenu: MenuOption[] = getMenuOptions();
