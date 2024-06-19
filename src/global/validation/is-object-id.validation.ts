import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { Types } from "mongoose";

@ValidatorConstraint({ name: "isObjectId", async: false })
export class isObjectId implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments
  ): boolean | Promise<boolean> {
    return Types.ObjectId.isValid(value);
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    const fieldName = validationArguments ? validationArguments.property : "it";
    return `${fieldName} is not objectId`;
  }
}
