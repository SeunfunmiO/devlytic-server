const https = require('https');
const Job = require('../models/Job');

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const FEATURED_JOB_AMOUNT = 500000; // NGN 5000 in kobo

const initiatePayment = async (req, res) => {
    try {
        const { jobId, email } = req.body;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        if (job.company.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const params = JSON.stringify({
            email,
            amount: FEATURED_JOB_AMOUNT,
            metadata: {
                jobId,
                companyId: req.user.id,
            },
            callback_url: `${process.env.CLIENT_URL}/dashboard/company/jobs`,
        });

        const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: '/transaction/initialize',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET}`,
                'Content-Type': 'application/json',
            },
        };

        const paystackReq = https.request(options, (paystackRes) => {
            let data = '';
            paystackRes.on('data', (chunk) => { data += chunk; });
            paystackRes.on('end', () => {
                const response = JSON.parse(data);
                res.status(200).json(response);
            });
        });

        paystackReq.on('error', (error) => {
            res.status(500).json({ message: error.message });
        });

        paystackReq.write(params);
        paystackReq.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { reference } = req.params;

        const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: `/transaction/verify/${reference}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET}`,
            },
        };

        const paystackReq = https.request(options, (paystackRes) => {
            let data = '';
            paystackRes.on('data', (chunk) => { data += chunk; });
            paystackRes.on('end', async () => {
                const response = JSON.parse(data);

                if (response.data?.status === 'success') {
                    const { jobId } = response.data.metadata;
                    await Job.findByIdAndUpdate(jobId, { isFeatured: true });
                    res.status(200).json({ message: 'Payment verified, job is now featured', response });
                } else {
                    res.status(400).json({ message: 'Payment verification failed' });
                }
            });
        });

        paystackReq.on('error', (error) => {
            res.status(500).json({ message: error.message });
        });

        paystackReq.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { initiatePayment, verifyPayment };