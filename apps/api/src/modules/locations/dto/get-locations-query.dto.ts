import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export const LOCATION_SORT_FIELDS = [
  'name',
  'address',
  'placeUrl',
  'isActive',
  'createdAt',
] as const;
export type LocationSortField = (typeof LOCATION_SORT_FIELDS)[number];

export class GetLocationsQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search by location name, address, or place URL' })
  @IsOptional()
  @IsString()
  override search?: string = undefined;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @Transform(({ obj, key, value }) => {
    const rawValue = obj?.[key] ?? value;
    if (rawValue === true || rawValue === 'true') return true;
    if (rawValue === false || rawValue === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ enum: LOCATION_SORT_FIELDS, description: 'Field to sort locations by' })
  @IsOptional()
  @IsIn(LOCATION_SORT_FIELDS)
  sortBy?: LocationSortField;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], description: 'Location sort direction' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
