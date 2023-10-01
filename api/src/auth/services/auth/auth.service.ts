import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { RefreshTokenEntity } from 'src/auth/models/refresh-token.entity';
import { RefreshToken } from 'src/auth/models/refresh-token.interface';
import { User } from 'src/user/user/models/user.interface';
import { Repository } from 'typeorm';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(RefreshTokenEntity) private readonly refreshTokenRepository: Repository<RefreshTokenEntity>) { }

    generateTokens(payload: User): Observable<{ jwtToken: string, refreshToken: string }> {

        var jwtToken: string = this.jwtService.sign({ user: payload });
        var refreshToken: string = this.generateRefreshToken();

        const refreshTokenEntity: RefreshTokenEntity = new RefreshTokenEntity();
        refreshTokenEntity.jwtToken = jwtToken;
        refreshTokenEntity.refreshToken = refreshToken;

        this.refreshTokenRepository.save(refreshTokenEntity);
        return of({ jwtToken, refreshToken });
    }

    refreshTokens(payload: User, jwtToken: string, refreshToken: string): Observable<{ jwtToken: string, refreshToken: string }> {

        return from(this.validateRefreshToken(jwtToken, refreshToken)).pipe(
            switchMap((valid) => {
                if (!valid) throw new UnauthorizedException();
                return from(this.generateTokens(payload)).pipe(
                    map((tokens) => {
                        return tokens;
                    })
                );
            })
        )
    }

    hashPassword(password: string): Observable<string> {
        return from<string>(bcrypt.hash(password, 12)) //12 rounds required for bcrypt to hash password
    }

    comparePasswords(newPassword: string, passwordHash: string): Observable<any | boolean> {
        return of<any | boolean>(bcrypt.compare(newPassword, passwordHash));
    }

    private generateRefreshToken(length: number = 64): string {
        const token = randomBytes(length).toString('hex');
        return token;
    }

    private validateRefreshToken(jwtToken: string, refreshToken: string): Observable<boolean> {

        return from(this.refreshTokenRepository.findOne({
            where: { refreshToken, jwtToken, revoked: false }
        })).pipe(
            map((result) => {
                if (result === null) return false;
                result.revoked = true;
                this.refreshTokenRepository.update(result.id, result);
                return result.expieryDate > new Date();
            })
        )

    }
}
