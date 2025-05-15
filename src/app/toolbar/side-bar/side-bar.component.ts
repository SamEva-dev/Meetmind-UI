import { Component, ElementRef, OnInit } from '@angular/core';
import { ToolbarModule } from '../toolbar.module';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { ToolbarService } from '../toolbar.service';
import { Router } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-side-bar',
  imports: [ToolbarModule, MenuComponent],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
  animations: [
    trigger('slide', [
      state('up', style({ height: 0 })),
      state('down', style({ height: '*' })),
      transition('up <=> down', animate(200))
    ])
  ]
})
export class SideBarComponent {

  constructor(public el: ElementRef) {}


}
