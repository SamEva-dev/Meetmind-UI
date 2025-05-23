import { Injectable } from '@angular/core';
import { ActiveToast, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
constructor(private toastr: ToastrService) {}

  success(message: string, title: string = 'Succès'): ActiveToast<any> {
    return this.toastr.success(message, title);
  }

  error(message: string, title: string = 'Erreur'): ActiveToast<any> {
    return this.toastr.error(message, title);
  }

  info(message: string, title: string = 'Information'): ActiveToast<any> {
    return this.toastr.info(message, title);
  }

  warning(message: string, title: string = 'Attention'): ActiveToast<any> {
    return this.toastr.warning(message, title);
  }

  clear(): void {
    this.toastr.clear();
  }
}
