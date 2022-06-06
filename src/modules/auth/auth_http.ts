import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import httpStatus from 'http-status'
import { validate, validateWithDB } from '../../helpers/validator'
import { verifyAccessToken, verifyRefreshToken } from '../../middleware/jwt'
import { Auth as Rules } from './auth_rules'
import { Auth as Handler } from './auth_handler'
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
});

const router = Router()

router.post('/v1/auth/users/sign-up', validate(Rules.signUp), validateWithDB(Rules.signUpWithDB), Handler.signUp)
router.post('/v1/auth/users/sign-in', apiLimiterSignIn, validate(Rules.signIn), Handler.signIn)
router.post('/v1/auth/users/sign-out', verifyAccessToken, validate(Rules.refreshToken), Handler.signOut)
router.post('/v1/auth/users/me', verifyAccessToken, Handler.me)
router.post('/v1/auth/users/refresh-token', verifyAccessToken, validate(Rules.refreshToken), Handler.refreshToken)
router.post('/v1/auth/users/forgot-password', validate(Rules.forgotPassword), Handler.forgotPassword)
router.post('/v1/auth/users/forgot-password/verify', verifyRefreshToken, Handler.forgotPasswordVerify)
router.post('/v1/auth/users/reset-password', verifyRefreshToken, validate(Rules.resetPassword), Handler.resetPassword)

export default router
