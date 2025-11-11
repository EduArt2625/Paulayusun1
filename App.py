from flask import Flask, request, jsonify, render_template, send_file
import os
from datetime import datetime
from io import BytesIO
from fpdf import FPDF
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.inception_v3 import preprocess_input
from tensorflow.keras.preprocessing import image
import numpy as np
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
import gdown
import time
import traceback

# -------------------- CONFIGURACIÓN DEL MODELO --------------------
MODEL_PATH = os.path.join(os.getcwd(), "modelo", "modelo_final_inceptionv3.keras")
DRIVE_ID = "1ff0tinkKeYayYOSf3v1KfY1c3t3CXkcb"
URL = f"https://drive.google.com/uc?id={DRIVE_ID}"

# Verificar existencia local
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
        exit(1)

# Cargar modelo
try:
    print("🧠 Cargando modelo...")
    start = time.time()
    modelo = load_model(MODEL_PATH)
    print(f"✅ Modelo cargado correctamente en {time.time() - start:.2f} segundos.")
    print("📐 Forma de entrada del modelo:", modelo.input_shape)
except Exception as e:
    print(f"❌ Error al cargar el modelo: {e}")
    print("Verifica que el archivo .keras esté completo y sea compatible.")
    exit(1)

# Detectar tamaño de entrada automáticamente
input_shape = modelo.input_shape
if len(input_shape) == 4:
    IMG_SIZE = input_shape[1] or 256
else:
    IMG_SIZE = 256

print(f"🖼️ Tamaño de entrada detectado: {IMG_SIZE}x{IMG_SIZE}")

# -------------------- CONFIGURACIÓN DE FLASK --------------------
app = Flask(__name__, static_folder='static', static_url_path='/static')

UPLOAD_FOLDER = os.path.join(app.root_path, "static", "uploads")
RESULT_FOLDER = os.path.join(app.root_path, "static", "resultados")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

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
    try:
        if "file" not in request.files:
            return jsonify({"error": "No se ha enviado ningún archivo."})
        
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "Archivo no válido."})
        
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        if not os.path.exists(filepath):
            return jsonify({"error": f"El archivo no se guardó correctamente en {filepath}"}), 500

        print(f"📸 Imagen guardada en: {filepath}")
        print(f"📏 Tamaño del archivo: {os.path.getsize(filepath)} bytes")

        # Cargar imagen con tamaño correcto
        img = image.load_img(filepath, target_size=(IMG_SIZE, IMG_SIZE))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)

        # Preprocesamiento adaptativo
        if IMG_SIZE == 299:
            img_array = preprocess_input(img_array)
            print("🧩 Usando preprocess_input de InceptionV3")
        else:
            img_array = img_array / 255.0
            print("🧩 Usando normalización simple /255.0")

        # Predicción
        print("🔍 Realizando predicción...")
        start_pred = time.time()

        pred = modelo.predict(img_array)
        print(f"⏱️ Predicción completada en {time.time() - start_pred:.2f} segundos.")

        indice = np.argmax(pred)
        confianza = round(float(np.max(pred)) * 100, 2)

        clases = [
            "Melanoma",
            "Carcinoma de células basales",
            "Carcinoma de células escamosas",
            "Lesión Benigna"
        ]
        clases = clases[indice] if indice < len(clases) else "Desconocida"

        print(f"✅ Resultado: {clase} ({confianza}%)")

        return jsonify({
            "clase": clases,
            "confianza": confianza,
            "imagen_url": f"/static/uploads/{file.filename}"
        })

    except Exception as e:
        print("❌ Error completo en analizar():")
        traceback.print_exc()
        return jsonify({"error": f"No se puede procesar la imagen: {e}"}), 500

# -------------------- GENERAR PDF --------------------
@app.route('/generar_pdf', methods=['POST'])
def generar_pdf():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No se recibieron datos para el PDF'}), 400

    clase = data.get('clase', 'Desconocida')
    confianza = data.get('confianza', 0)
    imagen_url = data.get('imagen_url', '')

    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    pdf.setTitle("Resultado de Análisis")

    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(100, 750, "Resultado de Análisis")

    pdf.setFont("Helvetica", 12)
    pdf.drawString(100, 710, f"Clase detectada: {clase}")
    pdf.drawString(100, 690, f"Nivel de confianza: {confianza}%")
    pdf.drawString(100, 650, "Fecha del análisis:")
    pdf.drawString(250, 650, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    pdf.drawString(100, 610, "Imagen analizada:")

    try:
        if imagen_url:
            image_path = imagen_url.replace("/", os.sep).lstrip(os.sep)
            if os.path.exists(image_path):
                pdf.drawImage(image_path, 100, 400, width=200, height=200)
    except Exception as e:
        print("⚠️ No se pudo agregar la imagen al PDF:", e)

    pdf.showPage()
    pdf.save()
    buffer.seek(0)

    return send_file(
        buffer,
        as_attachment=True,
        download_name="Resultado_Analisis.pdf",
        mimetype='application/pdf'
    )

# -------------------- MAIN --------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)



