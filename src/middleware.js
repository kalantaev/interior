


const promiseMiddleware = store => next => action => {
  next(action);
};

const localStorageMiddleware = store => next => action => {

  next(action);
};

export { promiseMiddleware, localStorageMiddleware }
