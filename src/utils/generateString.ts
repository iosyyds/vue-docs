export const generateString = (length: number) => {
  const charset = '0123456789abcdef';
  let randomCode = '';
  for (let i = 0; i < length; i++) {
    randomCode += charset[Math.floor(Math.random() * charset.length)];
  }
  return randomCode;
};