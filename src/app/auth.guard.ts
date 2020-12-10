import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { LocalStorageKeyTypes } from './helpers/utils';
import { LocalstorageService } from './service/localstorageservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private localstorageservice: LocalstorageService,
    private router: Router
  ) {
    
  }
  
  canActivate(): boolean {
    const loggedInUser = this.localstorageservice.getLocalStorage(LocalStorageKeyTypes.LOGIN_USER);
    if (loggedInUser && loggedInUser.length > 0) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
