let busy = false;

// API request
async function fetchIpData(ip) {
  const response = await fetch(`https://ipapi.co/${ip}/json/`);
  if (!response.ok) throw new Error("Error en la consulta de la API");
  return await response.json();
}

function ccToEmoji(cc) {
  if (!cc || cc.length !== 2) return "";
  const codePoints = [...cc.toUpperCase()].map(c => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Render friendly card with key info
function displayData(data) {
  const outputElement = document.getElementById("output");
  outputElement.innerHTML = "";

  const ip = data.ip || "—";
  const country = data.country_name || "—";
  const countryCode = data.country_code || "";
  const region = data.region || data.region_code || "—";
  const city = data.city || "—";
  const isp = data.org || "—";
  const asn = data.asn || "—";
  const timezone = data.timezone || "—";
  const latitude = data.latitude ?? "—";
  const longitude = data.longitude ?? "—";
  const mapsUrl = (data.latitude && data.longitude) ? `https://www.google.com/maps?q=${data.latitude},${data.longitude}` : null;

  const headerHTML = `
    <div class="result-card__header">
      <div class="result-card__title">Resultado de IP: <strong>${ip}</strong></div>
      <span class="badge">${ccToEmoji(countryCode)} ${countryCode || ""}</span>
    </div>`;

  const gridHTML = `
    <div class="result-card__body">
      <div class="result-grid">
        <div class="result-item">
          <span class="result-label">País</span>
          <span class="result-value">${country}</span>
        </div>
        <div class="result-item">
          <span class="result-label">Región / Ciudad</span>
          <span class="result-value">${region} ${city !== "—" ? `- ${city}` : ""}</span>
        </div>
        <div class="result-item">
          <span class="result-label">ISP / Organización</span>
          <span class="result-value"><span class="chip">${isp}</span></span>
        </div>
        <div class="result-item">
          <span class="result-label">ASN</span>
          <span class="result-value">${asn}</span>
        </div>
        <div class="result-item">
          <span class="result-label">Zona horaria</span>
          <span class="result-value">${timezone}</span>
        </div>
        <div class="result-item">
          <span class="result-label">Coordenadas</span>
          <span class="result-value">${latitude}, ${longitude}</span>
          ${mapsUrl ? `<a class="map-link" href="${mapsUrl}" target="_blank" rel="noopener">Ver en Google Maps</a>` : ""}
        </div>
      </div>
    </div>`;

  const card = document.createElement("div");
  card.className = "result-card";
  card.innerHTML = headerHTML + gridHTML;
  outputElement.appendChild(card);
}

// Lookup handler
async function handleLookup(event) {
  event.preventDefault();
  if (busy) return;

  const ipInputEl = document.getElementById("ipInput");
  const ip = ipInputEl.value.trim();
  const outputElement = document.getElementById("output");

  busy = true;
  outputElement.innerHTML = `<div class="result-card"><div class="result-card__body">Consultando...</div></div>`;
  if (!ip) {
    outputElement.innerHTML = `<div class="result-card"><div class="result-card__body">Por favor, ingresa una dirección IP o dominio.</div></div>`;
    busy = false;
    return;
  }

  try {
    const data = await fetchIpData(ip);
    if (data.error) {
      outputElement.innerHTML = `<div class="result-card"><div class="result-card__body">IP no válida.</div></div>`;
    } else {
      displayData(data);
    }
  } catch (error) {
    outputElement.innerHTML = `<div class="result-card"><div class="result-card__body">Error al obtener datos.</div></div>`;
    console.error("Error grave", error);
  } finally {
    busy = false;
    ipInputEl.value = "";
  }
}

function handleCancel(event) {
  event.preventDefault();
  busy = false;
  document.getElementById("ipInput").value = "";
  document.getElementById("output").innerHTML = "";
}

// Bind events
document.getElementById("lookupButton").addEventListener("click", handleLookup);
document.getElementById("Cancel").addEventListener("click", handleCancel);

