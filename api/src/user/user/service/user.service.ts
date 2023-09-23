import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Like, Repository, UpdateResult } from 'typeorm';
import { User, UserRole } from '../models/user.interface';
import { Observable, catchError, from, map, of, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { RegisterRequestDTO } from '../models/DTO/Request/RegisterRequestDTO';
import * as fs from 'fs/promises'; // 
import { FailedToRemoveResourceException } from 'src/Errors/FailedToRemoveResourceException';


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private authService: AuthService
    ) { }

    create(request: RegisterRequestDTO): Observable<boolean> {
        return this.authService.hashPassword(request.password).pipe(
            switchMap((passwordHash: string) => {

                const newUser = this.MapUserDTO(request, passwordHash);
                return from(this.userRepository.save(newUser)).pipe(
                    map((user: User) => {
                        const { passwordHash, ...result } = user;
                        return true;
                    }),
                    catchError((error: string) => {
                        return throwError(() => new Error(error));
                    })
                );
            })
        )
    }

    findOne(id: string): Observable<User> {
        return from(this.userRepository.findOne({ where: { id }, relations: ['jobsCreated', 'applications'] })).pipe(
            map((user: User) => {

                if (user === null) return null;

                const { passwordHash, ...result } = user;
                return result;
            })
        )
    }

    findAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {

                users.forEach(u => {
                    delete u.passwordHash;
                });
                return users
            })
        );
    }

    paginateFilterByUserName(options: IPaginationOptions, userName: string): Observable<Pagination<User>> {

        return from(this.userRepository.findAndCount(
            {
                skip: (Number(options.page) * Number(options.limit)) || 0,
                take: Number(options.limit) || 10,
                order: {
                    id: "ASC",
                },
                select: ['id', 'firstName', 'lastName', 'email', 'userName', 'role'],
                where: [
                    { userName: Like(`%${userName}%`) }
                ]
            }
        )).pipe(
            map(([users, totalUsers]) => {
                const userPageable: Pagination<User> = {
                    items: users,
                    links: {
                        first: options.route + `?limit=${options.limit}`,
                        previous: options.route + ``,
                        next: options.route + `?limit=${options.limit}&page=${Number(options.page) + 1}`,
                        last: options.route + `?limit=${options.limit}&page=${Math.ceil(totalUsers / Number(options.page))}`
                    },
                    meta: {
                        currentPage: Number(options.page),
                        itemCount: users.length,
                        itemsPerPage: Number(options.limit),
                        totalItems: totalUsers,
                        totalPages: Math.ceil(totalUsers / Number(options.limit))
                    }
                };
                return userPageable;
            })
        )
    }

    paginate(options: IPaginationOptions): Observable<Pagination<User>> {

        return from(paginate<User>(this.userRepository, options)).pipe(
            map((usersPageable: Pagination<User>) => {
                usersPageable.items.forEach(element => {
                    delete element.passwordHash;
                });
                return usersPageable;
            })
        )
    }

    deleteOne(id: string): Observable<any> {
        return from(this.userRepository.delete(id));
    }

    updateOne(id: string, user: User): Observable<any> {
        delete user.email;
        delete user.passwordHash;
        delete user.role;
        return from(this.userRepository.update(id, user));
    }

    updateRoleOfUser(id: string, user: User): Observable<any> {
        return from(this.userRepository.update(id, user))
    }

    login(email: string, password: string): Observable<string> {
        return this.validateUser(email, password).pipe(
            switchMap((user: User) => {

                if (user) {
                    return this.authService.generateJwt(user);
                } else {
                    return "Invalid credentials";
                }
            })
        )
    }

    validateUser(email: string, password: string): Observable<User> {
        return this.findByEmail(email).pipe(
            switchMap((user: User) => this.authService.comparePasswords(password, user.passwordHash).pipe(
                map((valid: boolean) => {

                    if (valid) {
                        const { passwordHash, ...result } = user;
                        return result;
                    } else {
                        throw Error("invalid token");
                    }
                })
            ))
        )
    }

    findByEmail(email: string): Observable<User> {
        return from(this.userRepository.findOne({ where: { email } }));
    }

    deleteProfileImage(imageName: string, imagePath: string = './uploads/profileimages'): Observable<boolean> {

        const fullImagePath: string = `${imagePath}/${imageName}`;

        if (!this.imageExists(fullImagePath)) return of(true);

        console.log(fullImagePath);
        try {
            fs.unlink(fullImagePath)
            return of(true);
        } catch (error) {
            throw new FailedToRemoveResourceException(`Failed to remove serve resource: ${fullImagePath}\n Error: ${error}`);
        }
    }

    


    private MapUserDTO(request: RegisterRequestDTO, passwordHash: string): UserEntity {
        const newUser = new UserEntity();
        newUser.firstName = request.firstName;
        newUser.lastName = request.lastName;
        newUser.userName = request.userName;
        newUser.email = request.email;
        newUser.role = UserRole.USER;
        newUser.passwordHash = passwordHash;
        return newUser;
    }

    private imageExists(imagePath: string): boolean {
        try {
            fs.access(imagePath, fs.constants.F_OK);
            return true;
        } catch (err) {
            return false;
        }
    }

}
