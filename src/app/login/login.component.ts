import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getFormControlValue, LocalStorageKeyTypes } from '../helpers/utils';
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
      "email": new FormControl(null, [Validators.required]),
      "password": new FormControl(null, [Validators.required])
    })
  }

  /**
   * method to check username and password at time of login
   *
   * @memberof LoginComponent
   */
  logIn() {
    if (this.logInForm) {

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
