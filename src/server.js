import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// API endpoint for CSP validation
app.post('/api/validate', express.json(), (req, res) => {
    try {
        const { policy } = req.body;
        if (!policy) {
            return res.status(400).json({ error: 'Policy is required' });
        }

        const parsed = parsePolicy(policy);
        const validation = validateCSP(parsed);

        res.json({
            valid: validation.valid,
            errors: validation.errors,
            parsedPolicy: parsed
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API endpoint for testing a URL's CSP
app.post('/api/test', express.json(), async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // In a real implementation, this would actually fetch the URL and analyze its CSP
        // For this demo, we'll return simulated data
        const simulatedResponse = {
            url,
            cspHeader: "default-src 'self'; script-src 'self' https://trusted.cdn.com",
            violations: [
                {
                    directive: "script-src",
                    blockedUrl: "https://untrusted.cdn.com/library.js",
                    lineNumber: 42,
                    sourceFile: url
                }
            ],
            warnings: [
                "Consider adding 'unsafe-inline' to style-src or using a nonce/hash",
                "Consider adding report-uri or report-to directive for monitoring"
            ]
        };

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        res.json(simulatedResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve the main page for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
