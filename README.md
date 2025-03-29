# Content Security Policy (CSP) Generator Tool 🔒

[![Security](https://img.shields.io/badge/Secured%20by-InfosecSamurai-blueviolet)](https://infosecsamurai.io)
[![CSP Level](https://img.shields.io/badge/CSP%20Level-3-brightgreen)](https://www.w3.org/TR/CSP3/)
[![OWASP](https://img.shields.io/badge/OWASP%20Compliant-Yes-success)](https://owasp.org/www-project-secure-headers/)
[![GitHub Stars](https://img.shields.io/github/stars/yourusername/csp-generator?style=social)](https://github.com/yourusername/csp-generator)
[![License](https://img.shields.io/badge/License-MIT-blue)](https://opensource.org/licenses/MIT)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/yourusername/csp-generator)](https://snyk.io/test/github/yourusername/csp-generator)
[![Build Status](https://img.shields.io/github/actions/workflow/status/yourusername/csp-generator/ci.yml)](https://github.com/yourusername/csp-generator/actions)

<a href="https://www.buymeacoffee.com/infosecsamurai" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="40" style="border-radius:5px">
</a>

*A professional-grade tool for crafting bulletproof Content Security Policies*

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Generating Policies](#generating-policies)
  - [Testing Policies](#testing-policies)
  - [URL Analysis](#url-analysis)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Content Security Policy (CSP) Generator is a comprehensive tool designed to help web developers create, validate, and test Content Security Policies for their websites. CSP is a critical security layer that helps prevent cross-site scripting (XSS), clickjacking, and other code injection attacks.

This tool provides:
- An interactive interface for building CSP policies
- Real-time validation of policy syntax
- Testing capabilities to identify potential violations
- Educational resources about CSP best practices

## Features

### Policy Generation
- **Complete Directive Coverage**: Supports all standard CSP directives including:
  - `default-src`, `script-src`, `style-src`, `img-src`
  - `connect-src`, `font-src`, `object-src`, `media-src`
  - `frame-src`, `child-src`, `form-action`
  - Advanced directives like `report-uri`, `report-to`, and `upgrade-insecure-requests`

- **Source Value Assistance**:
  - Predefined source values (`'self'`, `'none'`, `'unsafe-inline'`, etc.)
  - Automatic suggestions for common sources
  - Validation of host sources and schemes

### Validation & Testing
- **Policy Validation**:
  - Syntax checking
  - Identification of common mistakes
  - Warning about overly permissive rules

- **Violation Testing**:
  - Simulated violation testing
  - Real-world URL testing (via proxy)
  - Detailed violation reports

### Additional Tools
- **Report-Only Mode**: Generate CSP headers for report-only mode
- **Nonce/Hash Generator**: Tools for generating cryptographic nonces
- **Policy Comparison**: Compare two policies to identify differences

## Installation

### Prerequisites
- Node.js v16 or later
- npm v7 or later

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/InfosecSamurai/csp-generator.git
   cd csp-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional):
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   NODE_ENV=development
   # For production:
   # PROXY_URL=https://your-proxy-service.com
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. For production:
   ```bash
   npm run build
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Usage

### Generating Policies

1. **Add Directives**:
   - Click "Add Directive" to add a new CSP rule
   - Select from the dropdown of available directives
   - Enter allowed sources (space separated)

2. **Source Values**:
   - Use keywords like `'self'` or `'none'` (include single quotes)
   - Specify domains: `example.com https://cdn.example.com`
   - Use schemes: `https: data:`
   - Add nonces: `'nonce-abc123'`
   - Add hashes: `'sha256-abc123'`

3. **Generate Policy**:
   - Click "Generate CSP" to create your policy header
   - The formatted CSP will appear in the output box

### Testing Policies

1. **Syntax Validation**:
   - Click "Test Policy" to validate your CSP
   - The tool will check for:
     - Unknown directives
     - Invalid source values
     - Common anti-patterns
     - Missing critical directives

2. **Violation Simulation**:
   - The tool will simulate common violations
   - Provides warnings about potential issues

### URL Analysis

1. **Test Live URL**:
   - Enter a URL in the testing section
   - Click "Test URL" to analyze the site's CSP
   - Results will show:
     - Current CSP header (if any)
     - Violations detected
     - Recommendations for improvement

2. **Proxy Testing**:
   - For local development, test against:
     ```bash
     http://localhost:3000?testUrl=https://infosecsamurai.github.io
     ```

## API Endpoints

The tool provides a REST API for programmatic access:

### `POST /api/validate`
Validate a CSP policy string

**Request:**
```json
{
  "policy": "default-src 'self'; script-src 'self' example.com"
}
```

**Response:**
```json
{
  "valid": true,
  "errors": [],
  "warnings": ["Consider adding 'unsafe-inline' to style-src"],
  "parsedPolicy": {
    "default-src": ["'self'"],
    "script-src": ["'self'", "example.com"]
  }
}
```

### `POST /api/test`
Test a URL's CSP implementation

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "cspHeader": "default-src 'self'",
  "violations": [
    {
      "directive": "script-src",
      "blockedUrl": "https://tracking.example.com",
      "lineNumber": 42,
      "sourceFile": "https://example.com/index.html"
    }
  ],
  "warnings": [
    "Missing frame-ancestors directive",
    "Consider adding report-uri directive"
  ]
}
```

## Development


### Scripts
- `npm run dev`: Start development server with nodemon
- `npm start`: Start production server
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

### Adding New Directives
To add support for new CSP directives:

1. Edit `src/csp/directives.js`:
   ```javascript
   export const CSP_DIRECTIVES = {
     // ... existing directives
     'new-directive': "Description of the new directive"
   };
   ```

2. Add validation rules in `src/csp/validator.js` if needed

## Security Considerations

When using this tool:

1. **Production Policies**:
   - Always test policies in report-only mode first
   - Monitor violation reports before enforcement
   - Use nonces/hashes instead of `'unsafe-inline'` where possible

2. **Tool Limitations**:
   - URL testing uses a proxy which may not replicate all browser behavior
   - Some violations may only appear in specific browser contexts

3. **Best Practices**:
   - Start with `default-src 'none'` and add exceptions
   - Restrict `script-src` as much as possible
   - Include `frame-ancestors` to prevent clickjacking
   - Use `upgrade-insecure-requests` for HTTPS sites

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please include tests for new features and ensure all existing tests pass.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Note**: This tool is designed for educational and development purposes. Always consult security professionals when implementing CSP in production environments.
