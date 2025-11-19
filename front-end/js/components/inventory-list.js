import { api } from '../services/api.js';

export class InventoryList {
    constructor(containerId, modal, dropdownContainerId) {
        this.container = document.getElementById(containerId);
        this.modal = modal;
        this.dropdownContainer = document.getElementById(dropdownContainerId);
        this.materials = [];
    }

    async refresh() {
        try {
            this.materials = await api.getMaterials();
            this.render();
            this.renderDropdown();
        } catch (error) {
            console.error('Failed to fetch materials', error);
        }
    }

    render() {
        this.container.innerHTML = '';
        this.materials.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card inventory-card';
            card.innerHTML = `
                <div class="card-header">
                    <h3>${item.name}</h3>
                    <div class="color-dot" style="background-color: ${item.color};"></div>
                </div>
                <div class="card-body">
                    <p><strong>Cor:</strong> ${item.color}</p>
                    <p><strong>Marca:</strong> ${item.brand || 'N/A'}</p>
                </div>
                <div class="card-actions">
                    <button class="btn-edit" data-id="${item.id}">Editar</button>
                    <button class="btn-delete" data-id="${item.id}">Excluir</button>
                </div>
            `;

            card.querySelector('.btn-edit').addEventListener('click', () => this.openEditModal(item));
            card.querySelector('.btn-delete').addEventListener('click', () => this.deleteMaterial(item.id));

            this.container.appendChild(card);
        });
    }

    renderDropdown() {
        if (!this.dropdownContainer) return;
        this.dropdownContainer.innerHTML = '';
        this.materials.forEach(item => {
            const wrapper = document.createElement('div');
            wrapper.className = 'dropdown-item';
            wrapper.innerHTML = `
                <label>
                    <input type="checkbox" value="${item.id}">
                    <span class="color-dot-small" style="background-color: ${item.color};"></span>
                    ${item.name}
                </label>
                <input type="number" id="qtd_${item.id}" placeholder="g" min="1" class="qty-input">
            `;
            this.dropdownContainer.appendChild(wrapper);
        });
    }

    openEditModal(item) {
        this.modal.open({
            title: 'Editar Material',
            fields: {
                field1: { label: 'Nome', value: item.name },
                field2: { label: 'Cor', value: item.color },
                field3: { label: 'Marca', value: item.brand }
            },
            onSave: async (data) => {
                await api.updateMaterial(item.id, {
                    name: data.field1,
                    color: data.field2,
                    brand: data.field3,
                    type: 'LINHA', // Default
                    unit: 'GRAMAS' // Default
                });
                await this.refresh();
            }
        });
    }

    async deleteMaterial(id) {
        if (confirm('Deseja excluir este material?')) {
            await api.deleteMaterial(id);
            await this.refresh();
        }
    }

    async addMaterial(color, qtd, valor) {
        // Note: The original app used 'color' as name. Keeping logic similar but improved.
        const material = {
            name: color, // Using color as name for now as per original logic
            color: color,
            brand: '',
            type: 'LINHA',
            unit: 'GRAMAS'
        };
        await api.createMaterial(material);
        await this.refresh();
    }
}
