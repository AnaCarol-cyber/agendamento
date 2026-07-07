import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  usuario: string = '';
  senha: string = '';
  erro: string = '';
  autoLogin: boolean = false;
  mostrarSenha: boolean = false; 

  constructor(private router: Router) {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const autoLogin = localStorage.getItem('autoLogin');

    if (usuarioLogado && autoLogin === 'true') {
      this.router.navigate(['/dashboard']);
    }
  }

  entrar() {
    if (this.usuario === 'admin' && this.senha === '12345') {
      localStorage.setItem('usuarioLogado', this.usuario);
      localStorage.setItem('autoLogin', this.autoLogin.toString());
      this.router.navigate(['/dashboard']);
    } else {
      this.erro = 'Usuário ou senha inválidos';
    }
  }

  alternarSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }
}
