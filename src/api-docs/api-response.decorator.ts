import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

export enum CommonResponse {
  UNAUTHORIZED_SESSION = 'COMMON_RESPONSE:UNAUTHORIZED_SESSION',
  FORBIDDEN_SESSION = 'COMMON_RESPONSE:FORBIDDEN_SESSION',
  WRONG_FIELD_FORMATS = 'COMMON_RESPONSE:WRONG_FIELD_FORMATS',
}

const CommonResponseMap: Record<CommonResponse, ApiResponseOptions> = {
  [CommonResponse.UNAUTHORIZED_SESSION]: {
    status: HttpStatus.UNAUTHORIZED,
    description: 'The session is not authorized.',
  },
  [CommonResponse.FORBIDDEN_SESSION]: {
    status: HttpStatus.FORBIDDEN,
    description: "The session isn't valid, and get rejected.",
  },
  [CommonResponse.WRONG_FIELD_FORMATS]: {
    status: HttpStatus.BAD_REQUEST,
    description: "Wrong field's formats.",
  },
};

// Helper decorator to shorten usual common ApiResponse decorators
export function CommonApiResponse(...commonResponses: CommonResponse[]) {
  return applyDecorators(
    ...commonResponses.map((commonResponse) =>
      ApiResponse(CommonResponseMap[commonResponse]),
    ),
  );
}
