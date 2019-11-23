const ExpressBrute = require("express-brute");
const express = require("express");
const router = express.Router();

let store;

if (!process.env.environment || process.env.environment === "development") {
  store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
} else {
  // stores state with memcached
  store = new MemcachedStore(["127.0.0.1"], {
    prefix: "NoConflicts",
  });
}

const bruteforce = new ExpressBrute(store);

router.use("/auth", bruteforce.prevent, require("./auth"));

module.exports = router;
