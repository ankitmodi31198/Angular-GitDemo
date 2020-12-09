import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './homepage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GithubDataService } from '../service/github-data.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    HomepageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule
  ],
  exports: [
    HomepageComponent
  ],
  providers: [
    GithubDataService
  ]
})
export class HomepageModule { }
