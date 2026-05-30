const disposableDomains = require('disposable-email-domains');

const isDisposableEmail = (email) => {
    if (!email || typeof email !== 'string') return false;

    email = email.replace(/\s+/g, '').toLowerCase();

    const parts = email.split('@');

    if (parts.length !== 2) return false;

    const domain = parts[1];

    return disposableDomains.includes(domain);
};

module.exports = { isDisposableEmail };