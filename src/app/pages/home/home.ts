import { Component } from '@angular/core';
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

  imagens: string[] = [
    'assets/img/penteado2.jpg',
    'assets/img/penteado1.jpg',
    'assets/img/penteado3.jpg',
    'assets/img/penteado4.jpg',
    'assets/img/images1.jpg',
    'assets/img/imagem2.jpg',
    'assets/img/imagem3.webp',
    'assets/img/imagem4.png'
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
ngOnInit() {
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
