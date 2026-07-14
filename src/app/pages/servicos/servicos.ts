import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicos.html',
  styleUrls: ['./servicos.css']
})
export class Servicos {
  servicos: any[] = [];

  modelos = [
    'assets/img/1.jpeg','assets/img/2.jpeg','assets/img/3.jpeg','assets/img/4.jpeg',
    'assets/img/5.jpeg','assets/img/6.jpeg','assets/img/7.jpeg','assets/img/8.jpeg',
    'assets/img/9.jpeg','assets/img/10.jpeg','assets/img/11.jpeg','assets/img/12.jpeg',
    'assets/img/13.jpeg','assets/img/14.jpeg','assets/img/15.jpeg','assets/img/16.jpeg',
    'assets/img/17.jpeg','assets/img/18.jpeg','assets/img/19.jpeg','assets/img/20.jpeg',
    'assets/img/21.jpeg','assets/img/22.jpeg','assets/img/23.jpeg','assets/img/24.jpeg',
    'assets/img/25.jpeg','assets/img/26.jpeg','assets/img/27.jpeg','assets/img/28.jpeg',
    'assets/img/29.jpeg','assets/img/30.jpeg','assets/img/31.jpeg','assets/img/32.jpeg',
    'assets/img/33.jpeg','assets/img/34.jpeg','assets/img/35.jpeg','assets/img/36.jpeg',
    'assets/img/37.jpeg','assets/img/38.jpeg','assets/img/39.jpeg','assets/img/40.jpeg',
    'assets/img/41.jpeg','assets/img/42.jpeg','assets/img/43.jpeg','assets/img/44.jpeg',
    'assets/img/penteado1.jpg','assets/img/penteado2.jpg','assets/img/penteado3.jpg',
    'assets/img/penteado4.jpg'
  ];

  constructor(private router: Router) {
    this.carregarServicos();
  }

  modalAberto = false;
  imagemSelecionada: string | null = null;
  servicoSelecionado: any = null;
  indiceAtual: number = 0;
  tipoModal: 'servicos' | 'galeria' | null = null;

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

  abrirModal(servico: any) {
    this.modalAberto = true;
    this.tipoModal = 'servicos';
    this.indiceAtual = this.servicos.findIndex((item) => item.nome === servico.nome);
    this.imagemSelecionada = servico.imagem;
    this.servicoSelecionado = servico.nome ? servico : null;
  }

  abrirModalComIndice(indice: number) {
    this.modalAberto = true;
    this.tipoModal = 'galeria';
    this.indiceAtual = indice;
    this.imagemSelecionada = this.modelos[indice];
    this.servicoSelecionado = null;
  }

  fecharModal() {
    this.modalAberto = false;
    this.imagemSelecionada = null;
    this.servicoSelecionado = null;
    this.tipoModal = null;
  }

  selecionarServico(servico: any) {
    this.router.navigate(['/agendamento'], {
      queryParams: {
        servico: servico.nome,
        imagem: servico.imagem
      }
    });
  }

  irParaAgendamentoExistente() {
    this.router.navigate(['/agendamento'], { queryParams: { modeloExistente: true } });
  }

  proximaImagem() {
    if (!this.modalAberto) return;

    if (this.tipoModal === 'servicos') {
      const totalServicos = this.servicos.length;
      if (!totalServicos) return;

      this.indiceAtual = (this.indiceAtual + 1) % totalServicos;
      const servico = this.servicos[this.indiceAtual];
      this.servicoSelecionado = servico;
      this.imagemSelecionada = servico?.imagem || null;
      return;
    }

    this.indiceAtual = (this.indiceAtual + 1) % this.modelos.length;
    this.imagemSelecionada = this.modelos[this.indiceAtual];
    this.servicoSelecionado = null;
  }

  imagemAnterior() {
    if (!this.modalAberto) return;

    if (this.tipoModal === 'servicos') {
      const totalServicos = this.servicos.length;
      if (!totalServicos) return;

      this.indiceAtual = (this.indiceAtual - 1 + totalServicos) % totalServicos;
      const servico = this.servicos[this.indiceAtual];
      this.servicoSelecionado = servico;
      this.imagemSelecionada = servico?.imagem || null;
      return;
    }

    this.indiceAtual = (this.indiceAtual - 1 + this.modelos.length) % this.modelos.length;
    this.imagemSelecionada = this.modelos[this.indiceAtual];
    this.servicoSelecionado = null;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.modalAberto) return;

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.proximaImagem();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.imagemAnterior();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.fecharModal();
    }
  }
}
