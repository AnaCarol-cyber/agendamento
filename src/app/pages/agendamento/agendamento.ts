import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './agendamento.html',
  styleUrls: ['./agendamento.css']
})
export class Agendamento {
  nome: string = '';
  contato: string = '';
  servico: string = '';
  data: string = '';
  horario: string = '';
  consentimento: boolean = false;

  confirmarAgendamento() {
    const novoAgendamento = {
      nome: this.nome,
      contato: this.contato,
      servico: this.servico,
      data: this.data,
      horario: this.horario,
      status: 'Pendente' // ✅ sempre começa como pendente
    };

    // Salva no localStorage
    let agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    agendamentos.push(novoAgendamento);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

    alert('Agendamento enviado! Aguarde contato para pagamento.');
    
    // Limpa formulário
    this.nome = '';
    this.contato = '';
    this.servico = '';
    this.data = '';
    this.horario = '';
  }
}
