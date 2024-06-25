import axios from 'axios';
import { readFile } from 'node:fs/promises';
import fs from 'fs'

const DEBUG_READ_FROM_LOCAL_FILE = 0;

async function kosmos_query(query, imageBuffer) {
  const invokeUrl = "https://ai.api.nvidia.com/v1/vlm/microsoft/kosmos-2";

  const headers = {
    "Authorization": "Bearer " + process.env.NVIDIA_API_KEY,
    "Accept": "application/json"
  };

  var imageB64;

  if (DEBUG_READ_FROM_LOCAL_FILE) {
    const image_data = await readFile("sample_image.jpeg");
    imageB64 = Buffer.from(image_data).toString('base64');
  } else {
    imageB64 = imageBuffer.toString('base64');
  }

  console.log("imageB64.length:", imageB64.length);

  if (imageB64.length > 180_000) {
    throw new Error("To upload larger images, use the assets API (see docs)");
  }

  const payload = {
    "messages": [
      {
        "role": "user",
        "content": `${query} <img src="data:image/png;base64,${imageB64}" />`
      }
    ],
    "max_tokens": 1024,
    "temperature": 0.20,
    "top_p": 0.20
  };

  const response = await axios.post(invokeUrl, payload, { headers: headers, responseType: 'json' });
  // console.log("nvidia_api response:\n", JSON.stringify(response.data));
  return(response.data["choices"][0]["message"]["content"]);
}

export default kosmos_query;