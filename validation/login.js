const Validator = require('validator');
const validText = require('./valid-text');

router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
  
    if (!isValid) {
      return res.status(400).json(errors);
    }
  
    const email = req.body.email;
    const password = req.body.password;
  
    User.findOne({email})
      .then(user => {
        if (!user) {
          errors.email = 'User not found';
          return res.status(404).json(errors);
        }
  
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (isMatch) {
              res.json({msg: 'Success'});
            } else {
              errors.password = 'Incorrect password'
              return res.status(400).json(errors);
            }
          })
      })
  })

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = validText(data.email) ? data.email : '';
  data.password = validText(data.password) ? data.password : '';

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};