import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { getUser, User } from '../../helpers/rbac'
import { TestimonialEntity } from './testimonial_entity'
import { TestimonialService } from './testimonial_service'

export class TestimonialHandler {
  private testimonialService: TestimonialService

  constructor(testimonialService: TestimonialService = new TestimonialService()) {
    this.testimonialService = testimonialService
  }

  public findAll = async (
    req: Request<never, never, never, TestimonialEntity.RequestQuery>,
    res: Response
  ) => {
    const result: TestimonialEntity.ResponseFindAll = await this.testimonialService.findAll(
      req.query
    )

    return res.status(httpStatus.OK).json(result)
  }

  public store = async (req: Request, res: Response) => {
    const user: User = getUser(req)
    const { body } = req
    await this.testimonialService.store(body, user)
    return res.status(httpStatus.CREATED).json({ message: 'CREATED' })
  }

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      const { id } = req.params
      await this.testimonialService.update(body, id)
      return res.status(httpStatus.OK).json({ message: 'UPDATED' })
    } catch (error) {
      return next(error)
    }
  }

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.testimonialService.destroy(id)
      return res.status(httpStatus.OK).json({ message: 'DELETED' })
    } catch (error) {
      return next(error)
    }
  }

  public findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const result: TestimonialEntity.ResponseFindById = await this.testimonialService.findById(id)
      return res.status(httpStatus.OK).json(result)
    } catch (error) {
      return next(error)
    }
  }
}
