import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class EmptyStringValidatorService {
    validate(g: FormGroup) {
        let isEmpty = false;
        for (const control in g.controls) {
            const value = g.controls[control].value;
            if (typeof value !== 'string') return null;

            if (!value.trim().length) {
                isEmpty = true;
                break;
            }
        }
        return isEmpty ? { 'emptyString': true } : null;
    }
}