import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { MatCardModule } from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
// … ajoute au besoin MatCardModule, MatInputModule, etc.

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // Material
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    // PrimeNG
    ButtonModule,
    TableModule,
    ToastModule,
    DialogModule,
    MatCardModule,
    ProgressBarModule,
    MatSlideToggleModule, 
    MatSliderModule,
    FormsModule,
  ],
  exports: [
    CommonModule,
    // Material
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    // PrimeNG
    ButtonModule,
    TableModule,
    ToastModule,
    DialogModule,
    MatCardModule,
    ProgressBarModule,
    MatSlideToggleModule, 
    MatSliderModule,
    FormsModule,
    // composants partagés
  ]
})
export class SharedModule { }
