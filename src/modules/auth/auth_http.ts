import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { validate } from '../../helpers/validator'
import { verifyAccessToken } from '../../middleware/jwt'
import { Auth as Rules } from './auth_rules'
import { Auth as Handler } from './auth_handler'
import config from '../../config'

const apiLimiterSignIn = rateLimit({
  windowMs: Number(config.get('api.limiter.time.signin', 300000)), // Default time signin 5 minutes
  max: Number(config.get('api.limiter.max.signin', 3)),
});

const router = Router()

router.post('/v1/auth/users/sign-up', validate(Rules.signUp), Handler.signUp)
router.post('/v1/auth/users/sign-in', apiLimiterSignIn, validate(Rules.signIn), Handler.signIn)
router.post('/v1/auth/users/sign-out', verifyAccessToken, validate(Rules.refreshToken), Handler.signOut)
router.post('/v1/auth/users/me', verifyAccessToken, Handler.me)
router.post('/v1/auth/users/refresh-token', verifyAccessToken, validate(Rules.refreshToken), Handler.refreshToken)
router.post('/v1/auth/users/forgot-password', validate(Rules.forgotPassword), Handler.forgotPassword)
router.post('/v1/auth/users/forgot-password/verify', verifyAccessToken, Handler.forgotPasswordVerify)
router.post('/v1/auth/users/reset-password', verifyAccessToken, validate(Rules.resetPassword), Handler.resetPassword)

export default router
