import { AbstractControl, ValidatorFn } from '@angular/forms';

export function maximumValidator(max): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const formControl = control.parent;
        if (!formControl) {
            return null;
        } // return null if controls haven't initialised yet
        const lessThanThree = control.value.length;
        const isValid = lessThanThree <= max;
        return isValid ? null : { 'empty': true };
    };
}
