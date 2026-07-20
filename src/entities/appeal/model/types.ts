export interface Appeal {
  id: number
  personId: number
  source: 'phone' | 'email' | 'portal' | 'paper' | 'in-person'
  category: string
  registeredAt: string
  status: 'new' | 'in-progress' | 'resolved' | 'rejected' | 'redirected'
  responsible: string
  dueDate: string
  resolutionText?: string
  attachments: string[]
}
