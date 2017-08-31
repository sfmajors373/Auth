const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 11;

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;// mongoose.Promise is deprecated so we reassign it to regular Javascript promises
mongoose.connect('mongodb://localhost/users', { useMongoClient: true });

const UserSchema = new mongoose.Schema({
  // TODO: fill in this schema
  username: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  }
});

// UserSchema.pre('save', ((next) => {
//   const user = this;
  // only hash the password if it has been modified (or is new)
//   if (!user.isModified('password')) {
    // return;
//     next();
//   }
//   bcrypt.genSalt(SALT_WORK_FACTOR, ((err, salt) => {
//     if (err) {
      // return;
//       next(err);
//     }
//     bcrypt.hash(user.password, salt, ((error, hash) => {
//       if (error) {
        // return;
//         next(error);
//       }
//       user.password = hash;
//       next();
//     }));
//   }));
// }));

// UserSchema.methods.comparePassword = ((candidatePassword, cb) => {
//   bcrypt.compare(candidatePassword, this.password, ((err, isMatch) => {
//     if (err) {
//       return cb(err);
//     }
//     cb(null, isMatch);
//   }));
// });

module.exports = mongoose.model('User', UserSchema);
