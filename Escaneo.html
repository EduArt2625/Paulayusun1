
// -------------------- BOTÓN DE CARGA --------------------
document.getElementById("uploadBtn").addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput");
  fileInput.click();
});

// -------------------- VISTA PREVIA DE IMAGEN --------------------
document.getElementById("fileInput").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById("preview");
      preview.src = e.target.result;
      preview.style.display = "block";
      document.getElementById("analyzeBtn").disabled = false;
    };
    reader.readAsDataURL(file);
  }
});

// -------------------- ENVÍO AL BACKEND --------------------
document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor, selecciona una imagen primero.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const progressContainer = document.getElementById("progressContainer");
  const progress = document.getElementById("progress");
  progress.style.width = "0%";
  progressContainer.style.display = "block";

  try {
    // Simular avance inicial
    progress.style.width = "40%";

    const response = await fetch("/analizar", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Error en el servidor");

    const data = await response.json();

    if (data.error) {
      alert("❌ " + data.error);
      return;
    }

    progress.style.width = "100%";

    // Mostrar resultado
    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = `
      <h3>Resultado del análisis:</h3>
      <p><strong>Clase:</strong> ${data.clase}</p>
      <p><strong>Confianza:</strong> ${data.confianza}%</p>
      <img src="${data.imagen_url}" alt="Imagen analizada" style="max-width: 300px; border-radius: 10px; margin-top: 10px;">
      <br><br>
      <button id="descargarPdfBtn" class="btn-analizar"> Descargar PDF</button>
    `;

    // Botón para descargar PDF
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

        // Crear descarga del PDF
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
        alert(" Error al descargar el PDF: " + err.message);
      }
    });



    // Ocultar barra de progreso tras 2 segundos
    setTimeout(() => {
      progressContainer.style.display = "none";
      progress.style.width = "0%";
    }, 2000);

  } catch (error) {
    console.error(error);
    alert("Error al analizar la imagen.");
    progressContainer.style.display = "none";
    progress.style.width = "0%";
  }
});
