import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

// Controller Level
@UseGuards(JwtGuard)
@Controller("users")
export class UserController {
    // Route Level
    // @UseGuards(JwtGuard)
    @Get("me")
    getMe(@GetUser() user: User) {
        return user;
    }
}
