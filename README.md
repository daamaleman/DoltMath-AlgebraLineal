<div align="center">
	<img src="https://img.shields.io/badge/Django-5.2+-green?logo=django" alt="Django">
	<img src="https://img.shields.io/badge/Python-3.10+-blue?logo=python" alt="Python">
	<img src="https://img.shields.io/badge/License-MIT-yellow?logo=license" alt="MIT License">
</div>

# 🧮 DoltMath – Algebra Lineal

<p align="center">
	<b>Aplicación web para el aprendizaje y resolución de problemas de álgebra lineal.</b><br>
	<i>Desarrollada con Python + Django</i>
</p>

<div align="center">
	<img src="https://img.icons8.com/color/96/000000/matrix.png" alt="Álgebra Lineal"/>
</div>

---

## 🚀 Requisitos previos

<table>
	<tr><td>🐍 <b>Python 3.10+</b></td></tr>
	<tr><td>📦 <b>pip</b> (gestor de paquetes de Python)</td></tr>
	<tr><td>🧱 <b>Git</b> (para clonar el repositorio)</td></tr>
	<tr><td>🐘 <b>PostgreSQL</b> <i>(opcional, para usar otra base de datos)</i></td></tr>
</table>

---

## ⚙️ Instalación rápida

<details>
	<summary><b>1️⃣ Clonar el repositorio</b></summary>

    ```bash
    git clone https://github.com/usuario/DoltMath-AlgebraLineal.git
    cd DoltMath-AlgebraLineal
    ```

</details>

<details>
	<summary><b>2️⃣ Crear y activar entorno virtual</b></summary>

    <b>🪟 Windows (PowerShell)</b>
    ```bash
    python -m venv .venv
    .\.venv\Scripts\Activate.ps1
    ```

    <b>🐧 Linux / 🍎 macOS</b>
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    ```
    <br>
    <i>💡 Verifique que aparezca <code>(.venv)</code> en la terminal antes de continuar.</i>

</details>

<details>
	<summary><b>3️⃣ Instalar dependencias</b></summary>

    ```bash
    pip install --upgrade pip
    pip install -r requirements.txt
    ```
    <br>
    <i>Si no existe <code>requirements.txt</code> actualizado:</i>
    ```bash
    pip freeze > requirements.txt
    ```

</details>

<details>
	<summary><b>4️⃣ Configurar base de datos</b></summary>

    <b>Por defecto se usa SQLite.</b>
    <br>
    <b>Inicializar migraciones:</b>
    ```bash
    python manage.py migrate
    ```
    <br>
    <i>⚙️ Para usar PostgreSQL, configure <code>DATABASES</code> en <code>config/settings.py</code> antes de migrar.</i>

</details>

<details>
	<summary><b>5️⃣ Crear superusuario</b></summary>

    ```bash
    python manage.py createsuperuser
    ```
    <br>
    <i>Complete correo, usuario y contraseña.<br>Acceda al panel en <code>/admin</code>.</i>

</details>

<details>
	<summary><b>6️⃣ Ejecutar el servidor de desarrollo</b></summary>

    ```bash
    python manage.py runserver
    ```
    <br>
    <b>Abra:</b> <a href="http://127.0.0.1:8000/">http://127.0.0.1:8000/</a>

</details>

---

## 🧰 Comandos útiles

<table>
	<thead>
		<tr><th>Comando</th><th>Descripción</th></tr>
	</thead>
	<tbody>
		<tr><td><code>python manage.py check</code></td><td>Verifica la configuración del proyecto.</td></tr>
		<tr><td><code>python manage.py runserver</code></td><td>Inicia el servidor local.</td></tr>
		<tr><td><code>python manage.py makemigrations</code></td><td>Crea archivos de migración.</td></tr>
		<tr><td><code>python manage.py migrate</code></td><td>Aplica migraciones a la base de datos.</td></tr>
	</tbody>
 </table>

---

## 🧑‍💻 Estructura del proyecto

<details>
	<summary>Ver estructura</summary>

    <pre>

DoltMath-AlgebraLineal/
│
├── algebra/ # Aplicación principal
├── templates/ # Archivos HTML
├── static/ # Archivos CSS, JS e imágenes
├── config/ # Configuración global del proyecto
├── manage.py # Punto de entrada principal
└── requirements.txt # Dependencias del entorno
</pre>

</details>

---

## 🌐 Tecnologías utilizadas

<ul>
	<li><img src="https://img.shields.io/badge/Django-5.2+-green?logo=django" height="20"> Django 5.2+</li>
	<li><img src="https://img.shields.io/badge/Python-3.10+-blue?logo=python" height="20"> Python 3.10+</li>
	<li>HTML5 / CSS3 / TailwindCSS</li>
	<li>SQLite / PostgreSQL</li>
	<li>Git + GitHub</li>
</ul>

---

## 📄 Licencia

<img src="https://img.shields.io/badge/License-MIT-yellow?logo=license" height="20"> <br>
Este proyecto está bajo la licencia <b>MIT</b>.<br>
Puede usarlo, modificarlo y distribuirlo libremente citando al autor original.

---

## 💡 Autor

<table>
	<tr><td><b>Diedereich Alemán</b></td></tr>
	<tr><td>📧 <a href="mailto:diedereicha@uamv.edu.ni">diedereicha@uamv.edu.ni</a></td></tr>
	<tr><td>💼 Universidad Americana (UAM) – Facultad de Ingeniería</td></tr>
	<tr><td>🌍 Nicaragua</td></tr>
</table>

---

<p align="center"><i>“La matemática no sólo es lógica, sino también una forma de arte.”</i> 🎨</p>
