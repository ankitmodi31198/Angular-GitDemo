import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { getFormControlValue, LocalStorageKeyTypes } from '../helpers/utils';
import { GithubDataService } from '../service/github-data.service';
import { LocalstorageService } from '../service/localstorageservice.service';

@Component({
  selector: 'gitdemo-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, AfterViewInit, OnDestroy {

  searchForGithub: FormGroup;

  localStorageGithubUserListData: Array<any>;

  searchText: string = null;

  githubGridFormGroup: FormGroup;

  gridSearchSubscription: Subscription;

  constructor(
    private githubDataService: GithubDataService,
    private localstorageservice: LocalstorageService
  ) {
    this.localStorageGithubUserListData = this.localstorageservice.getLocalStorage(LocalStorageKeyTypes.GITHUB_USERS_LIST);
  }

  ngOnInit() {
    this.createGithubProfileSearchForm();
    this.createGithubGridForm();
  }

  ngAfterViewInit() {
    // here used debounceTime so when user will stop typing for 1 second then we will update the grid values
    if (this.githubGridFormGroup && this.githubGridFormGroup.get('gridSearch')) {
      this.gridSearchSubscription = this.githubGridFormGroup.get('gridSearch').valueChanges.pipe(debounceTime(1000))
      .subscribe((value) => {
        console.log(value);
        if (value) {
          this.localStorageGithubUserListData = this.localStorageGithubUserListData.filter(eachRow => 
            (eachRow.id && eachRow.id.toString().includes(value)) ||
            (eachRow.login && eachRow.login.toString().includes(value)) ||
            (eachRow.name && eachRow.name.toString().includes(value)) ||
            (eachRow.avatar_url && eachRow.avatar_url.toString().includes(value)) ||
            (eachRow.public_repos && eachRow.public_repos.toString().includes(value))
          );
        } else {
          this.localStorageGithubUserListData = this.localstorageservice.getLocalStorage(LocalStorageKeyTypes.GITHUB_USERS_LIST);
        }
      })
    }
  }

  createGithubProfileSearchForm() {
    this.searchForGithub = new FormGroup({
      "reprositoryName": new FormControl(null)
    })
  }

  createGithubGridForm() {
    this.githubGridFormGroup = new FormGroup({
      "gridSearch": new FormControl(null)
    })
  }

  searchForGithubProfile() {
    if (this.githubDataService) {
      this.githubDataService.getProfileData(getFormControlValue('reprositoryName', this.searchForGithub)).pipe(take(1))
      .subscribe((response) => {
        this.handleValidResponseOnProfileSearch(response);
      }, (error) => {
        if (error.status && error.status == 404) {
          window.alert('username not found');
        } else {
          console.error('unknown error occured', error);
        }
      })
    }
  }

  handleValidResponseOnProfileSearch(response: any) {
    const userProfileData = {
      id: response.id ? response.id : null,
      login: response.login ? response.login : null,
      name: response.name ? response.name : null,
      avatar_url: response.avatar_url ? response.avatar_url : null,
      public_repos: response.public_repos ? response.public_repos : null
    }

    if (this.localstorageservice) {
      let localStorageGithubUserListData: Array<any> = this.localstorageservice.getLocalStorage(LocalStorageKeyTypes.GITHUB_USERS_LIST);
      if (localStorageGithubUserListData && localStorageGithubUserListData.length > 0) {
        if (!(localStorageGithubUserListData.find((eachGithubUserList) => eachGithubUserList.id == userProfileData.id))) {
          localStorageGithubUserListData.push(userProfileData);
          this.localstorageservice.setLocalStorage(LocalStorageKeyTypes.GITHUB_USERS_LIST, localStorageGithubUserListData);
        }
      } else {
        this.localstorageservice.setLocalStorage(LocalStorageKeyTypes.GITHUB_USERS_LIST, [userProfileData]);
        // this.localStorageGithubUserListData = [userProfileData];
      }

      if (this.githubGridFormGroup && this.githubGridFormGroup.get('gridSearch')) {
        this.githubGridFormGroup.get('gridSearch').setValue(null);
      }
    }
  }

  /**
   * row delete click handler
   *
   * @param {*} eachGithubUserData
   * @memberof HomepageComponent
   */
  deleteRowClickHandler(eachGithubUserData) {
    if (eachGithubUserData && eachGithubUserData.id) {
      this.localStorageGithubUserListData = this.localStorageGithubUserListData.filter(eachGithubUserList => !(eachGithubUserList.id == eachGithubUserData.id));
      const localStorageGithubUserListData: Array<any> = this.localstorageservice.getLocalStorage(LocalStorageKeyTypes.GITHUB_USERS_LIST).filter(eachGithubUserList => !(eachGithubUserList.id == eachGithubUserData.id))
      this.localstorageservice.setLocalStorage(LocalStorageKeyTypes.GITHUB_USERS_LIST, localStorageGithubUserListData);
    }
  }

  ngOnDestroy() {
    if (this.gridSearchSubscription) {
      this.gridSearchSubscription.unsubscribe();
    }
  }

}
