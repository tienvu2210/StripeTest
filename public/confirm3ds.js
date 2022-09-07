window.onload = () => {
    (async () => {
        const message = document.querySelector('#message');

        const stripe = Stripe('pk_test_D93Ngce94ySSEnAwz0m5hACp');
        const response = await fetch('/create_setup_intent');
        const {client_secret: clientSecret} = await response.json();

        stripe.confirmCardSetup(clientSecret, {})
        // stripe.confirmSetupIntent(clientSecret, {})
        // stripe.setupIntents.confirm(
        //     'seti_1LfWPPIWsXy36PUSQWGRCcjF',
        //     // {payment_method: 'pm_card_visa'}
        // )
        .then(function(result) {
            if (result.error) {
                // Show error to your customer
                message.innerText = result.error.message;
            } else {
                if (result.setupIntent.status === 'succeeded') {
                    message.innerText = `setup ${result.setupIntent.id} success!`
                } else {
                    message.innerText = "wtf?";
                }
            }
        });
    })();
};
