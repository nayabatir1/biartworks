import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiSocketValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    switch (metadata.type) {
      case 'body':
        const { error } = this.schema.validate(value);
        if (error) throw new WsException(error.details[0].message);

      default:
        return value;
    }
  }
}
