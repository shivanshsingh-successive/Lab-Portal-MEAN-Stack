const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user");
const Subject = require("../models/subject");
const authorize = require("../middlewares/auth");
const multer = require('multer');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

let fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'image/jpeg')
        cb(null, true)
    else cb(null, false)
}

let upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// Sign-up
router.post("/register-user", (req, res, next) => {
    User.findOne({ username: req.body.username }, function (err, user) {
        if (err)
            res.status(501).send(err);
        if (user) {
            return res.status(201).send(user);
        } else {
            var subjects = [
                { subjname: 'Data Compression', subjcode: 'RCS087' },
                { subjname: 'Machine Learning', subjcode: 'ROE083' },
                { subjname: 'Image Processing', subjcode: 'RCS082' }]
            var newUser = new User();
            newUser.firstname = req.body.firstname;
            newUser.username = req.body.username;
            newUser.password = newUser.generateHash(req.body.password);
            newUser.subjects = subjects;
            newUser.save(function (err) {
                if (err)
                    throw err;
                return res.status(200).send(newUser);
            })
        }
    });
});

// Sign-in
router.post("/signin", (req, res, next) => {
    let getUser;
    User.findOne({
        username: req.body.username
    }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: "Authentication  user  failed"
            });
        }
        getUser = user;
        return user.validPassword(req.body.password);
    }).then(response => {
        if (!response) {
            return res.status(401).json({
                message: "Authentication  password failed"
            });
        }
        let jwtToken = jwt.sign({
            username: getUser.username,
            firstname: getUser.firstname,
            userId: getUser._id
        }, "longer-secret-is-better", {
            expiresIn: "30m"
        });
        res.status(200).json({
            token: jwtToken,
            expiresIn: 30 * 60 * 1000,
            _id: getUser._id
        });
    }).catch(err => {
        return res.status(401).json({
            message: "Authentication overall failed"
        });
    });
});

// Get Users
router.route('/').get((req, res) => {
    User.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json(response)
        }
    })
})

// Get Single User
router.route('/user-profile/:id').get(authorize, (req, res, next) => {
    User.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

//Add Question
router.post('/add-question', (req, res) => {
    Subject.findOne({ code: req.body.code }, function (err, subject) {
        if (err)
            return res.status(401).send(err);
        else {
            Subject.findByIdAndUpdate(subject._id,
                { $push: { experiments: { labno: req.body.labno, question: req.body.question } } },
                { new: true },
                function (err, doc) {
                    if (err)
                        console.log("error is")
                    else return res.status(200).send(doc)
                }
            );
        }
    })
})

// Get Questions
router.route('/get-subjects').get((req, res) => {
    Subject.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json(response)
        }
    })
})

// Get Single Subject
router.route('/subject/:id').get(authorize, (req, res, next) => {
    Subject.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

// Get Single Lab
router.route('/lab/:code/:labno').get((req, res, next) => {
    Subject.aggregate([
        { $match: { 'code': req.params.code } },
        {
            $project: {
                experiments: {
                    $filter: {
                        input: '$experiments',
                        as: 'experiments',
                        cond: { $eq: ['$$experiments.labno', parseInt(req.params.labno)] }
                    }
                },
                _id: 0
            }
        }
    ], function (error, doc) {
        if (error)
            return next(error)
        else {
            res.status(200).json({ message: doc[0] })
        }
    });
})

// Upload file
router.post('/upload/:id/:labno/:code', upload.single('file'), function (req, res) {
    console.log(req.file)
    User.findOne({ _id: req.params.id }, function (err, user) {
        if (err)
            return res.status(401).send(err);
        else {
            User.findByIdAndUpdate(user._id,
                {
                    $push: {
                        experiments: {
                            labno: req.params.labno,
                            file: req.file.filename,
                            code: req.params.code
                        }
                    }
                },
                { new: true },
                function (err, doc) {
                    if (err)
                        console.log("error is")
                    else return res.status(200).json({ doc: doc, status: true })
                }
            );
        }
    })
});

// Get bunch of students with same lab of the subject.
router.route('/data/:code/:labno').get((req, res, next) => {
    User.aggregate([
        { $unwind: '$experiments' },
        {
            $match: {
                $and: [
                    { "experiments.code": req.params.code },
                    { "experiments.labno": parseInt(req.params.labno) }
                ]
            }
        },
        {
            $group: {
                _id: '$_id',
                file: { $mergeObjects: "$experiments" },
                info: {
                    $mergeObjects: {
                        username: '$username',
                        firstname: '$firstname'
                    }
                }
            }
        }
    ]
        , function (error, doc) {
            if (error)
                return next(error)
            else {
                res.json({ msg: doc })
            }
        })
})

module.exports = router;
