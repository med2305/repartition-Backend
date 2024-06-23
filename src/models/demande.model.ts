export { };
const { Status } = require("../utils/enums");
import { Schema, model, ObjectId } from "mongoose";

interface IComments {
    userId: any;
    msg: string;
}

interface IDemande {
    category: string;
    mark: string;
    range: string;
    model: string;
    problem: string; // a supprimer
    imei: string;
    description: string;
    photo: string;
    status: typeof Status;
    clientId: any;
    arrivalDeliveryId: any;
    departDeliveryId: any;
    technicianId: any;
    comments: IComments[];
}

const commentsSchema = new Schema<IComments>({
    userId: { type: Schema.Types.ObjectId, ref: 'User' ,},
    msg: { type: String },

}, { timestamps: true, });

const demandeSchema = new Schema<IDemande>(
    {
        category: { type: String },
        mark: { type: String },
        range: { type: String },
        model: { type: String },
        problem: { type: String },
        imei: { type: String },
        description: { type: String },
        photo: { type: String },
        status: { type: String, enum: Object.values(Status) },
        clientId: { type: Schema.Types.ObjectId, ref: 'User',},
        arrivalDeliveryId: { type: Schema.Types.ObjectId, ref: 'User',},
        departDeliveryId: { type: Schema.Types.ObjectId, ref: 'User',},
        technicianId: { type: Schema.Types.ObjectId, ref: 'User',},
        comments: { type: [commentsSchema], },
    }, { timestamps: true, }
);



module.exports = model<IDemande>("Demande", demandeSchema);


