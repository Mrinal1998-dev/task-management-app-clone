export const restoreToken = (userToken) => {
    return {
        type: 'RESTORE_TOKEN',
        token: userToken
    }
};

export const signIn = () => {
    return {
        type: 'SIGN_IN',
        token: 'dummy-auth-token'
    }
};

export const signOut = () => {
    return {
        type: 'SIGN_OUT'
    }
};