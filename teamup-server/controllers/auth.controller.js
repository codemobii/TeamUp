// Import external modules

import User, { findOne, updateOne } from "../models/user.model";
import { sign } from "jsonwebtoken";
import { useEmail } from "../helpers/email.helper";

// Initiate email helper

const { sendEmail } = useEmail();

// Code generator

function makeRef(length) {
  var result = "";
  var characters = "123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// ************* MAIN CONTENTS ******************* //

// Register a new user

export function register(request, response) {
  var code = makeRef(4);
  const user = new User({
    email: request.body.email,
    password: request.body.email,
    fullname: request.body.fullname,
    resetCode: code,
    profilePic: request.body.profilePic,
  });
  user
    .save()
    .then(() => {
      response.status(200).send({
        message: "Account Created Successfully",
        error: false,
      });
      sendEmail(
        request.body.email,
        "Verify Your Account",
        `Hello ${request.body.fullname}. 
        <br />
        Kindly verify your TeamUp Account with the code below.
        <br /><br />
        <b><h1>${code}</h1></b>`
      );
    })
    .catch((er) => {
      response.status(500).send({
        message: "Error creating user",
        error: true,
        er,
      });
    });
}

// Verify code

export function verifyCode(request, response) {
  const code = request.body.resetCode;
  findOne({ resetCode: parseFloat(code) })
    .then((user) => {
      // return success response
      response.status(200).send({
        message: "Code verified successfully",
        user,
        error: false,
      });
      sendEmail(
        request.body.email,
        "Welcome to TeamUp",
        "Thank you for joining TeamUp. We wish that teamup helps you increase your productivity."
      );
    })
    .catch((e) => {
      response.status(404).send({
        message: "Invalid reset code supplied.",
        e,
        error: true,
      });
    });
}

// Login user here

export function login(request, response) {
  findOne({ email: request.body.email })
    .then((user) => {
      if (request.body.password !== user.password) {
        response.status(400).send({
          message: "Passwords does not match",
          status: false,
        });
      } else {
        //   create JWT token
        const token = sign(
          {
            userId: user._id,
            userEmail: user.email,
          },
          "RANDOM-TOKEN",
          { expiresIn: "4d" }
        );

        updateOne(
          { email: request.body.email },
          {
            token: token,
          },
          { new: true }
        )
          .then(() => {
            //   return success response
            response.status(200).send({
              message: "Login Successful",
              token,
              user,
              error: false,
            });
          })
          .catch(() => {
            response.status(404).send({
              message: "No account associated with this email",
              error: true,
              err,
            });
          });
      }
    })
    .catch((err) => {
      response.status(404).send({
        message: "No account associated with this email",
        error: true,
        err,
      });
    });
}

// Request for password reset

export function forgotPassword(request, response) {
  // Find user and update resetCode with the request body
  const code = makeRef(4);

  findOne({ email: request.body.email })
    .then((res) => {
      if (res) {
        updateOne(
          { email: request.body.email },
          {
            resetCode: code,
          },
          { new: true }
        )
          .then((user) => {
            console.log(request.body.email);
            if (!user) {
              return response.status(404).send({
                message: "No user associated with this email",
                error: true,
              });
            } else {
              response.status(200).send({
                message: "Reset code sent, check your email",
                error: false,
                code,
              });
              sendEmail(
                request.body.email,
                "Password Reset Code",
                `Your password reset code is <b>${code}<b/>`
              );
            }
          })
          .catch((err) => {
            if (err.kind === "ObjectId") {
              return response.status(404).send({
                message: "No user associated with this email",
                err,
                error: true,
              });
            }

            return response.status(500).send({
              message: "Error sending reset code",
              err,
              error: true,
            });
          });
      } else {
        return response.status(404).send({
          message: "No user associated with this email",
          error: true,
        });
      }
    })
    .catch((er) => {
      return response.status(404).send({
        message: "No user associated with this email",
        err,
        error: true,
      });
    });
}

// Change password

export function resetPassword(request, response) {
  const code = request.body.resetCode;
  updateOne(
    { resetCode: parseFloat(code) },
    {
      password: request.body.password,
    },
    { new: true }
  )
    .then((user) => {
      console.log(user);
      if (user.n === 0) {
        return response.status(404).send({
          message: "Code doesn't match",
          error: true,
        });
      } else {
        findOne({ resetCode: parseFloat(code) }).then((res) => {
          response.status(200).send({
            message: "Password reset was successful",
            user,
            error: false,
          });
          sendEmail(
            res.email,
            "Password Reset Successful",
            `Your password has been changed successfully`
          );
        });
      }
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return response.status(404).send({
          message: "No user associated with this email",
          err,
          error: true,
        });
      }

      return response.status(500).send({
        message: "Error sending resetting password",
        err,
        error: true,
      });
    });
}

// Logout bro

export function logout(request, response) {
  updateOne(
    { token: request.body.token },
    {
      token: null,
    },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        return response.status(404).send({
          message: "No user associated with this token",
          error: true,
        });
      } else {
        response.status(200).send({
          message: "Successfully logged out",
          error: false,
        });
      }
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return response.status(404).send({
          message: "No user associated with this email",
          err,
          error: true,
        });
      }

      return response.status(500).send({
        message: "Error sending reset code",
        err,
        error: true,
      });
    });
}
