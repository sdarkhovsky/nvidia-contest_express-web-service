import axios from 'axios';
import { readFile } from 'node:fs/promises';


function kosmos_query(query) {
  const invokeUrl = "https://ai.api.nvidia.com/v1/vlm/microsoft/kosmos-2";

  const headers = {
    "Authorization": "Bearer " + process.env.NVIDIA_API_KEY,
    "Accept": "application/json"
  };

  readFile("sample_image.jpeg")
    .then(data => {
      const imageB64 = Buffer.from(data).toString('base64');
      if (imageB64.length > 180_000) {
        throw new Error("To upload larger images, use the assets API (see docs)");
      }

      const payload = {
        "messages": [
          {
            "role": "user",
            "content": `Who is in this photo? <img src="data:image/png;base64,${imageB64}" />`
          }
        ],
        "max_tokens": 1024,
        "temperature": 0.20,
        "top_p": 0.20
      };

      return axios.post(invokeUrl, payload, { headers: headers, responseType: 'json' });
    })
    .then(response => {
      console.log(JSON.stringify(response.data));
    })
    .catch(error => {
      console.error(error);
    });
}

export default kosmos_query;