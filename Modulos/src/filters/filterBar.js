export function applyFilters(tasks, filtros) {
    return tasks.filter(tarea => {
        if (filtros.estado && tarea.estado !== filtros.estado) return false;
        if (filtros.idUsuario && tarea.idUsuario !== Number(filtros.idUsuario)) return false;
        return true;
    });
}

export function getFiltrosFromDOM() {
    const estado = document.getElementById('filterEstado')?.value || '';
    const idUsuario = document.getElementById('filterUsuario')?.value || '';
    return {
        estado: estado || null,
        idUsuario: idUsuario || null
    };
}

export function hayFiltrosActivos(filtros) {
    return !!(filtros.estado || filtros.idUsuario);
}
