import bcrypt from 'bcryptjs';
import jwt    from 'jsonwebtoken';
import type { User, AuthCredentialsDto, AuthResponseDto } from '@shared/types/auth.types';
import { UserRepository } from '../repositories/user.repository';
import { SERVER_CONSTANTS } from '../config/constants';
import { ENV } from '../config/env';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

interface JwtPayload { userId: number; email: string; }

export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}

  async register(dto: AuthCredentialsDto): Promise<AuthResponseDto> {
    if (this.userRepo.findByEmail(dto.email)) {
      throw new AppError(409, 'Пользователь с таким email уже существует');
    }
    const passwordHash = await bcrypt.hash(dto.password, SERVER_CONSTANTS.BCRYPT_SALT_ROUNDS);
    const user = this.userRepo.create(dto.email, passwordHash);
    return { token: this.signToken(user), user };
  }

  async login(dto: AuthCredentialsDto): Promise<AuthResponseDto> {
    const INVALID = 'Неверный email или пароль';
    const found   = this.userRepo.findByEmail(dto.email);
    if (!found) throw new AppError(401, INVALID);
    const ok = await bcrypt.compare(dto.password, found.passwordHash);
    if (!ok)  throw new AppError(401, INVALID);
    const { passwordHash: _, ...user } = found;
    return { token: this.signToken(user), user };
  }

  verifyToken(token: string): User {
    try {
      const payload = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
      const user    = this.userRepo.findById(payload.userId);
      if (!user) throw new AppError(401, 'Пользователь не найден');
      return user;
    } catch {
      throw new AppError(401, 'Недействительный токен');
    }
  }

  private signToken(user: User): string {
    return jwt.sign(
      { userId: user.id, email: user.email } satisfies JwtPayload,
      ENV.JWT_SECRET,
      { expiresIn: SERVER_CONSTANTS.JWT_EXPIRES_IN },
    );
  }
}
