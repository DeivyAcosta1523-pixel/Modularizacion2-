export function getStatusConfig(estado) {
    const esCompletada = estado === "Completada";
    return {
        esCompletada,
        colorEstado: esCompletada ? "#27ae60" : "#e67e22",
        textoBotonEstado: esCompletada ? "Reabrir" : "Hecha",
        estiloDecoracionTexto: esCompletada ? "line-through; color: gray;" : "none; color: black;",
        bgColorBoton: esCompletada ? '#7f8c8d' : '#2ecc71'
    };
}