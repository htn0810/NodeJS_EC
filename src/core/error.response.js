'use strict';

const {ReasonPhrases, StatusCodes} = require("../utils/httpStatusCode")

const StatusCode = {
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  CONFLICT: 409,
}

const ReasonStatusCode = {
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: "Not Found",
  BAD_REQUEST: "Bad Request",
  CONFLICT: 'Conflict'
}

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
    super(message, statusCode)
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.BAD_REQUEST, statusCode = StatusCode.BAD_REQUEST) {
    super(message, statusCode)
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
    super(message, statusCode)
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError
}