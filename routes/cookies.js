// const { checkExtraAccess } = require('../middlewares/auth');

//checks for ?ref=special_promo in the url and if it is there it gives the user extra access for the session

const path = require('path');
const express = require('express');
const router = express.Router();

// app.get('/cookies', (req, res) => {
// //   if (req.query.ref === 'special_promo') {
//     console.log("extra access granted");
//     req.session.extraAccess = true; // Sets the flag
// //     return res.redirect('/autherized-content');
// //   }
// //   console.log("no extra access");
// //   res.redirect('/');
//     res.redirect(path.join(__dirname, "..", "views", "interactPages", "lights.html")); 
// });


// 1. The Security Middleware Function
function checkExtraAccess(req, res, next) {
  if (req.session && req.session.extraAccess) {
    console.log("extra session access let them proceed");
    return next();
  }
  res.status(403).sendFile(path.join(__dirname, "..", "views", "403.html"));
}

// 2. The Entry Route (Sets the session flag)
router.get('', (req, res) => {
    console.log("session flag set to true <3");
    req.session.extraAccess = true; 
    res.status(403).sendFile(path.join(__dirname, "..", "views", "403.html")); // Redirects to the protected route below
});

// // 3. The Protected Route    //already in server.js, so not needed/here/right now
// router.get('/', checkExtraAccess, (req, res) => {
//   res.send('Welcome to the all-inclusive cookies club! frfr');
// });

// 4. Export the router so app.js can use it
module.exports = router;

