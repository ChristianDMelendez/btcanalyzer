const BACKEND_URL = "https://btcanalyzer.onrender.com";

// Load TensorFlow.js model (placeholder logic for pattern detection)
let model;
async function loadModel() {
  model = await tf.loadLayersModel('https://teachablemachine.withgoogle.com/models/8O9hCXn5n/model.json');
  console.log("Model loaded.");
}
loadModel();

// Analyze chart using TensorFlow.js model
async function analyzeChart() {
  const fileInput = document.getElementById("chart-upload");
  const file = fileInput.files[0];
  const chat = document.getElementById("chat-output");

  if (!file) {
    chat.innerHTML += `<div class="bot">⚠️ No image selected.</div>`;
    return;
  }

  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = async () => {
    const tensor = tf.browser.fromPixels(img).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
    const prediction = await model.predict(tensor).data();
    const labels = ["Head & Shoulders", "Double Top", "Rising Wedge", "Symmetrical Triangle"];
    const highest = prediction.indexOf(Math.max(...prediction));
    chat.innerHTML += `<div class="bot">🧠 Detected Pattern: ${labels[highest]}<br>📊 Confidence: ${(prediction[highest] * 100).toFixed(2)}%</div>`;
  };

  chat.innerHTML += `<div class="bot">Analyzing chart with TensorFlow.js... 🧠</div>`;
}

// Fetch BTC price from backend
async function fetchBTCPrice() {
  const response = await fetch(`${BACKEND_URL}/price`);
  const data = await response.json();
  const price = parseFloat(data.price).toFixed(2);
  document.getElementById("btc-price").innerText = `$${price}`;
}

// Chat logic
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
      chat.innerHTML += `<div class="bot">🤖 Noted. You can also upload a chart for pattern detection!</div>`;
    }
  }, 1000);
}

fetchBTCPrice();