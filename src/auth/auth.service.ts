import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {

    signup() {
        return { msg: "I am Sign Up" };
    }

    signin() {
        return { msg: "I am Sign In" };
    }
}
