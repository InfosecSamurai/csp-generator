import { CSP_DIRECTIVES } from './directives.js';

/**
 * Generates a Content Security Policy header from a policy object
 * @param {Object} policy - The CSP policy object
 * @returns {string} The CSP header string
 */
export function generateCSP(policy) {
    if (!policy || typeof policy !== 'object') {
        throw new Error('Policy must be an object');
    }

    const directives = [];
    
    for (const [directive, sources] of Object.entries(policy)) {
        if (!CSP_DIRECTIVES[directive]) {
            continue; // Skip unknown directives
        }
        
        if (!Array.isArray(sources) || sources.length === 0) {
            continue; // Skip directives with no sources
        }
        
        const validSources = sources.filter(source => 
            typeof source === 'string' && source.trim().length > 0
        );
        
        if (validSources.length > 0) {
            directives.push(`${directive} ${validSources.join(' ')}`);
        }
    }
    
    return directives.join('; ');
}

/**
 * Generates a report-only CSP header
 * @param {Object} policy - The CSP policy object
 * @returns {string} The CSP report-only header string
 */
export function generateReportOnlyCSP(policy) {
    const csp = generateCSP(policy);
    return csp ? `${csp}; report-uri /csp-report-endpoint` : '';
}
