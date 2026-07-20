export interface HousingRecord {
  id: number
  personId: number
  address: string
  type: 'apartment' | 'house' | 'other'
  area: number
  ownershipType: 'owned' | 'rented' | 'social'
}
