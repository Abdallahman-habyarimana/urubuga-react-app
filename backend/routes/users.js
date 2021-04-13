const express = require("express");
const bcrypt = require('bcrypt')
const router = express.Router();
const User = require('../models/User')

// @desc update
router.put("/:id", async(req, res) => {
    if(req.body.userId === req.params.id || req.user.isAdmin){
        if(req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (err) {
                return res.status(500).json(err)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body})
            res.status(200).json("Account Updated")
        } catch (err) {
            return res.status(401).json("Update not allowed")
        }
    } else {
        return res.status(401).json("Update not allowed")
    }
})
// @desc delete
router.delete("/:id", async(req, res) => {
    if(req.body.userId === req.params.id || req.user.isAdmin){
        try {
            const user = await User.findByIdAndDelete({ _id: req.params.id})
            res.status(200).json("Account has been deleted")
        } catch (err) {
            return res.status(401).json("You can't delete")
        }
    } else {
        return res.status(401).json("Delete not allowed")
    }
})
// @desc get a user
router.get("/:id", async(req, res)=> {
    try {
        const user = await User.findById(req.params.id);
        const { password, updatedAt, ...other} = user._doc
        res.status(200).json(other)
    } catch (err) {
        res.status(500).json(err)
    }
})
// @desc follow user
router.put("/:id/follow", async(req, res) => {
    if(req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if(!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId }})
                await currentUser.updateOne({ $push: { followings: req.params.id }})
                res.status(200).json("user has been followed")
            } else {
                res.status(403).json("Already follow this user")
            }
        } catch (err) {
            
        }
    } else {
        res.status(403).json("You can't follow yourself")
    }
})

// @desc unfollow user
router.put("/:id/unfollow", async(req, res) => {
    if(req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if(user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId }})
                await currentUser.updateOne({ $pull: { followings: req.params.id }})
                res.status(200).json("user has been unfollowed")
            } else {
                res.status(403).json("Already unfollow this user")
            }
        } catch (err) {
            
        }
    } else {
        res.status(403).json("You can't unfollow yourself")
    }
})

module.exports = router