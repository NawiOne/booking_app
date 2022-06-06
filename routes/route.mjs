import { Router } from 'express';
// import incomeController from '../controllers/income.mjs';
import bookingController from '../controllers/booking.mjs'

const route = Router();

// route.get('/book', bookingController.findOne);
route.get('/book', bookingController.cancel)
route.post('/book', bookingController.transaction)

export default route;