import { getStatusConfig } from '../utils/statusMapper.js';

export function buildRowHtml(idTarea, nombre, idUsuario, descripcion, estado) {
    const { colorEstado, textoBotonEstado, estiloDecoracionTexto, bgColorBoton } = getStatusConfig(estado);

    const fila = document.createElement('tr');
    fila.dataset.id = idTarea; 
    fila.innerHTML = `
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${idUsuario}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${nombre}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-decoration: ${estiloDecoracionTexto}" class="descripcion-celda">${descripcion}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">
            <span class="estado-tag" style="color: ${colorEstado}; font-weight: bold;">${estado}</span>
        </td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
            <button class="btn-estado" style="background-color: ${bgColorBoton}; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px; margin-right: 2px;">${textoBotonEstado}</button>
            <button class="btn-editar">Editar</button>
            <button class="btn-eliminar">Eliminar</button>
        </td>
    `;
    return fila;
}