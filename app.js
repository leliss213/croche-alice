let projetos = JSON.parse(localStorage.getItem('projetos')) || [];
let estoque = JSON.parse(localStorage.getItem('estoque')) || [];

function showTab(tab) {
  document.querySelectorAll('.tab-content').forEach(div => div.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
  atualizarResumo();
}

function adicionarProjeto() {
  const nome = document.getElementById('projetoNome').value.trim();
  if (nome) {
    projetos.push({ nome, status: 'Em andamento' });
    document.getElementById('projetoNome').value = '';
    salvarDados();
    renderizarProjetos();
  }
}

function editarProjeto(index) {
  const novoNome = prompt('Editar nome do projeto:', projetos[index].nome);
  if (novoNome !== null && novoNome.trim() !== '') {
    projetos[index].nome = novoNome.trim();
    salvarDados();
    renderizarProjetos();
  }
}

function excluirProjeto(index) {
  if (confirm('Deseja excluir este projeto?')) {
    projetos.splice(index, 1);
    salvarDados();
    renderizarProjetos();
  }
}

function adicionarLinha() {
  const cor = document.getElementById('linhaCor').value.trim();
  const quantidade = parseInt(document.getElementById('linhaQtd').value);
  if (cor && quantidade) {
    estoque.push({ cor, quantidade });
    document.getElementById('linhaCor').value = '';
    document.getElementById('linhaQtd').value = '';
    salvarDados();
    renderizarEstoque();
  }
}

function editarLinha(index) {
  const novaCor = prompt('Editar cor da linha:', estoque[index].cor);
  const novaQtd = prompt('Editar quantidade:', estoque[index].quantidade);
  if (novaCor !== null && novaQtd !== null && novaCor.trim() !== '' && !isNaN(parseInt(novaQtd))) {
    estoque[index].cor = novaCor.trim();
    estoque[index].quantidade = parseInt(novaQtd);
    salvarDados();
    renderizarEstoque();
  }
}

function excluirLinha(index) {
  if (confirm('Deseja excluir este item do estoque?')) {
    estoque.splice(index, 1);
    salvarDados();
    renderizarEstoque();
  }
}

function renderizarProjetos() {
  const lista = document.getElementById('listaProjetos');
  lista.innerHTML = '';
  projetos.forEach((proj, index) => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <strong>${proj.nome}</strong><br>Status: ${proj.status}<br>
      <button onclick="editarProjeto(${index})">Editar</button>
      <button onclick="excluirProjeto(${index})">Excluir</button>
    `;
    lista.appendChild(div);
  });
}

function renderizarEstoque() {
  const lista = document.getElementById('listaEstoque');
  lista.innerHTML = '';
  estoque.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <strong>${item.cor}</strong><br>Quantidade: ${item.quantidade}<br>
      <button onclick="editarLinha(${index})">Editar</button>
      <button onclick="excluirLinha(${index})">Excluir</button>
    `;
    lista.appendChild(div);
  });
}

function atualizarResumo() {
  document.getElementById('resumoProjetos').innerText = `Projetos em andamento: ${projetos.length}`;
  document.getElementById('resumoTipos').innerText = `Tipos de linhas: ${estoque.length}`;
  const total = estoque.reduce((acc, item) => acc + item.quantidade, 0);
  document.getElementById('resumoTotal').innerText = `Total de linhas: ${total}`;
}

function salvarDados() {
  localStorage.setItem('projetos', JSON.stringify(projetos));
  localStorage.setItem('estoque', JSON.stringify(estoque));
}

function alternarTema() {
    const corpo = document.body;
    const botao = document.getElementById('botao-tema');
    corpo.classList.toggle('dark');
  
    const usandoDark = corpo.classList.contains('dark');
    localStorage.setItem('temaEscuro', usandoDark ? 'sim' : 'nao');
    botao.innerHTML = usandoDark ? '&#9728;' : '&#9790;';
  }
  
  window.onload = () => {
    const botao = document.getElementById('botao-tema');
    if (localStorage.getItem('temaEscuro') === 'sim') {
      document.body.classList.add('dark');
      botao.innerHTML = '&#9728;';
    } else {
      botao.innerHTML = '&#9790;';
    }
  };  

renderizarProjetos();
renderizarEstoque();
atualizarResumo();
