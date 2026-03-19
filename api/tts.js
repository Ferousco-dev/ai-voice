function recitationStyle(text) {
  return text.replace(/\./g, " ... ").replace(/,/g, " , ").replace(/a/g, "aa").replace(/e/g, "ee");
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID || "WrGuwERIZ4vIdpOwsGUC";

    if (!apiKey) {
      return res.status(500).json({ error: "Missing ELEVENLABS_API_KEY" });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const text = body?.text;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    const styledText = recitationStyle(text);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: styledText,
          model_id: "eleven_turbo_v2_5",
        }),
      }
    );

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      return res.status(response.status).json({
        error: `API Error ${response.status}`,
        details: errorData,
      });
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString("base64");
    return res.json({
      audio: `data:audio/mpeg;base64,${base64Audio}`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Server error" });
  }
};
