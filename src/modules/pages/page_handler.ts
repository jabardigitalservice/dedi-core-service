import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { getUser, User } from '../../helpers/rbac'
import { PageEntity } from './page_entity'
import { PageService } from './page_service'

export class PageHandler {
  private pageService: PageService

  constructor(pageService: PageService = new PageService()) {
    this.pageService = pageService
  }

  public findAll = async (
    req: Request<never, never, never, PageEntity.RequestQuery>,
    res: Response,
    next: NextFunction
  ) => {
    const result: PageEntity.ResponseFindAll = await this.pageService.findAll(req.query)

    res.status(httpStatus.OK).json(result)
  }

  public findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const result: PageEntity.ResponseFindById = await this.pageService.findById(id)
      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  public store = async (req: Request, res: Response) => {
    const user: User = getUser(req)
    const { body } = req
    await this.pageService.store(body, user)
    res.status(httpStatus.CREATED).json({ message: 'CREATED' })
  }

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.pageService.destroy(id)
      res.status(httpStatus.OK).json({ message: 'DELETED' })
    } catch (error) {
      next(error)
    }
  }

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { body } = req
      await this.pageService.update(body, id)
      res.status(httpStatus.OK).json({ message: 'UPDATED' })
    } catch (error) {
      next(error)
    }
  }
}
