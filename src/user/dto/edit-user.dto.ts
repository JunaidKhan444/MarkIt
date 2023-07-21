import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsOptional,
    IsString,
} from 'class-validator';

export class EditUserDto {
    @IsEmail()
    @IsOptional()
    @ApiProperty({ required: false, })
    email?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, })
    firstName?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, })
    lastName?: string;
}
