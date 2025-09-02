import express from 'express';
import { createParcel, deleteParcel, emailParcelDetails, emailUpdatedParcelDetails, getParcel, searchParcel, updateParcel } from '../controller/parcelController.js';



const parcelRouter = express.Router();

parcelRouter.post('/', createParcel)
parcelRouter.get('/', getParcel);
parcelRouter.delete('/:parcelID', deleteParcel)
parcelRouter.put('/:parcelID', updateParcel);
parcelRouter.get('/:parcelID', searchParcel);
parcelRouter.post('/send-email',emailParcelDetails)
parcelRouter.post('/send-update-email',emailUpdatedParcelDetails)

export default parcelRouter;