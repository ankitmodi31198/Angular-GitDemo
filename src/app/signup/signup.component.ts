import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getFormControlValue, LocalStorageKeyTypes } from '../helpers/utils';
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
      "name": new FormControl(null, [Validators.required]),
      "email": new FormControl(null, [Validators.required]),
      "password": new FormControl(null, [Validators.required])
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
