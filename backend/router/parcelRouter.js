import express from 'express';
import { createParcel, deleteParcel, getParcel, searchParcel, updateParcel } from '../controller/parcelController.js';



const parcelRouter = express.Router();

parcelRouter.post('/', createParcel)
parcelRouter.get('/', getParcel);
parcelRouter.delete('/:parcelID', deleteParcel)
parcelRouter.put('/:parcelID', updateParcel);
parcelRouter.get('/:parcelID', searchParcel);

export default parcelRouter;