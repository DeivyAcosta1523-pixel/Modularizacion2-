import { userService, taskService } from './services/index.js';
import { 
    lanzarNotificacion, 
    limpiarNotificacion, 
    clearTaskInput, 
    actualizarContadorInterfaz, 
    agregarFilaTabla,
    setTotalTareasState
} from './ui/index.js';
import { validateIdInput, handleApiError, handleGenericError } from './utils/index.js';

const formBusqueda = document.getElementById('messageForm');
const inputId = document.getElementById('userName');
const inputTareaDesc = document.getElementById('userMessage');
const tablaTareas = document.getElementById('messagesContainer');

// Escucha en tiempo real para buscar ID de usuario
if (inputId) {
    inputId.addEventListener('input', async function() {
        const id = this.value.trim();
        if (id === "") {
            limpiarNotificacion();
            return;
        }
        try {
            const usuario = await userService.getUserById(id);
            lanzarNotificacion(`Usuario encontrado: ${usuario.name}`, "#2980b9", "#ebf5fb");
        } catch {
            lanzarNotificacion("Buscando usuario en el sistema...", "gray", "#f5f5f5");
        }
    });
}

// Carga las tareas específicas de un usuario
async function cargarTareasDeUsuario(idUsuario, nombreUsuario) {
    try {
        if (tablaTareas) tablaTareas.innerHTML = '';
        setTotalTareasState(0);

        const tareas = await taskService.getTasksByUserId(idUsuario);

        if (tareas.length > 0) {
            tareas.forEach(tarea => agregarFilaTabla(tarea));
            lanzarNotificacion(`Visualizando tareas de: ${nombreUsuario}`, "#2980b9", "#ebf5fb");
        } else {
            lanzarNotificacion(`El usuario ${nombreUsuario} no tiene tareas asignadas.`, "#d35400", "#fef9e7");
            actualizarContadorInterfaz(0);
        }
    } catch {
        handleGenericError("Error al intentar cargar el historial de tareas.");
    }
}

// Formulario de Envío (Doble acción Inteligente)
if (formBusqueda) {
    formBusqueda.onsubmit = async function(e) {
        e.preventDefault();

        const idBuscado = validateIdInput(inputId.value);
        const tareaTexto = inputTareaDesc.value.trim();

        if (idBuscado === "") {
            handleGenericError("Error: Por favor ingrese un ID de Usuario para buscar o guardar.");
            return;
        }

        // ACCIÓN A: Consultar
        if (tareaTexto === "") {
            lanzarNotificacion("Consultando historial en el servidor...", "blue", "#ebf5fb");
            try {
                const usuario = await userService.getUserById(idBuscado);
                await cargarTareasDeUsuario(usuario.id, usuario.name);
            } catch (error) {
                if (tablaTareas) tablaTareas.innerHTML = '';
                setTotalTareasState(0);
                actualizarContadorInterfaz(0);
                handleApiError(error);
            }
            return;
        }

        // ACCIÓN B: Crear Tarea
        try {
            const usuario = await userService.getUserById(idBuscado);
            const nuevaTarea = {
                idUsuario: Number(usuario.id),
                nombreUsuario: usuario.name,
                descripcion: tareaTexto,
                estado: "Pendiente"
            };

            const tFinal = await taskService.createTask(nuevaTarea);
            lanzarNotificacion(`¡Tarea registrada exitosamente para ${tFinal.nombreUsuario}!`, "green", "#e8f8f5");
            
            await cargarTareasDeUsuario(tFinal.idUsuario, tFinal.nombreUsuario);
            clearTaskInput();
        } catch (error) {
            handleApiError(error);
        }
    };
}

// Inicialización de la Base de datos completa
async function cargarTareasIniciales() {
    try {
        if (tablaTareas) tablaTareas.innerHTML = '';
        setTotalTareasState(0);

        const tareas = await taskService.getTasks();
        if (tareas.length > 0) {
            tareas.forEach(tarea => agregarFilaTabla(tarea));
        } else {
            actualizarContadorInterfaz(0);
        }
    } catch {
        console.log("Servidor vacío o desconectado. Esperando interacciones.");
    }
}

document.addEventListener("DOMContentLoaded", cargarTareasIniciales);