import * as core from 'express-serve-static-core'
import express from 'express'

export interface Query extends core.Query { }

export interface Params extends core.ParamsDictionary { }

export interface Request<ReqBody = any, ReqQuery = Query, URLParams extends Params = core.ParamsDictionary>

extends express.Request<URLParams, any, ReqBody, ReqQuery> {}
