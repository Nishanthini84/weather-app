const apiKey = "b7d10214d305d5bb5743989e213bb480";

async function getLatLon(city) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)},IN&limit=1&appid=${apiKey}`;
  const resp = await fetch(url);
  const arr = await resp.json();
  
  if (!arr.length) throw new Error("Place not found");
  return { lat: arr[0].lat, lon: arr[0].lon };
}

async function getWeather() {
  const input = document.getElementById("cityInput").value.trim();
  const resultDiv = document.getElementById("weatherResult");
  
  if (!input) return alert("❗ Please enter a city or district.");
  
  try {
    const { lat, lon } = await getLatLon(input);
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const res = await fetch(weatherUrl);
    if (!res.ok) throw new Error("Weather not found");
    const data = await res.json();
    
    resultDiv.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <h3>${data.weather[0].main} – ${data.weather[0].description}</h3>
      <p>🌡️ ${data.main.temp} °C</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
    `;
    resultDiv.classList.remove("hidden");
  } catch (err) {
    resultDiv.innerHTML = `<p style="color:red;">❌ ${err.message}</p>`;
    resultDiv.classList.remove("hidden");
  }
}
