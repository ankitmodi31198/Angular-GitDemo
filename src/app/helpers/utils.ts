import { FormGroup } from '@angular/forms';

export function getFormControlValue(formControlName: string, formGroup: FormGroup) {
    if (formControlName && formGroup) {
        return formGroup.get(formControlName) && formGroup.get(formControlName).value;
    }
}

export enum LocalStorageKeyTypes {
    USER_DETAIL = 'userDetail',
    GITHUB_USERS_LIST = 'githubUserList'
}