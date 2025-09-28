// This is your test secret API key.
const cors = require("cors");

const stripe = require("stripe")(
  "sk_test_51S3Lr9RP6vsCMpjYVOsW23NsAsqAOcHGJKMslXnpYWNb52gXCWcZAk59nylgD6Hs3qQxny6K8j3vvwXbqRS4k30S00KBnsLAHP",
  {
    apiVersion: "2025-08-27.basil",
  }
);
const express = require("express");
const app = express();
app.use(cors());

app.use(express.static("public"));

const YOUR_DOMAIN = "https://cursos.clubinfinitychess.com";
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  const { productId, price } = req.body;
  const session = await stripe.checkout.sessions.create({
    ui_mode: "custom",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: productId, // lo que quieras mostrar
          },
          unit_amount: price * 100,
        },
        quantity: 1,
      },
    ],

    mode: "payment",
    return_url: `${YOUR_DOMAIN}/complete?session_id={CHECKOUT_SESSION_ID}`,
  });

  res.send({ clientSecret: session.client_secret });
});

app.get("/session-status", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(
    req.query.session_id,
    { expand: ["payment_intent"] }
  );

  res.send({
    status: session.status,
    payment_status: session.payment_status,
    payment_intent_id: session.payment_intent.id,
    payment_intent_status: session.payment_intent.status,
  });
});
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
