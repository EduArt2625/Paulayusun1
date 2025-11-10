document.addEventListener("DOMContentLoaded", () => {
  console.log("JS cargado correctamente ✅");

  const uploadBtn = document.getElementById("uploadBtn");
  const fileInput = document.getElementById("fileInput");
  const preview = document.getElementById("preview");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const progressContainer = document.getElementById("progressContainer");
  const progress = document.getElementById("progress");
  const resultadoDiv = document.getElementById("resultado");

  // Verificar si existen los elementos
  if (!uploadBtn || !fileInput) {
    console.error("❌ No se encontró el botón o input en el DOM.");
    return;
  }

  // -------------------- BOTÓN DE CARGA --------------------
  uploadBtn.addEventListener("click", () => {
    console.log("Click en Cargar Imagen detectado 🎯");
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
        console.log("Botón Analizar habilitado ✅");
      };
      reader.readAsDataURL(file);
    } else {
      analyzeBtn.disabled = true;
      preview.style.display = "none";
    }
  });
});
