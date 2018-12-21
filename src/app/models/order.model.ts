export enum OrderStatus {
  Open = 0,
  Closed = 1,
}

export interface IOrder {
  address: string;
  date: Date;
  first_name: string;
  last_name: string;
  middle_name: string;
  mc_name: string;
  name: string;
  status: OrderStatus;
  time: string;
}
