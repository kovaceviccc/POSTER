import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, from, of } from 'rxjs';
import { User } from 'src/user/user/models/user.interface';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService) { }

    generateJwt(payload: User): Observable<string> {
        return from(this.jwtService.signAsync({ user: payload }));
    }

    hashPassword(password: string): Observable<string> {
        return from<string>(bcrypt.hash(password, 12)) //12 rounds required for bcrypt to hash password
    }

    comparePasswords(newPassword: string, passwordHash: string): Observable<any | boolean> {
        return of<any | boolean>(bcrypt.compare(newPassword, passwordHash));
    }
}
