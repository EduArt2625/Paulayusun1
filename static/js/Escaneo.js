document.addEventListener("DOMContentLoaded", () => {
  console.log("JS cargado correctamente");

  const uploadBtn = document.getElementById("uploadBtn");
  const fileInput = document.getElementById("fileInput");
  const preview = document.getElementById("preview");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const progressContainer = document.getElementById("progressContainer");
  const progress = document.getElementById("progress");
  const resultadoDiv = document.getElementById("resultado");

  // -------------------- BOTÓN DE CARGA --------------------
  uploadBtn.addEventListener("click", () => {
    console.log("Click en Cargar Imagen");
    fileInput.click();
  });

  // -------------------- VISTA PREVIA --------------------
  fileInput.addEventListener("change", function() {
    const file = this.files[0];
    console.log("Archivo seleccionado:", file);
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = "block";
        analyzeBtn.disabled = false;
        console.log("Botón Analizar habilitado");
      };
      reader.readAsDataURL(file);
    } else {
      analyzeBtn.disabled = true;
      preview.style.display = "none";
    }
  });

  // -------------------- BOTÓN ANALIZAR --------------------
  analyzeBtn.addEventListener("click", async () => {
    console.log("Click en Analizar detectado");

    const file = fileInput.files[0];
    if (!file) {
      alert("Por favor, selecciona una imagen primero.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Mostrar barra de progreso
    progressContainer.style.display = "block";
    progress.style.width = "0%";

    let width = 0;
    const interval = setInterval(() => {
      if (width >= 80) clearInterval(interval);
      width += 1;
      progress.style.width = width + "%";
    }, 30);

    try {
      const response = await fetch("/analizar", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error(`HTTP error ${response.status}`);

      const data = await response.json();
      console.log("Datos recibidos:", data);

      if (data.error) {
        alert("❌ " + data.error);
        progressContainer.style.display = "none";
        progress.style.width = "0%";
        return;
      }

      // Completar barra de progreso
      progress.style.width = "100%";

      // Mostrar resultado
      resultadoDiv.innerHTML = `
        <h3>Resultado del análisis:</h3>
        <p><strong>Clase:</strong> ${data.clase}</p>
        <p><strong>Confianza:</strong> ${data.confianza}%</p>
        <img src="${data.imagen_url}" alt="Imagen analizada" style="max-width:300px; border-radius:10px; margin-top:10px;">
        <br><br>
        <button id="descargarPdfBtn" class="btn btn-primary">Descargar PDF</button>
      `;

      // Descargar PDF
      const descargarPdfBtn = document.getElementById("descargarPdfBtn");
      descargarPdfBtn.addEventListener("click", async () => {
        try {
          const pdfResponse = await fetch("/generar_pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clase: data.clase,
              confianza: data.confianza,
              imagen_url: data.imagen_url
            })
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
          alert("Error al descargar el PDF: " + err.message);
        }
      });

      // Ocultar barra de progreso tras 2 segundos
      setTimeout(() => {
        progressContainer.style.display = "none";
        progress.style.width = "0%";
      }, 2000);

    } catch (error) {
      console.error("Error al analizar:", error);
      alert("Error al analizar la imagen. Revisa la consola para más detalles.");
      progressContainer.style.display = "none";
      progress.style.width = "0%";
    }
  });
});


