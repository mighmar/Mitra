const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const router = express.Router();


router.post('/register', (req, res, next) => {
    Account.register(new Account({ username : req.body.username, email:req.body.email }), req.body.password, (err, account) => {
        if (err) {
          //return res.render('register', { error : err.message });
		  return res.json(JSON.stringify({registerStatus:"registerError"}));
        }

        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
					return res.json(JSON.stringify({registerStatus:"registerError"}));
                    //return next(err);
                }
				    return res.json(JSON.stringify({registerStatus:"registerSuccess"}));
            });
        });
    });
});

router.post('/login', passport.authenticate('local'), (req, res, next) => {
    req.session.save((err) => {
		res.setHeader('Content-Type', 'application/json');
        if (err) {
			res.json(JSON.stringify({loginStatus:"loginError"}));
            //return next(err);
        }
		res.json(JSON.stringify({loginStatus:"loginSuccess"}));
    });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
		res.json({logoutStatus:"success"});
    });
});

router.get('/ping', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(JSON.stringify({resp: "pong!"}));
});

module.exports = router;
