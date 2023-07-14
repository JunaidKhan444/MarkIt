import { ForbiddenException, Injectable } from "@nestjs/common";
import { User, Bookmark } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }
    async signup(dto: AuthDto) {
        // Generate Password Hash
        const hash = await argon.hash(dto.password);
        // Save new User in db
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
                // Dirty way send user without HASH
                // Return only these fields
                // select: {
                //     id: true,
                //     email: true,
                //     createdAt: true
                // }
            })
            // Dirty way send user without HASH
            // Use Transformers instead
            delete user.hash;
            // Return saved User
            return user;

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new ForbiddenException("Credentials Taken");
                }
            }
            throw error;
        }
    }

    async signin(dto: AuthDto) {
        // find the user
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        })
        // if user does not exist throw exception 
        //Gaurd Condition
        if (!user) throw new ForbiddenException("Credentials Incorrect",);

        // compare password 
        const pwMatches = await argon.verify(user.hash, dto.password);

        // if password incorrect throw exception
        if (!pwMatches) throw new ForbiddenException("Credentials Incorrect",);

        // send back the user
        delete user.hash;
        return user;
    }
}
