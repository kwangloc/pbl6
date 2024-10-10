const bcrypt = require('bcrypt'); // hashing

const { User, validateUser } = require("../models/userModel");
const { isValidId, authUser } = require("../validations/validators");

// For testing
exports.test = async (req) => {
  throw new Error(`this is an error from testing`);
};

// Profile
exports.getAllUsers = async (req) => {
  return User.find().sort("-name");
};

exports.getUser = async (req) => {
  const { userId } = req.params;
  // invalid id
  if (!isValidId(userId)) {
    const error = new Error("Invalid userId");
    error.statusCode = 500;
    throw error;
  }
  // find by id
  const user = await User.findById(userId).select("-password");
  // not found id
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

exports.createUser = async (req) => {
  // 1. validate req.body
  const { err } = validateUser(req.body);
  if (err) throw new Error(JSON.stringify(err.details));
  try {
    // 2. check existing email
    let existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      const duplicateError = new Error("A user with this email already exists");
      duplicateError.statusCode = 409; // Conflict
      throw duplicateError;
    }
    // 3. create the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      ...req.body,
      password: hashedPassword
    });
    const savedUser = await newUser.save();
    const userWithoutPassword = savedUser.toObject();
    delete userWithoutPassword.password;
    return userWithoutPassword;
    // const user = await User.create(req.body);
    // return user;
  } catch (err) {
    throw new Error(`Failed to create user: ${err.message}`);
  }
};

exports.authUser = async (req) => {
  try {
    // 1. validate req.body
    const { err } = authUser(req.body);
    if (err) {
      const validationError = new Error(JSON.stringify(err.details));
      validationError.statusCode = 400;
      throw validationError;
    } 
    // 2. verify email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      throw err;
    }
    // 3. verify password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      throw err;
    }
    const token = user.generateAuthToken();
    // return token;
    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    };
  } catch (err) {
    throw new Error(`Authentication failed! ${err.message}`);
  }

}

exports.updateUser = async (req) => {
  // 1. validate req.body
  const { err } = validateUser(req.body);
  if (err) throw new Error(JSON.stringify(err.details));
  // 2. find user
  // val userId
  const { _id } = req.body;
  if (!isValidId(_id)) {
    const error = new Error("Invalid userId");
    error.statusCode = 500;
    throw error;
  }
  // 3. update the user
  try {
    const updateFields = {};
    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.location) updateFields.location = req.body.location;

    const user = await User.findByIdAndUpdate(
      _id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    // err: user not found
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return user;
  } catch (err) {
    throw new Error(`Failed to update user: ${err.message}`);
  }
};

exports.deleteUser = async (req) => {
  // auth admin


  const { userId } = req.params;
  // val userId
  if (!isValidId(userId)) {
    const error = new Error("Invalid userId");
    error.statusCode = 500;
    throw error;
  }

  try {
    let result = await User.findByIdAndDelete(userId);
    // if (!res) return res.status(404).send("The user id is invalid!");
    return result;
  } catch (err) {
    throw new Error(`Failed to delete user: ${err.message}`);
  }
};

// Skills
exports.getUserSkills = async (req) => {
  const { userId } = req.params;
  // val userId
  if (!isValidId(_id)) {
    const error = new Error("Invalid userId");
    error.statusCode = 500;
    throw error;
  }

  try {
    const user = await User.findById(userId).select("skills");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return user.skills;
  } catch (err) {
    throw new Error(`Failed to getUserSkills: ${err.message}`);
  }
};

exports.addUserSkill = async (req) => {
  // val userId
  const { userId } = req.body;
  if (!isValidId(userId)) {
    const error = new Error("Invalid userId");
    error.statusCode = 500;
    throw error;
  }

  // val skillId
  const { skill } = req.body;
  if (!isValidId(skill._id)) {
    const error = new Error("Invalid skillId");
    error.statusCode = 500;
    throw error;
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { skills: skill } },
      { new: true }
    ).select("skills");
    return user.skills;
  } catch (err) {
    throw new Error(`Failed to addUserSkill: ${err.message}`);
  }
};

exports.removeUserSkill = async (req) => {
  // val userId
  const { userId } = req.body;
  if (!isValidId(userId)) {
    const error = new Error("Invalid userId");
    error.statusCode = 500;
    throw error;
  }
  // val skillId
  const { skillId } = req.body;
  if (!isValidId(skillId)) {
    const error = new Error("Invalid skillId");
    error.statusCode = 500;
    throw error;
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      // { $pull: { skills: skillId } },
      { $pull: { skills: { _id: skillId } } },
      { new: true }
    ).select("skills");
    return user.skills;
  } catch (err) {
    throw new Error(`Failed to removeUserSkill: ${err.message}`);
  }
};

