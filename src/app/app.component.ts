import { Component, inject, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { SettingsService } from './feature/settings/services/settings.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  settingService = inject(SettingsService);
  settings: any;

  ngOnInit(): void {
    this.settingService.getSettings().pipe(
      catchError((error) => {
        console.error('Error fetching settings:', error);
        return of([]);
      }
      )
    ).subscribe((data) => {
      this.settings = data;
      console.log('Settings:', data);
    }

    ); 
  }
}
