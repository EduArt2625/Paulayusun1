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
    if (!file) return alert("Primero selecciona un archivo.");

    console.log("🔍 Enviando archivo al servidor...");

    // Mostrar progreso
    progressContainer.style.display = "block";
    progress.style.width = "50%";
    analyzeBtn.disabled = true;

    const formData = new FormData();
    formData.append("file", file); // <-- cambio aquí: "imagen" → "file"

    try {
      const response = await fetch("/analizar", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Error al analizar el arc
