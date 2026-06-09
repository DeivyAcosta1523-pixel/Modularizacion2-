import { userService, taskService } from './services/index.js';
import {
    lanzarNotificacion,
    limpiarNotificacion,
    clearTaskInput,
    actualizarContadorInterfaz,
    agregarFilaTabla,
    limpiarTabla
} from './ui/index.js';
import { validateIdInput, handleApiError, handleGenericError } from './utils/index.js';
import { applyFilters, getFiltrosFromDOM } from './filters/filterBar.js';
import { sortTasks, getSortConfigFromDOM } from './sorting/sortControls.js';
import { showSuccess, showError, showInfo, showWarning } from './notification/notificationSystem.js';
import { exportToJSON } from './export/exportTasks.js';

const formBusqueda = document.getElementById('messageForm');
const inputId = document.getElementById('userName');
const inputTareaDesc = document.getElementById('userMessage');

let todasLasTareas = [];

function mostrarNotificacion(notif) {
    if (notif && notif.texto) {
        lanzarNotificacion(notif.texto, notif.color, notif.fondo);
    }
}

function renderizarTareas(tareas) {
    limpiarTabla();
    if (tareas.length === 0) {
        actualizarContadorInterfaz(0);
        return;
    }
    tareas.forEach(t => agregarFilaTabla(t));
}

function aplicarFiltrosYSort() {
    const filtros = getFiltrosFromDOM();
    const { criterio, orden } = getSortConfigFromDOM();
    let resultado = applyFilters(todasLasTareas, filtros);
    resultado = sortTasks(resultado, criterio, orden);
    renderizarTareas(resultado);
}

if (inputId) {
    inputId.addEventListener('input', async function() {
        const id = this.value.trim();
        if (id === "") {
            limpiarNotificacion();
            return;
        }
        try {
            const usuario = await userService.getUserById(id);
            showInfo(`Usuario encontrado: ${usuario.name}`);
        } catch {
            lanzarNotificacion("Buscando usuario en el sistema...", "gray", "#f5f5f5");
        }
    });
}

async function cargarTareasDeUsuario(idUsuario, nombreUsuario) {
    try {
        todasLasTareas = [];
        limpiarTabla();
        const tareas = await taskService.getTasksByUserId(idUsuario);
        todasLasTareas = tareas;

        if (tareas.length > 0) {
            aplicarFiltrosYSort();
            showInfo(`Visualizando tareas de: ${nombreUsuario}`);
        } else {
            actualizarContadorInterfaz(0);
            showWarning(`El usuario ${nombreUsuario} no tiene tareas asignadas.`);
        }
    } catch {
        mostrarNotificacion(handleGenericError("Error al intentar cargar el historial de tareas."));
    }
}

if (formBusqueda) {
    formBusqueda.onsubmit = async function(e) {
        e.preventDefault();

        const idBuscado = validateIdInput(inputId.value);
        const tareaTexto = inputTareaDesc.value.trim();

        if (idBuscado === "") {
            mostrarNotificacion(handleGenericError("Error: Por favor ingrese un ID de Usuario para buscar o guardar."));
            return;
        }

        if (tareaTexto === "") {
            showInfo("Consultando historial en el servidor...");
            try {
                const usuario = await userService.getUserById(idBuscado);
                await cargarTareasDeUsuario(usuario.id, usuario.name);
            } catch (error) {
                todasLasTareas = [];
                limpiarTabla();
                mostrarNotificacion(handleApiError(error));
            }
            return;
        }

        try {
            const usuario = await userService.getUserById(idBuscado);
            const nuevaTarea = {
                idUsuario: Number(usuario.id),
                nombreUsuario: usuario.name,
                descripcion: tareaTexto,
                estado: "Pendiente",
                createdAt: new Date().toISOString()
            };

            const tFinal = await taskService.createTask(nuevaTarea);
            showSuccess(`¡Tarea registrada exitosamente para ${tFinal.nombreUsuario}!`);

            await cargarTareasDeUsuario(tFinal.idUsuario, tFinal.nombreUsuario);
            clearTaskInput();
        } catch (error) {
            mostrarNotificacion(handleApiError(error));
        }
    };
}

async function cargarTareasIniciales() {
    try {
        todasLasTareas = [];
        limpiarTabla();
        const tareas = await taskService.getTasks();
        todasLasTareas = tareas;

        if (tareas.length > 0) {
            aplicarFiltrosYSort();
        } else {
            actualizarContadorInterfaz(0);
        }
    } catch {
        console.log("Servidor vacío o desconectado. Esperando interacciones.");
    }
}

document.getElementById('btnApplyFilter')?.addEventListener('click', () => {
    if (todasLasTareas.length > 0) {
        aplicarFiltrosYSort();
    }
});

document.getElementById('btnClearFilter')?.addEventListener('click', () => {
    document.getElementById('filterEstado').value = '';
    document.getElementById('filterUsuario').value = '';
    if (todasLasTareas.length > 0) {
        aplicarFiltrosYSort();
    }
    showInfo("Filtros limpiados.");
});

document.getElementById('btnApplySort')?.addEventListener('click', () => {
    if (todasLasTareas.length > 0) {
        aplicarFiltrosYSort();
    }
});

document.getElementById('btnExport')?.addEventListener('click', () => {
    const tabla = document.getElementById('messagesContainer');
    const filas = tabla ? tabla.querySelectorAll('tr:not(#emptyState)') : [];
    if (filas.length === 0) {
        showError("No hay tareas visibles para exportar.");
        return;
    }

    const filtros = getFiltrosFromDOM();
    const { criterio, orden } = getSortConfigFromDOM();
    let visibles = applyFilters(todasLasTareas, filtros);
    visibles = sortTasks(visibles, criterio, orden);

    exportToJSON(visibles);
    showSuccess(`Se exportaron ${visibles.length} tareas.`);
});

document.addEventListener("DOMContentLoaded", cargarTareasIniciales);
