/**
 * Gestión del Cuadro de Mensajes (HTTP Fetch & DOM Manipulation)
 * Sin dependencias de WebSockets ni librerías externas complejas.
 */
document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.getElementById('messageForm');
    const userInput = document.getElementById('userInput');
    const messageInput = document.getElementById('messageInput');
    const bigBoardDisplay = document.getElementById('bigBoardDisplay');
    const messageCounterBadge = document.getElementById('messageCounterBadge');
    const refreshBtn = document.getElementById('refreshBtn');

    // Paleta de colores determinista para avatares según el nombre
    const avatarColors = [
        '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
        '#10b981', '#14b8a6', '#06b6d4', '#f59e0b'
    ];

    function getAvatarColor(name) {
        if (!name) return '#6366f1';
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % avatarColors.length;
        return avatarColors[index];
    }

    function getInitials(name) {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    }

    // Inicializar avatares de los mensajes ya renderizados por Handlebars
    document.querySelectorAll('.author-avatar').forEach((el) => {
        const rawName = el.textContent || '';
        el.textContent = getInitials(rawName);
        el.style.backgroundColor = getAvatarColor(rawName);
    });

    // Cargar último nombre recordado
    const savedUser = localStorage.getItem('board_author_name');
    if (savedUser && userInput) {
        userInput.value = savedUser;
    }

    // Función para renderizar una tarjeta de mensaje en el cuadro grande
    function createMessageCardHTML(item) {
        const initials = getInitials(item.user);
        const color = getAvatarColor(item.user);
        const timeDisplay = item.formattedTime || new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateDisplay = item.formattedDate || new Date(item.timestamp).toLocaleDateString();

        return `
            <article class="board-message-card new-entry" data-id="${item.id}">
                <header class="message-card-header">
                    <div class="author-info">
                        <div class="author-avatar" style="background-color: ${color}">${initials}</div>
                        <div>
                            <span class="author-label">Escrito por:</span>
                            <strong class="author-name">${escapeHtml(item.user)}</strong>
                        </div>
                    </div>
                    <div class="time-info">
                        <span class="time-label"><i class="fa-regular fa-clock"></i> Hora:</span>
                        <time class="time-value" datetime="${item.timestamp}">
                            ${timeDisplay} (${dateDisplay})
                        </time>
                    </div>
                </header>
                <div class="message-card-body">
                    <p class="message-text">${escapeHtml(item.message)}</p>
                </div>
            </article>
        `;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 1. Envío asíncrono con Fetch al endpoint HTTP POST /api/messages
    if (messageForm) {
        messageForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const user = userInput.value.trim();
            const message = messageInput.value.trim();

            if (!user || !message) return;

            // Recordar el autor para que no tenga que volver a escribirlo
            localStorage.setItem('board_author_name', user);

            try {
                const response = await fetch('/api/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ user, message })
                });

                const data = await response.json();

                if (!response.ok || data.status !== 'success') {
                    throw new Error(data.message || 'Error al guardar el mensaje.');
                }

                // Ocultar estado vacío si existía
                const emptyState = document.getElementById('emptyBoardState');
                if (emptyState) {
                    emptyState.remove();
                }

                // Añadir el nuevo mensaje al cuadro grande
                bigBoardDisplay.insertAdjacentHTML('beforeend', createMessageCardHTML(data.payload));
                
                // Actualizar contador
                const currentCount = bigBoardDisplay.querySelectorAll('.board-message-card').length;
                if (messageCounterBadge) {
                    messageCounterBadge.textContent = `${currentCount} Mensajes`;
                }

                // Limpiar solo el textarea del mensaje
                messageInput.value = '';
                messageInput.focus();

                // Auto-scroll al final del cuadro grande
                bigBoardDisplay.scrollTop = bigBoardDisplay.scrollHeight;

                // Notificación sutil
                if (window.Swal) {
                    const toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000,
                        background: '#1e293b',
                        color: '#f8fafc'
                    });
                    toast.fire({
                        icon: 'success',
                        title: 'Mensaje publicado en el cuadro'
                    });
                }
            } catch (err) {
                console.error('Error publicando mensaje:', err);
                if (window.Swal) {
                    Swal.fire({
                        icon: 'error',
                        title: 'No se pudo enviar',
                        text: err.message,
                        background: '#1e293b',
                        color: '#f8fafc',
                        confirmButtonColor: '#ef4444'
                    });
                } else {
                    alert('Error: ' + err.message);
                }
            }
        });
    }

    // 2. Función para recargar los mensajes desde el servidor (HTTP GET /api/messages)
    async function reloadMessages(showFeedback = true) {
        try {
            const res = await fetch('/api/messages', {
                headers: { 'Accept': 'application/json' }
            });
            const data = await res.json();

            if (data.status === 'success') {
                const messages = data.payload;
                if (messageCounterBadge) {
                    messageCounterBadge.textContent = `${messages.length} Mensajes`;
                }

                if (messages.length === 0) {
                    bigBoardDisplay.innerHTML = `
                        <div class="board-empty-state" id="emptyBoardState">
                            <i class="fa-regular fa-comment-dots empty-icon"></i>
                            <h4>El cuadro está vacío</h4>
                            <p>Aún no se ha publicado ningún mensaje. Completa el formulario para escribir el primero.</p>
                        </div>
                    `;
                } else {
                    bigBoardDisplay.innerHTML = messages.map(m => createMessageCardHTML(m)).join('');
                }

                if (showFeedback && window.Swal) {
                    const toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1500,
                        background: '#1e293b',
                        color: '#f8fafc'
                    });
                    toast.fire({
                        icon: 'info',
                        title: 'Cuadro actualizado'
                    });
                }
            }
        } catch (error) {
            console.error('Error recargando mensajes:', error);
        }
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => reloadMessages(true));
    }
});
