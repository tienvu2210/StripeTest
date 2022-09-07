window.onload = () => {
    (async () => {
        const stripe = Stripe('pk_test_D93Ngce94ySSEnAwz0m5hACp');
        const message = document.querySelector('#message')
        const paymentIntentRetrieved = await (await fetch('/pay')).json();
          
        // Pass the failed PaymentIntent to your client from your server
        stripe.confirmCardPayment(paymentIntentRetrieved.client_secret, {
            payment_method: paymentIntentRetrieved.last_payment_error.payment_method.id
        }).then(function(result) {
            if (result.error) {
                // Show error to your customer
                message.innerText = result.error.message;
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    message.innerText = "payment success!"
                } else {
                    message.innerText = "wtf?";
                }
            }
        });
    })();
};
