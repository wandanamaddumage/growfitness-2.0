import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { EmploymentType, UserStatus } from '@grow-fitness/shared-types';

export class GetCoachesQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search by email, phone, or name' })
  @IsOptional()
  @IsString()
  override search?: string = undefined;

  @ApiPropertyOptional({ enum: UserStatus, description: 'Filter by coach status' })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ enum: EmploymentType, description: 'Filter by coach employment type' })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;
}
