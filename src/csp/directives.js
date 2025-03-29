export const CSP_DIRECTIVES = {
    'default-src': "Fallback for other fetch directives",
    'script-src': "Defines valid sources for JavaScript",
    'style-src': "Defines valid sources for stylesheets",
    'img-src': "Defines valid sources of images",
    'connect-src': "Defines valid targets for fetch, XMLHttpRequest, WebSocket, etc.",
    'font-src': "Defines valid sources for fonts",
    'object-src': "Defines valid sources for the <object>, <embed>, and <applet> elements",
    'media-src': "Defines valid sources for loading media using the <audio> and <video> elements",
    'frame-src': "Defines valid sources for nested browsing contexts loading using elements like <frame> and <iframe>",
    'child-src': "Defines valid sources for web workers and nested browsing contexts",
    'form-action': "Defines valid endpoints for form submissions",
    'frame-ancestors': "Defines valid parents that may embed a page using <frame>, <iframe>, <object>, etc.",
    'manifest-src': "Defines valid sources of application manifest files",
    'worker-src': "Defines valid sources for Worker, SharedWorker, or ServiceWorker scripts",
    'prefetch-src': "Defines valid sources to be prefetched or prerendered",
    'base-uri': "Defines valid URLs which can be used in a document's <base> element",
    'sandbox': "Enables a sandbox for the requested resource similar to the <iframe> sandbox attribute",
    'report-uri': "Specifies a URI to which the user agent sends reports about policy violation",
    'report-to': "Specifies a group to which the user agent sends reports about policy violation",
    'upgrade-insecure-requests': "Instructs user agents to treat all of a site's insecure URLs as though they have been replaced with secure URLs",
    'block-all-mixed-content': "Prevents loading any assets using HTTP when the page is loaded using HTTPS"
};

export const CSP_SOURCE_VALUES = [
    "'none'",
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "'strict-dynamic'",
    "'report-sample'",
    "https:",
    "data:",
    "mediastream:",
    "blob:",
    "filesystem:",
    "*"
];
