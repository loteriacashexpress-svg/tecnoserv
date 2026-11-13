document.addEventListener('DOMContentLoaded', () => {
  // Selecciona todos los inputs de contraseña en la página actual
  const passwordInputs = document.querySelectorAll('input[type="password"]');

  passwordInputs.forEach(input => {
    // Evitar duplicar si ya fue envuelto
    if (input.parentElement.classList.contains('password-wrapper')) return;

    // Crear un contenedor relativo para posicionar el botón del ojito
    const wrapper = document.createElement('div');
    wrapper.className = 'password-wrapper';
    wrapper.style.position = 'relative';
    wrapper.style.display = 'block';
    wrapper.style.width = '100%';

    // Reinsertar el input dentro del wrapper
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    // Ajustar el padding derecho del input para que el texto no choque con el ícono
    input.style.paddingRight = '40px';

    // Crear el botón del ícono (Ojito)
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.innerHTML = '👁️';
    toggleBtn.style.position = 'absolute';
    toggleBtn.style.right = '12px';
    toggleBtn.style.top = '50%';
    toggleBtn.style.transform = 'translateY(-50%)';
    toggleBtn.style.background = 'transparent';
    toggleBtn.style.border = 'none';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.fontSize = '1.1rem';
    toggleBtn.style.padding = '0';
    toggleBtn.style.zIndex = '10';
    toggleBtn.title = 'Mostrar / Ocultar contraseña';

    // Evento para alternar entre texto y contraseña
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (input.type === 'password') {
        input.type = 'text';
        toggleBtn.innerHTML = '🔒'; // Cambia a candado o puedes usar otro emoji
      } else {
        input.type = 'password';
        toggleBtn.innerHTML = '👁️';
      }
    });

    wrapper.appendChild(toggleBtn);
  });
});
