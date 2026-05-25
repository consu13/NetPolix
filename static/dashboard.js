document.addEventListener('DOMContentLoaded', () => {
    // Verificar token
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }
    
    // Obtener datos del usuario
    const nickname = localStorage.getItem('nickname');
    const nombre = localStorage.getItem('nombre');
    const email = localStorage.getItem('email') || 'usuario@email.com';
    const cedula = localStorage.getItem('cedula');
    
    // Mostrar nickname en el header
    const userNicknameSpan = document.getElementById('userNickname');
    if (userNicknameSpan) {
        if (nickname && nickname !== 'null') {
            userNicknameSpan.textContent = nickname;
        } else if (nombre) {
            userNicknameSpan.textContent = nombre;
        } else {
            userNicknameSpan.textContent = 'Usuario';
        }
    }
    
    // Mostrar datos en el menú lateral
    const menuNickname = document.getElementById('menuNickname');
    const menuEmail = document.getElementById('menuEmail');
    
    if (menuNickname) {
        menuNickname.textContent = nickname || nombre || 'Usuario';
    }
    if (menuEmail) {
        menuEmail.textContent = email;
    }
    
    // Configurar avatar con iniciales
    const userAvatar = document.getElementById('userAvatar');
    const menuAvatar = document.getElementById('menuAvatar');
    
    function setupAvatar(avatarElement, name) {
        if (avatarElement) {
            avatarElement.onerror = function() {
                this.style.display = 'none';
                const parent = this.parentElement;
                const initials = document.createElement('div');
                initials.className = 'avatar-initials';
                const displayName = name || 'U';
                const firstLetter = displayName.charAt(0).toUpperCase();
                initials.textContent = firstLetter;
                parent.appendChild(initials);
            };
        }
    }
    
function crearCardVideo(video) {
        function fmtP(p) { return (p % 1 === 0 ? String(Math.round(p)) : p.toFixed(1)) + '/4'; }
        return `
            <div class="video-card" style="position:relative;">
                <div class="video-poster">
                    <img src="${video.url_imagen}" alt="${video.titulo}" class="poster-img"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <div class="poster-placeholder" style="display:none"><span>🎬</span></div>
                </div>
                <h3>${video.titulo}</h3>
                <p>Año: ${video.anio} | Duración: ${video.duracion} min</p>
                ${video.promedio > 0 ? `<p style="color:#f5c518;">Calificación: ${fmtP(video.promedio)}</p>` : ''}
                ${video.clasificacion ? `<p style="color:#aaa; font-size:11px; margin-top:2px;">Clasificación: ${video.clasificacion}</p>` : ''}
                <div class="stars-row">
                    <div class="stars" id="stars-${video.id}">
                        <span class="star" data-video="${video.id}" data-val="1">★</span>
                        <span class="star" data-video="${video.id}" data-val="2">★</span>
                        <span class="star" data-video="${video.id}" data-val="3">★</span>
                        <span class="star" data-video="${video.id}" data-val="4">★</span>
                    </div>
                    <div class="promedio-badge" id="prom-${video.id}">Sin calificaciones</div>
                </div>
                <div class="tu-voto-label" id="voto-label-${video.id}"></div>
                <button class="btn-agregar-carrito" data-id="${video.id}" data-titulo="${video.titulo}" data-imagen="${video.url_imagen || ''}" title="Agregar al carrito">+</button>
            </div>
        `;
    }

    function crearCardSerie(serie) {
        return `
            <div class="video-card serie-card" data-titulo="${serie.titulo}" style="position:relative; cursor:pointer">
                <div class="video-poster" style="position:relative;">
                    <img src="${serie.url_imagen}" alt="${serie.titulo}" class="poster-img"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <div class="poster-placeholder" style="display:none"><span>📺</span></div>
                    <button class="btn-agregar-carrito" data-id="serie-${serie.id}" data-titulo="${serie.titulo}" data-imagen="${serie.url_imagen || ''}" title="Agregar al carrito">+</button>
                </div>
                <h3>${serie.titulo}</h3>
                <p>${serie.total_temporadas} temporada${serie.total_temporadas > 1 ? 's' : ''}</p>
                <div class="temporadas-container" id="temp-${serie.id}" style="display:none"></div>
            </div>
        `;
    }

async function mostrarInicio() {
    vistaActual = 'INICIO';
    const contentArea = document.getElementById('contentArea');
    const token = localStorage.getItem('token');

    contentArea.innerHTML = `
        <div style="padding: 30px; width: 100%;">
            <h2 style="color: white; font-size: 24px; margin-bottom: 20px;">Películas destacadas</h2>
            <div class="videos-grid" id="peliculasInicio"></div>
            <h2 style="color: white; font-size: 24px; margin: 30px 0 20px;">Series</h2>
            <div class="videos-grid" id="seriesInicio"></div>
        </div>
    `;

    try {
        const response = await fetch('/api/inicio', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        // Renderizar películas
        const gridPeliculas = document.getElementById('peliculasInicio');
        gridPeliculas.innerHTML = data.peliculas.map(crearCardVideo).join('');

        // Renderizar series
        const gridSeries = document.getElementById('seriesInicio');
        gridSeries.innerHTML = data.series.map(crearCardSerie).join('');        

        // Eventos botones carrito
        document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                const titulo = btn.getAttribute('data-titulo');
                const urlImagen = btn.getAttribute('data-imagen');
                const tipo = id.toString().startsWith('serie-') ? 'SERIE' : 'PELICULA';
                agregarAlCarrito(id, titulo, urlImagen, tipo);
                btn.textContent = '✓';
                setTimeout(() => { btn.textContent = '+'; }, 1000);
            });
        });

        // Eventos series
        document.querySelectorAll('.serie-card').forEach(card => {
            card.addEventListener('click', async (e) => {
                if (e.target.classList.contains('btn-agregar-carrito')) return;
                const titulo = card.getAttribute('data-titulo');
                const tempContainer = card.querySelector('.temporadas-container');

                if (tempContainer.style.display === 'block') {
                    tempContainer.style.display = 'none';
                    return;
                }

                tempContainer.innerHTML = '<p style="color:#aaa">Cargando temporadas...</p>';
                tempContainer.style.display = 'block';

                const res = await fetch(`/api/series/${encodeURIComponent(titulo)}/temporadas`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();

                if (data.temporadas && data.temporadas.length > 0) {
                    let html = '<div style="margin-top:10px; border-top: 1px solid #4a4a48; padding-top:10px;">';
                    data.temporadas.forEach(t => {
                        html += `<div class="temporada-item" data-id="${t.id}" data-temporada="${t.temporada}"
                                      style="padding:8px 0; display:flex; justify-content:space-between; align-items:center; color:#e0e0e0; border-bottom:1px solid #3e3e3c; cursor:pointer;">
                            <span>Temporada ${t.temporada}</span>
                            <button class="btn-add-temporada" data-id="${t.id}" data-num="${t.temporada}"
                                    style="background:#00FF9D; color:#000; border:none; border-radius:50%; width:22px; height:22px; cursor:pointer; font-size:14px; flex-shrink:0;">+</button>
                        </div>`;
                    });
                    html += '</div>';
                    tempContainer.innerHTML = html;

                    tempContainer.querySelectorAll('.btn-add-temporada').forEach(btn => {
                        btn.addEventListener('click', async (e) => {
                            e.stopPropagation();
                            const res = await fetch(`/api/series/${btn.getAttribute('data-id')}/episodios`, {
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            const epData = await res.json();
                            if (epData.episodios) {
                                epData.episodios.forEach(ep => agregarAlCarrito(String(ep.id), ep.titulo, null, 'EPISODIO'));
                            }
                            btn.textContent = '✓';
                            setTimeout(() => { btn.textContent = '+'; }, 1000);
                        });
                    });

                    tempContainer.querySelectorAll('.temporada-item').forEach(item => {
                        item.addEventListener('click', async (e) => {
                            if (e.target.classList.contains('btn-add-temporada')) return;
                            e.stopPropagation();
                            const existing = item.nextElementSibling;
                            if (existing && existing.classList.contains('episodios-inline')) {
                                existing.style.display = existing.style.display === 'none' ? 'block' : 'none';
                                return;
                            }
                            const episodiosDiv = document.createElement('div');
                            episodiosDiv.className = 'episodios-inline';
                            episodiosDiv.innerHTML = '<p style="color:#aaa; padding:6px 0 6px 16px; font-size:13px;">Cargando...</p>';
                            item.after(episodiosDiv);
                            const res = await fetch(`/api/series/${item.getAttribute('data-id')}/episodios`, {
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            const epData = await res.json();
                            if (epData.episodios && epData.episodios.length > 0) {
                                episodiosDiv.innerHTML = epData.episodios.map(ep =>
                                    `<div style="padding:6px 8px 6px 16px; color:#ccc; font-size:13px; border-bottom:1px solid #2a2a2a; display:flex; justify-content:space-between; align-items:center;">
                                        <span>${ep.titulo} <span style="color:#888">(${ep.duracion} min)</span></span>
                                        <button class="btn-add-ep" data-id="${ep.id}" data-titulo="${ep.titulo}"
                                                style="background:#00FF9D; color:#000; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size:12px; flex-shrink:0;">+</button>
                                    </div>`
                                ).join('');
                                episodiosDiv.querySelectorAll('.btn-add-ep').forEach(btn => {
                                    btn.addEventListener('click', (e) => {
                                        e.stopPropagation();
                                        agregarAlCarrito(btn.getAttribute('data-id'), btn.getAttribute('data-titulo'), null, 'EPISODIO');
                                        btn.textContent = '✓';
                                        setTimeout(() => { btn.textContent = '+'; }, 1000);
                                    });
                                });
                            } else {
                                episodiosDiv.innerHTML = '<p style="color:#aaa; padding:6px 0 6px 16px; font-size:13px;">Sin capítulos registrados</p>';
                            }
                        });
                    });
                } else {
                    tempContainer.innerHTML = '<p style="color:#aaa">Sin temporadas registradas</p>';
                }
            });
        });

    } catch (error) {
        console.error('Error al cargar inicio:', error);
    }
}

async function mostrarEpisodios(idSerie, temporada, titulo) {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/series/${idSerie}/episodios`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
        <div style="padding: 30px; width: 100%;">
            <h2 style="color: white; margin-bottom: 20px;">${titulo} — Temporada ${temporada}</h2>
            <div class="videos-grid" id="episodiosGrid"></div>
            <button class="btn-volver" onclick="mostrarInicio()">← Volver</button>
        </div>
    `;

    const grid = document.getElementById('episodiosGrid');
    if (data.episodios && data.episodios.length > 0) {
        let html = '';
        data.episodios.forEach(ep => {
            html += `
                <div class="video-card">
                    <div class="video-poster">
                        <div class="poster-placeholder" style="display:flex"><span>📺</span></div>
                    </div>
                    <h3>${ep.titulo}</h3>
                    <p>Duración: ${ep.duracion} min</p>
                </div>
            `;
        });
        grid.innerHTML = html;
    } else {
        grid.innerHTML = '<p style="color:white">Sin episodios registrados</p>';
    }
}

    const displayName = nickname || nombre || 'Usuario';
    setupAvatar(userAvatar, displayName);
    setupAvatar(menuAvatar, displayName);

    // Cargar foto de perfil guardada al iniciar
    (async () => {
        try {
            const rp = await fetch('/api/perfil', { headers: { 'Authorization': `Bearer ${token}` } });
            const dp = await rp.json();
            if (dp.foto_perfil) {
                const src = `/static/foto_perfil/${dp.foto_perfil}`;
                if (userAvatar) userAvatar.src = src;
                if (menuAvatar) menuAvatar.src = src;
            }
        } catch(e) {}
    })();
    
    // Abrir/cerrar menú al hacer clic en el perfil
    const userProfile = document.getElementById('userProfile');
    const sideMenu = document.getElementById('sideMenu');
    
    if (userProfile && sideMenu) {
        userProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            sideMenu.classList.toggle('open');
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (event) => {
            if (!userProfile.contains(event.target) && !sideMenu.contains(event.target)) {
                sideMenu.classList.remove('open');
            }
        });
    }
    
    // Cerrar sesión desde el menú
    const menuLogoutBtn = document.getElementById('menuLogoutBtn');
    if (menuLogoutBtn) {
        menuLogoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = '/login';
        });
    }
    //Volver al inicio
    const menuInicio = document.getElementById('menuInicio');
    if (menuInicio) {
        menuInicio.addEventListener('click', (e) => {
            e.preventDefault();
            sideMenu.classList.remove('open');
            mostrarDropdownCategorias(true);
            mostrarInicio();
        });
    }
    
    // Mi Cuenta - Editar perfil
    const menuMiCuenta = document.getElementById('menuMiCuenta');
    const contentArea = document.getElementById('contentArea');

    let misVideosData = [];
    let vistaActual = 'INICIO';
    const VALOR_MAP = ['MALA', 'REGULAR', 'BUENA', 'EXCELENTE'];
    let outsideClickHandler = null;

    if (menuMiCuenta) {
        menuMiCuenta.addEventListener('click', async (e) => {
            e.preventDefault();
            sideMenu.classList.remove('open');
            mostrarDropdownCategorias(false);

            const currentNickname = localStorage.getItem('nickname') || 'No asignado';
            const currentNombre = localStorage.getItem('nombre') || 'No asignado';

            // Traer datos de perfil actuales
            let fotoActual = null;
            let tieneFecha = false;
            try {
                const rp = await fetch('/api/perfil', { headers: { 'Authorization': `Bearer ${token}` } });
                const dp = await rp.json();
                fotoActual = dp.foto_perfil || null;
                tieneFecha = dp.tiene_fecha_nacimiento || false;
            } catch(err) {}

            const avatarSrc = fotoActual
                ? `/static/foto_perfil/${fotoActual}`
                : '/static/avatar-default.png';

            const FOTOS = [
                'perfil_1.jpg','perfil_2.webp','perfil_3.jpeg','perfil_4.webp','perfil_5.webp',
                'perfil_6.jpg','perfil_7.jpg','perfil_8.webp','perfil_9.jpg'
            ];

            // Mostrar perfil
            contentArea.innerHTML = `
                <div class="profile-section">
                    <div class="profile-card">
                        <div style="display: flex; align-items: flex-start; gap: 30px;">
                            <div class="profile-avatar" style="position:relative; cursor:pointer;" id="avatarWrapper" title="Cambiar foto">
                                <img id="avatarImg" src="${avatarSrc}" alt="Avatar" style="width:150px;height:150px;object-fit:cover;border-radius:50%;">
                                <div style="position:absolute;bottom:6px;right:6px;font-size:18px;">✏️</div>
                            </div>
                            <div style="flex: 1; min-width: 400px;">
                                <div class="profile-field" data-field="nombre">
                                    <div class="field-info">
                                        <span class="field-label">NOMBRE</span>
                                        <span class="field-value" id="field-nombre">${currentNombre}</span>
                                    </div>
                                    <span class="edit-icon">
                                    <img src="/static/editar.png" alt="Editar" style="width: 20px; height: 20px;">
                                    </span>
                                </div>
                                
                                <div class="profile-field" data-field="nickname">
                                    <div class="field-info">
                                        <span class="field-label">NICKNAME</span>
                                        <span class="field-value" id="field-nickname">${currentNickname}</span>
                                    </div>
                                    <span class="edit-icon">
                                    <img src="/static/editar.png" alt="Editar" style="width: 20px; height: 20px;">
                                    </span>
                                </div>
                                
                                <div class="profile-field" data-field="email">
                                    <div class="field-info">
                                        <span class="field-label">CORREO</span>
                                        <span class="field-value" id="field-email">${localStorage.getItem('email') || 'No asignado'}</span>
                                    </div>
                                    <span class="edit-icon">
                                    <img src="/static/editar.png" alt="Editar" style="width: 20px; height: 20px;">
                                    </span>
                                </div>
                                
                                <div class="profile-field" data-field="password">
                                    <div class="field-info">
                                        <span class="field-label">CONTRASEÑA</span>
                                        <span class="field-value">••••••••</span>
                                    </div>
                                    <span class="edit-icon">
                                    <img src="/static/editar.png" alt="Editar" style="width: 20px; height: 20px;">
                                    </span>
                                </div>

                                <div class="profile-field" data-field="fecha_nacimiento">
                                    <div class="field-info">
                                        <span class="field-label">FECHA DE NACIMIENTO</span>
                                        <span class="field-value" id="field-fecha_nacimiento">${tieneFecha ? '••••••••' : 'No registrada'}</span>
                                    </div>
                                    <span class="edit-icon">
                                    <img src="/static/editar.png" alt="Editar" style="width: 20px; height: 20px;">
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
            `;
            
            // Agregar event listeners a los campos editables
            document.querySelectorAll('.profile-field').forEach(field => {
                field.addEventListener('click', () => {
                    const fieldName = field.getAttribute('data-field');
                    abrirModalEdicion(fieldName);
                });
            });

            // Selector de foto de perfil
            document.getElementById('avatarWrapper').addEventListener('click', () => {
                const overlay = document.createElement('div');
                overlay.className = 'modal-overlay';
                overlay.innerHTML = `
                    <div class="modal-content" style="max-width:480px;" id="fotoModalContent">
                        <h3 style="margin-bottom:20px;">Elige tu foto de perfil</h3>
                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
                            ${FOTOS.map(f => `
                                <img src="/static/foto_perfil/${f}" data-foto="${f}"
                                     style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:50%;cursor:pointer;border:3px solid ${fotoActual===f?'#00FF9D':'transparent'};transition:border 0.2s;"
                                     class="foto-opcion">
                            `).join('')}
                        </div>
                    </div>`;
                document.body.appendChild(overlay);

                overlay.addEventListener('click', e => {
                    if (!document.getElementById('fotoModalContent').contains(e.target)) {
                        overlay.remove();
                    }
                });

                overlay.querySelectorAll('.foto-opcion').forEach(img => {
                    img.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        const foto = img.getAttribute('data-foto');
                        try {
                            const res = await fetch('/api/perfil/foto', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                body: JSON.stringify({ foto_perfil: foto })
                            });
                            const rData = await res.json();
                            if (res.ok) {
                                fotoActual = foto;
                                document.getElementById('avatarImg').src = `/static/foto_perfil/${foto}`;
                                document.getElementById('userAvatar').src = `/static/foto_perfil/${foto}`;
                                document.getElementById('menuAvatar').src = `/static/foto_perfil/${foto}`;
                                overlay.remove();
                            } else {
                                console.error('Error al guardar foto:', rData);
                                alert('Error al guardar foto: ' + (rData.error || rData.message || JSON.stringify(rData)));
                            }
                        } catch(err) { console.error('Error de conexion:', err); alert('Error de conexión: ' + err.message); }
                    });
                });
            });

            // Función para abrir modal de edición
            function abrirModalEdicion(fieldName) {
                let html = '';
                let title = '';
                
                switch(fieldName) {
                    case 'nombre':
                        title = 'Editar Nombre';
                        html = `<input type="text" id="editValue" placeholder="Nuevo nombre" value="${localStorage.getItem('nombre') || ''}">`;
                        break;
                    case 'nickname':
                        title = 'Editar Nickname';
                        html = `<input type="text" id="editValue" placeholder="Nuevo nickname" value="${localStorage.getItem('nickname') || ''}">`;
                        break;
                    case 'email':
                        title = 'Editar Correo';
                        html = `<input type="email" id="editValue" placeholder="Nuevo correo" value="${localStorage.getItem('email') || ''}">`;
                        break;
                    case 'password':
                        title = 'Cambiar Contraseña';
                        html = `
                            <input type="password" id="currentPassword" placeholder="Contraseña actual">
                            <input type="password" id="newPassword" placeholder="Contraseña nueva">
                            <input type="password" id="confirmPassword" placeholder="Confirmar contraseña nueva">
                        `;
                        break;
                    case 'fecha_nacimiento':
                        title = 'Fecha de Nacimiento';
                        html = `
                            <label style="color:#aaa; font-size:13px; display:block; margin-bottom:8px;">Selecciona tu fecha de nacimiento</label>
                            <input type="date" id="editValue" style="width:100%; padding:10px; border-radius:6px; border:1px solid #555; background:#2a2a2a; color:white;">
                            <p style="color:#888; font-size:12px; margin-top:10px;">Por privacidad, tu fecha de nacimiento es encriptada. NetPOLIx no puede verla.</p>
                        `;
                        break;
                }
                
                const modal = document.createElement('div');
                modal.className = 'modal-overlay';
                modal.innerHTML = `
                    <div class="modal-content">
                        <h3>${title}</h3>
                        ${html}
                        <div class="modal-buttons">
                            <button class="btn-modal-save" id="modalSaveBtn">Guardar</button>
                            <button class="btn-modal-cancel" id="modalCancelBtn">Cancelar</button>
                        </div>
                        <div id="modalMessage" style="color: #ff6b6b; margin-top: 15px; text-align: center;"></div>
                    </div>
                `;
                
                document.body.appendChild(modal);
                
                document.getElementById('modalCancelBtn').addEventListener('click', () => {
                    modal.remove();
                });
                
                document.getElementById('modalSaveBtn').addEventListener('click', async () => {
                    const token = localStorage.getItem('token');
                    const messageDiv = document.getElementById('modalMessage');
                    
                    try {
                        if (fieldName === 'fecha_nacimiento') {
                            const fecha = document.getElementById('editValue').value;
                            if (!fecha) {
                                messageDiv.textContent = 'Selecciona una fecha';
                                return;
                            }
                            const response = await fetch('/api/perfil/fecha-nacimiento', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                body: JSON.stringify({ fecha_nacimiento: fecha })
                            });
                            const data = await response.json();
                            if (response.ok) {
                                document.getElementById('field-fecha_nacimiento').textContent = '••••••••';
                                messageDiv.style.color = '#4caf50';
                                messageDiv.textContent = 'Guardada correctamente';
                                setTimeout(() => modal.remove(), 1000);
                            } else {
                                messageDiv.textContent = data.error || 'Error';
                            }
                        } else if (fieldName === 'password') {
                            const currentPassword = document.getElementById('currentPassword').value;
                            const newPassword = document.getElementById('newPassword').value;
                            const confirmPassword = document.getElementById('confirmPassword').value;
                            
                            if (!currentPassword || !newPassword || !confirmPassword) {
                                messageDiv.textContent = 'Todos los campos son obligatorios';
                                return;
                            }
                            
                            if (newPassword !== confirmPassword) {
                                messageDiv.textContent = 'Las contraseñas nuevas no coinciden';
                                return;
                            }
                            
                            if (newPassword.length < 6) {
                                messageDiv.textContent = 'La contraseña debe tener al menos 6 caracteres';
                                return;
                            }
                            
                            const response = await fetch('/api/cambiar-password', {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                    current_password: currentPassword,
                                    new_password: newPassword
                                })
                            });
                            
                            const data = await response.json();
                            
                            if (response.ok) {
                                messageDiv.style.color = '#4caf50';
                                messageDiv.textContent = 'Contraseña actualizada';
                                setTimeout(() => {
                                    localStorage.clear();
                                    window.location.href = '/login';
                                }, 1000);
                            } else {
                                messageDiv.textContent = data.error || 'Error';
                            }
                            
                        } else {
                            const newValue = document.getElementById('editValue').value;
                            
                            if (!newValue) {
                                messageDiv.textContent = 'El campo no puede estar vacío';
                                return;
                            }
                            
                            if (fieldName === 'email') {
                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                if (!emailRegex.test(newValue)) {
                                    messageDiv.textContent = 'Email inválido';
                                    return;
                                }
                            }
                            
                            const updateData = {
                                nombre: localStorage.getItem('nombre'),
                                nickname: localStorage.getItem('nickname'),
                                cedula: localStorage.getItem('cedula'),
                                email: localStorage.getItem('email')
                            };
                            updateData[fieldName] = newValue;

                                console.log('Token:', token);
                                console.log('Datos a enviar:', updateData);
                            
                            const response = await fetch('/api/perfil', {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify(updateData)
                            });
                            
                            const data = await response.json();
                            
                            if (response.ok) {
                                localStorage.setItem(fieldName, newValue);
                                document.getElementById(`field-${fieldName}`).textContent = newValue;
                                
                                
                                if (fieldName === 'nickname') {
                                    document.getElementById('userNickname').textContent = newValue;
                                    document.getElementById('menuNickname').textContent = newValue;
                                }
                                
                                messageDiv.style.color = '#4caf50';
                                messageDiv.textContent = 'Actualizado';
                                setTimeout(() => modal.remove(), 1000);
                            } else {
                                messageDiv.textContent = data.error || 'Error';
                            }
                        }
                    } catch (error) {
                        console.error('Error detallado:', error);
                        messageDiv.textContent = 'Error de conexión: ' + error.message;
                    }
                });
            }
        });
    }
    
    // Mis Puntos
    const menuMisPuntos = document.getElementById('menuMisPuntos');
    if (menuMisPuntos) {
        menuMisPuntos.addEventListener('click', async (e) => {
            e.preventDefault();
            sideMenu.classList.remove('open');
            mostrarDropdownCategorias(false);
            const token = localStorage.getItem('token');

            const res = await fetch('/api/mis-puntos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            const puntos = data.puntos || 0;
            const META = 20;
            const pct = Math.min((puntos / META) * 100, 100).toFixed(0);
            const faltan = Math.max(META - puntos, 0);

            const tipoColor = t => t === 'COMPRA' ? '#00FF9D' : '#6c9fff';
            const tipoLabel = t => t === 'COMPRA' ? 'Compra' : 'Alquiler';

            const historialHTML = data.historial && data.historial.length > 0
                ? data.historial.map(h => `
                    <div class="pts-row">
                        <span class="pts-titulo">${h.titulo}</span>
                        <span class="pts-tipo" style="color:${tipoColor(h.tipo)}">${tipoLabel(h.tipo)}</span>
                        <span class="pts-fecha">${h.fecha}</span>
                        <span class="pts-ganados">+${h.puntos} pt${h.puntos > 1 ? 's' : ''}</span>
                    </div>`).join('')
                : '<p style="color:#aaa; padding:16px 0;">No hay transacciones aún.</p>';

            contentArea.innerHTML = `
                <div style="padding:30px; width:100%; max-width:700px;">
                    <h2 style="color:white; margin-bottom:25px;">Mis Puntos</h2>

                    <div class="pts-card">
                        <div class="pts-total">${puntos}</div>
                        <div class="pts-label-main">puntos acumulados</div>
                        <div class="pts-progress-wrap">
                            <div class="pts-progress-bar" style="width:${pct}%"></div>
                        </div>
                        <div class="pts-meta-txt">
                            ${puntos >= META
                                ? 'Tienes suficientes puntos para un video gratis'
                                : `Te faltan <strong>${faltan}</strong> puntos para un video gratis (${puntos}/${META})`}
                        </div>
                    </div>

                    <div class="pts-card" style="margin-top:20px;">
                        <div class="pts-section-title">Referidos</div>
                        <div style="color:#e0e0e0; font-size:15px; margin-top:8px;">
                            ${data.total_referidos > 0
                                ? `Referiste a <strong style="color:#00FF9D;">${data.total_referidos}</strong> amigo${data.total_referidos > 1 ? 's' : ''} y ganaste <strong style="color:#00FF9D;">${data.total_referidos}</strong> punto${data.total_referidos > 1 ? 's' : ''} por eso.`
                                : 'Aún no has referido a ningún amigo.'}
                        </div>
                    </div>

                    <div class="pts-card" style="margin-top:20px;">
                        <div class="pts-section-title">Historial</div>
                        <div style="margin-top:12px;">${historialHTML}</div>
                    </div>
                </div>`;
        });
    }
    // Mis Videos
    const menuMisVideos = document.getElementById('menuMisVideos');
    if (menuMisVideos) {
        menuMisVideos.addEventListener('click', async (e) => {
            e.preventDefault();
            sideMenu.classList.remove('open');
            mostrarDropdownCategorias(true);
            vistaActual = 'MIS_VIDEOS';
            const response = await fetch('/api/mis-videos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            misVideosData = data.videos || [];
            renderMisVideos();
        });
    }

    function renderMisVideos(filtroCategoria = null) {
        const videosParaMostrar = filtroCategoria
            ? misVideosData.filter(v => v.categorias && v.categorias.toUpperCase().includes(filtroCategoria.toUpperCase()))
            : misVideosData;

        let html = `<div class="videos-container" style="padding:30px; width:100%;">
            <h2 style="color:white; margin-bottom:${filtroCategoria ? '10px' : '25px'};">Mis Videos${filtroCategoria ? ` · <span style="color:#00FF9D">${filtroCategoria}</span>` : ''}</h2>`;

        if (filtroCategoria) {
            html += `<button id="btnVolverTodosVideos" style="background:transparent; color:#aaa; border:1px solid #555; padding:6px 12px; border-radius:4px; cursor:pointer; margin-bottom:20px; font-size:13px;">← Ver todos</button>`;
        }

        html += `<div class="videos-grid" id="misVideosGrid">`;

        if (videosParaMostrar.length > 0) {
            videosParaMostrar.forEach((v) => {
                const esActivo = v.tipo === 'COMPRA' || v.activo === true;
                const estadoColor = esActivo ? '#00FF9D' : '#ff6b6b';
                const estadoText = v.tipo === 'COMPRA' ? 'Comprado' : (v.activo ? 'Activo' : 'Vencido');
                html += `
                    <div class="video-card mv-card" style="cursor:pointer;">
                        <div class="video-poster">
                            <img src="${v.url_imagen || ''}" alt="${v.titulo}" class="poster-img"
                                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                            <div class="poster-placeholder" style="display:none"><span>🎬</span></div>
                        </div>
                        <h3>${v.titulo}</h3>
                        <p style="font-size:12px; color:#aaa;">${v.tipo} · ${v.fecha}</p>
                        <p style="color:${estadoColor}; font-size:12px; font-weight:bold;">${estadoText}</p>
                    </div>`;
            });
        } else {
            html += filtroCategoria
                ? `<p style="color:white;">No tienes videos en la categoría "${filtroCategoria}"</p>`
                : '<p style="color:white;">No tienes videos aún</p>';
        }

        html += `</div>
            <div id="misVideoDetail" style="display:none; margin-top:30px; width:100%;"></div>
        </div>`;
        contentArea.innerHTML = html;

        if (filtroCategoria) {
            document.getElementById('btnVolverTodosVideos').addEventListener('click', () => renderMisVideos());
        }

        document.querySelectorAll('.mv-card').forEach((card, i) => {
            card.addEventListener('click', async () => {
                document.querySelectorAll('.mv-card').forEach(c => c.classList.remove('mv-card-selected'));
                card.classList.add('mv-card-selected');
                await mostrarDetalle(videosParaMostrar[i]);
            });
        });
    }

    function mostrarDetalle(v) {
        if (outsideClickHandler) {
            document.removeEventListener('click', outsideClickHandler);
            outsideClickHandler = null;
        }
        const detailEl = document.getElementById('misVideoDetail');

        function fmtProm(p) {
            return (p % 1 === 0 ? String(Math.round(p)) : p.toFixed(1)) + '/4';
        }

        const estadoColor = v.tipo === 'COMPRA' ? '#00FF9D' : (v.activo ? '#00FF9D' : '#ff6b6b');
        const estadoText = v.tipo === 'COMPRA' ? 'Comprado' : (v.activo ? 'Activo' : 'Vencido');
        const categoriasHTML = v.categorias && v.categorias !== 'Sin categoría'
            ? v.categorias.split(', ').map(cat =>
                `<span class="mv-cat-tag" data-cat="${cat}" style="cursor:pointer; color:#00FF9D; text-decoration:underline; margin-right:6px;">${cat}</span>`
              ).join('')
            : (v.categorias || 'Sin categoría');

        detailEl.innerHTML = `
            <div class="mv-detail-wrap">
                <div class="mv-detail-header">
                    <h3 class="mv-detail-title">${v.titulo}</h3>
                </div>
                <div class="mv-detail-body">
                    <div class="mv-detail-left">
                        <div class="mv-detail-poster">
                            <img src="${v.url_imagen || ''}" alt="${v.titulo}" class="poster-img"
                                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                            <div class="poster-placeholder" style="display:none"><span></span></div>
                        </div>
                        <div class="mv-detail-meta">
                            <p><span class="mv-label">Categoría</span><span>${categoriasHTML}</span></p>
                            <p><span class="mv-label">Duración</span><span>${v.duracion} min</span></p>
                            <p><span class="mv-label">Tipo</span><span>${v.tipo}</span></p>
                            <p><span class="mv-label">Adquirido</span><span>${v.fecha}</span></p>
                            ${v.tipo === 'ALQUILER' ? `<p><span class="mv-label">Vence</span><span>${v.fecha_expiracion || 'Sin límite'}</span></p>` : ''}
                            <p><span class="mv-label">Estado</span><span style="color:${estadoColor}; font-weight:bold;">${estadoText}</span></p>
                        </div>
                    </div>
                    <div class="mv-detail-right">
                        <p class="mv-descripcion">${v.descripcion || 'Sin descripción disponible.'}</p>
                    </div>
                </div>
                <div class="mv-detail-actions">
                    <div class="mv-stars-container">
                        <span class="mv-label" style="font-size:14px;">Calificar:</span>
                        <div class="mv-stars" id="mv-stars-${v.id_video}">
                            <span class="mv-star" title="MALA">★</span>
                            <span class="mv-star" title="REGULAR">★</span>
                            <span class="mv-star" title="BUENA">★</span>
                            <span class="mv-star" title="EXCELENTE">★</span>
                        </div>
                        <div class="promedio-badge" id="mv-prom-${v.id_video}">Sin cal.</div>
                        <div id="mv-mi-voto-${v.id_video}" class="mv-mi-voto"></div>
                    </div>
                    <button class="mv-play-btn" id="mv-play-${v.id_video}">▶ Ver Película</button>
                </div>
            </div>`;

        detailEl.style.display = 'block';
        detailEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        detailEl.querySelectorAll('.mv-cat-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.stopPropagation();
                renderMisVideos(tag.getAttribute('data-cat'));
            });
        });

        function cerrarDetalle() {
            detailEl.style.display = 'none';
            document.querySelectorAll('.mv-card').forEach(c => c.classList.remove('mv-card-selected'));
            document.getElementById('misVideosGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (outsideClickHandler) {
                document.removeEventListener('click', outsideClickHandler);
                outsideClickHandler = null;
            }
        }

        outsideClickHandler = function(e) {
            if (!detailEl.querySelector('.mv-detail-wrap').contains(e.target)) {
                cerrarDetalle();
            }
        };

        setTimeout(() => document.addEventListener('click', outsideClickHandler), 0);

        const stars = document.querySelectorAll(`#mv-stars-${v.id_video} .mv-star`);
        let votoActual = 0;

        function pintarEstrellas(n) {
            stars.forEach((s, i) => { s.style.color = i < n ? '#FFD700' : '#555'; });
        }
        pintarEstrellas(votoActual);

        fetch(`/api/video/${v.id_video}/calificaciones`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json()).then(rData => {
            const prom = rData.promedio || 0;
            const mv = rData.mi_voto || null;
            document.getElementById(`mv-prom-${v.id_video}`).textContent = prom > 0 ? fmtProm(prom) : 'Sin cal.';
            if (mv) {
                votoActual = VALOR_MAP.indexOf(mv) + 1;
                pintarEstrellas(votoActual);
                document.getElementById(`mv-mi-voto-${v.id_video}`).textContent = 'Tu voto: ' + mv;
            }
        }).catch(() => {});

        stars.forEach((star, i) => {
            star.addEventListener('mouseenter', () => pintarEstrellas(i + 1));
            star.addEventListener('mouseleave', () => pintarEstrellas(votoActual));
            star.addEventListener('click', async () => {
                const valor = VALOR_MAP[i];
                try {
                    const res = await fetch(`/api/video/${v.id_video}/calificar`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ calificacion: valor })
                    });
                    const rData = await res.json();
                    if (res.ok) {
                        votoActual = i + 1;
                        pintarEstrellas(votoActual);
                        const prom = rData.promedio;
                        document.getElementById(`mv-prom-${v.id_video}`).textContent = prom > 0 ? fmtProm(prom) : 'Sin cal.';
                        document.getElementById(`mv-mi-voto-${v.id_video}`).textContent = 'Tu voto: ' + valor;
                    }
                } catch(err) { console.error(err); }
            });
        });

        document.getElementById(`mv-play-${v.id_video}`).addEventListener('click', () => {
            if (v.url_descarga) {
                window.open(v.url_descarga, '_blank');
            } else {
                alert('Este video no tiene URL de reproducción configurada.');
            }
        });
    }

    // Variables del carrito
    const CARRITO_KEY = 'carrito_' + (localStorage.getItem('email') || 'guest');
    let carrito = [];

    function abrirCarrito() {
        document.getElementById('carritoPanel').classList.add('open');
        document.getElementById('carritoOverlay').classList.add('show');
        renderizarCarrito();
    }

    function cerrarCarrito() {
        document.getElementById('carritoPanel').classList.remove('open');
        document.getElementById('carritoOverlay').classList.remove('show');
    }

    function agregarAlCarrito(id, titulo, urlImagen, tipo) {
        const existente = carrito.find(item => item.id === id);
        if (!existente) {
            carrito.push({ id, titulo, urlImagen: urlImagen || null, tipo: tipo || 'PELICULA' });
            localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
            actualizarContadorCarrito();
        }
    }

    function eliminarDelCarrito(id) {
        carrito = carrito.filter(item => item.id !== id);
        localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
        actualizarContadorCarrito();
        renderizarCarrito();
    }

    function actualizarContadorCarrito() {
        const cantidadSpan = document.getElementById('carritoCantidad');
        if (cantidadSpan) {
            if (carrito.length > 0) {
                cantidadSpan.textContent = carrito.length;
                cantidadSpan.style.display = 'flex';
            } else {
                cantidadSpan.textContent = '';
                cantidadSpan.style.display = 'none';
            }
        }
    }

    function renderizarCarrito() {
        const itemsDiv = document.getElementById('carritoItems');
        const totalDiv = document.getElementById('carritoTotal');
        const btnPagar = document.getElementById('btnIrPagar');

        if (carrito.length === 0) {
            itemsDiv.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
            totalDiv.textContent = '';
            btnPagar.disabled = true;
            return;
        }

        btnPagar.disabled = false;
        let html = '';
        carrito.forEach(item => {
            const esSerie = item.id.toString().startsWith('serie-');
            html += `
                <div class="carrito-item">
                    <div class="carrito-item-poster">
                        ${item.urlImagen && item.urlImagen !== ''
                            ? `<img src="${item.urlImagen}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'">`
                            : `<div class="carrito-item-emoji">${esSerie ? '' : ''}</div>`
                        }
                    </div>
                    <div class="carrito-item-info">
                        <div class="carrito-item-titulo">${item.titulo}</div>
                        <div class="carrito-item-tipo">${esSerie ? 'Serie' : 'Película'}</div>
                    </div>
                    <button class="carrito-item-eliminar" data-id="${item.id}">✕</button>
                </div>
            `;
        });
        itemsDiv.innerHTML = html;
        totalDiv.textContent = `${carrito.length} item${carrito.length > 1 ? 's' : ''} en tu carrito`;

        document.querySelectorAll('.carrito-item-eliminar').forEach(btn => {
            btn.addEventListener('click', () => {
                eliminarDelCarrito(btn.getAttribute('data-id'));
            });
        });
    }

    function cargarCarritoGuardado() {
        const guardado = localStorage.getItem(CARRITO_KEY);
        if (guardado) {
            carrito = JSON.parse(guardado);
            actualizarContadorCarrito();
        }
    }

    // Eventos del carrito
    document.getElementById('carritoIcono').addEventListener('click', abrirCarrito);
    document.getElementById('carritoCerrar').addEventListener('click', cerrarCarrito);
    document.getElementById('carritoOverlay').addEventListener('click', cerrarCarrito);
    document.getElementById('btnIrPagar').addEventListener('click', () => {
        window.location.href = '/pago';
    });

    cargarCarritoGuardado();

    const logoNetpolix = document.getElementById('logoNetpolix');
    if (logoNetpolix) {
        logoNetpolix.addEventListener('click', () => mostrarInicio());
    }

    function mostrarDropdownCategorias(visible) {
        const dropdown = document.getElementById('dropdownCategorias');
        if (dropdown) dropdown.style.display = visible ? '' : 'none';
    }

    //Tiempo Dropdown
    function configurarDropdownConDelay() {
        const dropdown = document.getElementById('dropdownCategorias');
        if (!dropdown) return;
        
        let timeoutId;
        
        // Mostrar dropdown al entrar el mouse
        dropdown.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
            dropdown.classList.add('show');
        });
        
        // Ocultar dropdown con delay al salir el mouse
        dropdown.addEventListener('mouseleave', () => {
            timeoutId = setTimeout(() => {
                dropdown.classList.remove('show');
            }, 50);
        });
    }
    
    // LLAMAR A LA FUNCIÓN
    configurarDropdownConDelay();

    // Función para cargar categorías en el dropdown
    async function cargarCategoriasDropdown() {
        const token = localStorage.getItem('token');
        const dropdownContent = document.getElementById('dropdownContent');
        
        if (!dropdownContent) return;
        
        try {
            const response = await fetch('/api/categorias-cliente', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            
            if (response.ok && data.categorias) {
                if (data.categorias.length === 0) {
                    dropdownContent.innerHTML = '<a class="categoria-item">No hay categorías</a>';
                } else {
                    let html = '<div class="dropdown-grid">';
                    data.categorias.forEach(cat => {
                        html += `
                            <div class="categoria-item" data-categoria="${cat.nombre}">
                                <span class="categoria-nombre">${cat.nombre}</span>
                            </div>
                        `;
                    });
                    dropdownContent.innerHTML = html;
                    
                    // Agregar evento a cada categoría
                    document.querySelectorAll('.categoria-item').forEach(item => {
                        item.addEventListener('click', () => {
                            const categoria = item.getAttribute('data-categoria');
                            if (vistaActual === 'MIS_VIDEOS') {
                                renderMisVideos(categoria);
                            } else {
                                mostrarVideosPorCategoria(categoria);
                            }
                        });
                    });
                }
            } else {
                dropdownContent.innerHTML = '<a class="categoria-item">Error al cargar</a>';
            }
        } catch (error) {
            dropdownContent.innerHTML = '<a class="categoria-item">Error de conexión</a>';
        }
    }

   async function mostrarVideosPorCategoria(categoria) {
    const contentArea = document.getElementById('contentArea');
    const token = localStorage.getItem('token');

    contentArea.innerHTML = `
        <div class="videos-container" style="padding: 30px; width: 100%;">
            <h2 style="color: white; font-size: 28px; margin-bottom: 25px;">${categoria}</h2>
            <div class="videos-grid" id="videosGrid">
                <div class="loading">Cargando videos...</div>
            </div>
        </div>
    `;

    // Cargar películas
    try {
        const response = await fetch(`/api/videos?categoria=${categoria}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        const grid = document.getElementById('videosGrid');

        if (response.ok && data.videos) {
            if (data.videos.length === 0) {
                grid.innerHTML = '<p style="color:white">No hay videos en esta categoría</p>';
            } else {
                grid.innerHTML = data.videos.map(crearCardVideo).join('');

                document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const id = btn.getAttribute('data-id');
                        const titulo = btn.getAttribute('data-titulo');
                        const urlImagen = btn.getAttribute('data-imagen');
                        const tipo = id.toString().startsWith('serie-') ? 'SERIE' : 'PELICULA';                         
                        agregarAlCarrito(id, titulo, urlImagen, tipo);
                        btn.textContent = '✓';
                        setTimeout(() => { btn.textContent = '+'; }, 1000);
                    });
                });
            }
        } else {
            grid.innerHTML = '<p style="color:white">Error al cargar videos</p>';
        }
    } catch (error) {
        document.getElementById('videosGrid').innerHTML = '<p style="color:white">Error de conexión</p>';
    }

    // Cargar series
    try {
        const resSeries = await fetch(`/api/series?categoria=${categoria}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const dataSeries = await resSeries.json();

        if (dataSeries.series && dataSeries.series.length > 0) {
            let htmlSeries = `
                <div style="width:100%; margin-top: 40px;">
                    <h2 style="color: white; font-size: 24px; margin-bottom: 20px;">Series</h2>
                    <div class="videos-grid" id="seriesGrid">
            `;
            dataSeries.series.forEach(serie => {
                htmlSeries += crearCardSerie(serie);
            });
            htmlSeries += `</div></div>`;
            document.querySelector('.videos-container').insertAdjacentHTML('beforeend', htmlSeries);

            document.querySelectorAll('.serie-card').forEach(card => {
                card.addEventListener('click', async (e) => {
                    if (e.target.classList.contains('btn-agregar-carrito')) return;
                    const titulo = card.getAttribute('data-titulo');
                    const idRep = card.querySelector('.temporadas-container').id.replace('temp-', '');
                    const tempContainer = document.getElementById(`temp-${idRep}`);

                    if (tempContainer.style.display === 'block') {
                        tempContainer.style.display = 'none';
                        return;
                    }

                    tempContainer.innerHTML = '<p style="color:#aaa">Cargando temporadas...</p>';
                    tempContainer.style.display = 'block';

                    const res = await fetch(`/api/series/${encodeURIComponent(titulo)}/temporadas`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();

                    if (data.temporadas && data.temporadas.length > 0) {
                        let html = '<div style="margin-top:10px; border-top: 1px solid #4a4a48; padding-top:10px;">';
                        data.temporadas.forEach(t => {
                            html += `<div class="temporada-item" data-id="${t.id}" data-temporada="${t.temporada}"
                                          style="padding:8px 0; display:flex; justify-content:space-between; align-items:center; color:#e0e0e0; border-bottom:1px solid #3e3e3c; cursor:pointer;">
                                <span>Temporada ${t.temporada}</span>
                                <button class="btn-add-temporada" data-id="${t.id}" data-num="${t.temporada}"
                                        style="background:#00FF9D; color:#000; border:none; border-radius:50%; width:22px; height:22px; cursor:pointer; font-size:14px; flex-shrink:0;">+</button>
                            </div>`;
                        });
                        html += '</div>';
                        tempContainer.innerHTML = html;

                        tempContainer.querySelectorAll('.btn-add-temporada').forEach(btn => {
                            btn.addEventListener('click', async (e) => {
                                e.stopPropagation();
                                const res = await fetch(`/api/series/${btn.getAttribute('data-id')}/episodios`, {
                                    headers: { 'Authorization': `Bearer ${token}` }
                                });
                                const epData = await res.json();
                                if (epData.episodios) {
                                    epData.episodios.forEach(ep => agregarAlCarrito(String(ep.id), ep.titulo, null, 'EPISODIO'));
                                }
                                btn.textContent = '✓';
                                setTimeout(() => { btn.textContent = '+'; }, 1000);
                            });
                        });

                        tempContainer.querySelectorAll('.temporada-item').forEach(item => {
                            item.addEventListener('click', async (e) => {
                                if (e.target.classList.contains('btn-add-temporada')) return;
                                e.stopPropagation();
                                const existing = item.nextElementSibling;
                                if (existing && existing.classList.contains('episodios-inline')) {
                                    existing.style.display = existing.style.display === 'none' ? 'block' : 'none';
                                    return;
                                }
                                const episodiosDiv = document.createElement('div');
                                episodiosDiv.className = 'episodios-inline';
                                episodiosDiv.innerHTML = '<p style="color:#aaa; padding:6px 0 6px 16px; font-size:13px;">Cargando...</p>';
                                item.after(episodiosDiv);
                                const res = await fetch(`/api/series/${item.getAttribute('data-id')}/episodios`, {
                                    headers: { 'Authorization': `Bearer ${token}` }
                                });
                                const epData = await res.json();
                                if (epData.episodios && epData.episodios.length > 0) {
                                    episodiosDiv.innerHTML = epData.episodios.map(ep =>
                                        `<div style="padding:6px 8px 6px 16px; color:#ccc; font-size:13px; border-bottom:1px solid #2a2a2a; display:flex; justify-content:space-between; align-items:center;">
                                            <span>${ep.titulo} <span style="color:#888">(${ep.duracion} min)</span></span>
                                            <button class="btn-add-ep" data-id="${ep.id}" data-titulo="${ep.titulo}"
                                                    style="background:#00FF9D; color:#000; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size:12px; flex-shrink:0;">+</button>
                                        </div>`
                                    ).join('');
                                    episodiosDiv.querySelectorAll('.btn-add-ep').forEach(btn => {
                                        btn.addEventListener('click', (e) => {
                                            e.stopPropagation();
                                            agregarAlCarrito(btn.getAttribute('data-id'), btn.getAttribute('data-titulo'), null, 'EPISODIO');
                                            btn.textContent = '✓';
                                            setTimeout(() => { btn.textContent = '+'; }, 1000);
                                        });
                                    });
                                } else {
                                    episodiosDiv.innerHTML = '<p style="color:#aaa; padding:6px 0 6px 16px; font-size:13px;">Sin capítulos registrados</p>';
                                }
                            });
                        });
                    } else {
                        tempContainer.innerHTML = '<p style="color:#aaa">Sin temporadas registradas</p>';
                    }
                });
            });

            document.querySelectorAll('.serie-card .btn-agregar-carrito').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = btn.getAttribute('data-id');
                    const titulo = btn.getAttribute('data-titulo');
                    const urlImagen = btn.getAttribute('data-imagen');
                    const tipo = id.toString().startsWith('serie-') ? 'SERIE' : 'PELICULA';
                    agregarAlCarrito(id, titulo, urlImagen, tipo);
                    btn.textContent = '✓';
                    setTimeout(() => { btn.textContent = '+'; }, 1000);
                });
            });
        }
    } catch (error) {
        console.error('Error al cargar series:', error);
    }
}

    // Llama a cargarCategoriasDropdown cuando carga la página
    // Agrega esta línea dentro del DOMContentLoaded, al final:
    cargarCategoriasDropdown();

    mostrarInicio();

    const searchInputHeader = document.getElementById('searchInputHeader');
    const searchBtnHeader = document.getElementById('searchBtnHeader');

    async function buscarDesdeHeader() {
        const query = searchInputHeader.value.trim();
        
        if (query === '') {
            // Si está vacío, mostrar la página de inicio normal
            mostrarInicio();
            return;
        }
        
        const contentArea = document.getElementById('contentArea');
        const token = localStorage.getItem('token');
        
        contentArea.innerHTML = `
            <div style="padding: 30px; width: 100%;">
                <div id="resultadosBusquedaHeader">
                    <div class="loading">Buscando "${query}"...</div>
                </div>
            </div>
        `;
        
        try {
            const response = await fetch(`/api/buscar?q=${encodeURIComponent(query)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            
            mostrarResultadosBusquedaHeader(data, query);
        } catch (error) {
            console.error('Error en búsqueda:', error);
            document.getElementById('resultadosBusquedaHeader').innerHTML = '<p class="error-message">Error de conexión</p>';
        }
    }

    function mostrarResultadosBusquedaHeader(data, query) {
        const peliculas = data.peliculas || [];
        const series = data.series || [];
        const container = document.getElementById('resultadosBusquedaHeader');

        if (peliculas.length === 0 && series.length === 0) {
            container.innerHTML = `<p class="no-results">No se encontraron resultados para "${query}"</p>`;
            return;
        }

        let html = `<h2 style="color: white; font-size: 22px; margin-bottom: 20px;">Resultados para: "${query}"</h2>`;

        if (peliculas.length > 0) {
            html += `<h3 style="color: white; font-size: 18px; margin-bottom: 15px;">Películas</h3>`;
            html += `<div class="videos-grid">`;
            peliculas.forEach(video => {
                html += crearCardVideo(video);
            });
            html += `</div>`;
        }

        if (series.length > 0) {
            html += `<h3 style="color: white; font-size: 18px; margin: 30px 0 15px;">Series</h3>`;
            html += `<div class="videos-grid">`;
            series.forEach(serie => {
                html += crearCardSerie(serie);
            });
            html += `</div>`;
        }

        container.innerHTML = html;

        document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                const titulo = btn.getAttribute('data-titulo');
                const urlImagen = btn.getAttribute('data-imagen');
                const tipo = id.toString().startsWith('serie-') ? 'SERIE' : 'PELICULA';
                agregarAlCarrito(id, titulo, urlImagen, tipo);
                btn.textContent = '✓';
                setTimeout(() => { btn.textContent = '+'; }, 1000);
            });
        });

        document.querySelectorAll('.serie-card-search').forEach(card => {
            card.addEventListener('click', async () => {
                const titulo = card.getAttribute('data-titulo');
                const tempContainer = card.querySelector('.temporadas-container');

                if (tempContainer.style.display === 'block') {
                    tempContainer.style.display = 'none';
                    return;
                }

                tempContainer.innerHTML = '<p style="color:#aaa; padding: 8px 0;">Cargando...</p>';
                tempContainer.style.display = 'block';

                const token = localStorage.getItem('token');
                const res = await fetch(`/api/series/${encodeURIComponent(titulo)}/temporadas`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();

                if (data.temporadas && data.temporadas.length > 0) {
                    let html = '<div style="margin-top:8px; border-top: 1px solid #4a4a48; padding-top:8px;">';
                    data.temporadas.forEach(t => {
                        html += `<div style="padding: 6px 0; color: #e0e0e0; border-bottom: 1px solid #3e3e3c; font-size: 13px;">
                            Temporada ${t.temporada}
                        </div>`;
                    });
                    html += '</div>';
                    tempContainer.innerHTML = html;
                } else {
                    tempContainer.innerHTML = '<p style="color:#aaa; font-size:13px;">Sin temporadas</p>';
                }
            });
        });
    }

    // Eventos de búsqueda
    searchBtnHeader.addEventListener('click', buscarDesdeHeader);
    searchInputHeader.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            buscarDesdeHeader();
        }
    });
    
});