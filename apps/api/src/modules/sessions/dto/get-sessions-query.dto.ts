import { IsOptional, IsString, IsEnum, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { SessionStatus } from '@grow-fitness/shared-types';

export class GetSessionsQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ['dateTime', 'createdAt'], description: 'Sort field' })
  @IsOptional()
  @IsIn(['dateTime', 'createdAt'])
  sortBy?: 'dateTime' | 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], description: 'Sort by dateTime direction' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'Filter by coach ID' })
  @IsOptional()
  @IsString()
  coachId?: string;

  @ApiPropertyOptional({ description: 'Filter by location ID' })
  @IsOptional()
  @IsString()
  locationId?: string;

  @ApiPropertyOptional({ description: 'Filter by kid ID (sessions containing this kid)' })
  @IsOptional()
  @IsString()
  kidId?: string;

  @ApiPropertyOptional({ enum: SessionStatus, description: 'Filter by session status' })
  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;

  @ApiPropertyOptional({ description: 'Filter sessions from this date (ISO format)' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Filter sessions until this date (ISO format)' })
  @IsOptional()
  @IsString()
  endDate?: string;
}
