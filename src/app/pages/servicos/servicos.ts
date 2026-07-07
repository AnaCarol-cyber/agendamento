import { Component } from '@angular/core';
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
  servicos = [
    { nome: 'Box Braids', preco: 250, imagem: 'assets/img/boxbraids.jpg' },
    { nome: 'Nagô', preco: 150, imagem: 'assets/img/nago.jpg' },
    { nome: 'Twist', preco: 200, imagem: 'assets/img/twist.jpg' },
    { nome: 'Megahair', preco: 400, imagem: 'assets/img/megahair.jpg' }
  ];

  modeloArquivo: File | null = null;

  constructor(private router: Router) {}

  selecionarServico(servico: any) {
    this.router.navigate(['/agendamento'], { queryParams: { servico: servico.nome } });
  }

  enviarModelo(event: any) {
    this.modeloArquivo = event.target.files[0];
    if (this.modeloArquivo) {
      console.log('Modelo enviado:', this.modeloArquivo.name);
    }
  }

  irParaAgendamento() {
    // Redireciona para agendamento com flag de modelo próprio
    this.router.navigate(['/agendamento'], { queryParams: { modeloProprio: true } });
  }
}
