import { AbstractControl, ValidatorFn } from '@angular/forms';

export function matchValidator(matchControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const formControl = control.parent;
        if (!formControl) {
            return null;
        } // return null if controls haven't initialised yet
        const matchControlValue =  formControl.controls[matchControlName].value;
        return control.value === matchControlValue ? null : { mustMatch: { valid: false, value: control.value } };
    };
}
