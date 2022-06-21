import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { UserEntity } from './user_entity'
import { UserService } from './user_service'

export class UserHandler {
  private userService: UserService

  constructor(userService: UserService = new UserService()) {
    this.userService = userService
  }

  public findAll = async (
    req: Request<never, never, never, UserEntity.RequestQuery>,
    res: Response,
    next: NextFunction
  ) => {
    const result: UserEntity.ResponseFindAll = await this.userService.findAll(req.query)

    res.status(httpStatus.OK).json(result)
  }

  public findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const result: UserEntity.ResponseFindById = await this.userService.findById(id)
      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.userService.destroy(id)
      res.status(httpStatus.OK).json({ message: 'DELETED' })
    } catch (error) {
      next(error)
    }
  }

  public store = async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req
    await this.userService.store(body)
    res.status(httpStatus.CREATED).json({ message: 'CREATED' })
  }

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      const { id } = req.params
      await this.userService.update(body, id)
      res.status(httpStatus.OK).json({ message: 'UPDATED' })
    } catch (error) {
      next(error)
    }
  }

  public updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      const { id } = req.params
      await this.userService.updateStatus(body, id)
      res.status(httpStatus.OK).json({ message: 'UPDATED' })
    } catch (error) {
      next(error)
    }
  }
}
