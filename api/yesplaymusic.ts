import axios, { AxiosInstance } from "axios";

const baseURL = "http://localhost:3000/";

const request: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
});

export async function cacheAudio(id: number, audio: string) {
  const file = await axios.get(audio, { responseType: "arraybuffer" });
  if (file.status !== 200) return;

  const formData = new FormData();
  const blob = new Blob([file.data], { type: "multipart/form-data" });
  formData.append("file", blob);

  request.post(`/audio/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params: {
      url: audio,
    },
  });
}
