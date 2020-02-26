import { AbstractControl, ValidatorFn } from '@angular/forms';

export function emptyValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const formControl = control.parent;
        if (!formControl) {
            return null;
        } // return null if controls haven't initialised yet
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { 'empty': true };
    };
}
