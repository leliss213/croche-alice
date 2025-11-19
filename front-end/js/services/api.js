const API_URL = 'http://localhost:8080';

export async function fetchJson(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        // For DELETE or 204 No Content, return null
        if (response.status === 204) return null;

        // Check if response has content before parsing JSON
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

export const api = {
    getProjects: () => fetchJson('/projects'),
    createProject: (project) => fetchJson('/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
    }),
    updateProject: (id, project) => fetchJson(`/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
    }),
    deleteProject: (id) => fetchJson(`/projects/${id}`, { method: 'DELETE' }),

    getMaterials: () => fetchJson('/materials'),
    createMaterial: (material) => fetchJson('/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(material)
    }),
    updateMaterial: (id, material) => fetchJson(`/materials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(material)
    }),
    deleteMaterial: (id) => fetchJson(`/materials/${id}`, { method: 'DELETE' })
};
