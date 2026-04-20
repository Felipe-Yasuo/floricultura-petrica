import { Router } from 'express'
import express from 'express'
import { ProcessStripeWebhookController } from '../controllers/webhook/ProcessStripeWebhookController'

const webhookRoutes = Router()

const processStripeWebhookController = new ProcessStripeWebhookController()

webhookRoutes.post(
    '/stripe',
    express.raw({ type: 'application/json' }),
    processStripeWebhookController.handle
)

export default webhookRoutes