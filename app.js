import express from "express";
import path from "path";
import fs from "fs";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { LlamaModel, LlamaContext, LlamaChatSession } from "node-llama-cpp";
import OpenAI from "openai";

const __dirname = path.resolve();
const port = parseInt(process.argv[2]);
const app = express();

app.use(express.json());
app.use(express.static(__dirname + "/"));
// app.set("trust proxy", true);

app.get("/", (req, res) => {
  req.setTimeout(0);
  res.sendFile(__dirname + "/about.html");
});
app.get("/gemenu", (req, res) => {
  req.setTimeout(0);
  res.sendFile(__dirname + "/gemenu.html");
});
app.get("/gemedi", (req, res) => {
  req.setTimeout(0);
  res.sendFile(__dirname + "/gemedi.html");
});
app.get("/gemtax", (req, res) => {
  req.setTimeout(0);
  res.sendFile(__dirname + "/gemtax.html");
});
app.get("/gemlla", (req, res) => {
  req.setTimeout(0);
  res.sendFile(__dirname + "/gemlla.html");
});
app.get("/loader.gif", (req, res) => {
  req.setTimeout(0);
  res.sendFile(__dirname + "/loader.gif");
});

const ggai = new GoogleGenerativeAI("AIzaSyDYqE43o6WJOH4mHiJkc07vTXF1E6jnIZs");
const ggmo = ggai.getGenerativeModel({ model: "gemini-pro" });
const ggco = { temperature: 0.9, topK: 1, topP: 1, maxOutputTokens: 1000 };
const ggsa = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];
const gghi = [
  [
    {
      role: "user",
      parts: [
        {
          text: "You are a nutritionist. You are to ask the user about dietary restrictions, health related issues, and foods available. Based on the information received, you are to advise the user about what to order.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Hi, I am a nutritionist. If you tell me your dietary restrictions, health related issues, and foods available, I will advise you what to order.",
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: "Dietary restrictions: Vegetarian. Health issues: Little diabetic, low good cholesterol, poor eyesight. Foods avaiable: A rice plate, wheat bread, mustard, chicken burrito, soy pasta, broccoli soup, tomato soup, and gulab jamun.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "You may order a rice plate, wheat bread, soy pasta, and broccoli soup or tomato soup. You should not order chicken burrito. You should avoid gulab jamun, but if you are fond of sweets, restrict to one gulab jamun.",
        },
      ],
    },
  ],
  [
    {
      role: "user",
      parts: [
        {
          text: "You are a pharmacist. You are to ask the user about health conditions, food factors, and medicines taken or to be taken together. Based on the information received, you are to warn the user about possible complications from the medicines.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Hi, I am a pharmacist. If you tell me your health conditions, food factors, and medicines taken or to be taken together, I can alter you about possible complications from the medicines.",
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: "Health conditions: Having some fever. Food factors: Vegetarian. Medicines taken together: Ibuprofen, Prilosec, AllerClear.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "I do not foresee any serious complications from these medicines.",
        },
      ],
    },
  ],
  [
    {
      role: "user",
      parts: [
        {
          text: "You are a tax specialist. You are to ask the user about tax jurisdiction and tax type and what question the user has. Based on that, you are to review pertinent tax laws and anser the user's question.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Hi, I am a tax specialist. If you tel me your tax jurisdiction and tax type and then pose your question, I will try to answer your question as best as I can.",
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: "Tax jurisdiction: State of Florida. Tax type: Sales tax. Question: Is renting an accommodation subject to tax?",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Renting an accommodation is subject to sales tax in Florida.",
        },
      ],
    },
  ],
  [
    {
      role: "user",
      parts: [
        {
          text: "You are a tax specialist. You are to ask the user about tax jurisdiction and tax type and what question the user has. Based on that, you are to review pertinent tax laws and anser the user's question.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Hi, I am a tax specialist. If you tel me your tax jurisdiction and tax type and then pose your question, I will try to answer your question as best as I can.",
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: "Tax jurisdiction: State of Florida. Tax type: Sales tax. Question: Is renting an accommodation subject to tax?",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Renting an accommodation is subject to sales tax in Florida.",
        },
      ],
    },
  ],
];

