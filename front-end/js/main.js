import { Modal } from './components/modal.js';
import { ProjectList } from './components/project-list.js';
import { InventoryList } from './components/inventory-list.js';
import { formatCurrency } from './utils/formatters.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Components
    const modal = new Modal('modal');
    const inventoryList = new InventoryList('listaEstoque', modal, 'dropdownCheckboxes');
    const projectList = new ProjectList('listaProjetos', modal, inventoryList);

    // Initial Load
    inventoryList.refresh();
    projectList.refresh();

    // Theme Toggle
    const btnTema = document.getElementById('botao-tema');
    const toggleTheme = () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('temaEscuro', isDark ? 'sim' : 'nao');
        btnTema.innerHTML = isDark ? '&#9728;' : '&#9790;';
    };
    btnTema.addEventListener('click', toggleTheme);

    // Load saved theme
    if (localStorage.getItem('temaEscuro') === 'sim') {
        document.body.classList.add('dark');
        btnTema.innerHTML = '&#9728;';
    } else {
        btnTema.innerHTML = '&#9790;';
    }

    // Tab Navigation
    document.querySelectorAll('nav button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabId = e.target.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(div => div.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Add Project Form
    document.getElementById('btnAddProjeto').addEventListener('click', () => {
        const nome = document.getElementById('projetoNome').value.trim();
        const valor = parseFloat(document.getElementById('projetoValor').value);

        if (!nome || isNaN(valor)) {
            alert('Preencha nome e valor corretamente.');
            return;
        }

        const checkboxes = document.querySelectorAll('#dropdownCheckboxes input[type="checkbox"]:checked');
        const selectedMaterials = Array.from(checkboxes).map(cb => ({
            id: cb.value,
            quantity: document.getElementById(`qtd_${cb.value}`).value || 0
        })).filter(l => l.quantity > 0);

        projectList.addProject(nome, valor, selectedMaterials).then(() => {
            // Clear form
            document.getElementById('projetoNome').value = '';
            document.getElementById('projetoValor').value = '';
            checkboxes.forEach(cb => cb.checked = false);
            document.querySelectorAll('.qty-input').forEach(i => i.value = '');
        });
    });

    // Dropdown Toggle
    document.querySelector('.dropbtn').addEventListener('click', () => {
        document.querySelector(".dropdown").classList.toggle("active");
    });

    // Add Material Form
    document.getElementById('btnAddLinha').addEventListener('click', () => {
        const cor = document.getElementById('linhaCor').value.trim();
        const marca = document.getElementById('linhaMarca').value.trim();
        const tipo = document.getElementById('linhaTipo').value;

        if (!cor) {
            alert('Preencha a cor/nome da linha.');
            return;
        }

        inventoryList.addMaterial(cor, marca, tipo).then(() => {
            document.getElementById('linhaCor').value = '';
            document.getElementById('linhaMarca').value = '';
        }).catch(err => {
            console.error(err);
            alert('Erro ao adicionar material: ' + err.message);
        });
    });

    // Dashboard Summary Update
    const updateDashboard = (projects) => {
        const totalProjetos = projects.length;
        const projetosConcluidos = projects.filter(p => p.status === 'COMPLETED').length;
        const projetosEmAndamento = projects.filter(p => p.status === 'IN_PROGRESS').length;

        const totalValor = projects.reduce((acc, p) => acc + (p.totalPrice || p.valor || 0), 0);
        const valorConcluido = projects
            .filter(p => p.status === 'COMPLETED')
            .reduce((acc, p) => acc + (p.totalPrice || p.valor || 0), 0);

        document.getElementById('resumoProjetos').innerHTML = `
            <strong>Total:</strong> ${totalProjetos}<br>
            <span style="color: green">Concluídos:</span> ${projetosConcluidos}<br>
            <span style="color: orange">Em Andamento:</span> ${projetosEmAndamento}
        `;
        document.getElementById('resumoValores').innerHTML = `
            <strong>Valor Total Estimado:</strong> ${formatCurrency(totalValor)}<br>
            <strong>Valor Realizado (Concluídos):</strong> ${formatCurrency(valorConcluido)}
        `;
    };

    document.addEventListener('projectsUpdated', (e) => updateDashboard(e.detail));
});
