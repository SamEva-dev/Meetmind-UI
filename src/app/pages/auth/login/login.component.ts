import { Component } from '@angular/core';
import { AuthModule } from '../auth.module';

@Component({
  selector: 'app-login',
  imports: [AuthModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';

    password: string = '';

    checked: boolean = false;
}
