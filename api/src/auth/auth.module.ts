import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth/auth.service';
import { RolesGuard } from './guards/roles-guard';
import { JwtAuthGuard } from './guards/jwt-guard';
import { JwtStrategy } from './guards/jwt-strategy';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './models/refresh-token.entity';

@Module({
    imports: [
        forwardRef(() => UserModule),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get("JWT_SECRET"),
                signOptions: { expiresIn: '10000s' }
            })
        }),
        TypeOrmModule.forFeature([RefreshTokenEntity])
    ],
    providers: [AuthService, RolesGuard, JwtAuthGuard, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule { }
