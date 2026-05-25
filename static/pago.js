const PRECIO_COMPRA = 10.00;
const PRECIO_ALQUILER = 3.50;

const token = localStorage.getItem('token');
if (!token) window.location.href = '/login';

const CARRITO_KEY = 'carrito_' + (localStorage.getItem('email') || 'guest');
let carrito = JSON.parse(localStorage.getItem(CARRITO_KEY) || '[]');
let tiposSeleccionados = {};

carrito.forEach(item => {
    tiposSeleccionados[item.id] = 'ALQUILER';
});

document.getElementById('btnVolver').addEventListener('click', () => {
    window.location.href = '/dashboard';
});

async function cargarPerfil() {
    const res = await fetch('/api/perfil', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    saldoCliente = parseFloat(data.saldo);
    document.getElementById('puntosActuales').textContent = data.puntos;
    actualizarResumen();
}

function calcularTotal() {
    return carrito.reduce((sum, item) => {
        const tipo = tiposSeleccionados[item.id] || 'ALQUILER';
        return sum + (tipo === 'COMPRA' ? PRECIO_COMPRA : PRECIO_ALQUILER);
    }, 0);
}

function calcularPuntosGanar() {
    return carrito.reduce((sum, item) => {
        const tipo = tiposSeleccionados[item.id] || 'ALQUILER';
        return sum + (tipo === 'COMPRA' ? 2 : 1);
    }, 0);
}

function actualizarResumen() {
    const total = calcularTotal();
    const puntosGanar = calcularPuntosGanar();
    const puntosDisponibles = parseInt(document.getElementById('puntosActuales').textContent) || 0;
    const puntosNecesarios = carrito.length * 20;  // 20 puntos por video (regla de negocio)

    document.getElementById('totalPagar').textContent = `$${total.toFixed(2)}`;
    document.getElementById('puntosGanar').textContent = `+${puntosGanar} pts`;

    const infoEl = document.getElementById('saldoRestanteInfo');
    const btnConfirmar = document.getElementById('btnConfirmar');
    const btnTarjeta = document.getElementById('btnTarjeta');

    if (puntosDisponibles >= puntosNecesarios) {
        infoEl.style.color = '#00FF9D';
        infoEl.textContent = `Usarás ${puntosNecesarios} puntos (20 por video). Te quedan ${puntosDisponibles - puntosNecesarios} pts`;
        btnConfirmar.disabled = false;
        btnConfirmar.style.display = 'block';
        btnTarjeta.style.display = 'block';
    } else {
        infoEl.style.color = '#aaaaaa';
        infoEl.textContent = `No tienes puntos suficientes (necesitas ${puntosNecesarios} pts, tienes ${puntosDisponibles})`;
        btnConfirmar.disabled = true;
        btnConfirmar.style.display = 'none';
        btnTarjeta.style.display = 'block';
    }
}

function renderizarItems() {
    const lista = document.getElementById('listaItems');

    if (carrito.length === 0) {
        lista.innerHTML = '<div class="carrito-vacio-pago">No hay items en tu carrito</div>';
        document.getElementById('btnConfirmar').disabled = true;
        return;
    }

    let html = '';
    carrito.forEach(item => {
        const esSerie = item.id.toString().startsWith('serie-');
        const tipoActual = tiposSeleccionados[item.id] || 'ALQUILER';
        const precio = tipoActual === 'COMPRA' ? PRECIO_COMPRA : PRECIO_ALQUILER;

        html += `
            <div class="item-pago" data-id="${item.id}">
                <div class="item-poster">
                    ${item.urlImagen
                        ? `<img src="${item.urlImagen}" onerror="this.style.display='none'">`
                        : (esSerie ? '📺' : '🎬')
                    }
                </div>
                <div class="item-info">
                    <div class="item-titulo">${item.titulo}</div>
                    <div class="item-tipo-selector">
                        <button class="tipo-btn ${tipoActual === 'ALQUILER' ? 'selected' : ''}" 
                                data-id="${item.id}" data-tipo="ALQUILER">
                            Alquilar $${PRECIO_ALQUILER.toFixed(2)}
                        </button>
                        <button class="tipo-btn ${tipoActual === 'COMPRA' ? 'selected' : ''}" 
                                data-id="${item.id}" data-tipo="COMPRA">
                            Comprar $${PRECIO_COMPRA.toFixed(2)}
                        </button>
                    </div>
                </div>
                <div class="item-precio" id="precio-${item.id}">$${precio.toFixed(2)}</div>
                <button class="item-eliminar" data-id="${item.id}">✕</button>
            </div>
        `;
    });
    lista.innerHTML = html;

    document.querySelectorAll('.tipo-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const tipo = btn.getAttribute('data-tipo');
            tiposSeleccionados[id] = tipo;

            document.querySelectorAll(`.tipo-btn[data-id="${id}"]`).forEach(b => {
                b.classList.toggle('selected', b.getAttribute('data-tipo') === tipo);
            });

            const precio = tipo === 'COMPRA' ? PRECIO_COMPRA : PRECIO_ALQUILER;
            document.getElementById(`precio-${id}`).textContent = `$${precio.toFixed(2)}`;
            actualizarResumen();
        });
    });

    document.querySelectorAll('.item-eliminar').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            carrito = carrito.filter(item => item.id !== id);
            localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
            delete tiposSeleccionados[id];
            renderizarItems();
            actualizarResumen();
        });
    });
}

