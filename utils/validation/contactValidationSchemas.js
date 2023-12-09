const Joi = require('joi');

const addContact = Joi.object({
  name: Joi.string()
    .min(2)
    .max(30)
    .pattern(/^[A-Za-z\s-]+$/)
    .message(
      'The name must be between 2 and 30 characters and can contain only letters, spaces, and hyphens.'
    )
    .required(),
  number: Joi.string()
    // .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    // .message('The phone number should have the format (123) 123-1234.')
    .required(),

  favorite: Joi.boolean(),
});

const updateContact = Joi.object({
  name: Joi.string().min(2).max(30),
  // .pattern(/^[A-Za-z\s-]+$/)
  number: Joi.string(),
  // .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)

  favorite: Joi.boolean(),
}).or('name', 'phone');

const updateFavorite = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = {
  addContact,
  updateContact,
  updateFavorite,
};
