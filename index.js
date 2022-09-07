require('dotenv').config();

const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);
const path = require('path');

app.get('/secret', async (req, res) => {
  // const customer = await stripe.customers.create();
  const intent = await stripe.setupIntents.create({
    payment_method_data: {
        type: "card",
        card: {
            number: 4000000000003220,
            exp_month: 5,
            exp_year: 2030,
            cvc: 123
        }
    },
    confirm: true,
    usage: "off_session",

    customer: 'cus_MOFfIoez3VIjnq',
  });

  res.json(intent);
});

app.get('/create_setup_intent', async (req, res) => {
  const customer = await stripe.customers.create();
  const intent = await stripe.setupIntents.create({
    payment_method_data: {
        type: "card",
        card: {
            number: 4000000000003220,
            exp_month: 5,
            exp_year: 2030,
            cvc: 123
        }
    },
    confirm: true,
    usage: "off_session",

    customer: customer.id,
  });

  res.json(intent);
});

app.get('/payment_intent', async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1999,
    currency: 'usd',
    // automatic_payment_methods: {enabled: true},
    payment_method_data: {
      type: "card",
      card: {
          number: 4000000000003220,
          exp_month: 5,
          exp_year: 2030,
          cvc: 123
      }
    },
    setup_future_usage: "off_session"
  });

  res.json(paymentIntent);
});

app.get('/payment_methods', async (req, res) => {
  const paymentMethods = await stripe.paymentMethods.list({
    customer: 'cus_MOFfIoez3VIjnq',
    type: 'card',
  });

  res.json(paymentMethods);
});

app.get('/pay', async (req, res) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: 'cus_MOFfIoez3VIjnq',
      type: 'card',
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: 'usd',
      customer: 'cus_MOFfIoez3VIjnq',
      // payment_method: paymentMethods.data[1].id,
      payment_method_data: {
        type: "card",
        card: {
            number: 4000000000003220,
            exp_month: 5,
            exp_year: 2030,
            cvc: 123
        }
      },
      payment_method_options: {
        card: {
          mit_exemption: {
            network_transaction_id: "seti_1LfSZ2IWsXy36PUS38iguv2h",
            ds_transaction_id: 4321
          }
        }
      },
      off_session: true,
      confirm: true,
    });

    res.json(paymentIntent);
  } catch (err) {
    // Error code will be authentication_required if authentication is needed
    console.log('Error code is: ', err.code);
    const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(err.raw.payment_intent.id);
    console.log('PI retrieved: ', paymentIntentRetrieved.id);

    console.log(stripe.confirmCardPayment);
    res.json(paymentIntentRetrieved);
  }
});

app.use('/', express.static(path.join(__dirname, 'public')))

app.listen(3000, () => {
  console.log('Running on port 3000');
});