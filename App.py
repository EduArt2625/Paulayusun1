#from tkinter import Canvas
#from tkinter.tix import Meter
from flask import Flask, request, jsonify, render_template, send_file
import os
from datetime import datetime
from io import BytesIO
from fpdf import FPDF
import tensorflow as tf
from tensorflow.keras.models import load_model, Model
from tensorflow.keras.applications.inception_v3 import preprocess_input
from tensorflow.keras.preprocessing import image
import numpy as np
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
import os
import gdown
from keras.models import load_model

# -------------------- CARGA DEL MODELO --------------------

# Ruta local del modelo
MODEL_PATH = os.path.join(os.getcwd(), "modelo", "modelo_final_inceptionv3.keras")

# ID de Google Drive (reemplázalo por el tuyo si cambia)
DRIVE_ID = "1ff0tinkKeYayYOSf3v1KfY1c3t3CXkcb"
URL = f"https://drive.google.com/uc?id={DRIVE_ID}"

# Verifica si el modelo existe localmente; si no, lo descarga
if not os.path.exists(MODEL_PATH):
    try:
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        print("🔽 Descargando modelo desde Google Drive...")
        gdown.download(URL, MODEL_PATH, quiet=False, fuzzy=True)

        if os.path.exists(MODEL_PATH):
            print("✅ Modelo descargado correctamente.")
        else:
            raise FileNotFoundError("❌ Error: El modelo no se descargó correctamente.")

    except Exception as e:
        print(f"⚠️ Error al descargar el modelo: {e}")
        print("Por favor, verifica tu conexión o el enlace de Google Drive.")
        exit(1)

# Intenta cargar el modelo
try:
    print("🧠 Cargando modelo...")
    modelo = load_model(MODEL_PATH)
    print("✅ Modelo cargado correctamente.")
except Exception as e:
    print(f"❌ Error al cargar el modelo: {e}")
    print("Verifica que el archivo .keras esté completo y sea compatible.")
    exit(1)

# -------------------- CONFIGURACIÓN DE FLASK --------------------

app = Flask(__name__)

# Carpetas para subir imágenes y guardar resultados
UPLOAD_FOLDER = os.path.join("static", "uploads")
RESULT_FOLDER = os.path.join("static", "resultados")

# Crear carpetas si no existen
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

# Límite de tamaño para archivos (16 MB)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

print("📁 Carpetas configuradas correctamente.")
print("🚀 Flask listo para recibir solicitudes.")


# -------------------- RUTAS DE PÁGINAS --------------------

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/escaneo')
def escaneo():
    return render_template('Escaneo.html')

@app.route('/proyecto')
def proyecto():
    return render_template('Proyecto.html')

@app.route('/informacion')
def informacion():
    return render_template('Informacion_adicional.html')

@app.route('/terminos')
def terminos():
    return render_template('Terminos.html')

# -------------------- RUTA DE ANÁLISIS --------------------
@app.route("/analizar", methods=["POST"])
def analizar():
    if "file" not in request.files:
        return jsonify({"error": "No se ha enviado ningún archivo."})

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Archivo no válido."})

    try:
        # Guardar imagen subida
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        # Preprocesamiento
        img = image.load_img(filepath, target_size=(256, 256))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0

        # Predicción
        pred = modelo.predict(img_array)
        indice = np.argmax(pred)
        confianza = round(float(np.max(pred)) * 100, 2)

        # etiquetas de salida o clases 
        clases = ["Melanoma","Carcinoma de células basales","Carcinoma de células escamosas", "Lesión Benigna"]
        clases = clases[indice]

      
 # Retornar al frontend
        return jsonify({
            "clase": clases,
            "confianza": confianza,
            "imagen_url": f"/static/uploads/{file.filename}"
        })

    except Exception as e:
        import traceback
        print("❌ Error completo:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500




# === GENERAR PDF DESDE RESULTADOS ===
@app.route('/generar_pdf', methods=['POST'])
def generar_pdf():
    # Obtener datos del cuerpo de la solicitud
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No se recibieron datos para el PDF'}), 400

    # Extraer datos del JSON recibido
    clase = data.get('clase', 'Desconocida')
    confianza = data.get('confianza', 0)
    imagen_url = data.get('imagen_url', '')

    # Crear un buffer para almacenar el PDF en memoria
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    pdf.setTitle("Resultado de Análisis")


    # Título del PDF
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(100, 750, "Resultado de Análisis")

    # Información principal
    pdf.setFont("Helvetica", 12)
    pdf.drawString(100, 710, f"Clase detectada: {clase}")
    pdf.drawString(100, 690, f"Nivel de confianza: {confianza}%")

    # Fecha del análisis
    pdf.drawString(100, 650, "Fecha del análisis:")
    pdf.drawString(250, 650, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    # Imagen analizada
    pdf.drawString(100, 610, "Imagen analizada:")

    # Intentar agregar la imagen al PDF
    try:
        if imagen_url:
            image_path = imagen_url.replace("/", os.sep).lstrip(os.sep)
            if os.path.exists(image_path):
                pdf.drawImage(image_path, 100, 400, width=200, height=200)
    except Exception as e:
        print("No se pudo agregar la imagen al PDF:", e)

    # Finalizar el PDF
    pdf.showPage()
    pdf.save()
    buffer.seek(0)

    # Enviar el archivo como descarga
    return send_file(
        buffer,
        as_attachment=True,
        download_name="Resultado_Analisis.pdf",
        mimetype='application/pdf'
    )


# -------------------- MAIN --------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=os.getenv("PORT", default=5000))


















