const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const {uploadSingleFile} = require('../utils/uploadFile');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(key => {
        if (allowedFields.includes(key))
            newObj[key] = obj[key]; 
    });
    return newObj;
}


exports.updateMe = catchAsync(async (req, res, next) => {
    // Send error if user posts email or password
    if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('This route is not for password updates', 400));

    // filtered out unwant fields update
    let updateObj = {...req.body};
    updateObj = filterObj(updateObj, 'fullname', 'avatar');

    if (req.file) updateObj.avatar = {
        filename: req.file.filename,
        path: req.file.path
    };

    const user = await User.findByIdAndUpdate(req.user.id, updateObj, {
        new: true,
        runValidators: true
    });

    user.password = undefined;

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

exports.uploadAvatarUser = uploadSingleFile('avatar');
