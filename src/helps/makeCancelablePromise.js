export default (promise) => {
  let hasCanceled = false;
  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((val) => {
      hasCanceled ? reject({ isCanceled: true }) : resolve(val);
    });
    promise.catch((error) => {
      hasCanceled ? reject({ isCanceled: true }) : reject(error);
    });
  });
  wrappedPromise.cancel = () => {
    hasCanceled = true;
  };
  return wrappedPromise;
};
