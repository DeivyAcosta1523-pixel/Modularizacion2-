const mensajeError = document.getElementById('userNameError');

export function lanzarNotificacion(texto, color, fondo) {
    if (!mensajeError) return;
    mensajeError.style.display = "block"; 
    mensajeError.innerText = texto;
    mensajeError.style.color = color;
    mensajeError.style.backgroundColor = fondo;
    mensajeError.style.border = `1px solid ${color}`;
}

export function limpiarNotificacion() {
    if (!mensajeError) return;
    mensajeError.innerText = "";
    mensajeError.style.backgroundColor = "transparent";
    mensajeError.style.border = "none";
    mensajeError.style.display = "none";
}