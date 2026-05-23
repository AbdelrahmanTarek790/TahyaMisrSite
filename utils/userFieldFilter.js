const CustomField = require('../models/CustomField');

const APPLE_REVIEWER_EMAILS = ['apple@tahyamisryu.com', 'apple-tester@tahyamisr.com'];

const isAppleReviewer = (user) => {
    if (!user || !user.email) return false;
    return APPLE_REVIEWER_EMAILS.includes(user.email.toLowerCase());
};

const isAdminOrSupervisor = (user) => {
    if (!user || !user.role) return false;
    return ['admin', 'hr', 'coordinator'].includes(user.role);
};

/**
 * Filter sensitive fields of user objects based on requester's permissions.
 * @param {Object} requester - The authenticated user making the request (req.user)
 * @param {Object|Array} targetUsers - The user document(s) to filter
 * @returns {Promise<Object|Array>} - The filtered user document(s)
 */
const filterUserFields = async (requester, targetUsers) => {
    if (!targetUsers) return targetUsers;

    const isArray = Array.isArray(targetUsers);
    const usersList = isArray ? targetUsers : [targetUsers];

    // Fetch all public custom fields to check isPublic flag when not populated
    const publicFields = await CustomField.find({ isPublic: true }).select('_id');
    const publicFieldIds = new Set(publicFields.map(f => f._id.toString()));

    const requesterIsApple = isAppleReviewer(requester);
    const requesterIsAdminOrSupervisor = isAdminOrSupervisor(requester);

    const filteredUsers = usersList.map(userDoc => {
        const user = typeof userDoc.toObject === 'function' ? userDoc.toObject() : { ...userDoc };

        const targetIsApple = isAppleReviewer(user);
        const isOwner = requester && requester._id && user._id && requester._id.toString() === user._id.toString();

        let showSensitive = false;

        if (requesterIsApple || targetIsApple) {
            showSensitive = false;
        } else if (requesterIsAdminOrSupervisor) {
            showSensitive = true;
        } else if (isOwner) {
            showSensitive = true;
        } else {
            showSensitive = false;
        }

        if (!showSensitive) {
            delete user.nationalId;
            if (user.customFieldValues && Array.isArray(user.customFieldValues)) {
                user.customFieldValues = user.customFieldValues.filter(cfv => {
                    const field = cfv.fieldId;
                    if (field && typeof field === 'object' && field._id) {
                        return field.isPublic === true;
                    }
                    return publicFieldIds.has(field ? field.toString() : '');
                });
            }
        }

        return user;
    });

    return isArray ? filteredUsers : filteredUsers[0];
};

module.exports = {
    filterUserFields,
    isAppleReviewer,
    isAdminOrSupervisor
};
