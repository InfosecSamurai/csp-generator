/**
 * Parses a CSP header string into a policy object
 * @param {string} cspHeader - The CSP header string
 * @returns {Object} The parsed CSP policy object
 */
export function parsePolicy(cspHeader) {
    if (typeof cspHeader !== 'string') {
        throw new Error('CSP header must be a string');
    }

    const policy = {};
    const directives = cspHeader.split(';').map(d => d.trim()).filter(d => d);

    for (const directive of directives) {
        const [name, ...values] = directive.split(/\s+/);
        if (name && values.length > 0) {
            policy[name] = values;
        }
    }

    return policy;
}

/**
 * Normalizes a CSP header by ordering directives consistently
 * @param {string} cspHeader - The CSP header string
 * @returns {string} The normalized CSP header
 */
export function normalizePolicy(cspHeader) {
    const policy = parsePolicy(cspHeader);
    const orderedDirectives = Object.keys(policy).sort();
    const normalizedDirectives = [];

    for (const directive of orderedDirectives) {
        normalizedDirectives.push(`${directive} ${policy[directive].join(' ')}`);
    }

    return normalizedDirectives.join('; ');
}
