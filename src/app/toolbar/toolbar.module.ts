import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { RippleModule } from 'primeng/ripple';

import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
     MatExpansionModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    RippleModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    RippleModule
  ]
})
export class ToolbarModule { }
