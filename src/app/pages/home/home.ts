import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  titulo: string = '';
  descricao: string = '';
  imagem: string | null = null;
  sobreMim: string = '';
  curiosidades: string = '';
  localizacao: string = '';

  imagens: string[] = [
    'assets/img/penteado2.jpg','assets/img/penteado1.jpg','assets/img/penteado3.jpg',
    'assets/img/penteado4.jpg','assets/img/images1.jpg','assets/img/imagem2.jpg',
    'assets/img/imagem3.webp','assets/img/imagem4.png','assets/img/2.jpeg',
    'assets/img/22.jpeg','assets/img/28.jpeg'
  ];

  modalAberto = false;
  indiceImagem = 0;

  abrirImagem(index: number) {
    this.indiceImagem = index;
    this.modalAberto = true;
  }

  fecharImagem() {
    this.modalAberto = false;
  }

  proximaImagem() {
    this.indiceImagem = (this.indiceImagem + 1) % this.imagens.length;
  }

  imagemAnterior() {
    this.indiceImagem = (this.indiceImagem - 1 + this.imagens.length) % this.imagens.length;
  }

  
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.modalAberto) {
      if (event.key === 'ArrowRight') {
        this.proximaImagem();
      } else if (event.key === 'ArrowLeft') {
        this.imagemAnterior();
      } else if (event.key === 'Escape') {
        this.fecharImagem();
      }
    }
  }

  ngOnInit() {
    this.titulo = localStorage.getItem('homeTitulo') || '';
    this.descricao = localStorage.getItem('homeDescricao') || '';
    this.imagem = localStorage.getItem('homeImagem');
    this.sobreMim = localStorage.getItem('homeSobreMim') || '';
    this.curiosidades = localStorage.getItem('homeCuriosidades') || '';
    this.localizacao = localStorage.getItem('homeLocalizacao') || '';

    window.addEventListener('scroll', () => {
      document.querySelectorAll('.animar, .animar-scroll').forEach((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          el.classList.add('ativo');
        }
      });
    });
  }
}
