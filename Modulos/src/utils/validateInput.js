export function validateIdInput(id) {
    return id.trim() !== "" ? Number(id.trim()) : "";
}