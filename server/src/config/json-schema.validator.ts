import {
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

@ValidatorConstraint({ name: 'JsonSchema', async: false })
export class JsonSchema implements ValidatorConstraintInterface {
  validate() {
    return true;
  }

  defaultMessage() {
    return '';
  }
}
