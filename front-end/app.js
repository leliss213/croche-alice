const API_URL = 'http://localhost:8080';

let projetos = [];
let estoque = [];
let modalContexto = {}; // Simplified context

async function fetchProjetos() {
  try {
    const response = await fetch(`${API_URL}/projects`);
    if (!response.ok) throw new Error('Network response was not ok');
    projetos = await response.json();
    renderizarProjetos();
    atualizarResumo();
  } catch (error) {
    console.error('Fetch projects failed:', error);
  }
}

async function fetchEstoque() {
  try {
    const response = await fetch(`${API_URL}/materials`);
    if (!response.ok) throw new Error('Network response was not ok');
    estoque = await response.json();
    renderizarEstoque();
    atualizarDropdownCheckboxes();
    atualizarResumo();
  } catch (error) {
    console.error('Fetch inventory failed:', error);
  }
}

function showTab(tab) {
  document.querySelectorAll('.tab-content').forEach(div => div.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
}

async function adicionarProjeto() {
  const nome = document.getElementById('projetoNome').value.trim();
  const valor = parseFloat(document.getElementById('projetoValor').value);
  if (!nome || isNaN(valor)) return;

  const checkboxes = document.querySelectorAll('#dropdownCheckboxes input[type="checkbox"]:checked');
  const linhasUsadas = Array.from(checkboxes).map(cb => ({
    id: cb.value,
    quantidade: document.getElementById(`qtd_${cb.value}`).value || 0
  })).filter(l => l.quantidade > 0);

  const novoProjeto = {
    name: nome,    status: 'EM_ANDAMENTO',    valor,
    projectMaterials: linhasUsadas.map(l => ({ material: { id: l.id }, quantity: l.quantidade }))
  };

  try {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoProjeto)
    });
    if (!response.ok) throw new Error('Network response was not ok');
    await fetchProjetos(); // Re-fetch to get the new project
    document.getElementById('projetoNome').value = '';
    document.getElementById('projetoValor').value = '';
    checkboxes.forEach(cb => cb.checked = false);
    document.querySelectorAll('#dropdownCheckboxes input[type="number"]').forEach(input => input.value = '');
  } catch (error) {
    console.error('Add project failed:', error);
  }
}

async function excluirProjeto(id) {
  if (confirm('Deseja excluir este projeto?')) {
    try {
      const response = await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Network response was not ok');
      await fetchProjetos();
    } catch (error) {
      console.error('Delete project failed:', error);
    }
  }
}

async function adicionarLinha() {
  const cor = document.getElementById('linhaCor').value.trim();
  if (cor) {
    const novoMaterial = { name: cor, color: cor, type: 'LINHA', unit: 'GRAMAS' };
    try {
      const response = await fetch(`${API_URL}/materials`, {
        method: 'POST',        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoMaterial)
      });
      if (!response.ok) throw new Error('Network response was not ok');
      await fetchEstoque();
      document.getElementById('linhaCor').value = '';
    } catch (error) {
      console.error('Add material failed:', error);
    }
  }
}

