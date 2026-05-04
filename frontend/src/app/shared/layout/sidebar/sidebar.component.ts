import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

interface NavItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatTooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  @Input() open = true;

  navItems: NavItem[] = [
    { icon: 'dashboard',        label: 'Inicio',         route: '/dashboard'  },
    { icon: 'account_balance',  label: 'Mis cuentas',    route: '/accounts'   },
    { icon: 'send',             label: 'Transferencias', route: '/transfers'  },
    { icon: 'person',           label: 'Mi perfil',      route: '/profile'    },
  ];
}
