const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/user');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../Uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Upload image setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({
  storage,
 limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
  },
});

// Get Profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update Name and Photo
router.put('/profile', authMiddleware, upload.single('profilePhoto'), async (req, res) => {
  try {
    console.log('PUT /api/user/profile received:', {
      body: req.body,
      file: req.file,
      user: req.user,
    });

    const { name } = req.body;
    const profilePhoto = req.file ? req.file.filename : undefined;

    const updateData = {};
    if (name) updateData.name = name;
    if (profilePhoto) updateData.profilePhoto = profilePhoto;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({
      msg: 'Profile updated',
      profilePhoto: updatedUser.profilePhoto,
      name: updatedUser.name,
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ msg: `Multer error: ${err.message}` });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;


// JWT_SECRET=tfrjrdyhtrfyteyety
//  fywM3ArJF08qyQNI