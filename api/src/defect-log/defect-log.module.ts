import { Module } from '@nestjs/common';
import { DefectLogController } from './defect-log.controller';
import { DefectLogService } from './defect-log.service';

@Module({
  controllers: [DefectLogController],
  providers: [DefectLogService],
  exports: [DefectLogService],
})
export class DefectLogModule {}
