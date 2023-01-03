import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsEmailAllowedConstraint implements ValidatorConstraintInterface {
  validate(email: any, args: ValidationArguments) {
    const emailUserName = email.split('@')[0];
    const isDev = process.env.ENV != 'production';
    return !emailUserName.includes('+') || isDev;
  }
}

export function IsEmailAllowed(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailAllowedConstraint,
    });
  };
}
