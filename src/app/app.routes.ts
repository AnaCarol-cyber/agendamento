import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Agendamento } from './pages/agendamento/agendamento';
import { Servicos } from './pages/servicos/servicos';
import { Login } from './pages/login/login';
import { Privacidade } from './pages/privacidade/privacidade';
import { Termos } from './pages/termos/termos';
import { Dashboard } from './pages/dashboard/dashboard';
import { HomeAdmin } from './pages/home-admin/home-admin';
import { ServicosAdmin } from './pages/servicos-admin/servicos-admin';
import { GraficosArquivados } from './pages/graficos-arquivados/graficos-arquivados';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'privacidade', component: Privacidade },
  { path: 'termos', component: Termos },
  { path: 'agendamento', component: Agendamento },
  { path: 'servicos', component: Servicos },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate:[AuthGuard]},


  { path: 'home-admin', component: HomeAdmin, canActivate: [AuthGuard] },
  { path: 'servicos-admin', component: ServicosAdmin, canActivate: [AuthGuard] },
  { path: 'graficos-arquivados', component: GraficosArquivados, canActivate: [AuthGuard] },

  { path: '**', redirectTo: '' }
];
