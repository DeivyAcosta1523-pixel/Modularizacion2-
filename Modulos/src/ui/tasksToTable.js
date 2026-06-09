import { buildRowHtml } from './toInsertIntoTable.js';
import { actualizarContadorInterfaz } from './showEmptyTask.js';
import { taskService } from '../services/index.js';
import { lanzarNotificacion } from './notification.js';
import { getStatusConfig } from '../utils/index.js';

const tablaTareas = document.getElementById('messagesContainer');
let localState = { total: 0 };

export function setTotalTareasState(total) {
    localState.total = total;
}

export function agregarFilaTabla(tarea) {
    if (localState.total === 0 && tablaTareas) tablaTareas.innerHTML = '';

    const fila = buildRowHtml(tarea.id, tarea.nombreUsuario, tarea.idUsuario, tarea.descripcion, tarea.estado);

    fila.querySelector('.btn-estado').onclick = () => handlerCambiarEstado(tarea.id, tarea.estado, fila);
    fila.querySelector('.btn-editar').onclick = () => handlerEditar(tarea.id, fila);
    fila.querySelector('.btn-eliminar').onclick = () => handlerEliminar(tarea.id, fila);

    tablaTareas.appendChild(fila);
    localState.total++;
    actualizarContadorInterfaz(localState.total);
}

async function handlerCambiarEstado(id, estadoActual, filaHTML) {
    const nuevoEstado = estadoActual === "Pendiente" ? "Completada" : "Pendiente";
    try {
        const tAct = await taskService.updateTaskStatus(id, nuevoEstado);
        lanzarNotificacion(`Estado de tarea cambiado a: ${tAct.estado}`, "green", "#e8f8f5");
        
        const celdaTexto = filaHTML.querySelector('.descripcion-celda');
        const etiquetaEstado = filaHTML.querySelector('.estado-tag');
        const botonEstado = filaHTML.querySelector('.btn-estado');
        const config = getStatusConfig(tAct.estado);
        
        etiquetaEstado.innerText = tAct.estado;
        etiquetaEstado.style.color = config.colorEstado;
        celdaTexto.style.textDecoration = config.estiloDecoracionTexto.split(';')[0];
        celdaTexto.style.color = tAct.estado === "Completada" ? "gray" : "black";
        botonEstado.innerText = config.textoBotonEstado;
        botonEstado.style.backgroundColor = config.bgColorBoton;

        botonEstado.onclick = () => handlerCambiarEstado(id, tAct.estado, filaHTML);
    } catch {
        lanzarNotificacion("Error: No se pudo cambiar el estado de la tarea.", "red", "#fdedec");
    }
}

async function handlerEditar(id, filaHTML) {
    const celdaTexto = filaHTML.querySelector('.descripcion-celda');
    let modTexto = prompt("Modifique la descripción actual de la tarea:", celdaTexto.innerText);
    
    if (modTexto === null) return;
    if (modTexto.trim() === '') {
        lanzarNotificacion("Error: No puede dejar la descripción vacía al actualizar.", "red", "#fdedec");
        return;
    }

    try {
        const tAct = await taskService.updateTaskDescription(id, modTexto.trim());
        celdaTexto.innerText = tAct.descripcion;
        lanzarNotificacion("¡La tarea ha sido actualizada con éxito!", "green", "#e8f8f5");
    } catch {
        lanzarNotificacion("Error: No se pudo salvar la actualización.", "red", "#fdedec");
    }
}

async function handlerEliminar(id, filaHTML) {
    if (!confirm("¿Está seguro de eliminar esta tarea?")) return;
    try {
        await taskService.deleteTask(id);
        filaHTML.remove();
        lanzarNotificacion("¡Tarea eliminada de la base de datos!", "green", "#e8f8f5");
        localState.total--;
        actualizarContadorInterfaz(localState.total);
    } catch {
        lanzarNotificacion("Error de red al intentar eliminar la tarea.", "red", "#fdedec");
    }
}