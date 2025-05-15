import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { AccessComponent } from './access/access.component';

export default [
    { path: 'access', component: AccessComponent },
    { path: 'error', component: ErrorComponent },
    { path: '', component: LoginComponent }
] as Routes;
