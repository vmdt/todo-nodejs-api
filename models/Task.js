const mongoose = require('mongoose');

const Task = new mongoose.Schema({
    description: String,
    category: {
        type: String,
        required: [true, "Category of task is required"]
    },
    priority: {
        type: Number,
        enum: [1, 2, 3],
        required: [true, "Priority of task is required"]
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    date: {
        type: String,
        required: [true, "Completed date is required"]
    },
    time: {
        type: String,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please author is required"]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Task', Task);
