const express = require("express");
const cors = require("cors");

(async () => {
  const fetch = (await import("node-fetch")).default;

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Debug middleware
  app.use((req, res, next) => {
    console.log(
      `📨 [${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`
    );
    next();
  });

  app.use(express.static(__dirname)); // Serve static files (index.html, etc.)

  // 🔑 PUT YOUR ElevenLabs API KEY HERE
  const API_KEY =
    "9b69c8cc26c685a18d33ec7afed653d7fd148971e0c1cd18ddaa5e902512f410";

  // 🎤 Voice ID (you can change later)
  const VOICE_ID = "WrGuwERIZ4vIdpOwsGUC";

  function recitationStyle(text) {
    return text
      .replace(/\./g, " ... ")
      .replace(/,/g, " , ")
      .replace(/a/g, "aa")
      .replace(/e/g, "ee");
  }

  app.post("/tts", async (req, res) => {
    try {
      console.log("📝 [TTS Request] Received request");
      let text = req.body.text;
      console.log("📝 [TTS Request] Text:", text);
      let styledText = recitationStyle(text);
      console.log("🎵 [TTS Request] Styled text:", styledText);

      console.log(
        "🔗 [TTS Request] Calling ElevenLabs API with Voice ID:",
        VOICE_ID
      );
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: styledText,
            model_id: "eleven_turbo_v2_5",
          }),
        }
      );

      console.log("✅ [TTS Request] API Response Status:", response.status);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.error(
            "❌ [TTS Request] API Error (JSON):",
            JSON.stringify(errorData, null, 2)
          );
        } catch {
          errorData = await response.text();
          console.error("❌ [TTS Request] API Error (Text):", errorData);
        }
        return res.status(response.status).json({
          error: `API Error ${response.status}`,
          details: errorData,
          message: "Check your ElevenLabs API key in server.js",
        });
      }

      const audioBuffer = await response.arrayBuffer();
      console.log(
        "🎧 [TTS Request] Audio buffer size:",
        audioBuffer.byteLength,
        "bytes"
      );
      const base64Audio = Buffer.from(audioBuffer).toString("base64");
      console.log("✨ [TTS Request] Base64 encoded, sending response");

      res.json({
        audio: `data:audio/mpeg;base64,${base64Audio}`,
      });
    } catch (error) {
      console.error("💥 [TTS Request] Error:", error.message);
      console.error("💥 [TTS Request] Full error:", error);
      res.status(500).send("Error generating audio: " + error.message);
    }
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
