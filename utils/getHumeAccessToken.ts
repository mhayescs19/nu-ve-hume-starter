import 'server-only'; // disables excution of code on client side
import { fetchAccessToken } from "@humeai/voice";
import {Hume, HumeClient} from 'hume';

export const getHumeAccessToken = async () => {
    const accessToken = await fetchAccessToken({
    apiKey: String(process.env.HUME_API_KEY),
    clientSecret: String(process.env.HUME_CLIENT_SECRET),
  });

  if (accessToken === 'undefined') {
    return null;
  }

  return accessToken ?? null;
}