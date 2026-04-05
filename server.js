require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files (HTML, CSS, JS) from the current directory
app.use(express.static(__dirname));

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS
    }
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log("Transporter error:", error);
    } else {
        console.log("Server is ready to send messages via", process.env.GMAIL_USER);
    }
});

// API Endpoint to Handle Form Submissions
app.post('/api/send-enquiry', async (req, res) => {
    try {
        const { formTitle, details } = req.body;

        if (!formTitle || !details) {
            return res.status(400).json({ error: "Missing form data." });
        }

        // Format the email body
        const emailText = `New Enquiry Received from Night Bus Ecosystem\n\n` +
                          `Form Type: ${formTitle}\n` +
                          `--------------------------------------------------\n` +
                          `${details.join('\n')}\n` +
                          `--------------------------------------------------\n\n` +
                          `Please contact the user regarding this enquiry.`;

        const mailOptions = {
            from: `"Night Bus Platform" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER, // Sending the email to yourself as the admin
            subject: `New Lead: ${formTitle}`,
            text: emailText
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
        
        res.status(200).json({ success: true, message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email." });
    }
});

// Fallback to index.html for any root requests
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
