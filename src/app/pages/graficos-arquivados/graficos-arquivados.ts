import {
  Component,
  AfterViewInit,
  HostListener
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-graficos-arquivados',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './graficos-arquivados.html',
  styleUrls: ['./graficos-arquivados.css']
})
export class GraficosArquivados implements AfterViewInit {

  tituloPagina ='Gráficos & Arquivados';

  menuAberto = false;

  mostrandoArquivados = false;

  busca = '';

  statusFiltro = '';

  arquivados: any[] =
    JSON.parse(localStorage.getItem('agendamentosArquivados') || '[]');

  ativos: any[] =
    JSON.parse(localStorage.getItem('agendamentos') || '[]');

  fotoSelecionada: string | null = null;

  private graficoStatus: Chart | null = null;
  private graficoRendimentos: Chart | null = null;

  constructor(private router: Router) {

    const usuario = localStorage.getItem('usuarioLogado');

    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }

  }

  ngAfterViewInit(): void {
    this.renderizarGraficos();
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  @HostListener('document:click', ['$event'])
  fecharMenuAoClicarFora(event: Event) {

    const target = event.target as HTMLElement;

    const dentro =
      target.closest('.menu-usuario') ||
      target.closest('.icone-usuario');

    if (!dentro) {
      this.menuAberto = false;
    }

  }

  sair() {
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }

  visualizarArquivados() {

    this.mostrandoArquivados = true;

    this.arquivados =
      JSON.parse(localStorage.getItem('agendamentosArquivados') || '[]');

  }

  voltarVisaoGeral() {

    this.mostrandoArquivados = false;

    this.ativos =
      JSON.parse(localStorage.getItem('agendamentos') || '[]');

    setTimeout(() => {
      this.renderizarGraficos();
    });

  }

  getAgendamentosFiltrados() {

    let lista = this.mostrandoArquivados
      ? this.arquivados
      : this.ativos;

    if (this.statusFiltro) {

      lista = lista.filter(
        a => a.status === this.statusFiltro
      );

    }

    if (this.busca) {

      lista = lista.filter(a =>

        a.nome.toLowerCase()
          .includes(this.busca.toLowerCase())

        ||

        a.servico.toLowerCase()
          .includes(this.busca.toLowerCase())

      );

    }

    return lista;

  }

  restaurarAgendamento(agendamento: any) {

    this.ativos.push(agendamento);

    localStorage.setItem(
      'agendamentos',
      JSON.stringify(this.ativos)
    );

    this.arquivados =
      this.arquivados.filter(a => a !== agendamento);

    localStorage.setItem(
      'agendamentosArquivados',
      JSON.stringify(this.arquivados)
    );

    alert('Agendamento restaurado com sucesso!');

  }

  excluirDefinitivo(agendamento: any) {

    if (!confirm('Deseja excluir definitivamente?')) {
      return;
    }

    this.arquivados =
      this.arquivados.filter(a => a !== agendamento);

    localStorage.setItem(
      'agendamentosArquivados',
      JSON.stringify(this.arquivados)
    );

    alert('Agendamento excluído.');

  }

  calcularRendimentos(): number {

    return this.ativos

      .filter(a => a.status === 'Confirmado')

      .reduce((total, atual) => {

        return total + (Number(atual.valor) || 0);

      }, 0);

  }

  gerarRelatorioPDF() {

    const doc = new jsPDF();

    doc.text('Relatório Geral', 14, 20);

    autoTable(doc, {

      head: [[
        'Nome',
        'Serviço',
        'Data',
        'Horário',
        'Valor',
        'Status'
      ]],

      body: this.ativos.map(a => [

        a.nome,

        a.servico,

        a.data,

        a.horario,

        a.valor || '',

        a.status

      ]),

      startY: 30

    });

    doc.text(
      `Rendimentos Confirmados: R$ ${this.calcularRendimentos()}`,
      14,
      (doc as any).lastAutoTable.finalY + 20
    );

    doc.save('relatorio-geral.pdf');

  }
    renderizarGraficos() {

    if (this.graficoStatus) {
      this.graficoStatus.destroy();
    }

    if (this.graficoRendimentos) {
      this.graficoRendimentos.destroy();
    }

    // Apenas agendamentos ativos do Dashboard
    this.ativos =
      JSON.parse(localStorage.getItem('agendamentos') || '[]');

    const pendentes = this.ativos.filter(
      a => a.status === 'Pendente'
    ).length;

    const confirmados = this.ativos.filter(
      a => a.status === 'Confirmado'
    ).length;

    const cancelados = this.ativos.filter(
      a => a.status === 'Cancelado'
    ).length;

    const canvasStatus =
      document.getElementById(
        'graficoStatusArquivados'
      ) as HTMLCanvasElement;

    if (canvasStatus) {

      this.graficoStatus = new Chart(canvasStatus, {

        type: 'pie',

        data: {

          labels: [
            'Pendentes',
            'Confirmados',
            'Cancelados'
          ],

          datasets: [

            {

              data: [
                pendentes,
                confirmados,
                cancelados
              ],

              backgroundColor: [
                '#fbc02d',
                '#4caf50',
                '#e53935'
              ]

            }

          ]

        },

        options: {

          responsive: true,

          plugins: {

            legend: {
              position: 'bottom'
            }

          }

        }

      });

    }

    const rendimentosPorMes: { [mes: string]: number } = {};

    this.ativos

      .filter(a => a.status === 'Confirmado')

      .forEach(a => {

        const data = new Date(a.data);

        const mes = data.toLocaleString(
          'pt-BR',
          {
            month: 'short'
          }
        );

        rendimentosPorMes[mes] =
          (rendimentosPorMes[mes] || 0) +
          (Number(a.valor) || 0);

      });

    const canvasRendimentos =
      document.getElementById(
        'graficoRendimentosArquivados'
      ) as HTMLCanvasElement;

    if (canvasRendimentos) {

      this.graficoRendimentos = new Chart(
        canvasRendimentos,

        {

          type: 'bar',

          data: {

            labels: Object.keys(
              rendimentosPorMes
            ),

            datasets: [

              {

                label: 'Rendimentos (R$)',

                data: Object.values(
                  rendimentosPorMes
                ),

                backgroundColor: '#4caf50'

              }

            ]

          },

          options: {

            responsive: true,

            plugins: {

              legend: {
                display: false
              }

            },

            scales: {

              y: {

                beginAtZero: true

              }

            }

          }

        }

      );

    }

  }

}