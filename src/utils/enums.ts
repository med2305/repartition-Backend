export enum Role {
  Client = "client",
  Admin = "admin",
  Technician = "technician",
  Delivery = "delivery"
}

export enum Status {
  New = "Nouveau",
  TechnicianAssigned = "technicien affecté",
  AwaitReciever = "En attente de réception",
  AwaitRepair = "En attente de réparation",
  AwaitDelivery = "En attente de livraison",
  UnderDelivery = "En cours de livraison",
  Completed = "Terminé"
}