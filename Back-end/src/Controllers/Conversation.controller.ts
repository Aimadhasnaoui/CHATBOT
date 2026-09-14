import { FirstMenu, intents } from './../utils/chatbotIntents';
import { prisma } from "../config/db.config";
import { Request, Response } from "express";
export const CreatConversation = async (req: Request, res: Response)=>{
  const NewConversation = await prisma.conversation.create({
    data:{
       userId: "11", Title: "Nouvelle conversation" ,
    }
  })
  const Messageresponse = intents.find((i) => i.topic === "Intro")
  res.status(200).json({
    message:'conversation a été créer avec succès',
    conversationId:NewConversation?.id,
    menu:FirstMenu,
    response:Messageresponse?.response
  })
}


export const GetConversation = async (req: Request, res: Response) => {
  const AllConversation = await prisma.conversation.findMany({
    orderBy: { startedAt: "desc" },
  });
  res.status(200).json(AllConversation);
};
export const GetConversationById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const Conversation = await prisma.conversation.findUnique({
    where: { id },
    include: { exchanges: true },
  });
  res.status(200).json(Conversation);
};
export const UpdateConversation = async (req: Request, res: Response) => {
  const data = req.body.Title;
  const id = req.params.id as string;
  const Conversation = await prisma.conversation.update({
    where: { id },
    data: {
    Title:data,
    },
  });
  res.status(200).json({
    message: "Mise à jour du nom avec succès",
  });
};
export const DeletConversation = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const Conversation = await prisma.conversation.delete({
    where: { id },
  });
  res.status(200).json({
    message: "Conversation supprimée avec succès",
  });
};
