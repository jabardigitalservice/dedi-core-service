import { Router } from 'express';
import cache from '../../config/cache';
import { Partner as Handler } from './partner_handler';
import { Partner as Log } from './partner_log';

const router = Router();

router.get('/v1/partners', cache(), Log.findAll(), Handler.findAll)
router.get('/v1/partners/suggestion', Handler.suggestion)

export default router;
