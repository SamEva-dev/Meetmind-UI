import { Component } from '@angular/core';
import { AuthModule } from '../auth.module';

@Component({
  selector: 'app-access',
  imports: [AuthModule],
  templateUrl: './access.component.html',
  styleUrl: './access.component.scss'
})
export class AccessComponent {

}
