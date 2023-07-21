import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateBookmarkDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    title: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, })
    description?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    link: string;
}
