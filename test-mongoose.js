const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  customFieldValues: [{ fieldId: String, value: String }]
});

const Model = mongoose.model('Test', schema);

const doc = new Model({ customFieldValues: '[{"fieldId":"abc","value":"def"}]' });

const error = doc.validateSync();
console.log(error.errors['customFieldValues'].message);
