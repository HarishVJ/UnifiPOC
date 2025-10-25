/**
 * Configuration and Constants
 * Persona configurations and application constants
 */

const PersonaConfig = {
    sm: {
        name: 'Site Manager',
        role: 'Site Manager',
        canEdit: true,
        canEditExcused: true,
        canEditComment: true,
        showAMH: false,
        avatar: 'SM'
    },
    amh: {
        name: 'John Smith',
        role: 'Area Manager',
        canEdit: true,
        canEditExcused: true,
        canEditComment: true,
        showAMH: true,
        avatar: 'AM'
    },
    ops: {
        name: 'Operations User',
        role: 'Operations',
        canEdit: false,
        canEditExcused: false,
        canEditComment: false,
        showAMH: false,
        avatar: 'OP'
    },
    admin: {
        name: 'Admin User',
        role: 'Administrator',
        canEdit: false,
        canEditExcused: false,
        canEditComment: false,
        showAMH: false,
        avatar: 'AD'
    }
};

const AppConfig = {
    MAX_COMMENT_LENGTH: 500,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    TOAST_DURATION: 3000,
    LOADING_DELAY: 1500,
    ACCEPTED_FILE_TYPES: '.pdf,.doc,.docx,.jpg,.jpeg,.png'
};
