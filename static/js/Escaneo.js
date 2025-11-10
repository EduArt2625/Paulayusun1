function iniciarEscaneo() {
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

  // Evitar registrar doble evento si ya existe
  if (uploadBtn.dataset.listenerAdded === "true") {
    console.warn("⚠️ Listeners ya estaban agregados, se evita duplicación.");
    return;
  }
  uploadBtn.dataset.listenerAdded = "true";

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
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarEscaneo);
} else {
  iniciarEscaneo();
}
