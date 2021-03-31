// Import Modules
const { useEmail } = require("../helpers/email.helper");
const cardModel = require("../models/card.model");
const userModel = require("../models/user.model");

// Initiate email helper
const { sendEmail } = useEmail();

// Create card
exports.create = (request, response) => {
  const course = new cardModel({
    title: request.body.title,
    user: request.body.user,
    manager: request.body.manager,
    members: request.body.members,
  });

  course
    .save()
    .then((data) => {
      //   return success response
      response.status(200).send({
        message: "Card created successfully",
        data,
      });
    })
    .catch((err) => {
      response.status(500).send({
        message: "Some error occurred while creating the Course.",
        err,
      });
    });
};

// Update Card
exports.update = (request, response) => {
  cardModel
    .findByIdAndUpdate(
      request.params.cardId,
      {
        title: request.body.title,
      },
      { new: true }
    )
    .then((course) => {
      //   return success response
      response.status(200).send({
        message: "Card updated successfully",
        course,
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return response.status(404).send({
          message: "Card not found with id " + request.params.courseId,
          err,
        });
      }
      return response.status(500).send({
        message: "Error updating card with id " + request.params.courseId,
        err,
      });
    });
};

// Get card
exports.get = (request, response) => {
  cardModel
    .find({ members: request.query.institute })
    .populate("members")
    .then((cards) => {
      //   return success response
      response.status(200).send({
        message: "Successfully",
        cards,
      });
    })
    .catch((err) => {
      response.status(500).send({
        message: "Some error occurred while retrieving courses.",
        err,
      });
    });
};

// Invite member
exports.invite = (req, res) => {
  userModel
    .findById(req.body.sender)
    .then((user) => {
      sendEmail(
        req.body.reciever,
        "Teamup Invite",
        `Hello dear. 
        <br />
        Your friend ${user.fullname} invited you to join their todo list to get work faster. 
        <br /><br />
        Please review in your Teamup App`
      );
      res.status(200).send({
        message: "Invite sent successfully",
        error: false,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error retrieving user with id " + req.body.sender,
        err,
        error: true,
      });
    });
};

// Accept Invite
exports.accept = (request, response) => {
  cardModel
    .findByIdAndUpdate(
      request.params.cardId,
      { $push: { members: request.body.user } },
      { new: true }
    )
    .then(() => {
      //   return success response
      response.status(200).send({
        message: "You have joined the card",
        error: false,
      });
    })
    .catch((err) => {
      return response.status(500).send({
        message: "Error updating course with id " + request.params.courseId,
        err,
        error: true,
      });
    });
};

// Assign manager
