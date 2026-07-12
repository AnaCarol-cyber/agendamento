import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './agendamento.html',
  styleUrls: ['./agendamento.css']
})
export class Agendamento {
  nome: string = '';
  contato: string = '';
  servico: string = '';
  data: string = '';
  horario: string = '';
  mensagem: string = '';
  foto: string = '';
  consentimento: boolean = false;

  horariosDisponiveis: string[] = [];

  // novos campos para receber da rota
  servicoSelecionado: string | null = null;
  imagemSelecionada: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // recupera os parâmetros enviados pela página de serviços
    this.route.queryParams.subscribe((params: any) => {
      this.servicoSelecionado = params['servico'] || null;
      this.imagemSelecionada = params['imagem'] || null;

      // se veio um serviço selecionado, já preenche o campo
      if (this.servicoSelecionado) {
        this.servico = this.servicoSelecionado;
        this.atualizarHorarios();
      }
    });
  }

  validarHorario(): boolean {
    const dataAg = new Date(`${this.data}T${this.horario}`);
    const diaSemana = dataAg.getDay(); 
    const hora = dataAg.getHours();
    const minutos = dataAg.getMinutes();

    if (diaSemana === 0) return false;
    if (hora < 8 || (hora >= 22 && minutos > 0)) return false; 

    return true;
  }

  atualizarHorarios() {
    let duracao = 60;
    if (this.servico?.toLowerCase() === 'trança') duracao = 270;
    else if (this.servico?.toLowerCase() === 'penteado') duracao = 90;
    else if (this.servico?.toLowerCase() === 'megahair') duracao = 120;

    this.horariosDisponiveis = [];
    let hora = 8 * 60; 
    const fim = 22 * 60;

    while (hora + duracao <= fim) {
      const h = Math.floor(hora / 60).toString().padStart(2, '0');
      const m = (hora % 60).toString().padStart(2, '0');
      this.horariosDisponiveis.push(`${h}:${m}`);
      hora += duracao;
    }
  }

  uploadFoto(event: any) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.foto = reader.result as string; 
      };
      reader.readAsDataURL(file);
    }
  }

 confirmarAgendamento() {
  const servicoFinal = this.servicoSelecionado  || this.servico;

  if (!this.nome || !this.contato || !servicoFinal || !this.data || !this.horario) {
    alert("Preencha todos os campos obrigatórios antes de salvar.");
    return;
  }

  if (!this.validarHorario()) {
    alert("Horário inválido! Funcionamos de segunda a sábado, das 08h às 22h, exceto domingo e feriados.");
    return;
  }

  if (!this.consentimento) {
    alert("É necessário autorizar o uso dos dados conforme a LGPD.");
    return;
  }

  const novoAgendamento = {
    nome: this.nome,
    contato: this.contato,
    servico: servicoFinal,
    imagem: this.imagemSelecionada,
    data: this.data,
    horario: this.horario,
    mensagem: this.mensagem,
    foto: this.foto,
    consentimento: this.consentimento,
    status: 'Pendente'
  };

  let agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
  agendamentos.push(novoAgendamento);
  localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

  alert('Agendamento enviado! Aguarde contato para pagamento.');

  this.nome = '';
  this.contato = '';
  this.servico = '';
  this.data = '';
  this.horario = '';
  this.mensagem = '';
  this.foto = '';
  this.consentimento = false;
  this.horariosDisponiveis = [];
  this.servicoSelecionado = null;
 this.imagemSelecionada = null;
  }
}
