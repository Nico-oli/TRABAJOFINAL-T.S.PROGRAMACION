// Diálogo modal "Justificar falta" (pantalla Alumno del Administrador).
// Sólo maneja mostrar/ocultar y leer los campos; el guardado real lo hace
// la página vía el callback onConfirm (capa de servicios, no acá).
//
// TODO: el backend no tiene un endpoint de "justificar falta" ni campos
// para fecha/motivo de la justificación (AlumnoActualizarRequest sólo
// admite sobreescribir el conteo `faltas`). Los campos Fecha y Motivo del
// mockup se conservan visualmente porque son parte del diseño, pero hoy
// no se persisten — sólo se usan para decrementar el conteo de faltas en
// 1, igual que hacía el mockup de demo. Si se agrega un endpoint que
// registre motivo/fecha, hay que enviarlos acá.
export function initJustifyDialog({ studentName, onConfirm }) {
  const backdrop = document.getElementById('justify-backdrop');
  if (!backdrop) return;

  const nameEl = document.getElementById('justify-name');
  const dateInput = document.getElementById('justify-date');
  const reasonInput = document.getElementById('justify-reason');
  const openBtn = document.getElementById('justify-open-btn');
  const cancelBtn = document.getElementById('justify-cancel-btn');
  const confirmBtn = document.getElementById('justify-confirm-btn');

  nameEl.textContent = studentName;
  const today = new Date();
  dateInput.value = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}`;

  openBtn.addEventListener('click', () => {
    reasonInput.value = '';
    backdrop.hidden = false;
  });

  cancelBtn.addEventListener('click', () => {
    backdrop.hidden = true;
  });

  confirmBtn.addEventListener('click', async () => {
    confirmBtn.disabled = true;
    try {
      await onConfirm({ fecha: dateInput.value, motivo: reasonInput.value });
    } catch (err) {
      // onConfirm (definido por cada página) es quien debería mostrar el
      // error al usuario (ver admin-alumno.js, que ya lo hace con un
      // toast). Esto es sólo una red de seguridad para que, si algún
      // onConfirm futuro no atrapa sus propios errores, el diálogo no
      // quede trabado en pantalla — se cierra igual y el error queda
      // logueado para debug.
      console.error('[justify-dialog] onConfirm rechazó la promesa:', err);
    } finally {
      backdrop.hidden = true;
      confirmBtn.disabled = false;
    }
  });
}
