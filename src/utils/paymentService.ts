import { Request, Response } from "express";
import { RequestType } from "../controller/interfaces.ts";
import { IPaymentInterface } from "../interfaces/doctorSlot.js";

const stripe = require('stripe')('sk_test_51Np894SEixsZ4knFgXnSgfwowqNNIFKweTSrkkfd5lFH4XYuVgWNkScisVzhbOmkToUIT00km3q32Uej3EvVNSTw00YVlxh9ls');

const DOMAIN = 'http://localhost:3000'
const paymentService = async ( req: Request, res: Response,doctorData: IPaymentInterface) => {
  try {
    console.log(doctorData,'from payment');

    const customer=await stripe.customers.create({
      metadata:{
        regFee:doctorData.RegisterFee
      }
    })
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            unit_amount: doctorData.RegisterFee*100,
            product_data: {
              name: 'Doctor Registration',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${DOMAIN}/payment-success`,
      cancel_url: `${DOMAIN}/payment-failed`,
    });

   return session.url
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
};


export default paymentService