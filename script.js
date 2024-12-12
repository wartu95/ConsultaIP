let busy = false;


//Función para hacer la consulta a la API
async function fetchIpData(ip) {
  const response = await fetch(`https://ipapi.co/${ip}/json/`);
  if (!response.ok) throw new Error("Error en la consulta de la API");
  const data = await response.json();
  return data;
}

//Función para mostrar los datos obtenidos
function displayData(data) {
  const outputElement = document.getElementById("output");
  outputElement.innerHTML = "";

  //Iterar sobre cada dato y mostrarlo
  Object.entries(data).forEach(([key, value]) => {
    const listItem = document.createElement("p");
    listItem.textContent = `${key}: ${value}`;
    outputElement.appendChild(listItem);
  });
}

//Función para manejar el evento de clic
async function handleLookup() {
  event.preventDefault();
  if(busy) return;


  const ip = document.getElementById("ipInput").value;
  const outputElement = document.getElementById("output");

  busy = true;
  outputElement.innerText = "Consultando....."
  if (!ip) {
    // Validar si el input está vacío
    outputElement.innerText = "Por favor, ingresa una dirección IP.";
    return;
  }

  try {
    const data = await fetchIpData(ip);
    if (data.error) {
      alert("IP no válida");
      console.log("Error en ip")
    } else {
      displayData(data);
      
      console.log("Consulta satisfactoria")
    }
  } catch (error) {
    outputElement.innerText = "Error al obtener datos.";
    console.error("Error grave", error)
  }finally{
    busy=false;
    ip.value = "";
  }
}


function handleCancel(event){
  event.preventDefault();
  if(busy){
    busy = false;
  }
  document.getElementById("ipInput").value = "";
  document.getElementById("output").innerText = "";
}

//Añadir el evento de clic al botón
document.getElementById("lookupButton").addEventListener("click", handleLookup);
document.getElementById("Cancel").addEventListener("click", handleCancel);

