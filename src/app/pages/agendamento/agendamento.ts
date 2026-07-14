import { Component, ViewChild, ElementRef } from '@angular/core';
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
  nome = '';
  contato = '';
  servico = '';
  data = '';
  horario = '';
  mensagem = '';
  foto = '';
  consentimento = false;
  horariosDisponiveis: string[] = [];
  servicoSelecionado: string | null = null;
  imagemSelecionada: string | null = null;
  servicos: any[] = [];

  constructor(private route: ActivatedRoute) {
    this.carregarServicos();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.servicoSelecionado = params['servico'] || null;
      this.imagemSelecionada = params['imagem'] || null;

      if (this.servicoSelecionado) {
        this.servico = this.servicoSelecionado;
      }

      this.atualizarHorarios();
    });
  }

  carregarServicos() {
    const salvos = JSON.parse(localStorage.getItem('servicos') || '[]');
    this.servicos = salvos.length ? salvos : [
      { nome: 'Box Braids', preco: 200, duracao: 270, imagem: 'assets/img/14.jpeg' },
      { nome: 'Nagô', preco: 150, duracao: 180, imagem: 'assets/img/27.jpeg' },
      { nome: 'Twist', preco: 200, duracao: 180, imagem: 'assets/img/penteado3.jpg' },
      { nome: 'Megahair', preco: 400, duracao: 120, imagem: 'assets/img/22.jpeg' },
      { nome: 'Tranças Soltas', preco: 200, duracao: 240, imagem: 'assets/img/37.jpeg' },
      { nome: 'Penteado', preco: 150, duracao: 90, imagem: 'assets/img/6.jpeg' }
    ];
    localStorage.setItem('servicos', JSON.stringify(this.servicos));
  }

  getDuracaoServico(servicoNome: string): number {
    const servicoEncontrado = this.servicos.find((item) => item.nome.toLowerCase() === servicoNome.toLowerCase());
    return servicoEncontrado?.duracao || 60;
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
    const duracao = this.getDuracaoServico(this.servicoSelecionado || this.servico || '');

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

  @ViewChild('fotoInput') fotoInput!: ElementRef;

  confirmarAgendamento() {
    const servicoFinal = this.servicoSelecionado || this.servico;

    if (!this.nome || !this.contato || !servicoFinal || !this.data || !this.horario) {
      alert('Preencha todos os campos obrigatórios antes de salvar.');
      return;
    }

    if (!this.validarHorario()) {
      alert('Horário inválido! Funcionamos de segunda a sábado, das 08h às 22h, exceto domingo e feriados.');
      return;
    }

    if (!this.consentimento) {
      alert('É necessário autorizar o uso dos dados conforme a LGPD.');
      return;
    }

    const novoAgendamento = {
      nome: this.nome,
      contato: this.contato,
      servico: servicoFinal,
      duracao: this.getDuracaoServico(servicoFinal),
      imagem: this.imagemSelecionada,
      data: this.data,
      horario: this.horario,
      mensagem: this.mensagem,
      foto: this.foto,
      consentimento: this.consentimento,
      status: 'Pendente',
      solicitadoEm: new Date().toISOString()
    };

    const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
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
    if (this.fotoInput) {
      this.fotoInput.nativeElement.value = '';
    }
  }
}
