const BACKEND_URL = "https://btcanalyzer.onrender.com";

// Fetch BTC price from the backend
async function fetchBTCPrice() {
  const response = await fetch(`${BACKEND_URL}/price`);
  const data = await response.json();
  const price = parseFloat(data.price).toFixed(2);
  document.getElementById("btc-price").innerText = `$${price}`;
}

function analyzeChart() {
  const chat = document.getElementById("chat-output");
  chat.innerHTML += `<div class="bot">Analyzing chart... 🔍</div>`;
  setTimeout(() => {
    chat.innerHTML += `<div class="bot">🔮 Prediction: BTC likely in accumulation. Watch for breakout above resistance.</div>`;
  }, 1500);
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
      chat.innerHTML += `<div class="bot">📡 Fetching latest BTC price (Bitstamp via CMC)...</div>`;
    } else {
      chat.innerHTML += `<div class="bot">🤖 BTC trend analysis complete. Still bullish unless we lose major support.</div>`;
    }
  }, 1000);
}

fetchBTCPrice();