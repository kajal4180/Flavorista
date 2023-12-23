const Joi = require('joi');

module.exports.recepieSchema = Joi.object({
    recepie:Joi.object({
        title: Joi.string().required(),
        // image:Joi.string().required(),
        ingridients: Joi.string().required(),
        instructions: Joi.string().required(),
        description:Joi.string().required(),
        cookTime:Joi.number().required()
    }).required(),
    deleteImages:Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    }).required()

})
