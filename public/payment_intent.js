window.onload = () => {
    (async () => {
        const stripe = Stripe('pk_test_D93Ngce94ySSEnAwz0m5hACp');
        
        const response = await fetch('/payment_intent');
        const {client_secret: clientSecret} = await response.json();
    
        const options = {
            // clientSecret: 'seti_1LfSZ2IWsXy36PUS38iguv2h_secret_MOF3JlqVNsOr5Cd49C3YsVyTsnRXTe1',
            clientSecret,
            // Fully customizable with appearance API.
            appearance: {/*...*/},
          };
          
        // Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 2
        const elements = stripe.elements(options);
        
        // Create and mount the Payment Element
        const paymentElement = elements.create('payment');
        paymentElement.mount('#payment-element');
    
        const form = document.getElementById('payment-form');
    
        form.addEventListener('submit', async (event) => {
          event.preventDefault();
        
          const {error} = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
              return_url: 'http://localhost:3000/setup_complete.html',
            }
          });
        
          if (error) {
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Show error to your customer (for example, payment
            // details incomplete)
            const messageContainer = document.querySelector('#error-message');
            messageContainer.textContent = error.message;
          } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
          }
        });
    })();
};
