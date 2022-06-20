import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { AuthEntity } from './auth_entity'
import { AuthService } from './auth_service'
import { AuthLog } from './auth_log'

export class AuthHandler {
  private authService: AuthService

  constructor(authService: AuthService = new AuthService()) {
    this.authService = authService
  }

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      await this.authService.signUp(body)
      res.status(httpStatus.CREATED).json({ message: 'CREATED' })
    } catch (error) {
      next(error)
    }
  }

  public signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      const result: AuthEntity.ResponseJWT = await this.authService.signIn(body)
      AuthLog.signIn(body)
      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      const result: AuthEntity.ResponseJWT = await this.authService.refreshToken(body)
      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  public signOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      await this.authService.signOut(body)
      res.status(httpStatus.OK).json({ message: 'LOGOUT' })
    } catch (error) {
      next(error)
    }
  }

  public me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result: AuthEntity.ResponseMe = await this.authService.me(req)
      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      const result: AuthEntity.ResponseForgotPassword = await this.authService.forgotPassword(body)
      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  public forgotPasswordVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result: AuthEntity.ResponseForgotPasswordVerify =
        await this.authService.forgotPasswordVerify(req)
      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      await this.authService.resetPassword(req, body)
      res.status(httpStatus.OK).json({ message: 'UPDATED' })
    } catch (error) {
      next(error)
    }
  }
}
