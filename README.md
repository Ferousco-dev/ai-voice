# ReciteAI 🎙️

> Turn any text into natural, expressive speech — a lightweight AI voice recitation web app powered by ElevenLabs.

<p align="left">
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/API-ElevenLabs-000000" alt="ElevenLabs">
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel" alt="Vercel">
</p>

**Live demo:** [ai-voice-umber.vercel.app](https://ai-voice-umber.vercel.app)

## Overview

ReciteAI takes text input and returns high-quality, human-like audio using the ElevenLabs text-to-speech API. It applies a light "recitation style" pass to the text (pacing/pauses) before synthesis so the output sounds more natural when read aloud.

## Features

- ✍️ Paste any text and generate spoken audio instantly
- 🗣️ Natural, expressive voices via ElevenLabs
- 🎛️ Recitation-style formatting for better pacing
- ⚡ Simple Express backend that proxies the TTS API
- 🌐 Static single-page frontend, deployable anywhere

## Tech Stack

- **Backend:** Node.js, Express, `node-fetch`, CORS
- **Frontend:** Vanilla HTML / CSS / JavaScript
- **TTS:** ElevenLabs API
- **Hosting:** Vercel

## Getting Started

```bash
# clone and install
git clone https://github.com/Ferousco-dev/ai-voice.git
cd ai-voice
npm install

# run
npm start
# then open http://localhost:3000
```

### Configuration

Set your ElevenLabs API key as an environment variable (do **not** commit it):

```bash
export ELEVENLABS_API_KEY="your_key_here"
```

## License

ISC