// ============================================
// UTILIDADES TARJETA
// ============================================

function luhn(numero) {
    const digits = numero.replace(/\s/g, '').split('').reverse().map(Number);
    const sum = digits.reduce((acc, d, i) => {
        if (i % 2 !== 0) {
            d *= 2;
            if (d > 9) d -= 9;
        }
        return acc + d;
    }, 0);
    return sum % 10 === 0;
}

function detectarTipoTarjeta(numero) {
    const n = numero.replace(/\s/g, '');
    if (/^4/.test(n)) return 'visa';
    if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard';
    return null;
}

function formatearNumero(valor) {
    return valor.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatearVencimiento(valor) {
    const digits = valor.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
}

// ============================================
// PAGO CON PUNTOS
// ============================================

document.getElementById('btnConfirmar').addEventListener('click', async () => {
    const btnConfirmar = document.getElementById('btnConfirmar');
    const mensajeEl = document.getElementById('mensajePago');

    btnConfirmar.disabled = true;
    btnConfirmar.textContent = 'Procesando...';
    mensajeEl.textContent = '';
    mensajeEl.className = 'mensaje-pago';

    const items = carrito.map(item => {
        const esSerie = item.id.toString().startsWith('serie-');
        return {
            id: item.id.toString().replace('serie-', ''),
            tipo: tiposSeleccionados[item.id] || 'ALQUILER',
            es_serie: esSerie
        };
    });

    try {
        const res = await fetch('/api/pagar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ items, metodo_pago: 'PUNTOS' })
        });
        const data = await res.json();

        if (res.ok) {
            mensajeEl.className = 'mensaje-pago success';
            mensajeEl.textContent = `✓ Pago exitoso. Puntos ganados: ${data.puntos_ganados}`;
            localStorage.removeItem(CARRITO_KEY);
            setTimeout(() => { window.location.href = '/dashboard'; }, 2000);
        } else {
            mensajeEl.className = 'mensaje-pago error';
            mensajeEl.textContent = data.error || 'Error al procesar el pago';
            btnConfirmar.disabled = false;
            btnConfirmar.textContent = 'Confirmar pago';
        }
    } catch (error) {
        mensajeEl.className = 'mensaje-pago error';
        mensajeEl.textContent = 'Error de conexión';
        btnConfirmar.disabled = false;
        btnConfirmar.textContent = 'Confirmar pago';
    }
});

// ============================================
// MODAL PASARELA DE PAGOS
// ============================================

document.getElementById('btnTarjeta').addEventListener('click', () => {
    document.getElementById('totalModal').textContent = `$${calcularTotal().toFixed(2)}`;
    document.getElementById('modalPagoOverlay').style.display = 'flex';
    document.getElementById('mensajeModal').textContent = '';
});

document.getElementById('modalCerrar').addEventListener('click', () => {
    document.getElementById('modalPagoOverlay').style.display = 'none';
});

// Cerrar modal al hacer click fuera
document.getElementById('modalPagoOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalPagoOverlay')) {
        document.getElementById('modalPagoOverlay').style.display = 'none';
    }
});

// Número de tarjeta
document.getElementById('numeroTarjeta').addEventListener('input', (e) => {
    const formatted = formatearNumero(e.target.value);
    e.target.value = formatted;

    const raw = formatted.replace(/\s/g, '');
    const tipo = detectarTipoTarjeta(raw);
    const badge = document.getElementById('tipoTarjetaBadge');
    const tarjeta = document.getElementById('tarjetaVisual');
    const logo = document.getElementById('tarjetaLogo');

    const partes = formatted.padEnd(19, '•').split(' ');
    document.getElementById('tarjetaNumeroDisplay').textContent =
        partes.map(p => p.padEnd(4, '•')).join(' ');

    if (tipo === 'visa') {
        badge.textContent = 'VISA';
        badge.className = 'tipo-tarjeta-badge visa';
        tarjeta.className = 'tarjeta-visual visa';
        logo.innerHTML = '<img src="/static/visa.png" alt="VISA" style="height:32px; object-fit:contain;">';
    } else if (tipo === 'mastercard') {
        badge.textContent = 'MASTERCARD';
        badge.className = 'tipo-tarjeta-badge mastercard';
        tarjeta.className = 'tarjeta-visual mastercard';
        logo.innerHTML = '<img src="/static/mastercard.png" alt="Mastercard" style="height:32px; object-fit:contain;">';
    } else {
        badge.textContent = '';
        badge.className = 'tipo-tarjeta-badge';
        tarjeta.className = 'tarjeta-visual';
        logo.textContent = '';
    }

    if (raw.length === 16) {
        e.target.classList.toggle('valido', luhn(raw));
        e.target.classList.toggle('invalido', !luhn(raw));
    } else {
        e.target.classList.remove('valido', 'invalido');
    }
});

