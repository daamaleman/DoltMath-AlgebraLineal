(function () {
  function buildMatrix(container, rows, cols) {
    container.innerHTML = "";
    const table = document.createElement("table");
    table.className = "matriz editable";
    for (let i = 0; i < rows; i++) {
      const tr = document.createElement("tr");
      for (let j = 0; j < cols; j++) {
        const td = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        input.inputMode = "numeric";
        input.placeholder = "0";
        td.appendChild(input);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    container.appendChild(table);
  }

  function serializeMatrix(table) {
    const rows = [];
    table.querySelectorAll("tr").forEach((tr) => {
      const row = [];
      tr.querySelectorAll("input").forEach((inp) => {
        const val = inp.value.trim();
        row.push(val || "0");
      });
      rows.push(row.join(" "));
    });
    return rows.join("\n");
  }

  function updateHidden(form) {
    form.querySelectorAll(".matrix").forEach((box) => {
      const name = box.getAttribute("data-name");
      const table = box.querySelector("table");
      if (!name || !table) return;
      const hidden = form.querySelector(`input[name="${name}"]`);
      if (hidden) hidden.value = serializeMatrix(table);
    });
    if (form.dataset.mode === "aug") {
      // compose matrizAug from matrizA and vectorB adding a pipe
      const A = form.querySelector('input[name="matrizA"]').value.split("\n");
      const b = form.querySelector('input[name="vectorB"]').value.split("\n");
      const rows = Math.max(A.length, b.length);
      const out = [];
      for (let i = 0; i < rows; i++) {
        const left = (A[i] || "").trim();
        const right = (b[i] || "").trim();
        out.push(`${left} | ${right}`.trim());
      }
      const hiddenAug = form.querySelector('input[name="matrizAug"]');
      if (hiddenAug) hiddenAug.value = out.join("\n");
    }
  }

  function initForm(form) {
    const mode = form.dataset.mode;
    const matrices = form.querySelectorAll(".matrix");
    const resizeBtn = form.querySelector('[data-action="resize"]');
    function doResize() {
      if (mode === "sum") {
        const r = +form.querySelector('[data-target="rows"]').value || 2;
        const c = +form.querySelector('[data-target="cols"]').value || 2;
        matrices.forEach((box) => {
          const cols = +box.getAttribute("data-cols") || c;
          buildMatrix(box, r, cols);
        });
      } else if (mode === "mul") {
        const rA = +form.querySelector('[data-target="rowsA"]').value || 2;
        const pc = +form.querySelector('[data-target="colsArowsB"]').value || 2;
        const cB = +form.querySelector('[data-target="colsB"]').value || 2;
        const [boxA, boxB] = matrices;
        buildMatrix(boxA, rA, pc);
        buildMatrix(boxB, pc, cB);
      } else if (mode === "aug") {
        const r = +form.querySelector('[data-target="rows"]').value || 2;
        const c = +form.querySelector('[data-target="cols"]').value || 2;
        const [boxA, boxB] = matrices;
        buildMatrix(boxA, r, c);
        boxB.setAttribute("data-cols", "1");
        buildMatrix(boxB, r, 1);
      }
      updateHidden(form);
    }
    doResize();
    if (resizeBtn) {
      resizeBtn.addEventListener("click", () => {
        doResize();
      });
    }
    form.addEventListener("input", () => updateHidden(form));
    form.addEventListener("submit", () => updateHidden(form));

    // Controls: clear, example, copy-result
    form.querySelectorAll('[data-action="clear"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        const hasValues = Array.from(
          form.querySelectorAll(".matrix input")
        ).some((inp) => inp.value.trim() !== "" && inp.value.trim() !== "0");
        const doClear = () => {
          form
            .querySelectorAll(".matrix input")
            .forEach((inp) => (inp.value = ""));
          updateHidden(form);
          if (window.Swal) {
            Swal.fire({
              toast: true,
              position: "top-end",
              timer: 1000,
              showConfirmButton: false,
              icon: "success",
              title: "Matrices vaciadas",
            });
          }
        };
        if (window.Swal && hasValues) {
          Swal.fire({
            icon: "warning",
            title: "Limpiar matrices",
            text: "Se borrarán todos los valores actuales.",
            showCancelButton: true,
            confirmButtonText: "Sí, limpiar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc2626",
          }).then((r) => {
            if (r.isConfirmed) doClear();
          });
        } else {
          doClear();
        }
      });
    });
    form.querySelectorAll('[data-action="example"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        const ex = btn.getAttribute("data-example");
        if (mode === "sum" && ex === "sum") {
          // A= [[1,2],[3,4]]; B= [[5,6],[7,8]]
          const [boxA, boxB] = matrices;
          doResize();
          const fillsA = ["1", "2", "3", "4"];
          const fillsB = ["5", "6", "7", "8"];
          [...boxA.querySelectorAll("input")].forEach(
            (i, idx) => (i.value = fillsA[idx] || "0")
          );
          [...boxB.querySelectorAll("input")].forEach(
            (i, idx) => (i.value = fillsB[idx] || "0")
          );
        }
        if (mode === "mul" && ex === "mul") {
          const [boxA, boxB] = matrices;
          form.querySelector('[data-target="rowsA"]').value = 2;
          form.querySelector('[data-target="colsArowsB"]').value = 2;
          form.querySelector('[data-target="colsB"]').value = 2;
          doResize();
          const fillsA = ["1", "2", "3", "4"];
          const fillsB = ["5", "6", "7", "8"];
          [...boxA.querySelectorAll("input")].forEach(
            (i, idx) => (i.value = fillsA[idx] || "0")
          );
          [...boxB.querySelectorAll("input")].forEach(
            (i, idx) => (i.value = fillsB[idx] || "0")
          );
        }
        if (mode === "aug") {
          const [boxA, boxB] = matrices;
          form.querySelector('[data-target="rows"]').value = 2;
          form.querySelector('[data-target="cols"]').value = 2;
          doResize();
          const fillsA = ["1", "2", "3", "4"];
          const fillsb = ["5", "11"];
          [...boxA.querySelectorAll("input")].forEach(
            (i, idx) => (i.value = fillsA[idx] || "0")
          );
          [...boxB.querySelectorAll("input")].forEach(
            (i, idx) => (i.value = fillsb[idx] || "0")
          );
        }
        updateHidden(form);
        if (window.Swal) {
          Swal.fire({
            toast: true,
            position: "top-end",
            timer: 1400,
            showConfirmButton: false,
            icon: "info",
            title: "Ejemplo cargado",
          });
        }
      });
    });

    form.querySelectorAll('[data-action="copy-result"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        const table = btn.closest(".panel").querySelector("table.matriz");
        if (!table) return;
        const text = Array.from(table.querySelectorAll("tr"))
          .map((tr) =>
            Array.from(tr.querySelectorAll("td"))
              .map((td) => td.innerText.trim())
              .join(" ")
          )
          .join("\n");
        navigator.clipboard
          .writeText(text)
          .then(() => {
            if (window.Swal) {
              Swal.fire({
                toast: true,
                position: "top-end",
                timer: 1400,
                showConfirmButton: false,
                icon: "success",
                title: "Resultado copiado",
              });
            } else {
              btn.textContent = "Copiado";
              setTimeout(() => (btn.textContent = "Copiar"), 1200);
            }
          })
          .catch(() => {
            if (window.Swal) {
              Swal.fire({
                icon: "error",
                title: "No se pudo copiar",
                timer: 1500,
                showConfirmButton: false,
              });
            }
          });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("form.matrix-form").forEach(initForm);
    // Keypad behavior
    const kp = document.getElementById("keypad");
    const fab = document.getElementById("keypadToggle");
    // Render keypad if not present (new layout)
    if (kp && !kp.children.length) {
      kp.innerHTML = `
        <div class="keypad-row">
          <button type="button" data-k="7">7</button>
          <button type="button" data-k="8">8</button>
          <button type="button" data-k="9">9</button>
          <button type="button" data-k="/">/</button>
        </div>
        <div class="keypad-row">
          <button type="button" data-k="4">4</button>
          <button type="button" data-k="5">5</button>
          <button type="button" data-k="6">6</button>
          <button type="button" data-k="-">-</button>
        </div>
        <div class="keypad-row">
          <button type="button" data-k="1">1</button>
          <button type="button" data-k="2">2</button>
          <button type="button" data-k="3">3</button>
          <button type="button" data-k="," >,</button>
        </div>
        <div class="keypad-row">
          <button type="button" data-k="0">0</button>
          <button type="button" data-k=".">.</button>
          <button type="button" data-k="back" class="danger">⌫</button>
          <button type="button" data-k="hide">✕</button>
        </div>`;
    }
    let currentInput = null;
    document.addEventListener("focusin", (e) => {
      const t = e.target;
      if (t && t.tagName === "INPUT" && t.closest(".matrix")) {
        currentInput = t;
        kp?.classList.remove("hidden");
      }
    });
    kp?.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn || !currentInput) return;
      const k = btn.getAttribute("data-k");
      if (k === "hide") {
        kp.classList.add("hidden");
        return;
      }
      if (k === "back") {
        currentInput.value = currentInput.value.slice(0, -1);
      } else {
        currentInput.value += k;
      }
      currentInput.dispatchEvent(new Event("input", { bubbles: true }));
      currentInput.focus();
    });
    // Toggle keypad via keyboard shortcut or future button
    document.addEventListener("keydown", (e) => {
      if (e.key === "F2") {
        kp?.classList.toggle("hidden");
      }
    });
    fab?.addEventListener("click", () => kp?.classList.toggle("hidden"));

    // Theme toggle
    const themeToggle = document.getElementById("themeToggle");
    const root = document.documentElement;
    const saved = localStorage.getItem("theme");
    if (saved) {
      root.setAttribute("data-theme", saved);
    }
    themeToggle?.addEventListener("click", () => {
      const current =
        root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      if (current === "light") root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", current);
      themeToggle.textContent = current === "dark" ? "☀️" : "🌙";
      if (window.Swal) {
        Swal.fire({
          toast: true,
          position: "top-end",
          timer: 1200,
          showConfirmButton: false,
          icon: current === "dark" ? "info" : "info",
          title: current === "dark" ? "Tema oscuro" : "Tema claro",
        });
      }
    });
    if (root.getAttribute("data-theme") === "dark") {
      themeToggle.textContent = "☀️";
    }

    // SweetAlert for server-side error blocks
    const err = document.querySelector(".alert-error");
    if (err && window.Swal) {
      const msg = err.textContent.trim();
      if (msg) {
        Swal.fire({ icon: "error", title: "Error", text: msg });
      }
    }

    // URL presets: allow predefining sizes and examples via query params
    (function applyUrlPresets() {
      const form = document.querySelector("form.matrix-form");
      if (!form) return;
      try {
        const sp = new URLSearchParams(location.search);
        const mode = form.dataset.mode;
        const setNum = (sel, v) => {
          const el = form.querySelector(sel);
          if (el && v != null) {
            el.value = +v;
          }
        };
        if (mode === "sum") {
          setNum('[data-target="rows"]', sp.get("rows"));
          setNum('[data-target="cols"]', sp.get("cols"));
        } else if (mode === "mul") {
          setNum('[data-target="rowsA"]', sp.get("rowsA"));
          setNum('[data-target="colsArowsB"]', sp.get("p"));
          setNum('[data-target="colsB"]', sp.get("colsB"));
        } else if (mode === "aug") {
          setNum('[data-target="rows"]', sp.get("rows"));
          setNum('[data-target="cols"]', sp.get("cols"));
        }
        // trigger resize if anything set
        if ([..."rows,cols,rowsA,p,colsB".split(",")].some((k) => sp.has(k))) {
          form.querySelector('[data-action="resize"]')?.click();
        }
        // Load simple examples
        const preset = sp.get("preset");
        if (preset === "example") {
          const exBtn = form.querySelector('[data-action="example"]');
          exBtn?.click();
        }
      } catch {}
    })();

    // Track recent operations when a result is visible
    (function trackRecents() {
      const resultPanel = document.querySelector(
        ".panel .matrix-result, section.panel .matrix-result"
      );
      const form = document.querySelector("form.matrix-form");
      if (!resultPanel || !form) return;
      try {
        const mode = form.dataset.mode; // sum|mul|aug
        const map = {
          sum: "Suma",
          mul: "Multiplicación",
          aug: "Gauss/Gauss‑Jordan",
        };
        const titleEl = document.querySelector(".panel .panel-title");
        const item = {
          ts: Date.now(),
          path: location.pathname + location.search,
          op: mode,
          opLabel: map[mode] || "Operación",
          title: titleEl ? titleEl.textContent.trim() : document.title,
        };
        const key = "recentOps";
        const arr = JSON.parse(localStorage.getItem(key) || "[]").filter(
          (x) => x && x.path
        );
        // de-dup by path, newest first
        const filtered = [
          item,
          ...arr.filter((x) => x.path !== item.path),
        ].slice(0, 6);
        localStorage.setItem(key, JSON.stringify(filtered));
      } catch {}
    })();

    // Header Recientes dropdown: populate & clear
    (function recentMenu() {
      const btn = document.getElementById("recentMenuBtn");
      const panel = document.getElementById("recentMenuPanel");
      const list = document.getElementById("recentMenuList");
      const clearBtn = document.getElementById("clearRecentsBtn");
      if (!btn || !panel) return;
      const fmtDate = (ts) => new Date(ts).toLocaleString();
      const render = () => {
        try {
          const data = JSON.parse(localStorage.getItem("recentOps") || "[]");
          list.innerHTML =
            (data || [])
              .slice(0, 10)
              .map(
                (x) => `<a href="${x.path}" class="block p-2 hover:bg-slate-50">
            <div class="text-xs text-slate-500">${fmtDate(x.ts)}</div>
            <div class="text-sm font-semibold">${x.opLabel || "Operación"}</div>
            <div class="text-xs text-slate-500 truncate">${x.title || ""}</div>
          </a>`
              )
              .join("") ||
            '<div class="p-2 text-sm text-slate-500">Sin elementos</div>';
        } catch {
          list.innerHTML =
            '<div class="p-2 text-sm text-slate-500">Sin elementos</div>';
        }
      };
      btn.addEventListener("click", () => {
        render();
        panel.classList.toggle("hidden");
      });
      document.addEventListener("click", (e) => {
        if (!panel.contains(e.target) && e.target !== btn) {
          panel.classList.add("hidden");
        }
      });
      clearBtn?.addEventListener("click", () => {
        try {
          localStorage.removeItem("recentOps");
        } catch {}
        render();
        // Also hide Home Recent section if present
        const homeSec = document.getElementById("recentSection");
        if (homeSec) {
          homeSec.classList.add("hidden");
        }
        if (window.Swal) {
          Swal.fire({
            toast: true,
            position: "top-end",
            timer: 1200,
            showConfirmButton: false,
            icon: "success",
            title: "Historial limpiado",
          });
        }
      });
    })();
  });
})();
