import { lanzarNotificacion } from '../ui/notification.js';

export function handleApiError(error) {
    if (error.message === "No existe") {
        lanzarNotificacion("Error: El ID de usuario especificado no existe en el sistema.", "red", "#fdedec");
    } else if (error.message === "ErrorServidor") {
        lanzarNotificacion("Error de Red: No se pudo conectar con el servidor. Verifique su json-server.", "red", "#fdedec");
    } else {
        lanzarNotificacion("Ocurrió un error inesperado con el servidor.", "red", "#fdedec");
    }
}