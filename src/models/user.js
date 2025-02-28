// export default class UserModel {
//     constructor(
//       name,
//       password,
//       about,
//       employeeCode,
//       role,
//       department,
//       email,
//       phone,
//       abbv
//     ) {
//       (this.name = name),
//         (this.password = password),
//         (this.about = about),
//         (this.employeeCode = employeeCode),
//         (this.role = role),
//         (this.department = department),
//         (this.email = email),
//         (this.phone = phone),
//         (this.abbreviation = abbv);
//     }
//   }
const mongoose = require('mongoose');

const userSchema = new mongoose.schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true,
    },
    employeeCode: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    abbreviation: {
        type: String,
        required: true,
    },

});

const User = mongoose.model("User", userSchema);

module.exports = User;
