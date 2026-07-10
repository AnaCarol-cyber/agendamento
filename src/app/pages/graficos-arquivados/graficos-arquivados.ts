import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { RouterModule } from '@angular/router';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-graficos-arquivados',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './graficos-arquivados.html',
  styleUrls: ['./graficos-arquivados.css']
})
export class GraficosArquivados implements AfterViewInit {
  tituloPagina: string = 'Gráficos & Arquivados';
  menuAberto: boolean = false;

  arquivados: any[] = JSON.parse(localStorage.getItem('agendamentosArquivados') || '[]');
  busca: string = '';
  statusFiltro: string = '';

  constructor(private router: Router) {}

  toggleMenu() { this.menuAberto = !this.menuAberto; }
  @HostListener('document:click', ['$event'])
  fecharMenuAoClicarFora(event: Event) {
    const target = event.target as HTMLElement;
    const dentroDoMenu = target.closest('.menu-usuario') || target.closest('.icone-usuario');
    if (!dentroDoMenu) {
      this.menuAberto = false;
    }
  }
    sair() { localStorage.removeItem('usuarioLogado'); this.router.navigate(['/login']); }

  ngAfterViewInit() { this.renderizarGraficos(); }

  getAgendamentosFiltrados() {
    let lista = this.arquivados;
    if (this.statusFiltro) lista = lista.filter(a => a.status === this.statusFiltro);
    if (this.busca) {
      lista = lista.filter(a =>
        a.nome.toLowerCase().includes(this.busca.toLowerCase()) ||
        a.servico.toLowerCase().includes(this.busca.toLowerCase())
      );
    }
    return lista;
  }

  restaurarAgendamento(agendamento: any) {
    let ativos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    ativos.push(agendamento);
    localStorage.setItem('agendamentos', JSON.stringify(ativos));

    this.arquivados = this.arquivados.filter(a => a !== agendamento);
    localStorage.setItem('agendamentosArquivados', JSON.stringify(this.arquivados));
    alert('Agendamento restaurado com sucesso!');
    this.renderizarGraficos();
  }

  excluirDefinitivo(agendamento: any) {
    if (confirm("Deseja excluir este agendamento permanentemente?")) {
      this.arquivados = this.arquivados.filter(a => a !== agendamento);
      localStorage.setItem('agendamentosArquivados', JSON.stringify(this.arquivados));
      alert('Agendamento excluído definitivamente.');
      this.renderizarGraficos();
    }
  }

  renderizarGraficos() {
    const statusCounts = {
      pendente: this.arquivados.filter(a => a.status === 'Pendente').length,
      confirmado: this.arquivados.filter(a => a.status === 'Confirmado').length,
      cancelado: this.arquivados.filter(a => a.status === 'Cancelado').length,
    };

    new Chart(document.getElementById('graficoStatusArquivados') as HTMLCanvasElement, {
      type: 'pie',
      data: {
        labels: ['Pendentes', 'Confirmados', 'Cancelados'],
        datasets: [{
          data: [statusCounts.pendente, statusCounts.confirmado, statusCounts.cancelado],
          backgroundColor: ['#fbc02d', '#4caf50', '#e53935']
        }]
      }
    });

    const rendimentosPorMes: { [mes: string]: number } = {};
    this.arquivados.filter(a => a.status === 'Confirmado').forEach(a => {
      const mes = new Date(a.data).toLocaleString('pt-BR', { month: 'short' });
      rendimentosPorMes[mes] = (rendimentosPorMes[mes] || 0) + (a.valor || 0);
    });

    new Chart(document.getElementById('graficoRendimentosArquivados') as HTMLCanvasElement, {
      type: 'bar',
      data: {
        labels: Object.keys(rendimentosPorMes),
        datasets: [{
          label: 'Rendimentos Arquivados (R$)',
          data: Object.values(rendimentosPorMes),
          backgroundColor: '#4caf50'
        }]
      }
    });
  }
}
