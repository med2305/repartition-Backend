export enum Role {
  Client = "client",
  Admin = "admin",
  Technician = "technician",
  Delivery = "delivery"
}

export enum Status {
  AwaitReciever = "En attente de réception",
  AwaitRepair = "En attente de réparation",
  UnderRepair = "En cours de réparation",
  UnderDelivery = "En cours de livraison",
  Completed = "Termminé"
}