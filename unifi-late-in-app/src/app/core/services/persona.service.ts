import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Persona, PersonaType, PERSONAS } from '../models/persona.model';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private currentPersonaSubject = new BehaviorSubject<Persona>(PERSONAS.sm);
  currentPersona$ = this.currentPersonaSubject.asObservable();

  get currentPersona(): Persona {
    return this.currentPersonaSubject.value;
  }

  switchPersona(personaType: PersonaType): void {
    const persona = PERSONAS[personaType];
    if (persona) {
      this.currentPersonaSubject.next(persona);
    }
  }

  getAllPersonas(): Persona[] {
    return Object.values(PERSONAS);
  }
}
