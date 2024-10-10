const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const admin = require('../middlewares/admin');

router.post('/test', userController.test);


// Public routes
// router.post('/register', userController.createUser);
// router.post('/login', userController.loginUser);
// router.post('/forgot-password', userController.forgotPassword);
// router.post('/reset-password', userController.resetPassword);

// Profile
router.get('/profile/all', userController.getAllUsers);
router.get('/profile/:userId', userController.getUser);
router.post('/register', userController.createUser);
router.post('/auth', userController.authUser);
router.put('/profile', userController.updateUser);
router.delete('/profile/:userId', admin, userController.deleteUser);

// Skills
router.get('/skills/:userId', userController.getUserSkills);
router.post('/skills', userController.addUserSkill);
router.delete('/skills/', userController.removeUserSkill);

// Experiences
// router.get('/experience', userController.getUserExperience);
// router.post('/experience', userController.addUserExperience);
// router.put('/experience/:experienceId', userController.updateUserExperience);
// router.delete('/experience/:experienceId', userController.removeUserExperience);

// Education
// router.get('/education', userController.getUserEducation);
// router.post('/education', userController.addUserEducation);
// router.put('/education/:educationId', userController.updateUserEducation);
// router.delete('/education/:educationId', userController.removeUserEducation);

// Saved-jobs
router.get('/savedJobs/:userId', userController.getSavedJobs);
router.post('/savedJobs/', userController.saveJob);
router.delete('/savedJobs/', userController.unsaveJob);

// Applied-jobs
router.get('/appliedJobs/:userId', userController.getAppliedJobs);
router.post('/appliedJobs/', userController.applyJob);
router.delete('/appliedJobs/', userController.withdrawApp);

module.exports = router;