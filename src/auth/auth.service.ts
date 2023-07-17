import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) { }

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
            // delete user.hash;
            // Return saved User
            return this.signToken(user.id, user.email);

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
        //Gaurd Condition
        if (!user) throw new ForbiddenException("Credentials Incorrect",);

        // compare password 
        const pwMatches = await argon.verify(user.hash, dto.password);

        // if password incorrect throw exception
        if (!pwMatches) throw new ForbiddenException("Credentials Incorrect",);

        // send back the user
        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email,
        }
        const secret = this.config.get("JWT_SECRET");
        const token = await this.jwt.signAsync(payload, {
            expiresIn: "15m",
            secret: secret
        });

        return {
            access_token: token
        }
    }
}
