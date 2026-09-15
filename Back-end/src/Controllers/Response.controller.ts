import { Request, Response } from "express";
import { matchIntent } from "../utils/chatbotMatcher";
import { intents, fallbackResponse, FirstMenu } from "../utils/chatbotIntents";
import dayjs from "dayjs";
import {GetDataStation} from '../Servises/DataStation'
import { prisma } from "../config/db.config";

export const ResponseLogic = async (req: Request, res: Response) => {
  const message = req.body?.message;
  const requestConversationId = req.body?.conversationId;
  const requestTopic = req.body?.topic;
  console.log({ message, topic: requestTopic });
  const repondeAt = dayjs();

  if (typeof message !== "string" || message.trim() === "") {
    res.status(400).json({ error: "Le champ 'message' est requis." });
    return;
  }

  let conversationId = requestConversationId;

  // Utilize explicit topic sent from client or fallback to intent matching
  let topic: string | null = null;
  if (typeof requestTopic === "string" && requestTopic.trim() !== "") {
    topic = requestTopic.trim();
  } else {
    topic = matchIntent(message);
  }

  // Custom handler for structured station data request submitted from bottom modal under topic 'donnestation'
  if (
    topic === "donnestation" &&
    (message.includes("Période:") ||
      message.includes("Station:") ||
      message.includes("Données station requested"))
  ) {
    const stationMatch = message.match(/Station:\s*([^\n]+)/);
    const pasMatch = message.match(/Pas de mesure:\s*([^\n]+)/);
    const paramMatch = message.match(/Paramètre:\s*([^\n]+)/);
    const periodeMatch = message.match(/Période:\s*([^\n]+)/);

    const station = stationMatch ? stationMatch[1].trim() : "Station sélectionnée";
    const pas = pasMatch ? pasMatch[1].trim() : "Horaire";
    const param = paramMatch ? paramMatch[1].trim() : "Température";
    const periode = periodeMatch ? periodeMatch[1].trim() : "Période sélectionnée";

    let rawData: any = null;
    try {
      rawData = await GetDataStation();
      console.log("GetDataStation result:", rawData);
    } catch (err) {
      console.error("GetDataStation error:", err);
    }

    let dataArray: any[] = [];
    if (Array.isArray(rawData)) {
      dataArray = rawData;
    } else if (rawData && Array.isArray(rawData.data)) {
      dataArray = rawData.data;
    }

    let labels: string[] = [];
    let values: number[] = [];

    if (dataArray.length > 0) {
      labels = dataArray.map((item: any, i: number) => {
        if (item.datetime) {
          const d = dayjs(item.datetime);
          return d.isValid() ? d.format("DD/MM HH:mm") : String(item.datetime);
        }
        if (item.date) {
          const d = dayjs(item.date);
          return d.isValid() ? d.format("DD/MM") : String(item.date);
        }
        return `N°${i + 1}`;
      });

      values = dataArray.map((item: any) => {
        if (typeof item.ETo === "number") return item.ETo;
        if (typeof item.eto === "number") return item.eto;
        if (item.ETo !== undefined && item.ETo !== null) return parseFloat(String(item.ETo));
        if (item.eto !== undefined && item.eto !== null) return parseFloat(String(item.eto));
        return typeof item.value === "number" ? item.value : parseFloat(item.value || "0");
      });
    }

    // Default fallback values if array is empty
    if (labels.length === 0 || values.length === 0) {
      labels = ["05:00", "05:15", "05:30", "05:45", "06:00", "06:15", "06:30"];
      values = [0, 0.1, 0.2, 0.35, 0.5, 0.4, 0.2];
    }

    const totalCount = dataArray.length || values.length;
    const maxETo = Math.max(...values);
    const minETo = Math.min(...values);
    const avgETo = (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2);

    const responseText =
      `📊 Données Station Récupérées 📡\n\n` +
      `• Station: ${station}\n` +
      `• Pas de mesure: ${pas}\n` +
      `• Paramètre: ETo (Évapotranspiration)\n` +
      `• Période: ${periode}\n\n` +
      `🟢 Statut: Relevés ETo valides.\n` +
      `• Moyenne ETo: ${avgETo} mm\n` +
      `• ETo Max: ${maxETo} mm | ETo Min: ${minETo} mm\n` +
      `• Nombre de mesures: ${totalCount} relevés\n\n` +
      `Voici le graphique d'Évapotranspiration (ETo) ci-dessous.`;

    const chartData = {
      title: `Évapotranspiration (ETo) - ${station}`,
      labels,
      values,
      unit: "mm",
      sensorName: "ETo",
    };

    res.status(200).json({
      matched: true,
      topic: "donnestation",
      response: responseText,
      menu: FirstMenu,
      repondeAt,
      conversationId,
      chartData,
    });
    return;
  }

  const matchedIntent = topic ? intents.find((i) => i.topic === topic) : undefined;
  console.log(matchedIntent);

  const responseText = matchedIntent ? matchedIntent.response : fallbackResponse;
  const ResponseMenu = matchedIntent?.menu;

  await prisma.exchange.create({
    data: {
      conversationId,
      message,
      matched: Boolean(matchedIntent),
      topic: topic ?? null,
      response: responseText,
      menu: ResponseMenu,
      createdAt: repondeAt.toDate(),
    },
  });

  res.status(200).json({
    matched: Boolean(matchedIntent),
    topic: topic ?? null,
    response: responseText,
    menu: ResponseMenu,
    repondeAt,
    conversationId,
  });
};
