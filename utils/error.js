module.exports = {
  checkThrowError: (err, context) => {
    console.error(`[${context}]`, err);
    throw err;
  }
};
