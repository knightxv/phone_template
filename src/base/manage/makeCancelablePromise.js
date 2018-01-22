/*
  解决在发送http请求时，转换页面时导致渲染发生在已卸载的页面

 */

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
