from django.shortcuts import render
from django.http import HttpRequest
from .logic import utilidades as u
from .logic import operaciones as op

def index(request: HttpRequest):
    return render(request, "algebra/index.html")

def _parse_matriz_simple(texto: str):
    matriz = []
    for linea in (texto or "").strip().splitlines():
        if not linea.strip():
            continue
        fila = []
        for token in linea.strip().split():
            fila.append(u.crear_fraccion_desde_cadena(token))
        matriz.append(fila)
    # Validación rectangular
    if matriz:
        ancho = len(matriz[0])
        if any(len(f) != ancho for f in matriz):
            raise ValueError("Todas las filas deben tener la misma cantidad de columnas.")
    return matriz

def _parse_matriz_aumentada(texto: str):
    M = []
    for linea in (texto or "").strip().splitlines():
        if not linea.strip():
            continue
        if "|" not in linea:
            raise ValueError("Cada fila debe contener '|' para separar A y b, ej: 1 2 | 5")
        izq, der = linea.split("|", 1)
        A_vals = [u.crear_fraccion_desde_cadena(t) for t in izq.strip().split()]
        b_vals = [u.crear_fraccion_desde_cadena(t) for t in der.strip().split()]
        if len(b_vals) != 1:
            raise ValueError("El término independiente b debe ser una sola columna.")
        M.append(A_vals + b_vals)
    # Validación rectangular
    ancho = len(M[0])
    if any(len(f) != ancho for f in M):
        raise ValueError("Todas las filas deben tener la misma cantidad de columnas.")
    return M

def _render_matriz(M):
    return [[u.texto_fraccion(x) for x in fila] for fila in (M or [])]

def suma(request: HttpRequest):
    ctx = {}
    if request.method == "POST":
        try:
            A = _parse_matriz_simple(request.POST.get("matrizA"))
            B = _parse_matriz_simple(request.POST.get("matrizB"))
            C = op.sumar_matrices(A, B)
            ctx["resultado"] = _render_matriz(C)
            if A:
                ctx["dims"] = {"A": f"{len(A)}×{len(A[0])}", "B": f"{len(B)}×{len(B[0])}", "C": f"{len(C)}×{len(C[0])}"}
        except Exception as e:
            ctx["error"] = str(e)
    return render(request, "algebra/suma.html", ctx)

def multiplicacion(request: HttpRequest):
    ctx = {}
    if request.method == "POST":
        try:
            A = _parse_matriz_simple(request.POST.get("matrizA"))
            B = _parse_matriz_simple(request.POST.get("matrizB"))
            want_steps = bool(request.POST.get("show_steps"))
            if want_steps:
                C, pasos = op.multiplicar_matrices(A, B, registrar_pasos=True)
                ctx["resultado"] = _render_matriz(C)
                # Renderizar matrices de cada paso a texto fracción
                ctx["pasos"] = [
                    {"operacion": p.get("operacion"), "matriz": _render_matriz(p.get("matriz"))}
                    for p in pasos
                ]
            else:
                C = op.multiplicar_matrices(A, B)
                ctx["resultado"] = _render_matriz(C)
            if A and B:
                ctx["dims"] = {
                    "A": f"{len(A)}×{len(A[0])}",
                    "B": f"{len(B)}×{len(B[0])}",
                    "C": f"{len(C)}×{len(C[0])}"
                }
        except Exception as e:
            ctx["error"] = str(e)
    return render(request, "algebra/multiplicacion.html", ctx)

def gauss(request: HttpRequest):
    ctx = {}
    if request.method == "POST":
        try:
            M = _parse_matriz_aumentada(request.POST.get("matrizAug"))
            want_steps = bool(request.POST.get("show_steps"))
            if want_steps:
                R, pasos = op.gauss(M, registrar_pasos=True)
                ctx["resultado"] = _render_matriz(R)
                ctx["pasos"] = [
                    {"operacion": p.get("operacion"), "matriz": _render_matriz(p.get("matriz"))}
                    for p in pasos
                ]
            else:
                R = op.gauss(M, registrar_pasos=False)
                ctx["resultado"] = _render_matriz(R)
            if M:
                m = len(M); n = len(M[0]) - 1
                ctx["dims"] = {"A": f"{m}×{n}", "b": f"{m}×1"}
        except Exception as e:
            ctx["error"] = str(e)
    return render(request, "algebra/gauss.html", ctx)