const model = new LlamaModel({
  modelPath: path.join("models", "llama-2-7b-chat.Q2_K.gguf"),
});
const context = new LlamaContext({ model });
const mlse = new LlamaChatSession({ context });
const ocai = new OpenAI({
  apiKey: "sk-proj-sIcYufDjMMAyqKzikgtbT3BlbkFJOGztLFfKve720G90x2im",
});

async function runGem(pagN, ipaU, inpU) {
  const pnam = path.resolve(__dirname, "posts", "pem".concat(pagN, ".html"));

  var outx = fs
    .readFileSync(pnam, { encoding: "utf-8" })
    .toString()
    .replace("</span>", "")
    .replace("</body>", "")
    .replace("</html>", "")
    .concat(
      '<div class="blus">',
      ipaU,
      " | ",
      Date.now(),
      "<br />",
      inpU,
      "</div>"
    );

  const ggch = await ggmo.startChat({ ggco, ggsa, history: gghi[pagN] });
  const ggre = (await ggch.sendMessage(inpU)).response.text();
  outx = outx.concat(
    '<div class="blgg">GEMINI | ',
    Date.now(),
    "<br />",
    ggre,
    "</div>"
  );

  if (pagN == "lla") {
    const mlre = await mlse.prompt(inpU);
    outx = outx.concat(
      '<div class="blml">Llama | ',
      Date.now(),
      "<br />",
      mlre,
      "</div>"
    );
  }

  if (pagN == "cha") {
    const occh = await ocai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }],
      model: "gpt-3.5-turbo",
    });
    const ocre = await occh.choices[0].message.content;
    outx = outx.concat(
      '<div class="blml">ChatGPT | ',
      tnow(),
      "<br />",
      ocre,
      "</div>"
    );
  }

  outx = outx.concat("<br /></span></body></html>");
  fs.writeFileSync(pnam, outx, { encoding: "utf-8" });
  return "Done";
}

app.post("/gemenu", async (req, res) => {
  req.setTimeout(0);
  try {
    const inpV = req.body?.inpU;
    if (!inpV) {
      return res.status(400).json({ error: "Invalid user input" });
    }
    const response = await runGem("enu", req.socket.remoteAddress, inpV);
    if (port == 3000) {
      console.log(response);
    }
    res.json({ response });
  } catch (error) {
    if (port == 3000) {
      console.log("Error post:", error);
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/gemedi", async (req, res) => {
  req.setTimeout(0);
  try {
    const inpV = req.body?.inpU;
    if (!inpV) {
      return res.status(400).json({ error: "Invalid user input" });
    }
    const response = await runGem("edi", req.socket.remoteAddress, inpV);
    if (port == 3000) {
      console.log(response);
    }
    res.json({ response });
  } catch (error) {
    if (port == 3000) {
      console.log("Error post:", error);
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/gemtax", async (req, res) => {
  req.setTimeout(0);
  try {
    const inpV = req.body?.inpU;
    if (!inpV) {
      return res.status(400).json({ error: "Invalid user input" });
    }
    const response = await runGem("tax", req.socket.remoteAddress, inpV);
    if (port == 3000) {
      console.log(response);
    }
    res.json({ response });
  } catch (error) {
    if (port == 3000) {
      console.log("Error post:", error);
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/gemlla", async (req, res) => {
  req.setTimeout(0);
  try {
    const inpV = req.body?.inpU;
    if (!inpV) {
      return res.status(400).json({ error: "Invalid user input" });
    }
    const response = await runGem("lla", req.socket.remoteAddress, inpV);
    if (port == 3000) {
      console.log(response);
    }
    res.json({ response });
  } catch (error) {
    if (port == 3000) {
      console.log("Error post:", error);
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, null, null, () => {
  console.log(`Server listening on port ${port}`);
});
