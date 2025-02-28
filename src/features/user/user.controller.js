// import UserModel from "./user.model.js";
// import jwt from "jsonwebtoken";
// import userRepository from "./user.repository.js";
// import bcrypt from "bcrypt";
// export default class UserController {
//   constructor() {
//     this.userRepo = new userRepository();
//   }
//   async signUp(req, res) {
//     // console.log(req.body);

//     const result = await this.userRepo.findByEmployeeCode(
//       req.body.employeeCode
//     );
//     if (result.status == "ok" && result.data != null) {
//       return res.send({
//         status: "err",
//         message: "Employee Already Exist",
//         data: {},
//       });
//       // return res.status(404).send("Employee Already Exist ");
//     } else {
//       const { name, password, about, employeeCode, role } = req.body;
//       const hashedPassword = await bcrypt.hash(password, 12);
//       const user = new UserModel(
//         name,
//         hashedPassword,
//         about,
//         employeeCode,
//         role
//       );
//       const sign = await this.userRepo.signUp(user);
//       if (sign.status == "ok") {
//         const token = jwt.sign(
//           {
//             userID: user._id,
//             employeeCode: user.employeeCode,
//           },
//           process.env.JWT_SECRET_TEACHER,
//           {
//             expiresIn: "10h",
//           }
//         );

//         res.send({
//           status: "ok",
//           message: "Success",
//           data: {
//             name: user.name,
//             employeeCode: user.employeeCode,
//             authorization: token,
//           },
//         });
//       } else {
//         res.send({
//           status: "err",
//           message: "Something Went wrong!",
//           data: {},
//         });
//       }
//     }
//   }

//   async signIn(req, res) {
//     const result = await this.userRepo.findByEmployeeCode(
//       req.body.employeeCode
//     );
//     if (result.status == "ok" && result.data == null) {
//       return res.send({
//         status: "err",
//         message: "Employee doesn't exist",
//         data: {},
//       });
//     }
//     // create token
//     else {
//       // comparing password with the hashed password
//       const output = await bcrypt.compare(
//         req.body.password,
//         result.data.password
//       );
//       if (output) {
//         const token = jwt.sign(
//           {
//             userID: result.id,
//             userEmail: result.email,
//           },
//           process.env.JWT_SECRET_TEACHER,
//           {
//             expiresIn: "10h",
//           }
//         );
//         //send token

//         return res.send({
//           status: "ok",
//           message: "Success",
//           data: {
//             name: result.name,
//             employeeCode: result.employeeCode,
//             authorization: token,
//           },
//         });
//       } else {
//         return res.send({
//           status: "err",
//           message: "Incorrect Credentials!",
//           data: {},
//         });
//         // return res.status(400).send("Incorrect Credentials.");
//       }
//     }
//   }
// }
