export interface FamilyMember {
  id: number
  personId: number
  relation: 'spouse' | 'child' | 'parent' | 'sibling'
  firstName: string
  lastName: string
  birthDate: string
}
