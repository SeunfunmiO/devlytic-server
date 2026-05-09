const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        passwordHash: { type: String, required: true },
        role: { type: String, default: 'developer' },
        avatar: { type: String, default: '' },
        bio: { type: String, default: '' },
        skills: [{ type: String }],
        githubUrl: { type: String, default: '' },
        portfolioUrl: { type: String, default: '' },
        resumeUrl: { type: String, default: '' },
        availabilityStatus: {
            type: String,
            enum: ['open', 'not looking', 'casually looking'],
            default: 'open',
        },
        appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
        refreshToken: { type: String, default: '' },
    },
    { timestamps: true }
);

userSchema.pre('save', async function () {
    if (!this.isModified('passwordHash')) return;
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);