export { };
const { Status } = require("../utils/enums");
import { Schema, model, ObjectId } from "mongoose";

interface IComments {
    demandeId: ObjectId;
    userId: ObjectId;
}

interface IDemande {
    category: string;
    mark: string;
    range: string;
    model: string;
    problem: string;
    imei: string;
    description: string;
    photo: string;
    status: typeof Status;
    clientId: any;
    deliveryId: any;
    technicianId: any;
    comments: IComments[];
}

const commentsSchema = new Schema<IComments>({
    demandeId: { type: Schema.Types.ObjectId, ref: 'Demande' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
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
        deliveryId: { type: Schema.Types.ObjectId, ref: 'User',},
        technicianId: { type: Schema.Types.ObjectId, ref: 'User',},
        comments: { type: [commentsSchema], },
    }, { timestamps: true, }
);



module.exports = model<IDemande>("Demande", demandeSchema);


