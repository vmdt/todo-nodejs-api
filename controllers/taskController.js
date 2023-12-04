const Task = require('../models/Task');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeature');

exports.getTasksByUser = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Task.find({user: req.user._id}), req.query)
     .filter()
     .sort()
     .limitFields()
     .paginate();

    const tasks = await features.query;

    return res.status(200).json({
        status: 'success',
        data: {
            results: tasks.length,
            tasks
        }
    });
});

exports.createTask = catchAsync(async (req, res, next) => {
    const task = await Task.create({
        user: req.user._id,
        ...req.body
    });

    return res.status(201).json({
        status: 'success',
        data: {
            task
        }
    });
});

exports.updateTask = catchAsync(async (req, res, next) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });

    if (!task)
        return next(new AppError('Not found task with this id', 404));

    return res.status(200).json({
        status: 'success',
        data: {
            task
        }
    });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task)
        return next(new AppError('Not found task with this id', 404));

    return res.status(200).json({
        status: 'success',
        data: null
    });
});

exports.search = catchAsync(async (req, res, next) => {
    const queryField = new RegExp(req.query.q, 'i');
    const tasks = await Task.find({
        category: {$regex: queryField},
        user: req.user._id
    });

    return res.status(200).json({
        status: 'success',
        data: {
            results: tasks.length,
            tasks
        }
    });
});