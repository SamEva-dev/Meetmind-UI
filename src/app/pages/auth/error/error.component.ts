import { Component } from '@angular/core';
import { AuthModule } from '../auth.module';

@Component({
  selector: 'app-error',
  imports: [AuthModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {

}
