import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

export const validateSchema =
    (schema: z.ZodType) =>
        async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            try {
                await schema.parseAsync({
                    body: req.body,
                    params: req.params,
                    query: req.query,
                })
                next()
            } catch (error) {
                if (error instanceof z.ZodError) {
                    res.status(400).json({
                        error: 'Erro de validação',
                        details: error.issues.map(issue => ({
                            campo: issue.path.slice(1).join('.'),
                            mensagem: issue.message
                        }))
                    })
                    return
                }

                res.status(500).json({ error: 'Erro interno do servidor' })
            }
        }