const userService = require('../services/userService');

exports.test = async (req, res, next) => {
  try {
    const result = await userService.test(req);
    console.log(typeof result);
    res.status(200).json(result);
  } catch (err) {
    next(err);
    // res.status(500).json({
    //   status: 'error',
    //   message: 'An error occurred while testing!',
    //   details: err.message
    // });
  }
};

// Profile
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers(req);
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const users = await userService.getUser(req);
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req);
    // console.log(typeof user);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.authUser = async (req, res, next) => {
  try {
    const result = await userService.authUser(req);
    // Set token in header
    res.setHeader('Authorization', `Bearer ${result.token}`);
    // Send user info in body
    res.status(200).json({
      message: 'Authentication successful',
      user: result.user
    });
  } catch (err) {
    next(err);
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// Skills
exports.getUserSkills = async (req, res, next) => {
  try {
    const skills = await userService.getUserSkills(req);
    res.status(200).json(skills);
  } catch (error) {
    next(err);
  }
};

exports.addUserSkill = async (req, res, next) => {
  try {
    const skills = await userService.addUserSkill(req);
    res.status(200).json(skills);
  } catch (error) {
    next(err);
  }
};

exports.removeUserSkill = async (req, res, next) => {
  try {
    const result = await userService.removeUserSkill(req);
    res.status(200).json(result);
  } catch (error) {
    next(err);
  }
};

// Experience
// Education

// Saved-jobs
exports.getSavedJobs = async (req, res, next) => {
  try {
    const result = await userService.getSavedJobs(req);
    res.status(200).json(result);
  } catch (error) {
    next(err);
  }
};

exports.saveJob = async (req, res, next) => {
  try {
    const result = await userService.saveJob(req);
    res.status(200).json(result);
  } catch (error) {
    next(err);
  }
};

exports.unsaveJob = async (req, res, next) => {
  try {
    const result = await userService.unsaveJob(req);
    res.status(200).json(result);
  } catch (error) {
    next(err);
  }
};

// Applied-jobs

exports.getAppliedJobs = async (req, res, next) => {
  try {
    const result = await userService.getAppliedJobs(req);
    res.status(200).json(result);
  } catch (error) {
    next(err);
  }
};

exports.applyJob = async (req, res, next) => {
  try {
    const result = await userService.applyJob(req);
    res.status(200).json(result);
  } catch (error) {
    next(err);
  }
};

exports.withdrawApp = async (req, res, next) => {
  try {
    const result = await userService.withdrawApp(req);
    res.status(200).json(result);
  } catch (error) {
    next(err);
  }
};


