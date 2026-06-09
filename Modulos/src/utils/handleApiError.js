export function handleApiError(error) {
    if (error.message === "No existe") {
        return { texto: "Error: El ID de usuario especificado no existe en el sistema.", color: "red", fondo: "#fdedec" };
    } else if (error.message === "ErrorServidor") {
        return { texto: "Error de Red: No se pudo conectar con el servidor. Verifique su json-server.", color: "red", fondo: "#fdedec" };
    } else {
        return { texto: "Ocurrió un error inesperado con el servidor.", color: "red", fondo: "#fdedec" };
    }
}