export function getStatusConfig(estado) {
    const configs = {
        "Pendiente": {
            colorEstado: "#e67e22",
            textoBotonEstado: "Iniciar",
            estiloDecoracionTexto: "none; color: black;",
            bgColorBoton: "#e67e22"
        },
        "En Proceso": {
            colorEstado: "#3498db",
            textoBotonEstado: "Completar",
            estiloDecoracionTexto: "none; color: black;",
            bgColorBoton: "#3498db"
        },
        "Completada": {
            colorEstado: "#27ae60",
            textoBotonEstado: "Reabrir",
            estiloDecoracionTexto: "line-through; color: gray;",
            bgColorBoton: "#7f8c8d"
        }
    };
    return configs[estado] || configs["Pendiente"];
}

export function getSiguienteEstado(estado) {
    const ciclo = ["Pendiente", "En Proceso", "Completada"];
    const idx = ciclo.indexOf(estado);
    return ciclo[(idx + 1) % ciclo.length];
}