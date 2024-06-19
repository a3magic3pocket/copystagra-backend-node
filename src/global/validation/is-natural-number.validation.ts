import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "isNaturalNumber", async: false })
export class IsNaturalNumber implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments
  ): boolean | Promise<boolean> {
    return /^[1-9][0-9]*/.test(value);
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    const fieldName = validationArguments ? validationArguments.property : "it";
    return `${fieldName} is not natural value`;
  }
}
