const tablaTareas = document.getElementById('messagesContainer');
const contadorTexto = document.getElementById('messageCount');

export function actualizarContadorInterfaz(totalTareas) {
    if (contadorTexto) {
        contadorTexto.innerText = `${totalTareas} tareas registradas`;
    }
    
    if (totalTareas === 0 && tablaTareas) {
        tablaTareas.innerHTML = `
            <tr id="emptyState">
                <td colspan="5" style="text-align: center; color: gray; padding: 20px;">
                    No hay tareas registradas en el sistema.
                </td>
            </tr>
        `;
    }
}