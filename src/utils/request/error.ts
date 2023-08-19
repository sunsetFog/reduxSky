// @ts-nocheck
export class ResponseError extends Error {
  constructor(message, code, response = {}) {
    super(message);
    this.code = code;
    this.response = response;
  }
}

export const ErrorType = {
  network: '亲～网络开小差了,请您稍后重试',
  timeout: '亲！网络开小差了,请您稍后重试',
};
