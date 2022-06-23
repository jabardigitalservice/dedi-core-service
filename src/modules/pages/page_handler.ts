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
    res: Response
  ) => {
    const result: PageEntity.ResponseFindAll = await this.pageService.findAll(req.query)

    return res.status(httpStatus.OK).json(result)
  }

  public findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const result: PageEntity.ResponseFindById = await this.pageService.findById(id)
      return res.status(httpStatus.OK).json(result)
    } catch (error) {
      return next(error)
    }
  }

  public store = async (req: Request, res: Response) => {
    const user: User = getUser(req)
    const { body } = req
    await this.pageService.store(body, user)
    return res.status(httpStatus.CREATED).json({ message: 'CREATED' })
  }

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.pageService.destroy(id)
      return res.status(httpStatus.OK).json({ message: 'DELETED' })
    } catch (error) {
      return next(error)
    }
  }

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { body } = req
      await this.pageService.update(body, id)
      return res.status(httpStatus.OK).json({ message: 'UPDATED' })
    } catch (error) {
      return next(error)
    }
  }
}
