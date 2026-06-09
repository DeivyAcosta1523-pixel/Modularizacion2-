import { lanzarNotificacion } from '../ui/notification.js';

export function handleGenericError(mensaje) {
    lanzarNotificacion(mensaje, "red", "#fdedec");
}