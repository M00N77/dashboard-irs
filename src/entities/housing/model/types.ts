export interface HousingRecord {
  id: string
  personId: string
  address: string
  type: 'apartment' | 'house' | 'other'
  area: number
  ownershipType: 'owned' | 'rented' | 'social'
}
