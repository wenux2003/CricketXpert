const express = require('express');
const router = express.Router();
const groundController = require('../controllers/groundController');

router.post('/', groundController.createGround);
router.get('/', groundController.getAllGrounds);
router.get('/:id', groundController.getGroundById);
router.put('/:id', groundController.updateGround);
router.delete('/:id', groundController.deleteGround);

module.exports = router;
