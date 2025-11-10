// Espera a que el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarEscaneo);
} else {
  iniciarEscaneo();
}

let escaneoInicializado = false;

function iniciarEscaneo() {
  if (escaneoInicializado) return; // Evita duplicar listeners
  escaneoInicializado = true;

  const uploadBtn = document.getElementById("uploadBtn");
  const fileInput = document.getElementById("fileInput");
  const preview = document.getElementById("preview");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const progressContainer = document.getElementById("progressContainer");
  const progress = document.getElementById("progress");
  const resultadoDiv = document.getElementById("resultado");

  if (!uploadBtn || !fileInput) {
    console.error("No se encontró el botón o input de archivo en el DOM.");
    return;
  }

  // --- BOTÓN DE CARGA ---
  uploadBtn.addEventListener("click", () => fileInput.click());

  // --- VISTA PREVIA ---
  fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
        analyzeBtn.disabled = false;
      };
      reader.readAsDataURL(file);
    } else {
      analyzeBtn.disabled = true;
      preview.style.display = "none";
    }
  });

  // --- ANÁLISIS ---
  analyzeBtn.addEventListener("click", async () => {
    const file = fileInput.files[0];
    if (!file) return alert("Primero selecciona un archivo.");

    progressContainer.style.display = "block";
    progress.style.width = "50%";
    analyzeBtn.disabled = true;

    const formData = new FormData();
    formData.append("file", file); // clave "file"

    try {
      const response = await fetch("/analizar", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Error al analizar el archivo");

      const data = await response.json();

      progress.style.width = "100%";

      resultadoDiv.innerHTML = `
        <div class="alert alert-success mt-3">
          <h4>✅ Resultado del análisis:</h4>
          <p><strong>${data.resultado}</strong></p>
        </div>
      `;
    } catch (err) {
      console.error("Error en el análisis:", err);
      resultadoDiv.innerHTML = `
        <div class="alert alert-danger mt-3">
          Error al procesar el archivo.
        </div>
      `;
    } finally {
      progress.style.width = "0%";
      progressContainer.style.display = "none";
      analyzeBtn.disabled = false;
    }
  });
}
