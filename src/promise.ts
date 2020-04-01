import { isFn, isThenable, IThenable } from './utils';
type TStatus = "pending" | "fulfilled" | "rejected";

interface IPromiseAp<T = any> extends IThenable<T> {
  status: TStatus;
  value: T;
  reason: any;
  catch<TResult = never>(onRejected: (reason: any) => TResult | IThenable<TResult>): IPromiseAp<T | TResult>;
}

interface IExecutor<T> {
  (
    onFulfilled: (value?: T | IThenable<T>) => void,
    onRejected: (reason: any) => void
  ): void;
}

interface IPromiseApConstructor<T> {
  new (executor: IExecutor<T>): IPromiseAp;
  resolve(value: T): IPromiseAp;
  reject(reason: any): IPromiseAp;
}

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function promiseResolution(promise: PromiseAp, x: any): PromiseAp {
  if (promise === x) {
    throw new Error("TypeError");
  }
  if (x instanceof PromiseAp) {
    if (x.status === PENDING) {
      // 持续pending直到
      return x.then(promise.resolve.bind(promise), promise.reject.bind(promise));
    } else if (x.status === FULFILLED) {
      return promise.resolve(x.value);
    } else {
      return promise.reject(x.reason);
    }
  } else if (isThenable(x)) {
    // return resolve
  } else {
    return promise.resolve(x);
  }
}

class PromiseAp<T = any> implements IPromiseAp<T> {
  private _resolveQueue: (<TResult = T>(value?: T) => TResult | IThenable<TResult>)[];
  private _rejectQueue: (<TResult = never>(reason: any) => TResult | IThenable<TResult>)[];
  private _next?: PromiseAp; // 下一个Promise的指针
  public value: T;
  public reason;
  public status: TStatus;
  constructor(fn: IExecutor<T>) {
    this.status = PENDING;
    this._resolveQueue = [];
    this._rejectQueue = [];
    fn(this.resolve.bind(this), this.reject.bind(this));
  }

  static resolve<TResult>(fn: IExecutor<TResult>) {}
  
  walkQueue(promise: PromiseAp): void {
    let queue, val, fn, x;
    if (promise.status === FULFILLED) {
      queue = promise._resolveQueue;
      val = promise.value;
    } else if (promise.status === REJECTED) {
      queue = promise._rejectQueue;
      val = promise.reason;
    }
    while(fn = queue.shift()) {
      x = fn.call(promise, val);
      x && promiseResolution(promise._next, x);
    }
  }

  resolve(value?: T): PromiseAp<T>{
    if (this.status === REJECTED) {
      throw Error('Illegal Invoke');
    }
    setTimeout(() => {
      this.status = FULFILLED;
      this.value = value;
      this._resolveQueue.length && this.walkQueue(this);
    });
    return this;
  }

  reject(reason: any): PromiseAp<T> {
    if (this.status === FULFILLED) {
      throw Error('Illegal Invoke');
    }
    setTimeout(() => {
      this.status = REJECTED;
      this.reason = reason;
      this._rejectQueue.length && this.walkQueue(this);
    });
    return this;
  }
  
  then(onFulfilled = value => value, onRejected = value => value) {
    const next = this._next || (this._next = new PromiseAp(() => {}));
    if (this.status === PENDING) {
      isFn(onFulfilled) && this._resolveQueue.push(onFulfilled);
      isFn(onRejected) && this._rejectQueue.push(onRejected);
    }
    return next;
  }

  catch(onRejected = value => value) {
    return this.then(undefined, onRejected);
  }
}

export default PromiseAp;
