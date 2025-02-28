// export default class AdminModel {
//     constructor(employeeCode, name, password, email, phone, role) {
//       (this.name = name),
//         (this.password = password),
//         (this.employeeCode = employeeCode),
//         (this.email = email),
//         (this.phone = phone),
//         (this.role = role);
//     }
//   }

const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
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
    employeeCode: {
        type: String,
        required: true,
    },
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;