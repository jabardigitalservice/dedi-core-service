import * as core from 'express-serve-static-core'
import express from 'express'

export type Query = core.Query

export type Params = core.ParamsDictionary

export type Request<
  ReqBody = any,
  ReqQuery = Query,
  URLParams extends Params = core.ParamsDictionary
> = express.Request<URLParams, any, ReqBody, ReqQuery>
