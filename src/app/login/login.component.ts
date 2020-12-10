import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormStatus, getFormControlValue, LocalStorageKeyTypes } from '../helpers/utils';
import { LocalstorageService } from '../service/localstorageservice.service';

@Component({
  selector: 'gitdemo-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  /**
   * form group for login form
   *
   * @type {FormGroup}
   * @memberof LoginComponent
   */
  logInForm: FormGroup;

  /**
    * if user trying to submit form and he doesn't touch one of the mandatory property then at that time want to give red border, it will be used there 
   *
   * @type {boolean}
   * @memberof LoginComponent
   */
  submittedInvalidForm: boolean = false;

  constructor(
    private localstorageserviceService: LocalstorageService,
    private router: Router
  ) {
    
  }

  ngOnInit() {
    this.createLoginForm();
  }

  createLoginForm() {
    this.logInForm = new FormGroup({
      "email": new FormControl(null, [Validators.required,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      "password": new FormControl(null, [Validators.required, Validators.minLength(6),
        Validators.pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)])
    })
  }

  /**
   * method to check username and password at time of login
   *
   * @memberof LoginComponent
   */
  logIn() {
    if (this.logInForm) {
      if (this.logInForm && this.logInForm.status && this.logInForm.status.toUpperCase() === FormStatus.INVALID) {
        this.submittedInvalidForm = true;
        return;
      }

      const logInFormData: any = {
        email: getFormControlValue('email', this.logInForm),
        password: getFormControlValue('password', this.logInForm)
      }

      if (this.localstorageserviceService) {
        let localStorageUserData: Array<any> = this.localstorageserviceService.getLocalStorage(LocalStorageKeyTypes.USER_DETAIL);
        if (localStorageUserData && localStorageUserData.length > 0) {
          const loggedInUserDetail = localStorageUserData.find((eachUserData) => eachUserData.email && eachUserData.email == logInFormData.email);
          if (loggedInUserDetail) {
            if (loggedInUserDetail.password == logInFormData.password) {
              this.localstorageserviceService.setLocalStorage(LocalStorageKeyTypes.LOGIN_USER, [logInFormData]);
              window.alert('login successful');
              this.router.navigate(['/home']);
            } else {
              this.showUsernamePasswordIncorrect();
            }
          } else {
            this.showUsernamePasswordIncorrect();
          }
        } else {
          this.showUsernamePasswordIncorrect();
        }
      }
    }
  }

  showUsernamePasswordIncorrect() {
    window.alert('username or password incorrect');
  }

}
