import axios from "axios";
import { env } from "../config/env.config";

type GetDataStationParams = {
  dateFrom?: string;
  dateTo?: string;
  stationId?: string | number;
  type?: string;
  sensors?: string[];
};

export const GetDataStation = async (params?: GetDataStationParams): Promise<any> => {
  const date_from = params?.dateFrom || "2026-09-15";
  const date_to = params?.dateTo || "2026-09-15";
  const station_id = params?.stationId || 25;
  const type = params?.type || "brute";
  const sensorsQuery = params?.sensors && params.sensors.length > 0
    ? params.sensors.map((s) => `sensors[]=${s}`).join("&")
    : "sensors[]=eto";

  const token = "922|grEsKp4JyY9Mys0Xixf74pbPE1W9YtnshLpXSOwY7fbcc668";

  // Normalize baseUrl to remove trailing slash if present (prevents // double-slash 404 errors)
  const baseUrl = (env.EXTRNEL_API_URL || "https://agrotech2.yobeen.com/api").replace(/\/+$/, "");

  const url = `${baseUrl}/data_meteo_filter?date_from=${date_from}&date_to=${date_to}&type=${type}&${sensorsQuery}&station_id=${station_id}`;

  const res = await axios.get<any>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    timeout: 15000,
  });
  return res.data;
};
