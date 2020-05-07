import axios from 'axios';
import { showAlert } from './alert';
var stripe = Stripe('pk_test_ZsT1Yh4lVmt0b3jTr9A70Jae00IavP7mYF');

export const payment=async tourId=>{
    console.log('payment call');
    try{
        const res=await axios(`http://localhost:2000/api/v1/booking/checkout-session/${tourId}`);
        console.log(res);
        stripe.redirectToCheckout({
            sessionId:res.data.session.id
        })

    }catch(err){
        console.log(`errir is`,err)
        showAlert('error',err);
    }
}
