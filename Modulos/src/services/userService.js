import { API_URL } from '../api/config.js';

export const userService = {
    async getUserById(id) {
        const res = await fetch(`${API_URL}/users/${Number(id)}`);
        if (!res.ok) throw new Error("No existe");
        return await res.json();
    }
};