// Saved-jobs
exports.getSavedJobs = async (req) => {
  try {
    const { userId } = req.params;
    // val userId
    if (!isValidId(userId)) {
      const error = new Error("Invalid userId");
      error.statusCode = 500;
      throw error;
    }

    const user = await User.findById(userId).select("savedJobs");

    // err: user not found      
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return user.savedJobs;
  } catch (error) {
    throw new Error(`Failed to getSavedJobs: ${error.message}`);
  }
};

exports.saveJob = async (req) => {
  try {
    const { userId, jobToSave } = req.body;

    // val userId
    if (!isValidId(userId)) {
      const error = new Error("Invalid userId");
      error.statusCode = 400;
      throw error;
    }
    // val jobId
    if (!isValidId(jobToSave._id)) {
      const error = new Error("Invalid jobId");
      error.statusCode = 400;
      throw error;
    }

    // Check required fields
    const requiredFields = ['_id', 'title', 'due']; // Add other required fields
    for (const field of requiredFields) {
      if (!jobToSave[field]) {
        const error = new Error(`Missing required field: ${field}`);
        error.statusCode = 400;
        throw error;
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      // { $addToSet: { savedJobs: jobToSave } },
      {
        $addToSet: {
          savedJobs: {
            _id: jobToSave._id,
            title: jobToSave.title,
            due: jobToSave.due
          }
        }
      },
      { new: true }
    ).select("savedJobs");
    // err: user not found
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return user.savedJobs;
  } catch (error) {
    throw new Error(`Failed to saveJob: ${error.message}`);
  }
};

exports.unsaveJob = async (req) => {
  try {
    const { userId } = req.body;
    const { jobId } = req.body;

    // val userId
    if (!isValidId(userId)) {
      const error = new Error("Invalid userId");
      error.statusCode = 500;
      throw error;
    }
    // val jobId
    if (!isValidId(jobId)) {
      const error = new Error("Invalid jobId");
      error.statusCode = 500;
      throw error;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      // { $pull: { skills: skillId } },
      { $pull: { savedJobs: { _id: jobId } } },
      { new: true }
    ).select("savedJobs");

    // err: user not found
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return user.savedJobs;
  } catch (err) {
    throw new Error(`Failed to unsaveJob: ${err.message}`);
  }
};

// Applied-jobs
exports.getAppliedJobs = async (req) => {
  try {
    const { userId } = req.params;
    // val userId
    if (!isValidId(userId)) {
      const error = new Error("Invalid userId");
      error.statusCode = 500;
      throw error;
    }

    const user = await User.findById(userId).select("appliedJobs");

    // err: user not found      
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return user.savedJobs;
  } catch (error) {
    throw new Error(`Failed to getAppliedJobs: ${error.message}`);
  }
};

exports.applyJob = async (req) => {
  try {
    const { userId } = req.body;
    const { jobToApply } = req.body;

    // val userId
    if (!isValidId(userId)) {
      const error = new Error("Invalid userId");
      error.statusCode = 500;
      throw error;
    }
    // val jobId
    if (!isValidId(jobToApply._id)) {
      const error = new Error("Invalid jobId");
      error.statusCode = 500;
      throw error;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { appliedJobs: jobToApply } },
      { new: true }
    ).select("appliedJobs");
    // err: user not found
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return user.appliedJobs;
  } catch (error) {
    throw new Error(`Failed to applyJob: ${error.message}`);
  }
};

exports.withdrawApp = async (req) => {
  try {
    const { userId } = req.body;
    const { jobId } = req.body;

    // val userId
    if (!isValidId(userId)) {
      const error = new Error("Invalid userId");
      error.statusCode = 500;
      throw error;
    }
    // val jobId
    if (!isValidId(jobId)) {
      const error = new Error("Invalid jobId");
      error.statusCode = 500;
      throw error;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      // { $pull: { skills: skillId } },
      { $pull: { appliedJobs: { _id: jobId } } },
      { new: true }
    ).select("appliedJobs");

    // err: user not found
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return user.appliedJobs;
  } catch (err) {
    throw new Error(`Failed to withdrawApp: ${err.message}`);
  }
};

