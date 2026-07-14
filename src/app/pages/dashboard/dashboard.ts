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
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  tituloPagina = 'Dashboard Administrativo';
  usuarioLogado: string | null = null;
  agendamentos: any[] = [];
  movimentacoesFinanceiras: any[] = [];
  statusFiltro = '';
  busca = '';
  menuAberto = false;
  mostrandoArquivados = false;
  fotoSelecionada: string | null = null;
  detalheFinanceiroSelecionado: 'entrada' | 'saida' | null = null;
  novaMovimentacao = { descricao: '', valor: 0, data: '', tipo: 'entrada' };

  constructor(private router: Router) {
    this.usuarioLogado = localStorage.getItem('usuarioLogado');

    if (!this.usuarioLogado) {
      this.router.navigate(['/login']);
      return;
    }

    this.carregarAgendamentos();
    this.carregarMovimentacoes();
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
      alert('Horário inválido! Funcionamos de segunda a sábado, das 08h às 22h.');
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

Para confirmar, realize o pagamento de 50% (R$${agendamento.valor / 2}).
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
    const arquivados = JSON.parse(localStorage.getItem('agendamentosArquivados') || '[]');
    arquivados.push(agendamento);
    localStorage.setItem('agendamentosArquivados', JSON.stringify(arquivados));
    this.agendamentos = this.agendamentos.filter((a) => a !== agendamento);
    this.salvar();
  }

  excluirAgendamento(agendamento: any) {
    if (confirm('Deseja excluir este agendamento permanentemente?')) {
      this.agendamentos = this.agendamentos.filter((a) => a !== agendamento);
      this.salvar();
    }
  }

  adicionarMovimentacao() {
    if (!this.novaMovimentacao.descricao || !this.novaMovimentacao.valor || !this.novaMovimentacao.data) {
      alert('Preencha descrição, valor e data para registrar a movimentação.');
      return;
    }

    this.movimentacoesFinanceiras.push({
      ...this.novaMovimentacao,
      valor: Number(this.novaMovimentacao.valor)
    });
    this.salvarMovimentacoes();
    this.novaMovimentacao = { descricao: '', valor: 0, data: '', tipo: 'entrada' };
    alert('Movimentação registrada com sucesso!');
  }

  carregarMovimentacoes() {
    this.movimentacoesFinanceiras = JSON.parse(localStorage.getItem('movimentacoesFinanceiras') || '[]');
  }

  salvarMovimentacoes() {
    localStorage.setItem('movimentacoesFinanceiras', JSON.stringify(this.movimentacoesFinanceiras));
  }

  calcularEntradas() {
    const entradasAgendamentos = this.agendamentos
      .filter((a) => a.status === 'Confirmado' && Number(a.valor || 0) > 0)
      .reduce((total, a) => total + Number(a.valor || 0), 0);

    const entradasManuais = this.movimentacoesFinanceiras
      .filter((m) => m.tipo === 'entrada')
      .reduce((total, m) => total + Number(m.valor || 0), 0);

    return entradasAgendamentos + entradasManuais;
  }

  calcularSaidas() {
    return this.movimentacoesFinanceiras
      .filter((m) => m.tipo === 'saida')
      .reduce((total, m) => total + Number(m.valor || 0), 0);
  }

  calcularSaldo() {
    return this.calcularEntradas() - this.calcularSaidas();
  }

  calcularRendimentos() {
    return this.calcularEntradas();
  }

  selecionarDetalhesFinanceiro(tipo: 'entrada' | 'saida') {
    this.detalheFinanceiroSelecionado = this.detalheFinanceiroSelecionado === tipo ? null : tipo;
  }

  getDetalhesFinanceiro(tipo: 'entrada' | 'saida') {
    const detalhesMovimentacoes = this.movimentacoesFinanceiras
      .filter((m) => m.tipo === tipo)
      .map((m) => ({
        data: m.data,
        valor: Number(m.valor),
        descricao: m.descricao || 'Movimentação manual'
      }));

    if (tipo === 'entrada') {
      const entradasAgendamentos = this.agendamentos
        .filter((a) => a.status === 'Confirmado' && Number(a.valor || 0) > 0)
        .map((a) => ({
          data: a.data,
          valor: Number(a.valor || 0),
          descricao: `Agendamento: ${a.servico}`
        }));

      return [...entradasAgendamentos, ...detalhesMovimentacoes]
        .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
    }

    return detalhesMovimentacoes.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  }

  formatarData(valor: string | null | undefined): string {
    if (!valor) {
      return '—';
    }

    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) {
      return '—';
    }

    return data.toLocaleDateString('pt-BR');
  }

  formatarDataHora(valor: string | null | undefined): string {
    if (!valor) {
      return '—';
    }

    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) {
      return '—';
    }

    return data.toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  }

  gerarRelatorioPDF() {
    const doc = new jsPDF();
    doc.text('Relatório de Agendamentos', 14, 20);
    autoTable(doc, {
      head: [['Nome', 'Serviço', 'Data', 'Horário', 'Valor', 'Status']],
      body: this.agendamentos.map((a) => [
        a.nome, a.servico, a.data, a.horario, a.valor || '', a.status
      ]),
      startY: 30
    });

    const entradas = this.calcularEntradas();
    const saidas = this.calcularSaidas();
    const saldo = this.calcularSaldo();
    const finalY = (doc as any).lastAutoTable.finalY + 12;

    doc.text(`Entradas: R$ ${entradas.toFixed(2)}`, 14, finalY);
    doc.text(`Saídas: R$ ${saidas.toFixed(2)}`, 14, finalY + 8);
    doc.text(`Saldo: R$ ${saldo.toFixed(2)}`, 14, finalY + 16);
    doc.save('relatorio_agendamentos.pdf');
  }

  carregarAgendamentos() {
    this.agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    this.agendamentos.forEach((a) => { if (!a.status) a.status = 'Pendente'; });
  }

  salvar() { localStorage.setItem('agendamentos', JSON.stringify(this.agendamentos)); }

  getAgendamentosFiltrados() {
    let lista = this.agendamentos;
    if (this.statusFiltro) lista = lista.filter((a) => a.status === this.statusFiltro);
    if (this.busca) {
      lista = lista.filter((a) =>
        a.nome.toLowerCase().includes(this.busca.toLowerCase()) ||
        a.servico.toLowerCase().includes(this.busca.toLowerCase())
      );
    }
    return lista;
  }

  abrirModal(foto: string) { this.fotoSelecionada = foto; }
  fecharModal() { this.fotoSelecionada = null; }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

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
