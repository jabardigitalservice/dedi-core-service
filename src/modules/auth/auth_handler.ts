import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { AuthEntity } from './auth_entity'
import { AuthService } from './auth_service'
import { AuthLog } from './auth_log'
import { getUser, User } from '../../helpers/rbac'

export class AuthHandler {
  private authService: AuthService

  constructor(authService: AuthService = new AuthService()) {
    this.authService = authService
  }

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      await this.authService.signUp(body)
      return res.status(httpStatus.CREATED).json({ message: 'CREATED' })
    } catch (error) {
      return next(error)
    }
  }

  public signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      const result: AuthEntity.ResponseJWT = await this.authService.signIn(body)
      AuthLog.signIn(body)
      return res.status(httpStatus.OK).json(result)
    } catch (error) {
      return next(error)
    }
  }

  public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      const result: AuthEntity.ResponseJWT = await this.authService.refreshToken(body)
      return res.status(httpStatus.OK).json(result)
    } catch (error) {
      return next(error)
    }
  }

  public signOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      await this.authService.signOut(body)
      return res.status(httpStatus.OK).json({ message: 'LOGOUT' })
    } catch (error) {
      return next(error)
    }
  }

  public me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: User = getUser(req)
      const result: AuthEntity.ResponseMe = await this.authService.me(user)
      return res.status(httpStatus.OK).json(result)
    } catch (error) {
      return next(error)
    }
  }

  public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      const result: AuthEntity.ResponseForgotPassword = await this.authService.forgotPassword(body)
      return res.status(httpStatus.OK).json(result)
    } catch (error) {
      return next(error)
    }
  }

  public forgotPasswordVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result: AuthEntity.ResponseForgotPasswordVerify =
        await this.authService.forgotPasswordVerify(req)
      return res.status(httpStatus.OK).json(result)
    } catch (error) {
      return next(error)
    }
  }

  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      await this.authService.resetPassword(req, body)
      return res.status(httpStatus.OK).json({ message: 'UPDATED' })
    } catch (error) {
      return next(error)
    }
  }
}
