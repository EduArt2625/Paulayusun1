if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarEscaneo);
} else {
  iniciarEscaneo();
}

let escaneoInicializado = false;

function iniciarEscaneo() {
  if (escaneoInicializado) {
    console.warn("⚠️ Listeners ya estaban agregados, se evita duplicación.");
    return;
  }
  escaneoInicializado = true;

  console.log("JS Escaneo cargado correctamente ✅");

  const uploadBtn = document.getElementById("uploadBtn");
  const fileInput = document.getElementById("fileInput");
  const preview = document.getElementById("preview");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const progressContainer = document.getElementById("progressContainer");
  const progress = document.getElementById("progress");
  const resultadoDiv = document.getElementById("resultado");

  if (!uploadBtn || !fileInput) {
    console.error("❌ No se encontró el botón o el input en el DOM.");
    return;
  }

  // -------------------- BOTÓN DE CARGA --------------------
  uploadBtn.addEventListener("click", () => {
    console.log("Click en Cargar Imagen");
    fileInput.click();
  });

  // -------------------- VISTA PREVIA --------------------
  fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      console.log("📸 Archivo seleccionado:", file.name);
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
        analyzeBtn.disabled = false;
        console.log("✅ Vista previa mostrada y botón Analizar habilitado");
      };
      reader.readAsDataURL(file);
    } else {
      analyzeBtn.disabled = true;
      preview.style.display = "none";
    }
  });

  // -------------------- ANÁLISIS --------------------
  analyzeBtn.addEventListener("click", async () => {
    const file = fileInput.files[0];
    if (!file) return alert("Primero selecciona una imagen.");

    console.log("🔍 Enviando imagen al servidor...");

    // Mostrar progreso
    progressContainer.style.display = "block";
    progress.style.width = "50%";
    analyzeBtn.disabled = true;

    const formData = new FormData();
    formData.append("imagen", file);

    try {
      const response = await fetch("/analizar", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Error al analizar la imagen");

      const data = await response.json();

      progress.style.width = "100%";

      // Mostrar resultado
      resultadoDiv.innerHTML = `
        <div class="alert alert-success mt-3">
          <h4>✅ Resultado del análisis:</h4>
          <p><strong>${data.resultado}</strong></p>
        </div>
      `;

      console.log("🧠 Análisis recibido:", data);

    } catch (err) {
      console.error("❌ Error en el análisis:", err);
      resultadoDiv.innerHTML = `
        <div class="alert alert-danger mt-3">
          Error al procesar la imagen.
        </div>
      `;
    } finally {
      progress.style.width = "0%";
      progressContainer.style.display = "none";
      analyzeBtn.disabled = false;
    }
  });
}
