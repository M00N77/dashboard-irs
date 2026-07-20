export interface FamilyMember {
  id: string
  personId: string
  relation: 'spouse' | 'child' | 'parent' | 'sibling'
  firstName: string
  lastName: string
  birthDate: string
}
