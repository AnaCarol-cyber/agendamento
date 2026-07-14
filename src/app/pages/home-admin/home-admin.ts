import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home-admin.html',
  styleUrls: ['./home-admin.css']
})
export class HomeAdmin {
  tituloPagina: string = 'Editar Home';
  menuAberto: boolean = false;

  titulo: string = '';
  descricao: string = '';
  imagem: string | null = null;
  sobreMim: string = '';
curiosidades: string = '';
localizacao: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.titulo = localStorage.getItem('homeTitulo') || '';
    this.descricao = localStorage.getItem('homeDescricao') || '';
    this.imagem = localStorage.getItem('homeImagem');
      this.sobreMim = localStorage.getItem('homeSobreMim') || '';
  this.curiosidades = localStorage.getItem('homeCuriosidades') || '';
  this.localizacao = localStorage.getItem('homeLocalizacao') || '';
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  @HostListener('document:click', ['$event'])
  fecharMenuAoClicarFora(event: Event) {
    const target = event.target as HTMLElement;
    const dentroDoMenu = target.closest('.menu-usuario') || target.closest('.icone-usuario');
    if (!dentroDoMenu) {
      this.menuAberto = false;
    }
  }

  sair() {
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }

  uploadImagem(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagem = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

 salvarHome() {
  localStorage.setItem('homeTitulo', this.titulo);
  localStorage.setItem('homeDescricao', this.descricao);
  if (this.imagem) localStorage.setItem('homeImagem', this.imagem);

  localStorage.setItem('homeSobreMim', this.sobreMim);
  localStorage.setItem('homeCuriosidades', this.curiosidades);
  localStorage.setItem('homeLocalizacao', this.localizacao);

  alert('Página Home atualizada com sucesso!');

  this.titulo = '';
  this.descricao = '';
  this.imagem = null;
  this.sobreMim = '';
  this.curiosidades = '';
  this.localizacao = '';
}

carregarUltimaEdicao() {
  this.titulo = localStorage.getItem('homeTitulo') || '';
  this.descricao = localStorage.getItem('homeDescricao') || '';
  this.imagem = localStorage.getItem('homeImagem');
  this.sobreMim = localStorage.getItem('homeSobreMim') || '';
  this.curiosidades = localStorage.getItem('homeCuriosidades') || '';
  this.localizacao = localStorage.getItem('homeLocalizacao') || '';
}

excluirEdicao() {
  localStorage.removeItem('homeTitulo');
  localStorage.removeItem('homeDescricao');
  localStorage.removeItem('homeImagem');
  localStorage.removeItem('homeSobreMim');
  localStorage.removeItem('homeCuriosidades');
  localStorage.removeItem('homeLocalizacao');
  alert('Edição excluída!');
  this.titulo = '';
  this.descricao = '';
  this.imagem = null;
  this.sobreMim = '';
  this.curiosidades = '';
  this.localizacao = '';
}

}
