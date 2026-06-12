import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationDocument } from '../../infra/database/schemas/location.schema';
import { CreateLocationDto, UpdateLocationDto } from '@grow-fitness/shared-schemas';
import { AuditService } from '../audit/audit.service';
import { ErrorCode } from '../../common/enums/error-codes.enum';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import type { LocationSortField } from './dto/get-locations-query.dto';

interface LocationListFilters {
  search?: string;
  isActive?: boolean;
  sortBy?: LocationSortField;
  sortOrder?: 'asc' | 'desc';
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildLocationSort(
  sortBy?: LocationSortField,
  sortOrder?: 'asc' | 'desc'
): Record<string, 1 | -1> {
  if (!sortBy) {
    return { name: 1, _id: 1 };
  }

  const direction = sortOrder === 'desc' ? -1 : 1;
  return { [sortBy]: direction, _id: 1 };
}

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
    private auditService: AuditService
  ) {}

  async findAll(pagination: PaginationDto, filters: LocationListFilters = {}) {
    const query: Record<string, unknown> = {};

    if (filters.search?.trim()) {
      const escapedSearch = escapeRegExp(filters.search.trim());
      query.$or = [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { address: { $regex: escapedSearch, $options: 'i' } },
        { placeUrl: { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const skip = (pagination.page - 1) * pagination.limit;
    const sort = buildLocationSort(filters.sortBy, filters.sortOrder);
    const [data, total] = await Promise.all([
      this.locationModel.find(query).sort(sort).skip(skip).limit(pagination.limit).exec(),
      this.locationModel.countDocuments(query).exec(),
    ]);

    return new PaginatedResponseDto(data, total, pagination.page, pagination.limit);
  }

  async findById(id: string) {
    const location = await this.locationModel.findById(id).exec();

    if (!location) {
      throw new NotFoundException({
        errorCode: ErrorCode.LOCATION_NOT_FOUND,
        message: 'Location not found',
      });
    }

    return location;
  }

  async create(createLocationDto: CreateLocationDto, actorId: string) {
    const location = new this.locationModel(createLocationDto);
    await location.save();

    await this.auditService.log({
      actorId,
      action: 'CREATE_LOCATION',
      entityType: 'Location',
      entityId: location._id.toString(),
      metadata: createLocationDto,
    });

    return location;
  }

  async update(id: string, updateLocationDto: UpdateLocationDto, actorId: string) {
    const location = await this.locationModel.findById(id).exec();

    if (!location) {
      throw new NotFoundException({
        errorCode: ErrorCode.LOCATION_NOT_FOUND,
        message: 'Location not found',
      });
    }

    Object.assign(location, updateLocationDto);
    await location.save();

    await this.auditService.log({
      actorId,
      action: 'UPDATE_LOCATION',
      entityType: 'Location',
      entityId: id,
      metadata: updateLocationDto,
    });

    return location;
  }

  async delete(id: string, actorId: string) {
    const location = await this.locationModel.findById(id).exec();

    if (!location) {
      throw new NotFoundException({
        errorCode: ErrorCode.LOCATION_NOT_FOUND,
        message: 'Location not found',
      });
    }

    await this.locationModel.deleteOne({ _id: id }).exec();

    await this.auditService.log({
      actorId,
      action: 'DELETE_LOCATION',
      entityType: 'Location',
      entityId: id,
    });

    return { message: 'Location deleted successfully' };
  }
}
