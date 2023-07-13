import { Injectable } from "@nestjs/common";
import { User, Bookmark } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }
    signup() {
        return { msg: "I am Sign Up" };
    }

    signin() {
        return { msg: "I am Sign In" };
    }
}
