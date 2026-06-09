// ==========================================
// 0. CONFIGURACIÓN DINÁMICA DE LA IP
// ==========================================
const API_URL = `http://${window.location.hostname}:3000`;

// ==========================================
// 1. MÓDULO API (Servicios Restful)
// ==========================================
window.api = {
    async getUserById(id) {
        const res = await fetch(`${API_URL}/users/${Number(id)}`);
        if (!res.ok) throw new Error("No existe");
        return await res.json();
    },

    async getTasks() {
        const res = await fetch(`${API_URL}/tareas`);
        if (!res.ok) throw new Error();
        return await res.json();
    },

    async getTasksByUserId(idUsuario) {
        const res = await fetch(`${API_URL}/tareas?idUsuario=${Number(idUsuario)}`);
        if (!res.ok) throw new Error();
        return await res.json();
    },

    async createTask(nuevaTarea) {
        const res = await fetch(`${API_URL}/tareas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaTarea)
        });
        if (!res.ok) throw new Error("ErrorServidor");
        return await res.json();
    },

    async updateTaskStatus(id, nuevoEstado) {
        const res = await fetch(`${API_URL}/tareas/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        if (!res.ok) throw new Error();
        return await res.json();
    },

    async updateTaskDescription(id, descripcion) {
        const res = await fetch(`${API_URL}/tareas/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ descripcion })
        });
        if (!res.ok) throw new Error();
        return await res.json();
    },

    async deleteTask(id) {
        const res = await fetch(`${API_URL}/tareas/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error();
        return true;
    }
};

// ==========================================
// 2. MÓDULO UTILS (Validaciones y Mapeos)
// ==========================================
window.utils = {
    getStatusConfig(estado) {
        const esCompletada = estado === "Completada";
        return {
            esCompletada,
            colorEstado: esCompletada ? "#27ae60" : "#e67e22",
            textoBotonEstado: esCompletada ? "Reabrir" : "Hecha",
            estiloDecoracionTexto: esCompletada ? "line-through; color: gray;" : "none; color: black;",
            bgColorBoton: esCompletada ? '#7f8c8d' : '#2ecc71'
        };
    },

    validateIdInput(id) {
        return id.trim() !== "" ? Number(id.trim()) : "";
    },

    handleApiError(error) {
        if (error.message === "No existe") {
            ui.lanzarNotificacion("Error: El ID de usuario especificado no existe en el sistema.", "red", "#fdedec");
        } else if (error.message === "ErrorServidor") {
            ui.lanzarNotificacion("Error de Red: No se pudo conectar con el servidor. Verifique su json-server.", "red", "#fdedec");
        } else {
            ui.lanzarNotificacion("Ocurrió un error inesperado con el servidor.", "red", "#fdedec");
        }
    },

    handleGenericError(mensaje) {
        ui.lanzarNotificacion(mensaje, "red", "#fdedec");
    }
};

// ==========================================
// 3. MÓDULO UI (Interfaz Gráfica y DOM)
// ==========================================
window.ui = {
    elements: {
        formBusqueda: document.getElementById('messageForm'),
        inputId: document.getElementById('userName'),
        inputTareaDesc: document.getElementById('userMessage'),
        mensajeError: document.getElementById('userNameError'),
        tablaTareas: document.getElementById('messagesContainer'),
        contadorTexto: document.getElementById('messageCount')
    },

    state: {
        totalTareas: 0
    },

    lanzarNotificacion(texto, color, fondo) {
        const el = this.elements.mensajeError;
        if (!el) return;
        el.style.display = "block";
        el.innerText = texto;
        el.style.color = color;
        el.style.backgroundColor = fondo;
        el.style.border = `1px solid ${color}`;
    },

    limpiarNotificacion() {
        const el = this.elements.mensajeError;
        if (!el) return;
        el.innerText = "";
        el.style.backgroundColor = "transparent";
        el.style.border = "none";
        el.style.display = "none";
    },

    clearTaskInput() {
        if (this.elements.inputTareaDesc) {
            this.elements.inputTareaDesc.value = '';
        }
    },

    actualizarContadorInterfaz() {
        if (this.elements.contadorTexto) {
            this.elements.contadorTexto.innerText = `${this.state.totalTareas} tareas registradas`;
        }
        
        if (this.state.totalTareas === 0 && this.elements.tablaTareas) {
            this.elements.tablaTareas.innerHTML = `
                <tr id="emptyState">
                    <td colspan="5" style="text-align: center; color: gray; padding: 20px;">
                        No hay tareas registradas en el sistema.
                    </td>
                </tr>
            `;
        }
    },

    buildRowHtml(idTarea, nombre, idUsuario, descripcion, estado) {
        const config = utils.getStatusConfig(estado);
        const fila = document.createElement('tr');
        fila.dataset.id = idTarea;
        fila.innerHTML = `
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${idUsuario}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${nombre}</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-decoration: ${config.estiloDecoracionTexto}" class="descripcion-celda">${descripcion}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">
                <span class="estado-tag" style="color: ${config.config.colorEstado || config.colorEstado}; font-weight: bold;">${estado}</span>
            </td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
                <button class="btn-estado" style="background-color: ${config.bgColorBoton}; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px; margin-right: 2px;">${config.textoBotonEstado}</button>
                <button class="btn-editar">Editar</button>
                <button class="btn-eliminar">Eliminar</button>
            </td>
        `;
        return fila;
    },

    agregarFilaTabla(tarea) {
        if (this.state.totalTareas === 0 && this.elements.tablaTareas) {
            this.elements.tablaTareas.innerHTML = '';
        }

        const fila = this.buildRowHtml(tarea.id, tarea.nombreUsuario, tarea.idUsuario, tarea.descripcion, tarea.estado);

        fila.querySelector('.btn-estado').onclick = () => this.handlers.cambiarEstado(tarea.id, tarea.estado, fila);
        fila.querySelector('.btn-editar').onclick = () => this.handlers.editar(tarea.id, fila);
        fila.querySelector('.btn-eliminar').onclick = () => this.handlers.eliminar(tarea.id, fila);

        this.elements.tablaTareas.appendChild(fila);
        this.state.totalTareas++;
        this.actualizarContadorInterfaz();
    },

    handlers: {
        async cambiarEstado(id, estadoActual, filaHTML) {
            const nuevoEstado = estadoActual === "Pendiente" ? "Completada" : "Pendiente";
            try {
                const tareaActualizada = await api.updateTaskStatus(id, nuevoEstado);
                ui.lanzarNotificacion(`Estado de tarea cambiado a: ${tareaActualizada.estado}`, "green", "#e8f8f5");
                
                const celdaTexto = filaHTML.querySelector('.descripcion-celda');
                const etiquetaEstado = filaHTML.querySelector('.estado-tag');
                const botonEstado = filaHTML.querySelector('.btn-estado');
                const config = utils.getStatusConfig(tareaActualizada.estado);
                
                etiquetaEstado.innerText = tareaActualizada.estado;
                etiquetaEstado.style.color = config.colorEstado;
                celdaTexto.style.textDecoration = config.estiloDecoracionTexto.split(';')[0];
                celdaTexto.style.color = tareaActualizada.estado === "Completada" ? "gray" : "black";
                botonEstado.innerText = config.textoBotonEstado;
                botonEstado.style.backgroundColor = config.bgColorBoton;

                botonEstado.onclick = () => ui.handlers.cambiarEstado(id, tareaActualizada.estado, filaHTML);
            } catch {
                ui.lanzarNotificacion("Error: No se pudo cambiar el estado de la tarea.", "red", "#fdedec");
            }
        },

        async editar(id, filaHTML) {
            const celdaTexto = filaHTML.querySelector('.descripcion-celda');
            let modificacionTexto = prompt("Modifique la descripción actual de la tarea:", celdaTexto.innerText);
            
            if (modificacionTexto === null) return;
            if (modificacionTexto.trim() === '') {
                ui.lanzarNotificacion("Error: No puede dejar la descripción vacía al actualizar.", "red", "#fdedec");
                return;
            }

            try {
                const tActualizada = await api.updateTaskDescription(id, modificacionTexto.trim());
                celdaTexto.innerText = tActualizada.descripcion;
                ui.lanzarNotificacion("¡La tarea ha sido actualizada con éxito!", "green", "#e8f8f5");
            } catch {
                ui.lanzarNotificacion("Error: No se pudo salvar la actualización.", "red", "#fdedec");
            }
        },

        async eliminar(id, filaHTML) {
            if (!confirm("¿Está seguro de eliminar esta tarea?")) return;
            try {
                await api.deleteTask(id);
                filaHTML.remove();
                ui.lanzarNotificacion("¡Tarea eliminada de la base de datos!", "green", "#e8f8f5");
                ui.state.totalTareas--;
                ui.actualizarContadorInterfaz();
            } catch {
                ui.lanzarNotificacion("Error de red al intentar eliminar la tarea.", "red", "#fdedec");
            }
        }
    }
};