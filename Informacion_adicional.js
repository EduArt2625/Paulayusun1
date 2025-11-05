document.addEventListener("DOMContentLoaded", () => {
  const datosLesiones = {
    "melanoma": {
      nombre: "Melanoma",
      patogenesis: "Neoplasia que se origina en los melanocitos, también se puede describir como la transformación maligna del melanocito; este tumor con gran capacidad de invasión puede desarrollarse a partir de un lunar existente o aparecer como una nueva mancha oscura en la piel [Acosta et al, 2009], puede aparecer en mucosas, globo ocular, leptomeninges y tracto intestinal y tiene gran capacidad de metastatizar. Su aparición es multifactorial: influye la exposición a radiación ultravioleta (especialmente exposición intermitente intensa y quemaduras solares en etapas tempranas de la vida), predisposición genética (mutaciones en genes como BRAF, NRAS, CDKN2A) y características fenotípicas (piel clara, alto número de nevos, historial familiar). Las mutaciones conducen a daño del ADN, activación de vías proliferativas y pérdida de control en los puntos de control del ciclo celular, permitiendo invasión y posible metástasis [Vidrio, 2003].",
      manifestaciones_y_señales_de_alerta: [
        "Asimetría",
        "Bordes irregulares",
        "Color heterogéneo",
        "Diámetro >6 mm",
        "Evolución"
      ],
      texto_adicional_manifestaciones: "Ciertas variantes (lentigo maligno, acral lentiginous) pueden presentar patrones distintos; cualquier cambio rápido en un lunar es motivo de evaluación.",
      imagen: "/static/img/melanoma.png",
      recomendaciones: [
        "Evitar quemaduras solares y camas de bronceado; protección solar de amplio espectro (FPS ≥ 30) y ropa protectora.",
        "Autoexploración mensual y consulta inmediata ante cambios.",
        "Controles dermatológicos periódicos en personas de alto riesgo (antecedentes familiares, mutaciones conocidas, muchos nevos).",
        "Educación sobre signos de alarma y documentación fotográfica de nevos atípicos para seguimiento."
      ],
      Referencias: "Acosta, Á. E., Fierro, E., Velásquez, VE, & Rueda, X. (2009). Melanoma: patogénesis, clínica e histopatología. Revista de la Asociación Colombiana de Dermatología y Cirugía Dermatológica, 17(2), 87-108. Vidrio, R. (2003). Cáncer de piel. Revista de la Facultad de Medicina UNAM, 46(4), 166-171."
    },

    "basocelular": {
      nombre: "Carcinoma de células basales",
      patogenesis: "Es la neoplasia maligna más frecuente y suele afectar a las personas de edad avanzada, el tumor deriva de las células que forman la capa basal de la epidermis, pues estas comienzan a crecer hacia abajo y se muestran empanizadas en la periferia de un lóbulo de células tumorales comenzando a formar estos tumores que se caracterizan por su crecimiento lento, invasión local y no metástasis; visualmente se manifiesta como una lesión perlada y puede sangrar o desarrollar una costra [Soto et al, 2018]. Uno de los factores de riesgo más significativo de este tipo de cáncer es la inmunosupresión inducida por las radiaciones UV, pues esto favorece algunos mecanismos inmunológicos supresores que alteran la función de presentación de antígenos de las células de Langerhans, lo cual permite el flujo de células inflamatorias [Vidrio, 2003]. Otros factores como: genéticos (mutación del gen supresor P-53), sustancias carcinógenas, rayos X, infecciones o úlceras crónicas [Friedman et al, 1991]. El CBC crece de forma local e invasiva, pero tiene baja tendencia a metastatizar; sin embargo, puede producir destrucción tisular local importante si no se trata.",
      imagen: "/static/img/ccb.png",
      recomendaciones: [
        "Protección solar y evitar exposición prolongada; vigilancia en pieles fotoexpuestas.",
        "Consulta por lesiones que no cicatrizan, nódulos perlados nuevos o cambios en lesiones previas.",
        "Tratamiento temprano (exéresis, Mohs u otras técnicas según localización y riesgo) para minimizar daño y recidiva."
      ],
      Referencias: "Friedman RJ, et al. Cancer of the skin. Editorial Saunders, EUA, 1991. Vidrio, R. (2003). Cáncer de piel. Revista de la Facultad de Medicina UNAM, 46(4), 166-171."
    },

    "escamoso": {
      nombre: "Carcinoma de células escamosas",
      patogenesis: "Este tipo de cáncer de piel se desarrolla en las células escamosas de la epidermis o sus anexos usualmente en zonas que han estado expuestas frecuentemente al sol, es menos común que CBC, pero más propenso a invadir ganglios regionales u otros órganos, físicamente es más duro al tacto y se siente escamoso [Collazos, 2021]. Crece rápido y suele aparecer sobre lesiones precancerosas como las queratosis actínicas o úlceras crónicas. Predomina en la cara, pero se puede encontrar en extremidades, genitales y mucosas orales y anales [Vidrio, 2003]. Factores de riesgo: hidrocarburos, radiaciones ionizantes o ultravioleta, enfermedades virales, inmunosupresión, exposición solar, piel blanca, ojos claros, edad o tabaquismo.",
      imagen: "/static/img/cce.png",
      recomendaciones: [
        "Evitar exposición UV crónica; tratar queratosis actínicas (crioterapia, fototerapia tópica) para reducir progresión.",
        "Educación para detectar lesiones que cambian, no cicatrizan o que aparecen sobre cicatrices.",
        "Vigilancia intensificada en pacientes inmunosuprimidos (mayor riesgo y agresividad)."
      ],
      Referencias: "Collazos, C. (2021). Datos | Cáncer de Piel - Liga Colombiana contra el Cáncer. Vidrio, R. (2003). Cáncer de piel. Revista de la Facultad de Medicina UNAM, 46(4), 166-171."
    },

    "benignas": {
      nombre: "Lesiones benignas",
      patogenesis: "Son proliferaciones no malignas de distintos orígenes celulares: nevos (melanocitos), queratosis seborreicas (queratinocitos), angiomas (vasculares). Su origen suele ser genético o reactivo y no implica las mismas alteraciones oncogénicas que los cánceres cutáneos; algunas lesiones benignas pueden simular malignidad o transformarse en raros casos.",
      imagen: "/static/img/benignas.png",
      recomendaciones: [
        "Vigilancia y autoexploración; documentar cambios con fotografía si existe preocupación.",
        "Evitar extracción o manipulación casera.",
        "Si hay dudas diagnósticas, derivación a dermatología y, si procede, biopsia.",
        "Educación al paciente sobre signos de alerta (cambios en tamaño, forma, color, sangrado, ulceración)."
      ],
      Referencias: "Wang Z, Wang X, Shi Y, Wu S, Ding Y, Yao G, Chen J. Advancements in elucidating the pathogenesis of actinic keratosis: present state and future prospects. Front Med (Lausanne). 2024 Mar 19;11:1330491."
    }
  };

  window.mostrarInfo = function(tipo) {
    const lesion = datosLesiones[tipo];
    if (!lesion) {
      console.warn("Tipo de lesión no encontrado:", tipo);
      return;
    }

    // Manifestaciones como lista
    let manifestacionesHTML = "";
    if (lesion.manifestaciones_y_señales_de_alerta) {
      const itemsManifestaciones = lesion.manifestaciones_y_señales_de_alerta
        .map(item => `<li>${item}</li>`)
        .join("");
      const textoExtra = lesion.texto_adicional_manifestaciones ? `<p>${lesion.texto_adicional_manifestaciones}</p>` : "";
      manifestacionesHTML = `
        <strong>Manifestaciones clínicas / señales de alarma:</strong>
        <ul>${itemsManifestaciones}</ul>
        ${textoExtra}
      `;
    }

    // Recomendaciones como lista
    let recomendacionesHTML = "";
    if (lesion.recomendaciones) {
      const itemsRecomendaciones = lesion.recomendaciones
        .map(item => `<li>${item}</li>`)
        .join("");
      recomendacionesHTML = `
        <strong>Recomendaciones generales:</strong>
        <ul>${itemsRecomendaciones}</ul>
      `;
    }

    // Referencias
    let referenciasHTML = lesion.Referencias ? `<br><strong>Referencias:</strong><br>${lesion.Referencias}` : "";

    // Actualizar HTML en el orden deseado
    document.getElementById("nombre-lesion").textContent = lesion.nombre;
    document.getElementById("imagen-lesion").src = lesion.imagen;
    document.getElementById("imagen-lesion").alt = lesion.nombre;
    document.getElementById("recomendaciones").innerHTML = `
      <strong>Patogénesis:</strong>
      <p>${lesion.patogenesis}</p>
      ${manifestacionesHTML}
      ${recomendacionesHTML}
      ${referenciasHTML}
    `;
  };
});
