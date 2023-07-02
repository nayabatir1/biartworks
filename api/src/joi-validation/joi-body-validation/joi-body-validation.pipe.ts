import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiBodyValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    switch (metadata.type) {
      case 'body':
        const { error } = this.schema.validate(value);
        if (error)
          throw new BadRequestException({
            status: 400,
            message: error.details[0].message,
          });

      default:
        return value;
    }
  }
}
