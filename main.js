const BACKEND_URL = "https://btcanalyzer.onrender.com";

// ✅ Load Teachable Machine model using the correct loader
let model;
async function loadModel() {
  try {
    model = await tf.loadLayersModel("https://teachablemachine.withgoogle.com/models/jD_JuC-x7/model.json");
    console.log("✅ Model loaded.");
  } catch (err) {
    console.error("❌ Failed to load model:", err);
  }
}
loadModel();

async function analyzeChart() {
  const fileInput = document.getElementById("chart-upload");
  const file = fileInput.files[0];
  const chat = document.getElementById("chat-output");

  if (!file) {
    chat.innerHTML += `<div class="bot">⚠️ No image selected.</div>`;
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const img = new Image();
    img.src = reader.result;

    img.onload = async () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 224;
        canvas.height = 224;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 224, 224);

        const imageData = ctx.getImageData(0, 0, 224, 224);
        const input = tf.browser.fromPixels(imageData).toFloat().div(tf.scalar(255)).expandDims(0);
        const prediction = await model.predict(input).data();

        const labels = ["Pattern A", "Pattern B", "Pattern C"]; // 🔄 Replace with your real labels
        const highest = prediction.indexOf(Math.max(...prediction));

        chat.innerHTML += `<div class="bot">🧠 Detected Pattern: ${labels[highest]}<br>📊 Confidence: ${(prediction[highest] * 100).toFixed(2)}%</div>`;
      } catch (err) {
        console.error("❌ Prediction error:", err);
        chat.innerHTML += `<div class="bot">❌ Error analyzing chart. Try another image.</div>`;
      }
    };
  };
  reader.readAsDataURL(file);

  chat.innerHTML += `<div class="bot">Analyzing chart with TensorFlow.js... 🧠</div>`;
}

async function fetchBTCPrice() {
  try {
    const response = await fetch(`${BACKEND_URL}/price`);
    const data = await response.json();
    const price = parseFloat(data.price).toFixed(2);
    document.getElementById("btc-price").innerText = `$${price}`;
  } catch (err) {
    console.error("❌ Error fetching BTC price:", err);
  }
}

function sendMessage() {
  const input = document.getElementById("user-input");
  const chat = document.getElementById("chat-output");
  const msg = input.value;
  if (!msg.trim()) return;

  chat.innerHTML += `<div class="user">${msg}</div>`;
  input.value = "";

  setTimeout(() => {
    if (msg.toLowerCase().includes("price")) {
      fetchBTCPrice();
      chat.innerHTML += `<div class="bot">📡 Fetching latest BTC price...</div>`;
    } else {
      chat.innerHTML += `<div class="bot">🤖 Got it. Upload a chart to detect patterns!</div>`;
    }
  }, 1000);
}

fetchBTCPrice();
