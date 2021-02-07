const express = require("express"),
    apiController = require("../controllers/api"),
    apiControllerItems = require("../controllers/items"),
    router = express.Router();


router.post('/register', apiController.register);
router.post('/login', apiController.login);
router.get('/me', apiController.me);

router.post('/items', apiControllerItems.items);
router.delete('/items/:id', apiControllerItems.delereItems);
router.put('/items/:id', apiControllerItems.updateItem);
router.get('/items/:id', apiControllerItems.getItemById);
router.get('/items', apiControllerItems.getItemList);

router.post('/items/:id/images', apiControllerItems.setItemImg);



module.exports = router;