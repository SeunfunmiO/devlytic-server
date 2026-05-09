const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const companySchema = new mongoose.Schema(
    {
        companyName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        passwordHash: { type: String, required: true },
        role: { type: String, default: 'company' },
        logo: { type: String, default: '' },
        website: { type: String, default: '' },
        industry: { type: String, default: '' },
        description: { type: String, default: '' },
        postedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
        refreshToken: { type: String, default: '' },
    },
    { timestamps: true }
);

companySchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) return next();
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
    next();
});

companySchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model('Company', companySchema);