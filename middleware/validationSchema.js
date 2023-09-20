const {body} = require('express-validator');

const validationSchema = () => {
    return [ /* from express-validator */
        body('title')
            .notEmpty().withMessage("title is require")
            .isLength({min:2}).withMessage("title at least 2 chars"),
        body('price')
            .notEmpty().withMessage("price is require")
    ];
};

module.exports = {
    validationSchema
};