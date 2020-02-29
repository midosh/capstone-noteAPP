import * as uuid from 'uuid'

import { NoteItem } from '../models/NoteItem'
import { NoteAccess } from '../dataLayer/noteAccess'
import { CreateNoteItemRequest } from '../requests/CreateNoteItemRequest'
import { UpdateNoteItemRequest } from '../requests/UpdateNoteItemRequest'
import { parseUserId } from '../auth/utils'

const noteAccess = new NoteAccess()

export async function getNotes(jwtToken: string): Promise<NoteItem[]> {
  const userId = parseUserId(jwtToken)
  return noteAccess.getNotes(userId)
}

export async function deleteNote(jwtToken: string,itemId: string){
  const userId = parseUserId(jwtToken)
return noteAccess.deleteNote(userId,itemId)

}

export async function generateUploadUrl(jwtToken: string,itemId:string){
  const userId = parseUserId(jwtToken)
return noteAccess.generateUploadUrl(userId,itemId)
}

export async function updateNote(jwtToken: string,itemReq:UpdateNoteItemRequest, itemId: string){
  const userId = parseUserId(jwtToken)
 return noteAccess.updateNote(userId,itemReq, itemId)
}

export async function createNote(itemReq: CreateNoteItemRequest,jwtToken: string): Promise<NoteItem> {

  const itemId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await noteAccess.createNote({
    itemId: itemId,
    userId: userId,
    createdAt: Date.now.toString(),
    ...itemReq,
    done: false });
}


