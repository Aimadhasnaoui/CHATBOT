import express from "express";
const route = express.Router()
import {GetConversation,CreatConversation,GetConversationById,DeletConversation,UpdateConversation} from '../Controllers/Conversation.controller'

route.get('/',GetConversation)
.post('/',CreatConversation)
.get('/:id',GetConversationById)
.put('/:id',UpdateConversation)
.delete('/:id',DeletConversation)

export default route