import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { Auth as Entity } from './auth_entity'
import { Auth as Service } from './auth_service'
import { Auth as Log } from './auth_log'

export namespace Auth {
  export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      await Service.signUp(body)
      res.status(httpStatus.CREATED).json({ message: 'CREATED' })
    } catch (error) {
      next(error)
    }
  }

  export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      const result: Entity.ResponseJWT = await Service.signIn(body)
      Log.signIn(body)
      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      const result: Entity.ResponseJWT = await Service.refreshToken(body)
      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  export const signOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      await Service.signOut(body)
      res.status(httpStatus.OK).json({ message: 'LOGOUT' })
    } catch (error) {
      next(error)
    }
  }

  export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      const result: Entity.ResponseForgotPassword = await Service.forgotPassword(body)
      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  export const forgotPasswordVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result: Entity.ResponseForgotPasswordVerify = await Service.forgotPasswordVerify(req)
      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      await Service.resetPassword(req, body)
      res.status(httpStatus.OK).json({ message: 'UPDATED' })
    } catch (error) {
      next(error)
    }
  }
}
