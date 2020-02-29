export interface NoteItem {
  userId: string
  itemId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