// Titular
document.getElementById('titularTarjeta').addEventListener('input', (e) => {
    document.getElementById('tarjetaTitularDisplay').textContent =
        e.target.value.toUpperCase() || 'NOMBRE APELLIDO';
});

// Vencimiento
document.getElementById('vencimiento').addEventListener('input', (e) => {
    e.target.value = formatearVencimiento(e.target.value);
    document.getElementById('tarjetaVenceDisplay').textContent = e.target.value || 'MM/AA';
});

// Pagar con tarjeta
document.getElementById('btnPagarModal').addEventListener('click', async () => {
    const numero = document.getElementById('numeroTarjeta').value.replace(/\s/g, '');
    const titular = document.getElementById('titularTarjeta').value.trim();
    const vencimiento = document.getElementById('vencimiento').value;
    const cvv = document.getElementById('cvv').value.trim();
    const mensajeEl = document.getElementById('mensajeModal');
    const btnPagar = document.getElementById('btnPagarModal');

    mensajeEl.textContent = '';
    mensajeEl.className = 'mensaje-modal';

    if (numero.length !== 16) {
        mensajeEl.className = 'mensaje-modal error';
        mensajeEl.textContent = 'Número de tarjeta inválido';
        return;
    }
    if (!luhn(numero)) {
        mensajeEl.className = 'mensaje-modal error';
        mensajeEl.textContent = 'Número de tarjeta inválido';
        return;
    }
    const tipo = detectarTipoTarjeta(numero);
    if (!tipo) {
        mensajeEl.className = 'mensaje-modal error';
        mensajeEl.textContent = 'Solo se aceptan Visa y Mastercard';
        return;
    }
    if (!titular) {
        mensajeEl.className = 'mensaje-modal error';
        mensajeEl.textContent = 'Ingresa el nombre del titular';
        return;
    }
    if (!/^\d{2}\/\d{2}$/.test(vencimiento)) {
        mensajeEl.className = 'mensaje-modal error';
        mensajeEl.textContent = 'Fecha de vencimiento inválida';
        return;
    }
    const [mes, anio] = vencimiento.split('/').map(Number);
    const ahora = new Date();
    const anioCompleto = 2000 + anio;
    if (mes < 1 || mes > 12 || anioCompleto < ahora.getFullYear() ||
        (anioCompleto === ahora.getFullYear() && mes < ahora.getMonth() + 1)) {
        mensajeEl.className = 'mensaje-modal error';
        mensajeEl.textContent = 'Tarjeta vencida';
        return;
    }
    if (cvv.length < 3) {
        mensajeEl.className = 'mensaje-modal error';
        mensajeEl.textContent = 'CVV inválido';
        return;
    }

    btnPagar.disabled = true;
    btnPagar.textContent = 'Procesando...';

    const items = carrito.map(item => {
        const esSerie = item.id.toString().startsWith('serie-');
        return {
            id: item.id.toString().replace('serie-', ''),
            tipo: tiposSeleccionados[item.id] || 'ALQUILER',
            es_serie: esSerie
        };
    });

    try {
        const res = await fetch('/api/pagar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ items, metodo_pago: 'TARJETA' })
        });
        const data = await res.json();

        if (res.ok) {
            mensajeEl.className = 'mensaje-modal success';
            mensajeEl.textContent = `✓ Pago exitoso. Puntos ganados: ${data.puntos_ganados}`;
            localStorage.removeItem(CARRITO_KEY);
            setTimeout(() => { window.location.href = '/dashboard'; }, 2000);
        } else {
            mensajeEl.className = 'mensaje-modal error';
            mensajeEl.textContent = data.error || 'Error al procesar';
            btnPagar.disabled = false;
            btnPagar.textContent = 'Pagar ahora';
        }
    } catch (error) {
        mensajeEl.className = 'mensaje-modal error';
        mensajeEl.textContent = 'Error de conexión';
        btnPagar.disabled = false;
        btnPagar.textContent = 'Pagar ahora';
    }
});

// ============================================
// INICIALIZAR
// ============================================
cargarPerfil();
renderizarItems();