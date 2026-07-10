import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RouterModule } from '@angular/router';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  tituloPagina: string = 'Dashboard Administrativo';
  usuarioLogado: string | null = null;
  agendamentos: any[] = [];
  statusFiltro: string = '';
  busca: string = '';
  menuAberto: boolean = false;
  mostrandoArquivados: boolean = false;
  fotoSelecionada: string | null = null;

  constructor(private router: Router) {
    this.usuarioLogado = localStorage.getItem('usuarioLogado');
    this.carregarAgendamentos();
  }

  validarHorario(agendamento: any): boolean {
    const data = new Date(`${agendamento.data}T${agendamento.horario}`);
    const diaSemana = data.getDay();
    const hora = data.getHours();
    const minutos = data.getMinutes();
    if (diaSemana === 0) return false;
    if (hora < 8 || (hora >= 22 && minutos > 0)) return false;
    return true;
  }

  getDuracaoServico(servico: string): number {
    switch (servico.toLowerCase()) {
      case 'trança': return 270;
      case 'penteado': return 90;
      case 'megahair': return 120;
      default: return 60;
    }
  }

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

  arquivarAgendamento(agendamento: any) {
    let arquivados = JSON.parse(localStorage.getItem('agendamentosArquivados') || '[]');
    arquivados.push(agendamento);
    localStorage.setItem('agendamentosArquivados', JSON.stringify(arquivados));
    this.agendamentos = this.agendamentos.filter(a => a !== agendamento);
    this.salvar();
  }

  excluirAgendamento(agendamento: any) {
    if (confirm("Deseja excluir este agendamento permanentemente?")) {
      this.agendamentos = this.agendamentos.filter(a => a !== agendamento);
      this.salvar();
    }
  }

  visualizarArquivados() {
    this.mostrandoArquivados = true;
    this.agendamentos = JSON.parse(localStorage.getItem('agendamentosArquivados') || '[]');
  }

  voltarDashboard() {
    this.mostrandoArquivados = false;
    this.carregarAgendamentos();
  }

  calcularRendimentos() {
    return this.agendamentos
      .filter(a => a.status === 'Confirmado')
      .reduce((total, a) => total + (a.valor || 0), 0);
  }

  gerarRelatorioPDF() {
    const doc = new jsPDF();
    doc.text("Relatório de Agendamentos", 14, 20);
    autoTable(doc, {
      head: [['Nome','Serviço','Data','Horário','Valor','Status']],
      body: this.agendamentos.map(a => [
        a.nome, a.servico, a.data, a.horario, a.valor || '', a.status
      ]),
      startY: 30
    });
    const rendimentos = this.calcularRendimentos();
    doc.text(`Rendimentos Confirmados: R$ ${rendimentos}`, 14, (doc as any).lastAutoTable.finalY + 20);
    doc.save('relatorio_agendamentos.pdf');
  }

  carregarAgendamentos() {
    this.agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    this.agendamentos.forEach(a => { if (!a.status) a.status = 'Pendente'; });
  }

  salvar() { localStorage.setItem('agendamentos', JSON.stringify(this.agendamentos)); }

  getAgendamentosFiltrados() {
    let lista = this.agendamentos;
    if (this.statusFiltro) lista = lista.filter(a => a.status === this.statusFiltro);
    if (this.busca) {
      lista = lista.filter(a =>
        a.nome.toLowerCase().includes(this.busca.toLowerCase()) ||
        a.servico.toLowerCase().includes(this.busca.toLowerCase())
      );
    }
    return lista;
  }

  abrirModal(foto: string) { this.fotoSelecionada = foto; }
  fecharModal() { this.fotoSelecionada = null; }

  toggleMenu() { 
    this.menuAberto = !this.menuAberto; }
    sair() { localStorage.removeItem('usuarioLogado'); this.router.navigate(['/login']); }

    @HostListener('document:click', ['$event'])
  fecharMenuAoClicarFora(event: Event) {
    const target = event.target as HTMLElement;
    const dentroDoMenu = target.closest('.menu-usuario') || target.closest('.icone-usuario');
    if (!dentroDoMenu) {
      this.menuAberto = false;
    }
  }
}
