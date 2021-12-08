const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  const numCards = req.body.numCards;
  const cards = [];
  for (let i = 0; i < 10; i++) {
    const card = {};
    card.value = Math.floor(Math.random() * 13);
    card.color = Math.floor(Math.random() * 4);
    cards.push(card);
  }
  console.log("cards:", cards);
  res.json(cards);
  next();
});

module.exports = router;
