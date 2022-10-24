const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

//Mongoose pre middleware function for user model
// UserSchema.pre("save", function (next) {
//   const user = this;
//   if (this.isModified("password") || this.isNew) {
//     bcrypt.genSalt(10, function (saltError, salt) {
//       if (saltError) {
//         return next(saltError);
//       } else {
//         bcrypt.hash(user.password, salt, function (hashError, hashPassword) {
//           if (hashError) {
//             return next(hashError);
//           }
//           user.password = hashPassword;
//           next();
//         });
//       }
//     });
//   } else {
//     return next();
//   }
// });

// UserSchema.methods.comparePassword = function(password, callback) {
//     bcrypt.compare(password, this.password, function(error, isMatch) {
//         if(error) {
//             return callback(error)
//         } else {
//             callback(null, isMatch)
//         }
//     })
// }


//compile schema
let User = mongoose.model("User", UserSchema);

module.exports = User;
