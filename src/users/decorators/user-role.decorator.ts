import { SetMetadata } from '@nestjs/common';
import { UserType } from '../../utils/enum.js';

export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles);
