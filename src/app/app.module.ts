import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LocalstorageService } from './service/localstorageservice.service';
import { HomepageModule } from './homepage/homepage.module';
import { LoginModule } from './login/login.module';
import { SignupModule } from './signup/signup.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoginModule,
    HomepageModule,
    SignupModule,
    HttpClientModule
  ],
  providers: [
    LocalstorageService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
