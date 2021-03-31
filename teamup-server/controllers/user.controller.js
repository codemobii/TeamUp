// Import modules
import { findById, findByIdAndUpdate } from "../models/user.model";

// Get user
export function get(request, response) {
  findById(request.params.userId)
    .then((data) => {
      console.log(request.query);
      //   return success response
      response.status(200).send({
        data,
        error: false,
      });
    })
    .catch((err) => {
      response.status(500).send({
        message: "Some error occurred while retrieving user.",
        err,
        error: true,
      });
    });
}

// Update profile
export function update(request, response) {
  findById(request.params.userId)
    .then((data) => {
      findByIdAndUpdate(
        request.params.userId,
        {
          email: request.body.email || data.email,
          password: request.body.password || data.password,
          fullname: request.body.fullname || data.fullname,
          role: request.body.role || data.role,
          profilePic: request.body.profilePic || data.profilePic,
        },
        { new: true }
      )
        .then((user) => {
          //   return success response
          response.status(200).send({
            message: "Profile updated successfully",
            user,
            error: false,
          });
        })
        .catch((err) => {
          if (err.kind === "ObjectId") {
            return response.status(404).send({
              message: "Profile not found with id " + request.params.userId,
              err,
              error: true,
            });
          }
          return response.status(500).send({
            message: "Error updating Profile with id " + request.params.userId,
            err,
            error: true,
          });
        });
    })
    .catch((err) => {
      response.status(500).send({
        message: "Some error occurred while retrieving user.",
        err,
        error: true,
      });
    });
}

// Upload Profile Picture
