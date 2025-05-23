import { Component } from '@angular/core';
import { ToolbarModule } from '../toolbar.module';
import { MenuItem } from 'primeng/api';
import { MenuItemComponent } from '../menu-item/menu-item.component';

@Component({
  selector: 'app-menu',
  imports: [ToolbarModule, MenuItemComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
 model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] }]
            },
            {
                items: [{ label: 'Settings', icon: 'pi pi-fw pi-home', routerLink: ['/settings'] }]
            },
            {
                items: [{ label: 'Meetings', icon: 'pi pi-fw pi-home', routerLink: ['/meetings'] }]
            },
            
        ];
    }
}
