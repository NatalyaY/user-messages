import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class EmptyStringValidatorService {
    validate(g: AbstractControl) {
        if (typeof g.value == 'string' && !g.value.trim().length) {
            return { 'emptyString': true };
        }
        return null;
    }
}