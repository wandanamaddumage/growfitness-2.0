import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsEnum, IsIn, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { SessionType } from '@grow-fitness/shared-types';

export const KID_SORT_FIELDS = [
  'name',
  'gender',
  'birthDate',
  'sessionType',
  'parentName',
  'goal',
  'createdAt',
] as const;
export type KidSortField = (typeof KID_SORT_FIELDS)[number];

export class FindKidsQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by parent ID' })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional({ enum: SessionType, description: 'Filter by session type' })
  @IsOptional()
  @IsEnum(SessionType)
  sessionType?: SessionType;

  @ApiPropertyOptional({ description: 'Filter by exact gender' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: 'Minimum age in years', minimum: 0, maximum: 18 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(18)
  minAge?: number;

  @ApiPropertyOptional({ description: 'Maximum age in years', minimum: 0, maximum: 18 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(18)
  maxAge?: number;

  // search is already defined in PaginationDto, no need to redeclare

  @ApiPropertyOptional({ enum: KID_SORT_FIELDS, description: 'Field to sort kids by' })
  @IsOptional()
  @IsIn(KID_SORT_FIELDS)
  sortBy?: KidSortField;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], description: 'Kid sort direction' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
