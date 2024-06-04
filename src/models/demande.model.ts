export { };
const { Status } = require("../utils/enums");
import { Document, Schema, model, ObjectId } from "mongoose";

interface IComments {
    demandeId: ObjectId;
    userId: ObjectId;
}

interface IDemande extends Omit<Document, 'model'> {
    category: string;
    mark: string;
    range: string;
    model: string;
    problem: string;
    imei: string;
    description: string;
    photos: string;
    status: typeof Status;
    clientId: any;
    comments: IComments[];
}

const commentsSchema = new Schema<IComments>({
    demandeId: { type: Schema.Types.ObjectId, ref: 'Demande', required: true, },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, },
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
        photos: { type: String },
        status: { type: String, enum: Object.values(Status) },
        clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, },
        comments: { type: [commentsSchema], },
    }, { timestamps: true, }
);



module.exports = model<IDemande>("Demande", demandeSchema);
module.exports = model<IComments>('avis', commentsSchema);


