const horarios = {
  semana: { inicio: 8, fim: 19 },
  sabado: { inicio: 8, fim: 18 }
};

const valores = {
  penteado: {
    nome: "Penteado",
    preco: 100,
    duracao: 2
  },
  trancas_cliente: {
    nome: "Tranças – material do cliente",
    preco: 200,
    duracao: 4
  },
  trancas_bella: {
    nome: "Tranças – meu material",
    preco: 350,
    duracao: 4
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const data = document.getElementById("data");
  const servico = document.getElementById("servico");

  if (data && servico) {
    data.addEventListener("change", gerarHorarios);
    servico.addEventListener("change", gerarHorarios);
  }
});

function gerarHorarios() {
  const dataInput = document.getElementById("data").value;
  const servicoSelecionado = document.getElementById("servico").value;
  const selectHorario = document.getElementById("horario");

  selectHorario.innerHTML = "";

  if (!dataInput || !servicoSelecionado) {
    selectHorario.innerHTML = "<option value=''>Selecione data e serviço</option>";
    return;
  }

  const data = new Date(dataInput + "T00:00");
  const dia = data.getDay();

  if (dia === 0) {
    selectHorario.innerHTML = "<option value=''>Não atendemos aos domingos</option>";
    return;
  }

  const config = dia === 6 ? horarios.sabado : horarios.semana;
  const duracao = valores[servicoSelecionado].duracao;

  selectHorario.innerHTML = "<option value=''>Selecione um horário</option>";

  for (let h = config.inicio; h <= config.fim - duracao; h++) {
    const option = document.createElement("option");
    option.value = h;
    option.textContent = `${h}:00`;
    selectHorario.appendChild(option);
  }
}

function confirmar() {
  const servicoKey = document.getElementById("servico").value;
  const pagamento = document.getElementById("pagamento").value;
  const horario = document.getElementById("horario").value;
  const dataInput = document.getElementById("data").value;

  if (!servicoKey || !horario || !dataInput) {
    alert("Por favor, preencha todos os campos do agendamento.");
    return;
  }

  let valor = valores[servicoKey].preco;
  if (pagamento === "cartao") valor *= 1.1;

  const dataFormatada = dataInput.split("-").reverse().join("/");

  const mensagem = `
✨ *Agendamento – Tranças Bella*

📅 Data: ${dataFormatada}
⏰ Horário: ${horario}:00
💇‍♀️ Serviço: ${valores[servicoKey].nome}
💰 Valor: R$ ${valor.toFixed(2)}

Pagamento: ${pagamento === "pix" ? "Pix ou dinheiro" : "Cartão (+10%)"}
`;

  window.open(
    `https://wa.me/5571999999999?text=${encodeURIComponent(mensagem)}`,
    "_blank"
  );
}