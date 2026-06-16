import { lanzarNotificacion, limpiarNotificacion } from '../ui/notification';

export function showSuccess(mensaje) {
    lanzarNotificacion(mensaje, "#27ae60", "#e8f8f5");
}

export function showError(mensaje) {
    lanzarNotificacion(mensaje, "#e74c3c", "#fdedec");
}

export function showInfo(mensaje) {
    lanzarNotificacion(mensaje, "#2980b9", "#ebf5fb");
}

export function showWarning(mensaje) {
    lanzarNotificacion(mensaje, "#e67e22", "#fef9e7");
}

export function clearNotifications() {
    limpiarNotificacion();
}
