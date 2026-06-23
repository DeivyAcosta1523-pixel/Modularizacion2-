// ============================================================
// MÓDULO INDEPENDIENTE: FILTROS AVANZADOS Y ORDENAMIENTO (RF01 y RF02)
// ============================================================

/**
 * Lee las filas que ya están dibujadas en la pantalla y aplica
 * los filtros ocultándolas o mostrándolas sin recargar la página.
 */
export function aplicarFiltrosYOrden() {
    // 1. Buscamos el contenedor de la tabla
    const tablaTareas = document.getElementById('messagesContainer');
    if (!tablaTareas) return;

    // 2. Capturamos los valores seleccionados por el usuario en la interfaz
    const filtroEstado = document.getElementById('filtroEstado')?.value || 'todos';
    const filtroUsuario = document.getElementById('filtroUsuario')?.value.trim().toLowerCase() || '';
    const criterioOrden = document.getElementById('criterioOrden')?.value || 'ninguno';

    // 3. Convertimos las filas (tr) en una lista/Array de JavaScript para manipularlas.
    // Con ".filter" ignoramos la fila de "No hay tareas" (id="emptyState").
    const filas = Array.from(tablaTareas.querySelectorAll('tr')).filter(fila => fila.id !== 'emptyState');

    // --- PASO 1: FILTRADO COMBINADO SIMULTÁNEO (RF01) ---
    filas.forEach(fila => {
        // Extraemos los datos de las celdas usando el orden que definiste en toInsertIntoTable.js
        const celdaIdUsuario = fila.children[0]?.innerText || '';                            // Columna 1: ID
        const celdaNombre = fila.children[1]?.innerText.toLowerCase() || '';                   // Columna 2: Nombre Usuario
        const celdaEstado = fila.querySelector('.estado-tag')?.innerText.toLowerCase() || ''; // Columna 4: Estado

        // Comprobamos el filtro de Estado
        const cumpleEstado = filtroEstado === 'todos' || celdaEstado === filtroEstado.toLowerCase();
        
        // Comprobamos el filtro de Usuario (busca coincidencia simultánea por Nombre o por ID de usuario)
        const cumpleUsuario = filtroUsuario === '' || 
                              celdaNombre.includes(filtroUsuario) || 
                              celdaIdUsuario.includes(filtroUsuario);

        // COMBINACIÓN: Si cumple ambos filtros a la vez, se muestra; si no, se oculta con CSS
        if (cumpleEstado && cumpleUsuario) {
            fila.style.display = ""; // Visible
        } else {
            fila.style.display = "none"; // Oculto
        }
    });

    // --- PASO 2: ORDENAMIENTO DINÁMICO DESDE INTERFAZ (RF02) ---
    if (criterioOrden !== 'ninguno') {
        filas.sort((filaA, filaB) => {
            // Ordenar por Nombre/Descripción de la tarea
            if (criterioOrden === 'nombre') {
                const textoA = filaA.querySelector('.descripcion-celda')?.innerText || '';
                const textoB = filaB.querySelector('.descripcion-celda')?.innerText || '';
                return textoA.localeCompare(textoB);
            }
            // Ordenar por Estado (Completada vs Pendiente)
            if (criterioOrden === 'estado') {
                const estadoA = filaA.querySelector('.estado-tag')?.innerText || '';
                const estadoB = filaB.querySelector('.estado-tag')?.innerText || '';
                return estadoA.localeCompare(estadoB);
            }
            // Ordenar por Fecha/ID de creación (Usamos el dataset.id que le asignaste en toInsertIntoTable.js)
            if (criterioOrden === 'fecha') {
                const idA = Number(filaA.dataset.id) || 0;
                const idB = Number(filaB.dataset.id) || 0;
                return idA - idB; // Ordena de menor a mayor (más antiguo a más reciente)
            }
            return 0;
        });

        // Reinsertamos las filas ordenadas en el contenedor de la tabla.
        // appendChild cambia los elementos de posición en el HTML sin duplicarlos ni recrear eventos.
        filas.forEach(fila => tablaTareas.appendChild(fila));
    }
}

/**
 * Agrega los escuchadores de eventos a los elementos del HTML
 */
export function inicializarModuloFiltros() {
    document.getElementById('filtroEstado')?.addEventListener('change', aplicarFiltrosYOrden);
    document.getElementById('filtroUsuario')?.addEventListener('input', aplicarFiltrosYOrden);
    document.getElementById('criterioOrden')?.addEventListener('change', aplicarFiltrosYOrden);
}