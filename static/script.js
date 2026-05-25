    document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Limpiar mensaje anterior
        messageDiv.textContent = '';
        messageDiv.style.color = '#ff6b6b';

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Guardar token y datos del usuario
                localStorage.setItem('token', data.token);
                localStorage.setItem('nombre', data.nombre);
                localStorage.setItem('nickname', data.nickname);
                localStorage.setItem('rol', data.rol);
                localStorage.setItem('email', email);
                localStorage.setItem('cadula', data.cedula);
                messageDiv.style.color = '#4caf50';
                messageDiv.textContent = 'Inicio de sesión exitoso. Redirigiendo...';
                // Redirigir según el rol (más adelante cambiaremos)
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
            } else {
                messageDiv.textContent = data.error || 'Error al iniciar sesión';
            }
        } catch (error) {
            messageDiv.textContent = 'Error de conexión con el servidor';
            console.error(error);
        }
    });

    // Enlace de registro (por ahora solo alerta)
    const registerLink = document.getElementById('registerLink');
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Próximamente: formulario de registro');
        });
    }
});