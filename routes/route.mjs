import { Router } from 'express';
import incomeController from '../controllers/booking.mjs'

const route = Router();

route.get('/book', incomeController.findOne);
route.post('/book', incomeController.create)

export default route;