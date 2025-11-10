// -------------------- BOTÓN DE CARGA --------------------
document.getElementById("btn-cargar").addEventListener("click", () => {
  document.getElementById("file").click();
});

// -------------------- VISTA PREVIA DE IMAGEN --------------------
document.getElementById("file").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById("preview");
      preview.src = e.target.result;
      preview.style.display = "block";
      document.getElementById("btn-analizar").disabled = false;
    };
    reader.readAsDataURL(file);
  }
});

// -------------------- ENVÍO AL BACKEND --------------------
document.getElementById("btn-analizar").addEventListener("click", async () => {
  const fileInput = document.getElementById("file");
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor, selecciona una imagen primero.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const progressContainer = document.getElementById("progressContainer");
  const progressBar = document.getElementById("progress");
  progressContainer.style.display = "block";
  progressBar.style.width = "30%";

  try {
    const response = await fetch("/analizar", {
      method: "POST",
      body: formData,
    });

    progressBar.style.width = "70%";

    if (!response.ok) throw new Error("Error en el servidor");
    const data = await response.json();

    progressBar.style.width = "100%";

    if (data.error) {
      alert("❌ " + data.error);
      return;
    }

    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = `
      <h3>Resultado del análisis:</h3>
      <p><strong>Clase:</strong> ${data.clase}</p>
      <p><strong>Confianza:</strong> ${data.confianza}%</p>
      <img src="${data.imagen_url}" alt="Imagen analizada" class="img-fluid rounded mt-3" style="max-width: 300px;">
      <br><br>
      <button id="descargarPdfBtn" class="btn btn-outline-primary">Descargar PDF</button>
    `;

    // -------------------- DESCARGAR PDF --------------------
    document.getElementById("descargarPdfBtn").addEventListener("click", async () => {
      try {
        const pdfResponse = await fetch("/generar_pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clase: data.clase,
            confianza: data.confianza,
            imagen_url: data.imagen_url,
          }),
        });

        if (!pdfResponse.ok) throw new Error("Error al generar el PDF");

        const blob = await pdfResponse.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Resultado_Analisis.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        alert("⚠️ Error al descargar el PDF: " + err.message);
      }
    });
  } catch (error) {
    console.error(error);
    alert("⚠️ Error al analizar la imagen: " + error.message);
  } finally {
    progressBar.style.width = "0%";
    progressContainer.style.display = "none";
  }
});

