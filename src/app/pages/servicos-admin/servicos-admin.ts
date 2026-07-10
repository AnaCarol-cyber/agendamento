import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HostListener } from '@angular/core';


interface Servico {
  nome: string;
  duracao: number;
  preco: number;
  imagem?: string;
}

@Component({
  selector: 'app-servicos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './servicos-admin.html',
  styleUrls: ['./servicos-admin.css']
})
export class ServicosAdmin {
  tituloPagina: string = 'Gerenciar Serviços';
  menuAberto: boolean = false;

  servicos: Servico[] = JSON.parse(localStorage.getItem('servicos') || '[]');
  novoServico: Servico = { nome: '', duracao: 60, preco: 0 };

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

  uploadImagem(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => { this.novoServico.imagem = reader.result as string; };
      reader.readAsDataURL(file);
    }
  }

  adicionarServico() {
    if (!this.novoServico.nome || !this.novoServico.preco) {
      alert('Preencha pelo menos nome e preço do serviço.');
      return;
    }
    this.servicos.push({ ...this.novoServico });
    this.salvar();
    this.novoServico = { nome: '', duracao: 60, preco: 0 };
    alert('Serviço adicionado com sucesso!');
  }

  editarServico(servico: Servico) {
    this.novoServico = { ...servico };
    this.excluirServico(servico);
  }

  excluirServico(servico: Servico) {
    this.servicos = this.servicos.filter(s => s !== servico);
    this.salvar();
  }

  salvar() {
    localStorage.setItem('servicos', JSON.stringify(this.servicos));
  }
}
