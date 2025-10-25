import { Injectable } from '@angular/core';
import { LateInRecord, ValidationError } from '../models/late-in-record.model';
import { Persona } from '../models/persona.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  validateRecords(records: LateInRecord[], persona: Persona): ValidationError[] {
    const errors: ValidationError[] = [];

    records.forEach(record => {
      // Excused is mandatory for Late In
      if (!record.excused) {
        errors.push({
          employeeId: record.employeeId,
          field: 'excused',
          message: 'Excused field is required (must select Yes or No)'
        });
      }

      // Comment is mandatory for Late In (when variance > 0)
      if (record.variance > 0 && (!record.comment || !record.comment.trim())) {
        errors.push({
          employeeId: record.employeeId,
          field: 'comment',
          message: 'Comment is mandatory for Late In exceptions'
        });
      }

      // Comment character limit (500 chars)
      if (record.comment && record.comment.length > 500) {
        errors.push({
          employeeId: record.employeeId,
          field: 'comment',
          message: `Comment exceeds 500 character limit (${record.comment.length} chars)`
        });
      }

      // AMH specific validations
      if (persona.showAMH) {
        if (!record.amhReason || !record.amhReason.trim()) {
          errors.push({
            employeeId: record.employeeId,
            field: 'amhReason',
            message: 'AMH authorization reason is required'
          });
        }
        if (!record.amhAttachment) {
          errors.push({
            employeeId: record.employeeId,
            field: 'amhAttachment',
            message: 'AMH supporting document must be uploaded'
          });
        }
      }
    });

    return errors;
  }

  isCommentValid(comment: string, variance: number): boolean {
    if (variance > 0 && (!comment || !comment.trim())) {
      return false;
    }
    if (comment && comment.length > 500) {
      return false;
    }
    return true;
  }

  isExcusedValid(excused: string): boolean {
    return excused === 'Yes' || excused === 'No';
  }
}
