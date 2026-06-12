import { IsOptional, IsString, IsEnum, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { UserStatus } from '@grow-fitness/shared-types';

export const PARENT_SORT_FIELDS = [
  'name',
  'email',
  'phone',
  'location',
  'status',
  'createdAt',
] as const;
export type ParentSortField = (typeof PARENT_SORT_FIELDS)[number];

export class GetParentsQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search by email, phone, or name' })
  @IsOptional()
  @IsString()
  override search?: string = undefined;

  @ApiPropertyOptional({ description: 'Filter by location' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ enum: UserStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ enum: PARENT_SORT_FIELDS, description: 'Field to sort parents by' })
  @IsOptional()
  @IsIn(PARENT_SORT_FIELDS)
  sortBy?: ParentSortField;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], description: 'Parent sort direction' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
