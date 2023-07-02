import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiQueryValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    switch (metadata.type) {
      case 'query':
        const { error, value: validatedValue } = this.schema.validate(value);
        value = validatedValue;
        if (error) throw new BadRequestException(error.details[0].message);

      default:
        return value;
    }
  }
}
