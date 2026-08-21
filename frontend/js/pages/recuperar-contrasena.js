// TODO: pantalla no incluida en el mockup original — ver el comentario en
// recuperar-contrasena.html. No hay endpoint de recuperación de
// contraseña en el backend todavía, así que el submit no llama a la API:
// sólo confirma visualmente que el formulario "se envió".
const form = document.getElementById('recover-form');
const messageEl = document.getElementById('recover-message');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('recover-email').value.trim();

  messageEl.textContent = email
    ? `Si "${email}" corresponde a una cuenta registrada, vas a recibir instrucciones (función no conectada todavía).`
    : 'Ingresá tu email para continuar.';
  messageEl.hidden = false;
});
