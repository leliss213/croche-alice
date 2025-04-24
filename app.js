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

  if (!nome || isNaN(valor)) return;

  // 1. Coletar as linhas selecionadas do dropdown
  const checkboxes = document.querySelectorAll('#dropdownCheckboxes input[type="checkbox"]:checked');
  const linhasUsadas = [];

  checkboxes.forEach(checkbox => {
    const id = checkbox.value;
    const qtdInput = document.getElementById(`qtd_${id}`);
    const quantidade = qtdInput.value || 0;
    if (quantidade > 0) {
      linhasUsadas.push({ id, quantidade });
    }
    
  });

  // 2. Criar o projeto com as linhas usadas
  const novoProjeto = {
    nome,
    status: 'Em andamento',
    valor,
    linhasUsadas 
  };

  projetos.push(novoProjeto);

  // 3. Limpar inputs
  document.getElementById('projetoNome').value = '';
  document.getElementById('projetoValor').value = '';
  document.querySelectorAll('#dropdownCheckboxes input[type="checkbox"]').forEach(cb => cb.checked = false);
  document.querySelectorAll('#dropdownCheckboxes input[type="number"]').forEach(input => input.value = '');

  // 4. Atualizar UI
  renderizarProjetos();
  salvarDados();

  console.log(novoProjeto)
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
    estoque.push({ cor, quantidade, valor, id: gerarUUID() });
    localStorage.setItem('estoque', JSON.stringify(estoque));

    document.getElementById('linhaCor').value = '';
    document.getElementById('linhaQtd').value = '';
    document.getElementById('linhaValor').value = '';

    renderizarEstoque();
    atualizarDropdownCheckboxes();
  }
}


function excluirLinha(index) {
  if (confirm('Deseja excluir este item do estoque?')) {
    estoque.splice(index, 1);
    salvarDados();
    renderizarEstoque();
  }
}


// function renderizarProjetos() {
//   const lista = document.getElementById('listaProjetos');
//   lista.innerHTML = '';

//   projetos.forEach((proj, index) => {
//     const div = document.createElement('div');
//     div.className = 'card';

//     // Texto base do projeto
//     let html = `
//       <strong>${proj.nome}</strong><br>
//       Status: ${proj.status}<br>
//       Valor: R$ ${proj.valor.toFixed(2).replace('.', ',')}<br>
//     `;

//     // Mostrar linhas usadas (se houver)
//     if (proj.linhasUsadas && proj.linhasUsadas.length > 0) {
//       html += `<em>Linhas usadas:</em><ul>`;
//       proj.linhasUsadas.forEach(uso => {
//         // Encontrar no estoque pelo ID da linha usada
//         const linha = estoque.find(item => item.id === uso.id);
//         const nomeCor = linha ? linha.cor : 'Linha removida';
//         html += `<li>${nomeCor} — ${uso.quantidade} grama(s)</li>`;
//       });
//       html += `</ul>`;
//     }

//     // Botões
//     html += `
//       <button onclick="abrirModal('projeto', ${index})">Editar</button>
//       <button onclick="excluirProjeto(${index})">Excluir</button>
//     `;

//     div.innerHTML = html;
//     lista.appendChild(div);
//   });
// }


function renderizarProjetos() {
  const lista = document.getElementById('listaProjetos');
  lista.innerHTML = '';

  projetos.forEach((proj, index) => {
    const div = document.createElement('div');
    div.className = 'card';

    let html = `
      <strong>${proj.nome}</strong><br>
      <span>Status:</span> ${proj.status}<br>
      <span>Valor:</span> R$ ${proj.valor.toFixed(2).replace('.', ',')}<br><br>
    `;

    if (proj.linhasUsadas && proj.linhasUsadas.length > 0) {
      html += `
        <div class="linhas-usadas">
          <strong>Linhas usadas:</strong>
          <table>
            <thead>
              <tr>
                <th>Cor</th>
                <th>Quantidade</th>
              </tr>
            </thead>
            <tbody>
      `;
      proj.linhasUsadas.forEach(uso => {
        const linha = estoque.find(item => item.id === uso.id);
        const nomeCor = linha ? linha.cor : '<em style="color:red;">Removida</em>';
        html += `
          <tr>
            <td>${nomeCor}</td>
            <td>${uso.quantidade} g</td>
          </tr>
        `;
      });
      html += `
            </tbody>
          </table>
        </div><br>
      `;
    }

    html += `
      <button onclick="abrirModal('projeto', ${index})">Editar</button>
      <button onclick="excluirProjeto(${index})">Excluir</button>
    `;

    div.innerHTML = html;
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
  modalContexto = { tipo, index, item: { ...projetos[index] } };
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
    const projeto = projetos[modalContexto.index];
    //const lines = []

    //const updatedYarns = selectedYarns.length > 0 ? selectedYarns : modalContexto.item.yarns;
    //selectedYarns = [];

    projetos[modalContexto.index] = { ...projeto, nome: campo1, valor: campo3 };

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
  const selecaoLinhasElements = document.querySelectorAll(".selecaoLinhas");
  selecaoLinhasElements.forEach((container) => {
    const selectedValue = container.value;
    container.innerHTML = "";
    estoque.forEach((linha, index) => {
      const option = document.createElement("option");
      option.value = linha.cor;
      option.text = linha.cor;

      option.dataset.quantidade = linha.quantidade;
      if (linha.cor === selectedValue) {
        option.selected = true;
      }
      container.appendChild(option);
    });
  });
}


function salvarDados() {
  localStorage.setItem('projetos', JSON.stringify(projetos));
  localStorage.setItem('estoque', JSON.stringify(estoque));
}


function toggleDropdown() {
  const dropdown = document.querySelector(".dropdown");
  dropdown.classList.toggle("active");
}


// function atualizarDropdownCheckboxes() {
//   const container = document.getElementById('dropdownCheckboxes');
//   container.innerHTML = ''; // limpa antes

//   estoque.forEach((linha, index) => {
//     const label = document.createElement('label');
//     label.innerHTML = `
//       <input type="checkbox" value="${linha.cor}" data-id="${index}">
//       ${linha.cor} (Qtd: ${linha.quantidade})
//     `;
//     container.appendChild(label);
//   });
// }
function atualizarDropdownCheckboxes() {
  const container = document.getElementById('dropdownCheckboxes');
  container.innerHTML = '';

  estoque.forEach(item => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <label>
        <input type="checkbox" value="${item.id}"> ${item.cor}
      </label>
      <input type="number" id="qtd_${item.id}" placeholder="Qtd" min="1" style="width: 60px; margin-left: 10px;"><br>
    `;
    container.appendChild(wrapper);
  });
}


function gerarUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
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
atualizarDropdownCheckboxes();