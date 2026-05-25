document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const messageDiv = document.getElementById('message');

    // Validar campos en tiempo real
    const inputs = ['nombre', 'cedula', 'email', 'password', 'confirmPassword'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.classList.add('invalid');
            } else {
                this.classList.remove('invalid');
            }
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Limpiar mensaje anterior
        messageDiv.textContent = '';
        messageDiv.className = 'message';
        
        // Obtener valores
        const nombre = document.getElementById('nombre').value.trim();
        const cedula = document.getElementById('cedula').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const emailReferidor = document.getElementById('emailReferidor').value.trim();
        const nickname = document.getElementById('nickname').value.trim();
        const fechaNacimiento = document.getElementById('fechaNacimiento').value;

        
        // Validaciones
        if (!nombre || !cedula || !email || !password || !confirmPassword) {
            showMessage('Por favor, completa todos los campos obligatorios', 'error');
            return;
        }
        //Validar nickname
        if (!nickname) {
            showMessage('Por favor, ingresa un nombre de usuario', 'error');
            return;
        }
        
        // Validar cédula (solo números)
        if (!/^\d+$/.test(cedula)) {
            showMessage('La cédula solo debe contener números', 'error');
            return;
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Ingresa un correo electrónico válido', 'error');
            return;
        }
        
        // Validar contraseña (mínimo 6 caracteres)
        if (password.length < 6) {
            showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }
        
        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            showMessage('Las contraseñas no coinciden', 'error');
            return;
        }
        
        // Validar email del referidor si se proporcionó
        if (emailReferidor && !emailRegex.test(emailReferidor)) {
            showMessage('El email del referidor no es válido', 'error');
            return;
        }
        
        // Mostrar loading
        const submitBtn = document.querySelector('.btn-register');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Registrando...';
        submitBtn.disabled = true;
        
        try {
            // Preparar datos para enviar
            const requestData = {
                nombre: nombre,
                cedula: cedula,
                email: email,
                password: password,
                nickname: nickname
            };
            
            if (emailReferidor) {
                requestData.email_referidor = emailReferidor;
            }
            if (fechaNacimiento) {
                requestData.fecha_nacimiento = fechaNacimiento;
            }
            
            const response = await fetch('/api/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showMessage('¡Registro exitoso! Redirigiendo al inicio de sesión...', 'success');
                // Limpiar formulario
                form.reset();
                // Redirigir después de 2 segundos
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1000);
            } else {
                showMessage(data.error || 'Error al registrarse', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Error de conexión con el servidor', 'error');
        } finally {
            // Restaurar botón
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
    }
    
    // Validar confirmación de contraseña en tiempo real
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    
    function validatePasswordMatch() {
        if (confirmInput.value && passwordInput.value !== confirmInput.value) {
            confirmInput.classList.add('invalid');
        } else {
            confirmInput.classList.remove('invalid');
        }
    }
    
    passwordInput.addEventListener('input', validatePasswordMatch);
    confirmInput.addEventListener('input', validatePasswordMatch);
});