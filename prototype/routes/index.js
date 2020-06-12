const express = require('express');
const router = express.Router();

const userRouter = require('user');
const orgRouter = require('org');
const adminRouter = require('admin');

router.use('/user', userRouter);
router.use('/org', orgRouter);
router.use('/admin', adminRouter);

router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;