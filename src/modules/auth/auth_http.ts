import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import httpStatus from 'http-status'
import { validate, validateWithDB } from '../../helpers/validator'
import { verifyAccessToken, verifyRefreshToken } from '../../middleware/jwt'
import { AuthRules } from './auth_rules'
import { AuthHandler } from './auth_handler'
import config from '../../config'
import lang from '../../lang'

const apiLimiterSignIn = rateLimit({
  windowMs: Number(config.get('api.limiter.time.signin', 5)) * 60 * 1000, // Default time signin 5 minutes
  max: Number(config.get('api.limiter.max.signin', 3)),
  handler: (request, response, next) => {
    const { resetTime } = request.rateLimit
    response.status(httpStatus.TOO_MANY_REQUESTS).json({
      error: lang.__('auth.signin.failed.limiter'),
      reset_time: resetTime,
    })
  },
  skipSuccessfulRequests: true,
})

const authHandler = new AuthHandler()

const router = Router()

router.post(
  '/v1/auth/users/sign-up',
  validate(AuthRules.signUp),
  validateWithDB(AuthRules.signUpWithDB),
  authHandler.signUp
)
router.post(
  '/v1/auth/users/sign-in',
  apiLimiterSignIn,
  validate(AuthRules.signIn),
  authHandler.signIn
)
router.post(
  '/v1/auth/users/sign-out',
  verifyAccessToken,
  validate(AuthRules.refreshToken),
  authHandler.signOut
)
router.post('/v1/auth/users/me', verifyAccessToken, authHandler.me)
router.post(
  '/v1/auth/users/refresh-token',
  verifyAccessToken,
  validate(AuthRules.refreshToken),
  authHandler.refreshToken
)
router.post(
  '/v1/auth/users/forgot-password',
  validate(AuthRules.forgotPassword),
  authHandler.forgotPassword
)
router.post(
  '/v1/auth/users/forgot-password/verify',
  verifyRefreshToken,
  authHandler.forgotPasswordVerify
)
router.post(
  '/v1/auth/users/reset-password',
  verifyRefreshToken,
  validate(AuthRules.resetPassword),
  authHandler.resetPassword
)

export default router
