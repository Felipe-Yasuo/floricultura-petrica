import bcrypt from 'bcryptjs'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'

interface CreateUserRequest {
    name: string
    email: string
    password: string
}

export class CreateUserService {
    async execute({ name, email, password }: CreateUserRequest) {
        const userExists = await prismaClient.user.findUnique({
            where: { email }
        })

        if (userExists) {
            throw new AppError('Email já cadastrado', 409)
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prismaClient.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        })

        return user
    }
}