export interface Appeal {
  id: string
  personId: string
  source: 'phone' | 'email' | 'portal' | 'paper' | 'in-person'
  category: string
  registeredAt: string
  status: 'new' | 'in-progress' | 'resolved' | 'rejected' | 'redirected'
  responsible: string
  dueDate: string
  resolutionText?: string
  attachments: string[]
}
