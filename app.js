let projetos = JSON.parse(localStorage.getItem('projetos')) || [];
let estoque = JSON.parse(localStorage.getItem('estoque')) || [];


function showTab(tab) {
  document.querySelectorAll('.tab-content').forEach(div => div.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
  atualizarResumo();
}

function adicionarProjeto() {
    const nome = document.getElementById('projetoNome').value.trim();
    const valor = parseFloat(document.getElementById('projetoValor').value);
    // const linhasSelecionadas = Array.from(document.getElementById('selecaoLinhas').selectedOptions).map(option => ({
    //   cor: option.text,
    //   quantidade: parseInt(option.dataset.quantidade)
    // }));
    
    if (nome && !isNaN(valor)) {
      projetos.push({ nome, status: 'Em andamento', valor});
      document.getElementById('projetoNome').value = '';
      document.getElementById('projetoValor').value = '';
      renderizarProjetos();
      salvarDados();
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
    const valor = parseFloat(document.getElementById('linhaValor').value);
    
    if (cor && !isNaN(quantidade) && !isNaN(valor)) {
      estoque.push({ cor, quantidade, valor });
      document.getElementById('linhaCor').value = '';
      document.getElementById('linhaQtd').value = '';
      document.getElementById('linhaValor').value = '';
      renderizarEstoque();
      atualizarSelecaoLinhas();
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
        <strong>${proj.nome}</strong><br>
        Status: ${proj.status}<br>
        Valor: R$ ${proj.valor.toFixed(2).replace('.', ',')}<br>
        <button onclick="abrirModal('projeto', ${index})">Editar</button>
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
      <strong>${item.cor}</strong><br>
      Quantidade: ${item.quantidade}<br>
      Valor: R$ ${item.valor.toFixed(2).replace('.', ',')}
      <br>
      <button onclick="abrirModal('estoque', ${index})">Editar</button>
      <button onclick="excluirLinha(${index})">Excluir</button>
    `;
    lista.appendChild(div);
  });
}

function atualizarResumo() {
    const totalProjetos = projetos.length;
    const totalTipos = estoque.length;
    const totalLinhas = estoque.reduce((acc, item) => acc + item.quantidade, 0);
    const totalEstoqueReais = estoque.reduce((acc, item) => acc + (item.valor * item.quantidade), 0);
    const totalProjetosReais = projetos.reduce((acc, item) => acc + item.valor, 0);
  
    document.getElementById('resumoProjetos').innerText = `Projetos em andamento: ${totalProjetos}`;
    document.getElementById('resumoTipos').innerText = `Tipos de linhas: ${totalTipos}`;
    document.getElementById('resumoTotal').innerText = `Total de linhas: ${totalLinhas}`;
    
    const linhaValor = `Valor total em estoque: R$ ${totalEstoqueReais.toFixed(2).replace('.', ',')}`;
    const projetoValor = `Valor total dos projetos: R$ ${totalProjetosReais.toFixed(2).replace('.', ',')}`;
  
    const extraResumo = document.createElement('p');
    extraResumo.innerHTML = `${linhaValor}<br>${projetoValor}`;
  
    const resumoDiv = document.getElementById('perfil');
    resumoDiv.querySelector('.card').appendChild(extraResumo);
}

function abrirModal(tipo, index) {
    modalContexto = { tipo, index };
    const item = tipo === 'projeto' ? projetos[index] : estoque[index];
    document.getElementById('modalTitulo').innerText = tipo === 'projeto' ? 'Editar Projeto' : 'Editar Estoque';
    document.getElementById('modalCampo1').value = tipo === 'projeto' ? item.nome : item.cor;
    document.getElementById('modalCampo2').value = tipo === 'projeto' ? 0 : item.quantidade;
    document.getElementById('modalCampo3').value = item.valor;
    document.getElementById('modal').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modal').style.display = 'none';
}
  
function salvarEdicao() {
    const campo1 = document.getElementById('modalCampo1').value.trim();
    const campo2 = parseInt(document.getElementById('modalCampo2').value);
    const campo3 = parseFloat(document.getElementById('modalCampo3').value);
    if (!campo1 || isNaN(campo3)) return;

    if (modalContexto.tipo === 'projeto') {
      projetos[modalContexto.index] = { ...projetos[modalContexto.index], nome: campo1, valor: campo3 };
      renderizarProjetos();
    } else {
      if (isNaN(campo2)) return;
      estoque[modalContexto.index] = { ...estoque[modalContexto.index], cor: campo1, quantidade: campo2, valor: campo3 };
      renderizarEstoque();
    }
    fecharModal();
    atualizarResumo();
}

function atualizarSelecaoLinhas() {
    const container = document.getElementById("selecaoLinhas");
    container.innerHTML = ""; // Limpar conteúdo anterior
    estoque.forEach((linha, index) => {
      const option = document.createElement("option");
      option.value = linha.cor;
      option.text = linha.cor;
      option.dataset.quantidade = linha.quantidade;
      container.appendChild(option);
    });
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
