import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Agendamento } from './pages/agendamento/agendamento';
import { Servicos } from './pages/servicos/servicos';
import {Login} from './pages/login/login';
import { Privacidade } from './pages/privacidade/privacidade';
import { Termos } from './pages/termos/termos';
import { Dashboard } from './pages/dashboard/dashboard';


export const routes: Routes = [
  { path: '', 
    component: Home 
  },
    { path: 'privacidade', 
    component: Privacidade
   },
   { path: 'termos', 
    component: Termos
   },
  { path: 'agendamento', 
    component: Agendamento
   },
     { path: '', redirectTo: 'agendamento', pathMatch: 'full' },
  
     { path: 'servicos', 
    component: Servicos
   },
 
   { path: 'servicos', 
    component: Servicos
   },
  { path: 'login', 
    component: Login
   },
  { path: 'dashboard', 
    component: Dashboard
   }

];