async function excluirLinha(id) {
  if (confirm('Deseja excluir este item do estoque?')) {
    try {
      const response = await fetch(`${API_URL}/materials/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Network response was not ok');
      await fetchEstoque();
    } catch (error) {
      console.error('Delete material failed:', error);
    }
  }
}

function renderizarProjetos() {
  const lista = document.getElementById('listaProjetos');
  lista.innerHTML = '';
  projetos.forEach(proj => {
    const div = document.createElement('div');
    div.className = 'card';
    let html = `<strong>${proj.name}</strong><br><span>Status:</span> ${proj.status}<br><span>Valor:</span> R$ ${proj.valor.toFixed(2).replace('.', ',')}<br><br>`;
    if (proj.projectMaterials && proj.projectMaterials.length > 0) {
      html += `<div class="linhas-usadas"><strong>Linhas usadas:</strong><table><thead><tr><th>Cor</th><th>Quantidade</th></tr></thead><tbody>`;
      proj.projectMaterials.forEach(uso => {
        const linha = estoque.find(item => item.id === uso.material.id);
        html += `<tr><td>${linha ? linha.name : '<em style="color:red;">Removida</em>'}</td><td>${uso.quantity} g</td></tr>`;
      });
      html += `</tbody></table></div><br>`;
    }
    html += `<button onclick="abrirModal('projeto', '${proj.id}')">Editar</button><button onclick="excluirProjeto('${proj.id}')">Excluir</button>`;
    div.innerHTML = html;
    lista.appendChild(div);
  });
}

function renderizarEstoque() {
  const lista = document.getElementById('listaEstoque');
  lista.innerHTML = '';
  estoque.forEach(item => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<strong>${item.name}</strong><br><span>Cor:</span> ${item.color}<br><span>Marca:</span> ${item.brand || 'N/A'}<br><br><button onclick="abrirModal('estoque', '${item.id}')">Editar</button><button onclick="excluirLinha('${item.id}')">Excluir</button>`;
    lista.appendChild(div);
  });
}

function atualizarResumo() {
  const totalProjetos = projetos.length;
  const totalTiposMateriais = estoque.length;
  const totalProjetosReais = projetos.reduce((acc, item) => acc + item.valor, 0);

  document.getElementById('resumoProjetos').innerText = `Projetos em andamento: ${totalProjetos}`;
  document.getElementById('resumoTipos').innerText = `Tipos de materiais: ${totalTiposMateriais}`;

  const resumoCard = document.getElementById('perfil').querySelector('.card');
  let p = resumoCard.querySelector('p');
  if (!p) {
    p = document.createElement('p');
    resumoCard.appendChild(p);
  }
  p.innerHTML = `Valor total dos projetos: R$ ${totalProjetosReais.toFixed(2).replace('.', ',')}`;
}

function abrirModal(tipo, id) {
  modalContexto = { tipo, id };
  document.getElementById('modal').style.display = 'flex';
  document.getElementById('modalTitulo').innerText = tipo === 'projeto' ? 'Editar Projeto' : 'Editar Material';

  if (tipo === 'projeto') {
    const proj = projetos.find(p => p.id === id);
    document.getElementById('modalCampo1Label').innerText = 'Nome';
    document.getElementById('modalCampo2Label').innerText = 'Valor';
    document.getElementById('modalCampo1').value = proj.name;
    document.getElementById('modalCampo2').value = proj.valor;
    document.getElementById('modalCampo3').style.display = 'none'; // Hide irrelevant field
    document.getElementById('modalCampo3Label').style.display = 'none';
  } else { // estoque
    const item = estoque.find(i => i.id === id);
    document.getElementById('modalCampo1Label').innerText = 'Nome';
    document.getElementById('modalCampo2Label').innerText = 'Cor';
    document.getElementById('modalCampo3Label').innerText = 'Marca';
    document.getElementById('modalCampo1').value = item.name;
    document.getElementById('modalCampo2').value = item.color;
    document.getElementById('modalCampo3').value = item.brand || '';
    document.getElementById('modalCampo3').style.display = 'block';
    document.getElementById('modalCampo3Label').style.display = 'block';
  }
}

function fecharModal() {
  document.getElementById('modal').style.display = 'none';
}

async function salvarEdicao() {
  const { tipo, id } = modalContexto;
  let body, url;

  if (tipo === 'projeto') {
    url = `${API_URL}/projects/${id}`;
    body = JSON.stringify({ name: document.getElementById('modalCampo1').value, valor: parseFloat(document.getElementById('modalCampo2').value) });
  } else { // estoque
    url = `${API_URL}/materials/${id}`;
    body = JSON.stringify({
      name: document.getElementById('modalCampo1').value,
      color: document.getElementById('modalCampo2').value,
      brand: document.getElementById('modalCampo3').value
    });
  }

  try {
    const response = await fetch(url, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body
    });
    if (!response.ok) throw new Error('Network response was not ok');
    fecharModal();
    if (tipo === 'projeto') await fetchProjetos(); else await fetchEstoque();
  } catch (error) {
    console.error('Save edit failed:', error);
  }
}

function toggleDropdown() {
  document.querySelector(".dropdown").classList.toggle("active");
}

function atualizarDropdownCheckboxes() {
  const container = document.getElementById('dropdownCheckboxes');
  container.innerHTML = '';
  estoque.forEach(item => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<label><input type="checkbox" value="${item.id}"> ${item.name}</label><input type="number" id="qtd_${item.id}" placeholder="Qtd" min="1" style="width: 60px; margin-left: 10px;"><br>`;
    container.appendChild(wrapper);
  });
}

function alternarTema() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('temaEscuro', isDark ? 'sim' : 'nao');
  document.getElementById('botao-tema').innerHTML = isDark ? '&#9728;' : '&#9790;';
}

window.onload = () => {
  if (localStorage.getItem('temaEscuro') === 'sim') {
    document.body.classList.add('dark');
    document.getElementById('botao-tema').innerHTML = '&#9728;';
  } else {
    document.getElementById('botao-tema').innerHTML = '&#9790;';
  }
  fetchProjetos();
  fetchEstoque();
};
