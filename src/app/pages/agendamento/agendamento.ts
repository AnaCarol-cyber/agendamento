import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './agendamento.html',
  styleUrls: ['./agendamento.css'],
})
export class Agendamento {
  confirmar() {
    const mensagem = `✨ Agendamento – Tranças Bella`;
    window.open(
      `https://wa.me/5571999999999?text=${encodeURIComponent(mensagem)}`,
      '_blank'
    );
  }
}