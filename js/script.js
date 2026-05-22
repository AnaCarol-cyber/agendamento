// MODAL IMAGEM
function abrirImagem(img) {
  const modal = document.getElementById("modalImagem");
  const modalImg = document.getElementById("imagemModal");

  modal.style.display = "flex";
  modalImg.src = img.src;
}

function fecharImagem() {
  document.getElementById("modalImagem").style.display = "none";
}

const horarios = {
  semana: { inicio: 8, fim: 19 },
  sabado: { inicio: 8, fim: 18 }
};

const valores = {
  penteado: { preco: 200, duracao: 2 },
  trancas: { preco: 400, duracao: 5 }
};

if (document.getElementById("data")) {
  document.getElementById("data").addEventListener("change", gerarHorarios);
  document.getElementById("servico").addEventListener("change", gerarHorarios);
}

function gerarHorarios() {
  const dataInput = document.getElementById("data").value;
  const servico = document.getElementById("servico").value;
  const selectHorario = document.getElementById("horario");

  selectHorario.innerHTML = "";

  if (!dataInput || !servico) {
    selectHorario.innerHTML = `<option>Selecione data e serviço</option>`;
    return;
  }

  const data = new Date(dataInput + "T00:00");
  const dia = data.getDay();

  if (dia === 0) {
    alert("Não atendemos aos domingos.");
    return;
  }

  let inicio, fim;

  if (dia === 6) {
    inicio = horarios.sabado.inicio;
    fim = horarios.sabado.fim;
  } else {
    inicio = horarios.semana.inicio;
    fim = horarios.semana.fim;
  }

  const duracao = valores[servico].duracao;

  for (let h = inicio; h <= fim - duracao; h++) {
    const option = document.createElement("option");
    option.value = h;
    option.textContent = `${h}:00`;
    selectHorario.appendChild(option);
  }
}

function confirmar() {
  const servico = document.getElementById("servico").value;
  const pagamento = document.getElementById("pagamento").value;
  const horario = document.getElementById("horario").value;
  const data = document.getElementById("data").value;

  if (!servico || !horario || !data) {
    alert("Preencha todos os campos!");
    return;
  }

  let valor = valores[servico].preco;
  let sinal = valor * 0.5;

  if (pagamento === "cartao") {
    sinal *= 1.1;
  }

  const nomeServico = servico === "penteado" ? "Penteado" : "Tranças";

  const mensagem = `
📌 *Novo Agendamento*
💇‍♀️ Serviço: ${nomeServico}
📅 Data: ${data}
⏰ Horário: ${horario}:00
💳 Pagamento: ${pagamento.toUpperCase()}
💰 Sinal: R$ ${sinal.toFixed(2)}
`;

  const telefone = "5571999999999"; // ⬅️ coloque seu número aqui
  const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
}