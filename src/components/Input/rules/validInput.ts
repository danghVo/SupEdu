const validInput = (comparation: boolean, unValidMessage: string) => {
    let isValid = true;
    let message = '';

    if (comparation) {
        isValid = false;
        message = unValidMessage;
    }

    return {
        isValid,
        message,
    };
};

export default validInput;
