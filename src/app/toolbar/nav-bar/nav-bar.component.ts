import { Component, OnInit } from '@angular/core';
import { ToolbarModule } from '../toolbar.module';
import { ToolbarService } from '../toolbar.service';

@Component({
  selector: 'app-nav-bar',
  imports: [ToolbarModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {

  constructor(private toolbarService: ToolbarService) { }

  ngOnInit(): void {
  }

  toggleSidebarPin() {
   // this.toolbarService.toggleSidebarPin();
  }
}
