import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { emailValidator, FormStatus, getFormControlValue, LocalStorageKeyTypes } from '../helpers/utils';
import { LocalstorageService } from '../service/localstorageservice.service';

@Component({
  selector: 'gitdemo-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  /**
   * form group for signup form
   *
   * @type {FormGroup}
   * @memberof SignupComponent
   */
  signupForm: FormGroup;

  /**
   * if user trying to submit form and he doesn't touch one of the mandatory property then at that time want to give red border, it will be used there 
   *
   * @type {boolean}
   * @memberof SignupComponent
   */
  submittedInvalidForm: boolean = false;

  constructor(
    private localstorageserviceService: LocalstorageService,
    private router: Router
  ) {
    
  }

  ngOnInit() {
    this.createSignupForm();
  }

  createSignupForm() {
    this.signupForm = new FormGroup({
      "name": new FormControl(null, [Validators.required, Validators.minLength(2)]),
      "email": new FormControl(null, [Validators.required,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      "password": new FormControl(null, [Validators.required, Validators.minLength(6),
        Validators.pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)])
    })
  }

  /**
   * method for save user information data into localstorage as database
   * will call at time of submit form
   *
   * @memberof SignupComponent
   */
  signup() {
    if (this.signupForm) {
      if (this.signupForm.status && this.signupForm.status.toUpperCase() === FormStatus.INVALID) {
        this.submittedInvalidForm = true;
        return;
      }

      const signupData: any = {
        name: getFormControlValue('name', this.signupForm),
        email: getFormControlValue('email', this.signupForm),
        password: getFormControlValue('password', this.signupForm)
      }

      if (this.localstorageserviceService) {
        let localStorageUserData: Array<any> = this.localstorageserviceService.getLocalStorage(LocalStorageKeyTypes.USER_DETAIL);
        if (localStorageUserData && localStorageUserData.length > 0) {
          localStorageUserData.push(signupData);
          this.localstorageserviceService.setLocalStorage(LocalStorageKeyTypes.USER_DETAIL, localStorageUserData);
        } else {
          this.localstorageserviceService.setLocalStorage(LocalStorageKeyTypes.USER_DETAIL, [signupData]);
        }
        window.alert('sign up successful please login');
        this.router.navigate(['/login']);
      }
    }
  }

}
