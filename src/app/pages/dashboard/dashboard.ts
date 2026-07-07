import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  usuarioLogado: string | null = null;
  agendamentos: any[] = [];
  statusFiltro: string = '';
  busca: string = '';
  menuAberto: boolean = false;

  constructor(private router: Router) {
    this.usuarioLogado = localStorage.getItem('usuarioLogado');
    this.carregarAgendamentos();
  }

  carregarAgendamentos() {
    this.agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    this.agendamentos.forEach(a => {
      if (!a.status) {
        a.status = 'Pendente';
      }
    });
  }

  // Valida horário de funcionamento
  validarHorario(agendamento: any): boolean {
    const data = new Date(`${agendamento.data}T${agendamento.horario}`);
    const diaSemana = data.getDay(); // 0=Domingo, 6=Sábado
    const hora = data.getHours();
    const minutos = data.getMinutes();

    // Não funciona em domingos
    if (diaSemana === 0) return false;

    // Horário permitido: 08h às 22h
    if (hora < 8 || (hora >= 22 && minutos > 0)) return false;

    return true;
  }

  // Duração dos serviços
  getDuracaoServico(servico: string): number {
    switch (servico.toLowerCase()) {
      case 'trança': return 270; // 4h30
      case 'penteado': return 90; // 1h30
      case 'megahair': return 120; // 2h
      default: return 60;
    }
  }

  // SALVAR VALOR → envia link de pagamento
  adicionarValor(agendamento: any, valor: number) {
    if (!this.validarHorario(agendamento)) {
      alert("Horário inválido! Funcionamos de segunda a sábado, das 08h às 22h.");
      return;
    }

    agendamento.valor = valor;
    this.salvar();

    const duracao = this.getDuracaoServico(agendamento.servico);
    const numeroCliente = `55${agendamento.contato}`;
    const numeroAdmin = '5571986633727';

    const links: any = {
      'trança': 'https://pay.sumup.com/b2c/QC7UBOJQ',
      'penteado': 'https://pay.sumup.com/b2c/QZOEYC4V',
      'megahair': 'https://pay.sumup.com/b2c/Q86EAM7H'
    };

    const servico = agendamento.servico.toLowerCase();
    const linkPagamento = links[servico] || 'https://pay.sumup.com';

    const mensagem = `Olá ${agendamento.nome}, seu agendamento foi registrado!
💇 Serviço: ${agendamento.servico}
📅 Data: ${agendamento.data} às ${agendamento.horario}
⏱️ Duração aproximada: ${duracao} minutos
💰 Valor do serviço: R$${agendamento.valor}

Para confirmar, realize o pagamento de 50% (R$${agendamento.valor/2}).
Você pode pagar com cartão ou Pix pelo link abaixo:
${linkPagamento}`;

    window.open(`https://wa.me/${numeroCliente}?text=${encodeURIComponent(mensagem)}`, '_blank');
    window.open(`https://wa.me/${numeroAdmin}?text=${encodeURIComponent(mensagem)}`, '_blank');
  }

  // CONFIRMAR → só depois do pagamento
  confirmarAgendamento(agendamento: any) {
    agendamento.status = 'Confirmado';
    this.salvar();

    const numeroCliente = `55${agendamento.contato}`;
    const numeroAdmin = '5571986633727';

    const mensagem = `Olá ${agendamento.nome}, seu pagamento foi confirmado!
💇 Serviço: ${agendamento.servico}
📅 Data: ${agendamento.data} às ${agendamento.horario}
✅ Status: CONFIRMADO

Nos vemos no dia e horário marcado!`;

    window.open(`https://wa.me/${numeroCliente}?text=${encodeURIComponent(mensagem)}`, '_blank');
    window.open(`https://wa.me/${numeroAdmin}?text=${encodeURIComponent(mensagem)}`, '_blank');
  }

  cancelarAgendamento(agendamento: any) {
    agendamento.status = 'Cancelado';
    agendamento.termos = 'Cancelamento deve ser feito com 24h de antecedência. Após esse prazo, o valor da entrada não será reembolsado.';

    const numeroCliente = `55${agendamento.contato}`;
    const numeroAdmin = '5571986633727';

    const mensagem = `Olá ${agendamento.nome}, seu agendamento foi cancelado.
Serviço: ${agendamento.servico}
Data: ${agendamento.data} às ${agendamento.horario}
⚠️ ${agendamento.termos}`;

    window.open(`https://wa.me/${numeroCliente}?text=${encodeURIComponent(mensagem)}`, '_blank');
    window.open(`https://wa.me/${numeroAdmin}?text=${encodeURIComponent(mensagem)}`, '_blank');

    this.salvar();
  }

  salvar() {
    localStorage.setItem('agendamentos', JSON.stringify(this.agendamentos));
  }

  getAgendamentosFiltrados() {
    let lista = this.agendamentos;
    if (this.statusFiltro) {
      lista = lista.filter(a => a.status === this.statusFiltro);
    }
    if (this.busca) {
      lista = lista.filter(a =>
        a.nome.toLowerCase().includes(this.busca.toLowerCase()) ||
        a.servico.toLowerCase().includes(this.busca.toLowerCase())
      );
    }
    return lista;
  }

  exportarCSV() {
    const linhas = [
      ['Nome','Contato','Serviço','Data','Horário','Valor','Status'],
      ...this.agendamentos.map(a => [
        a.nome, a.contato, a.servico, a.data, a.horario, a.valor, a.status
      ])
    ];
    const csv = linhas.map(l => l.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agendamentos.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  sair() {
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }
}
