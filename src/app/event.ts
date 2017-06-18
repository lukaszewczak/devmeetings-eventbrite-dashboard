export interface Attendee {
  resource_uri: string,
  id: number,
  changed: string,
  created: string,
  quantity: number,
  status: string,
  checked_in: boolean,
  cancelled: boolean,
  guestlist_id: number,
  invited_by: number,
  order_id: number

}

export interface SalesHistory {
  date: string,
  attendees: number,
  attendeesList: Attendee[]
}

export interface Event {
  name: string,
  id: string,
  url: string,
  start: Date,
  end: Date,
  daysLeft: number,
  daysFromSalesStart: number,
  quantity_total: number,
  quantity_sold: number,
  sales_start: string,
  sales_end: string,
  salesDays: number,
  salesDaysLeft: number,
  salesHistory: SalesHistory[]
}
