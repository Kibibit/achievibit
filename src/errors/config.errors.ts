import { ValidationError } from 'class-validator';
import { times, values } from 'lodash';

export class ConfigValidationError extends Error {
  constructor(validationErrors: ValidationError[]) {
    const message = validationErrors
      .map((validationError) => {
        const productLine = ` property: ${ validationError.property } `;
        const valueLine = ` value: ${ validationError.value } `;
        const longerLineLength = Math.max(productLine.length, valueLine.length);
        const deco = times(longerLineLength, () => '=').join('');
        return [
          '',
          deco,
          ` property: ${ validationError.property }`,
          ` value: ${ validationError.value }`,
          deco,
          values(validationError.constraints).map((value) => ` - ${ value }`).join('\n')
        ].join('\n');
      }).join('') + '\n\n';

    super(message);
    this.name = 'ConfigValidationError';
  }
}
