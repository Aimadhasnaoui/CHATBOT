import express from 'express'
import { ResponseLogic } from '../Controllers/Response.controller'
const router = express.Router()

router.get('/response',ResponseLogic)

export default router