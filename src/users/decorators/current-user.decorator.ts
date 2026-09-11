import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JWTPayloadType } from '../../utils/types.js';
import { CURRENT_USER_KEY } from '../../utils/constants.js';

export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const payoad: JWTPayloadType = request[CURRENT_USER_KEY];
    return payoad;
  },
);