def gauss_jordan(request: HttpRequest):
    ctx = {}
    if request.method == "POST":
        try:
            M = _parse_matriz_aumentada(request.POST.get("matrizAug"))
            want_steps = bool(request.POST.get("show_steps"))
            if want_steps:
                R, pasos = op.gauss_jordan(M, registrar_pasos=True)
                ctx["resultado"] = _render_matriz(R)
                ctx["pasos"] = [
                    {"operacion": p.get("operacion"), "matriz": _render_matriz(p.get("matriz"))}
                    for p in pasos
                ]
            else:
                R = op.gauss_jordan(M, registrar_pasos=False)
                ctx["resultado"] = _render_matriz(R)
            if M:
                m = len(M); n = len(M[0]) - 1
                ctx["dims"] = {"A": f"{m}×{n}", "b": f"{m}×1"}
        except Exception as e:
            ctx["error"] = str(e)
    return render(request, "algebra/gauss_jordan.html", ctx)

def _parse_vectores_columnas(texto: str):
    """Convierte un bloque de texto con vectores fila en matriz A con columnas como vectores.
    Cada línea representa un vector en R^n, separado por espacios. Devuelve A con entrada fracción.
    """
    filas = _parse_matriz_simple(texto)
    if not filas:
        return []
    m = len(filas)
    n = len(filas[0])
    # Transponer para tratar cada columna como vector v_j
    A = []
    i = 0
    while i < m:
        fila = []
        j = 0
        while j < n:
            fila.append(filas[i][j])
            j += 1
        A.append(fila)
        i += 1
    return A

def _parse_vector_columna(texto: str):
    """Parsea un vector columna b con una entrada por línea o separada por espacios."""
    vals = []
    for token in (texto or "").replace("\n", " ").split():
        vals.append(u.crear_fraccion_desde_cadena(token))
    if not vals:
        return None
    return [[v] for v in vals]

def sistemas(request: HttpRequest):
    """Vista para Sistemas de ecuaciones (Ax=0 / Ax=b) y Dependencia lineal."""
    ctx = {}
    if request.method == "POST":
        try:
            modo = request.POST.get("modo")  # 'sistema' | 'dependencia'
            metodo = request.POST.get("metodo") or "gauss_jordan"
            mostrar_pasos = bool(request.POST.get("show_steps"))
            if modo == "sistema":
                M_text = request.POST.get("matrizAug")
                M = _parse_matriz_aumentada(M_text)
                res = op.analizar_sistema_general(M, metodo)
                ctx["res"] = {
                    **res,
                    "R": _render_matriz(res["R"]),
                    "pasos": [
                        {"operacion": p.get("operacion"), "matriz": _render_matriz(p.get("matriz"))}
                        for p in (res["pasos"] if mostrar_pasos else [])
                    ],
                }
                # dimensiones
                if M:
                    m = len(M); n = len(M[0]) - 1
                    ctx["dims"] = {"A": f"{m}×{n}", "b": f"{m}×1"}
            elif modo == "dependencia":
                A_text = request.POST.get("matrizA")
                b_text = request.POST.get("vectorB")
                A = _parse_matriz_simple(A_text)
                b = _parse_vector_columna(b_text)
                res = op.dependencia_vectores(A, b, metodo)
                # Render matrices de pasos homogéneo (y no homogéneo si b dado)
                r_h = res["resultado_homogeneo"]
                r_h["R"] = _render_matriz(r_h["R"])    
                r_h["pasos"] = [
                    {"operacion": p.get("operacion"), "matriz": _render_matriz(p.get("matriz"))}
                    for p in r_h["pasos"]
                ] if mostrar_pasos else []
                if res["resultado_no_homogeneo"]:
                    r_b = res["resultado_no_homogeneo"]
                    r_b["R"] = _render_matriz(r_b["R"]) 
                    r_b["pasos"] = [
                        {"operacion": p.get("operacion"), "matriz": _render_matriz(p.get("matriz"))}
                        for p in r_b["pasos"]
                    ] if mostrar_pasos else []
                ctx["dep"] = res
                # dims
                if A:
                    ctx["dims"] = {"A": f"{len(A)}×{len(A[0])}"}
                    if b:
                        ctx["dims"]["b"] = f"{len(b)}×1"
            else:
                ctx["error"] = "Modo no reconocido."
        except Exception as e:
            ctx["error"] = str(e)
    return render(request, "algebra/sistemas.html", ctx)
