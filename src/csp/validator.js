import { CSP_DIRECTIVES, CSP_SOURCE_VALUES } from './directives.js';

/**
 * Validates a parsed CSP policy object
 * @param {Object} policy - The parsed CSP policy
 * @returns {Object} Validation result with valid boolean and errors array
 */
export function validateCSP(policy) {
    const result = {
        valid: true,
        errors: []
    };

    if (!policy || typeof policy !== 'object') {
        result.valid = false;
        result.errors.push('Policy must be an object');
        return result;
    }

    for (const [directive, sources] of Object.entries(policy)) {
        // Check if directive is known
        if (!CSP_DIRECTIVES[directive]) {
            result.valid = false;
            result.errors.push(`Unknown directive: ${directive}`);
        }

        // Check sources are valid
        if (!Array.isArray(sources)) {
            result.valid = false;
            result.errors.push(`Sources for ${directive} must be an array`);
            continue;
        }

        for (const source of sources) {
            if (typeof source !== 'string') {
                result.valid = false;
                result.errors.push(`Source in ${directive} must be a string`);
                continue;
            }

            // Check if it's a special keyword or needs validation
            if (source.startsWith("'") && source.endsWith("'")) {
                const keyword = source.toLowerCase();
                if (!CSP_SOURCE_VALUES.includes(keyword)) {
                    result.valid = false;
                    result.errors.push(`Invalid keyword source in ${directive}: ${source}`);
                }
            } else if (source === '*') {
                if (directive === 'script-src' || directive === 'style-src') {
                    result.valid = false;
                    result.errors.push(`Wildcard (*) is too permissive for ${directive}`);
                }
            } else if (!isValidSourceValue(source)) {
                result.valid = false;
                result.errors.push(`Invalid source in ${directive}: ${source}`);
            }
        }
    }

    // Additional policy-wide validations
    if (policy['script-src'] && policy['script-src'].includes("'unsafe-inline'") && 
        policy['script-src'].includes("'nonce-'")) {
        result.valid = false;
        result.errors.push("Cannot use both 'unsafe-inline' and nonces in script-src");
    }

    if (policy['default-src'] && policy['default-src'].includes("'none'") && 
        Object.keys(policy).length > 1) {
        result.valid = false;
        result.errors.push("Cannot specify other directives when default-src is 'none'");
    }

    return result;
}

function isValidSourceValue(source) {
    // Check for scheme sources (https:, data:, etc.)
    if (source.endsWith(':') && !source.includes(' ')) {
        return true;
    }

    // Check for host sources (example.com, *.example.com)
    if (/^([*a-z0-9-]+\.)?[a-z0-9-]+(\.[a-z]{2,})+(\/.*)?$/i.test(source)) {
        return true;
    }

    // Check for IP addresses
    if (/^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/.test(source)) {
        return true;
    }

    // Check for nonce and hash sources
    if (source.startsWith("'nonce-") || 
        source.startsWith("'sha256-") || 
        source.startsWith("'sha384-") || 
        source.startsWith("'sha512-")) {
        return true;
    }

    return false;
}
