import { IsEnum, IsOptional, IsPositive, IsIn, IsNumber } from 'class-validator';
import { TaskStatus, Priority } from '@prisma/client';
import { Type } from 'class-transformer';

export class QueryTaskDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsIn(['createdAt', 'dueDate', 'priority', 'title'])
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';
}
