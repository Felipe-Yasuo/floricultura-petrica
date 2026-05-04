export class AppError extends Error {
    public readonly statusCode: number
    public readonly isOperational: boolean
    public readonly details?: unknown

    constructor(message: string, statusCode = 400, details?: unknown) {
        super(message)
        this.name = this.constructor.name
        this.statusCode = statusCode
        this.isOperational = true
        this.details = details
        Object.setPrototypeOf(this, new.target.prototype)
        Error.captureStackTrace?.(this, this.constructor)
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(`${resource} not found`, 404)
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401)
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403)
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409)
    }
}