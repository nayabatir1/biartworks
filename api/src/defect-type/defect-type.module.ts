import { Module } from '@nestjs/common';
import { DefectTypeController } from './defect-type.controller';
import { DefectTypeService } from './defect-type.service';

@Module({
  controllers: [DefectTypeController],
  providers: [DefectTypeService]
})
export class DefectTypeModule {}
