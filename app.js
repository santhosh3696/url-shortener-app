const express = require('express');
const shortid = require('shortid');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// ✅ Root route (to test server)
app.get('/', (req, res) => {
    res.send('AUTO DEPLOY SUCCESS');
});

// In-memory DB
let urlDatabase = {};

// ✅ Create short URL
app.post('/shorten', (req, res) => {
    console.log("Incoming request:", req.body); // Debug log

    const { longUrl } = req.body;

    if (!longUrl) {
        return res.status(400).json({
            error: "longUrl is required"
        });
    }

    const shortUrl = shortid.generate();
    urlDatabase[shortUrl] = longUrl;

    console.log("Saved:", shortUrl, "->", longUrl); // Debug log

    res.json({
        shortUrl: `http://localhost:${PORT}/${shortUrl}`
    });
});

// ✅ Redirect to original URL
app.get('/:shortUrl', (req, res) => {
    const shortUrl = req.params.shortUrl;
    const longUrl = urlDatabase[shortUrl];

    console.log("Redirect request:", shortUrl); // Debug log

    if (longUrl) {
        return res.redirect(longUrl);
    } else {
        return res.status(404).send('URL not found');
    }
});

// ✅ Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});