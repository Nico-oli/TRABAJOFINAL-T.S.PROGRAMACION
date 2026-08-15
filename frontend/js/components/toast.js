// Toast de confirmación (usado tras justificar una falta). Espera un
// <div id="toast" class="toast" hidden></div> en el HTML de la página.
let hideTimer = null;

export function showToast(message, duration = 2200) {
  const el = document.getElementById('toast');
  if (!el) return;

  el.textContent = message;
  el.hidden = false;

  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    el.hidden = true;
  }, duration);
}
