import { generateCSP } from '../src/csp/generator.js';
import { validateCSP } from '../src/csp/validator.js';
import { CSP_DIRECTIVES } from '../src/csp/directives.js';
import { parsePolicy } from '../src/utils/parser.js';
import { showNotification } from '../src/utils/helpers.js';

document.addEventListener('DOMContentLoaded', () => {
    const directivesContainer = document.getElementById('directives-container');
    const addDirectiveBtn = document.getElementById('add-directive');
    const generateCspBtn = document.getElementById('generate-csp');
    const cspOutput = document.getElementById('csp-output');
    const copyCspBtn = document.getElementById('copy-csp');
    const testCspBtn = document.getElementById('test-csp');
    const testUrlInput = document.getElementById('test-url');
    const runTestBtn = document.getElementById('run-test');
    const testResults = document.getElementById('test-results');

    // Add initial directive
    addDirective();

    // Event listeners
    addDirectiveBtn.addEventListener('click', addDirective);
    generateCspBtn.addEventListener('click', generatePolicy);
    copyCspBtn.addEventListener('click', copyToClipboard);
    testCspBtn.addEventListener('click', testPolicy);
    runTestBtn.addEventListener('click', runTest);

    function addDirective() {
        const directiveItem = document.createElement('div');
        directiveItem.className = 'directive-item';
        
        const directiveSelect = document.createElement('select');
        Object.keys(CSP_DIRECTIVES).forEach(directive => {
            const option = document.createElement('option');
            option.value = directive;
            option.textContent = directive;
            directiveSelect.appendChild(option);
        });
        
        const directiveValue = document.createElement('input');
        directiveValue.type = 'text';
        directiveValue.placeholder = 'Enter sources (space separated)';
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-directive';
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => {
            directivesContainer.removeChild(directiveItem);
        });
        
        directiveItem.appendChild(directiveSelect);
        directiveItem.appendChild(directiveValue);
        directiveItem.appendChild(removeBtn);
        
        directivesContainer.appendChild(directiveItem);
    }

    function generatePolicy() {
        const directiveItems = document.querySelectorAll('.directive-item');
        const policy = {};
        
        directiveItems.forEach(item => {
            const select = item.querySelector('select');
            const input = item.querySelector('input');
            
            if (select && input && input.value.trim()) {
                const directive = select.value;
                const sources = input.value.trim().split(/\s+/);
                policy[directive] = sources;
            }
        });
        
        const cspHeader = generateCSP(policy);
        cspOutput.value = cspHeader;
    }

    function copyToClipboard() {
        if (!cspOutput.value) {
            showNotification('No CSP to copy', 'error');
            return;
        }
        
        cspOutput.select();
        document.execCommand('copy');
        showNotification('CSP copied to clipboard!', 'success');
    }

    function testPolicy() {
        if (!cspOutput.value) {
            showNotification('No CSP to test', 'error');
            return;
        }
        
        try {
            const parsed = parsePolicy(cspOutput.value);
            const validation = validateCSP(parsed);
            
            testResults.innerHTML = '';
            
            if (validation.valid) {
                const successItem = document.createElement('div');
                successItem.className = 'test-result-item success';
                successItem.textContent = '✅ CSP is valid and well-formed';
                testResults.appendChild(successItem);
            } else {
                validation.errors.forEach(error => {
                    const errorItem = document.createElement('div');
                    errorItem.className = 'test-result-item error';
                    errorItem.textContent = `❌ ${error}`;
                    testResults.appendChild(errorItem);
                });
            }
            
            // Show parsed structure
            const parsedItem = document.createElement('div');
            parsedItem.className = 'test-result-item';
            parsedItem.innerHTML = `<strong>Parsed CSP:</strong><pre>${JSON.stringify(parsed, null, 2)}</pre>`;
            testResults.appendChild(parsedItem);
            
        } catch (error) {
            showNotification(`Error testing CSP: ${error.message}`, 'error');
        }
    }

    async function runTest() {
        const url = testUrlInput.value.trim();
        if (!url) {
            showNotification('Please enter a URL to test', 'error');
            return;
        }
        
        try {
            // In a real app, this would be an API call to a backend service
            // For this demo, we'll simulate a response
            showNotification(`Testing CSP for ${url}...`, 'info');
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Simulated response
            const simulatedResponse = {
                url,
                cspHeader: "default-src 'self'; script-src 'self' https://trusted.cdn.com",
                violations: [
                    {
                        directive: "script-src",
                        blockedUrl: "https://untrusted.cdn.com/library.js",
                        lineNumber: 42,
                        sourceFile: "https://example.com/index.html"
                    }
                ],
                warnings: [
                    "Consider adding 'unsafe-inline' to style-src or using a nonce/hash",
                    "Consider adding report-uri or report-to directive for monitoring"
                ]
            };
            
            // Display results
            testResults.innerHTML = '';
            
            const headerItem = document.createElement('div');
            headerItem.className = 'test-result-item';
            headerItem.innerHTML = `<strong>Found CSP Header:</strong><br><code>${simulatedResponse.cspHeader}</code>`;
            testResults.appendChild(headerItem);
            
            if (simulatedResponse.violations.length > 0) {
                const violationsHeader = document.createElement('div');
                violationsHeader.className = 'test-result-item error';
                violationsHeader.textContent = '🚨 CSP Violations Detected:';
                testResults.appendChild(violationsHeader);
                
                simulatedResponse.violations.forEach(violation => {
                    const violationItem = document.createElement('div');
                    violationItem.className = 'test-result-item error';
                    violationItem.innerHTML = `
                        <strong>${violation.directive}</strong> blocked ${violation.blockedUrl}<br>
                        Source: ${violation.sourceFile}:${violation.lineNumber}
                    `;
                    testResults.appendChild(violationItem);
                });
            } else {
                const noViolations = document.createElement('div');
                noViolations.className = 'test-result-item success';
                noViolations.textContent = '✅ No CSP violations detected';
                testResults.appendChild(noViolations);
            }
            
            if (simulatedResponse.warnings.length > 0) {
                const warningsHeader = document.createElement('div');
                warningsHeader.className = 'test-result-item';
                warningsHeader.textContent = '⚠️ Recommendations:';
                testResults.appendChild(warningsHeader);
                
                simulatedResponse.warnings.forEach(warning => {
                    const warningItem = document.createElement('div');
                    warningItem.className = 'test-result-item';
                    warningItem.textContent = `• ${warning}`;
                    testResults.appendChild(warningItem);
                });
            }
            
        } catch (error) {
            showNotification(`Error testing URL: ${error.message}`, 'error');
        }
    }
});
