import express from 'express'
import { ResponseLogic } from '../Controllers/Response.controller'
const router = express.Router()

router.post('/',ResponseLogic)

export default router