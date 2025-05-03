// Check if an email is valid
export const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

// Check if a password is strong (at least 6 characters, contains numbers and letters)
export const isValidPassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(password);
};

// Check if a string is empty
export const isEmpty = (value) => {
    return value.trim() === '';
};

// Validate form data
export const validateForm = (formData) => {
    const errors = {};

    if (isEmpty(formData.name)) errors.name = 'Name is required';
    if (!isValidEmail(formData.email)) errors.email = 'Invalid email address';
    if (!isValidPassword(formData.password)) errors.password = 'Password must be at least 6 characters, and include both letters and numbers';

    return errors;
};
