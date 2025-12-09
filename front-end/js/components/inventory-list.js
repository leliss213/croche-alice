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
            // Calculate Stock
            const totalPurchased = item.purchases ? item.purchases.reduce((acc, p) => acc + p.quantity, 0) : 0;
            const totalUsed = item.projectMaterials ? item.projectMaterials.reduce((acc, pm) => acc + (pm.quantity || 0), 0) : 0;
            const currentStock = totalPurchased - totalUsed;

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
                    <p><strong>Estoque:</strong> ${currentStock} g</p>
                </div>
                <div class="card-actions">
                    <button class="btn-stock" data-id="${item.id}" style="background-color: #ff9800;" title="Adicionar Estoque">+</button>
                    <button class="btn-edit" data-id="${item.id}">Editar</button>
                    <button class="btn-delete" data-id="${item.id}">Excluir</button>
                </div>
            `;

            card.querySelector('.btn-stock').addEventListener('click', () => this.openPurchaseModal(item));
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

    openPurchaseModal(item) {
        this.modal.open({
            title: `Adicionar Estoque: ${item.name}`,
            fields: {
                field1: { label: 'Quantidade (g)', value: '', type: 'number' },
                field2: { label: 'Preço Total (R$)', value: '', type: 'number', step: '0.01' },
                field3: { label: 'Data', value: new Date().toISOString().split('T')[0], type: 'date' } // Assuming modal supports date or text
            },
            onSave: async (data) => {
                await api.createPurchase({
                    material: { id: item.id },
                    quantity: parseFloat(data.field1),
                    totalPrice: parseFloat(data.field2),
                    purchaseDate: data.field3
                });
                await this.refresh();
            }
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

    async addMaterial(color, brand, type) {
        const material = {
            name: color,
            color: color,
            brand: brand || '',
            type: type || 'LINHA',
            unit: 'GRAMAS'
        };
        await api.createMaterial(material);
        await this.refresh();
    }
}
