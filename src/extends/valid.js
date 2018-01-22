export const phone = (text) => {
  if (typeof text !== 'string') {
    return false;
  }
  return /^1[34578]\d{9}$/.test(text);
};


export default exports;
