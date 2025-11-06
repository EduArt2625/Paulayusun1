const datosLesiones = {
  melanoma: {
    nombre: "Melanoma",
    patogenesis: "Cáncer que se origina en los melanocitos. Es muy agresivo y puede hacer metástasis rápidamente.",
    imagen: "img/melanoma.jpg",
    recomendaciones: "Consultar a un dermatólogo. Realizar autoexploración regular. Evitar exposición solar sin protección."
  },
  basocelular: {
    nombre: "Carcinoma de células basales",
    patogenesis: "Tumor maligno de crecimiento lento que raramente hace metástasis.",
    imagen: "img/basocelular.jpg",
    recomendaciones: "Tratamiento quirúrgico. Seguimiento médico regular."
  },
  escamoso: {
    nombre: "Carcinoma de células escamosas",
    patogenesis: "Tumor que puede invadir tejidos profundos y hacer metástasis si no se trata.",
    imagen: "img/escamoso.jpg",
    recomendaciones: "Tratamiento quirúrgico y posible radioterapia. Protección solar."
  },
  benignas: {
    nombre: "Lesiones benignas",
    patogenesis: "Crecimientos no cancerosos de la piel que generalmente no requieren tratamiento.",
    imagen: "img/benignas.jpg",
    recomendaciones: "Observación y seguimiento. Consulta si hay cambios en forma o color."
  }
};

function mostrarInfo(tipo) {
  const lesion = datosLesiones[tipo];
  document.getElementById("nombre-lesion").textContent = lesion.nombre;
  document.getElementById("imagen-lesion").src = lesion.imagen;
  document.getElementById("imagen-lesion").alt = lesion.nombre;
  document.getElementById("recomendaciones").innerHTML = `<strong>Recomendaciones generales:</strong> ${lesion.recomendaciones}<br><br><strong>Patogénesis:</strong> ${lesion.patogenesis}`;
}
