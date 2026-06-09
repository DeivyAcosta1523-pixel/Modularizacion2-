export function sortTasks(tasks, criterio, orden = 'asc') {
    const copia = [...tasks];
    copia.sort((a, b) => {
        let comparacion = 0;
        if (criterio === 'fecha') {
            const fechaA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const fechaB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            comparacion = fechaA - fechaB;
        } else if (criterio === 'nombre') {
            comparacion = (a.descripcion || '').localeCompare(b.descripcion || '');
        } else if (criterio === 'estado') {
            const ordenEstados = { 'Pendiente': 1, 'En Proceso': 2, 'Completada': 3 };
            comparacion = (ordenEstados[a.estado] || 0) - (ordenEstados[b.estado] || 0);
        }
        return orden === 'desc' ? -comparacion : comparacion;
    });
    return copia;
}

export function getSortConfigFromDOM() {
    const criterio = document.getElementById('sortCriterio')?.value || 'fecha';
    const orden = document.getElementById('sortOrden')?.value || 'asc';
    return { criterio, orden };
}
