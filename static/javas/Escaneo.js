// Botón para abrir el input file
document.getElementById("uploadBtn").addEventListener("click", () => {
  document.getElementById("fileInput").click();
});

// Mostrar vista previa
document.getElementById("fileInput").addEventListener("change", function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById("preview");
      preview.src = e.target.result;
      preview.style.display = "block";
      document.getElementById("analyzeBtn").disabled = false;
    };
    reader.readAsDataURL(file);
  }
});

// Simulación análisis
document.getElementById("analyzeBtn").addEventListener("click", () => {
  const progressBar = document.getElementById("progress");
  const progressContainer = document.getElementById("progressContainer");
  progressContainer.style.display = "block";

  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    progressBar.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(interval);
      generarPDF();
    }
  }, 400);
});


// Generar PDF
async function generarPDF() {
  const { jsPDF } = window.jspdf;

  // Crear PDF vacío
  const pdf = new jsPDF("p", "mm", "a4");

  // Texto inicial
  pdf.setFontSize(20);
  pdf.text("Informe Diagnóstico - NeoDerma", 20, 30);

  pdf.setFontSize(12);
  pdf.text("Este es un informe de diagnóstico simulado.", 20, 50);
  pdf.text("Resultado: Lesión benigna - Sin riesgo.", 20, 70);
  pdf.text("Se recomienda acudir a un dermatólogo para una evaluación más detallada.", 20, 90);

  // Clonamos y reemplazamos botón por enlace
  const element = document.querySelector(".info-box").cloneNode(true);
  element.querySelector("#infoBtn")?.remove();

  const link = document.createElement("a");
  link.href = "Informacion_adicional.html";

  link.style.color = "blue";
  element.appendChild(link);

  // Lo añadimos oculto al body para que html2canvas lo pinte con estilos
  element.style.position = "absolute";
  element.style.left = "-9999px";
  document.body.appendChild(element);

  // Capturamos con html2canvas
  const canvas = await html2canvas(element, { scale: 2 });
  document.body.removeChild(element); // lo quitamos del DOM

  const imgData = canvas.toDataURL("image/png");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const imgProps = pdf.getImageProperties(imgData);
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  // Insertar la captura en el PDF debajo del texto
  pdf.addImage(imgData, "PNG", 20, 110, pdfWidth - 40, pdfHeight);

  // ✅ Añadimos un enlace real en el PDF (clickeable)
  pdf.setTextColor(0, 0, 255); // azul estilo link
  pdf.textWithLink("Ir a información adicional", 20, 110 + pdfHeight + 20, {
    url: "https://eduart2625.github.io/Pro_paulis.github.io/Informacion_adicional.html"
  });

  // Guardar archivo
  pdf.save("informe_diagnostico.pdf");
}

