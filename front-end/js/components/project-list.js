import { api } from '../services/api.js';
import { formatCurrency } from '../utils/formatters.js';

export class ProjectList {
    constructor(containerId, modal, inventoryList) {
        this.container = document.getElementById(containerId);
        this.modal = modal;
        this.inventoryList = inventoryList;
        this.projects = [];
    }

    async refresh() {
        try {
            this.projects = await api.getProjects();
            this.render();
            // Dispatch event for dashboard update
            document.dispatchEvent(new CustomEvent('projectsUpdated', { detail: this.projects }));
        } catch (error) {
            console.error('Failed to fetch projects', error);
        }
    }

    render() {
        this.container.innerHTML = '';
        this.projects.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'card project-card';

            let materialsHtml = '';
            if (proj.projectMaterials && proj.projectMaterials.length > 0) {
                materialsHtml = `
                    <div class="materials-list">
                        <strong>Linhas usadas:</strong>
                        <table>
                            <thead><tr><th>Cor</th><th>Qtd</th></tr></thead>
                            <tbody>
                                ${proj.projectMaterials.map(pm => `
                                    <tr>
                                        <td>${pm.material ? pm.material.name : '<em>Removido</em>'}</td>
                                        <td>${pm.quantity} g</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="card-header">
                    <h3>${proj.title || proj.name}</h3>
                    <span class="status-badge ${proj.status}">${proj.status}</span>
                </div>
                <div class="card-body">
                    <p><strong>Valor:</strong> ${formatCurrency(proj.totalPrice || proj.valor)}</p>
                    ${materialsHtml}
                </div>
                <div class="card-actions">
                    <button class="btn-edit" data-id="${proj.id}">Editar</button>
                    <button class="btn-delete" data-id="${proj.id}">Excluir</button>
                </div>
            `;

            // Bind events
            card.querySelector('.btn-edit').addEventListener('click', () => this.openEditModal(proj));
            card.querySelector('.btn-delete').addEventListener('click', () => this.deleteProject(proj.id));

            this.container.appendChild(card);
        });
    }

    openEditModal(proj) {
        this.modal.open({
            title: 'Editar Projeto',
            fields: {
                field1: { label: 'Nome', value: proj.title || proj.name },
                field2: { label: 'Valor', value: proj.totalPrice || proj.valor, type: 'number', step: '0.01' },
                field3: { label: 'Status', value: proj.status, type: 'select', options: ['IN_PROGRESS', 'COMPLETED', 'NOT_STARTED', 'CANCELLED'] }
            },
            onSave: async (data) => {
                await api.updateProject(proj.id, {
                    title: data.field1,
                    name: data.field1,
                    totalPrice: parseFloat(data.field2),
                    valor: parseFloat(data.field2),
                    status: data.field3
                });
                await this.refresh();
            }
        });
    }

    async deleteProject(id) {
        if (confirm('Deseja excluir este projeto?')) {
            await api.deleteProject(id);
            await this.refresh();
        }
    }

    async addProject(name, value, selectedMaterials) {
        const project = {
            title: name,
            name: name,
            totalPrice: value,
            valor: value,
            status: 'IN_PROGRESS',
            projectMaterials: selectedMaterials.map(m => ({
                material: { id: m.id },
                quantity: m.quantity
            }))
        };
        await api.createProject(project);
        await this.refresh();
    }
}
