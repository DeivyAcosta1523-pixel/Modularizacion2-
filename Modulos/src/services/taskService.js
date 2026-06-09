import { API_URL } from '../api/config.js';

export const taskService = {
    async getTasks() {
        const res = await fetch(`${API_URL}/tareas`);
        if (!res.ok) throw new Error();
        return await res.json();
    },

    async getTasksByUserId(idUsuario) {
        const res = await fetch(`${API_URL}/tareas?idUsuario=${Number(idUsuario)}`);
        if (!res.ok) throw new Error();
        return await res.json();
    },

    async createTask(nuevaTarea) {
        const res = await fetch(`${API_URL}/tareas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaTarea)
        });
        if (!res.ok) throw new Error("ErrorServidor");
        return await res.json();
    },

    async updateTaskStatus(id, nuevoEstado) {
        const res = await fetch(`${API_URL}/tareas/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        if (!res.ok) throw new Error();
        return await res.json();
    },

    async updateTaskDescription(id, descripcion) {
        const res = await fetch(`${API_URL}/tareas/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ descripcion })
        });
        if (!res.ok) throw new Error();
        return await res.json();
    },

    async deleteTask(id) {
        const res = await fetch(`${API_URL}/tareas/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error();
        return true;
    }
};