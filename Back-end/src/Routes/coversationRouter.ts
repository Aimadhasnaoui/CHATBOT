import express from "express";
const route = express.Router()
import {GetConversation,GetConversationById,DeletConversation,UpdateConversation} from '../Controllers/Conversation.controller'

route.get('/',GetConversation)
.get('/:id',GetConversationById)
.put('/:id',UpdateConversation)
.delete('/:id',DeletConversation)

export default route