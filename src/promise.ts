type TStatus = "pending" | "fulfilled" | "rejected";

interface IException {}

interface IThenable<T> {
  then<R>(
    onFulfilled?: (value: T) => R,
    onRejected?: (IException) => R
  ): IThenable<R>;
}

interface IPromiseAp<T = any> extends IThenable<T> {
  status: TStatus;
  value: T;
  reason: IException;
}

interface IPromiseApConstructor<T> {
  (fn): T;
}

interface IOnFulFilled {
  (): void;
}

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function promiseResolution(
  promise: IPromiseAp,
  value: any,
  resolve: (val: any) => any,
  reject: (reason: any) => any
): void {
  if (promise === value) {
    throw new Error('TypeError');
  }
  if (value instanceof PromiseAp) {
    if (value.status === PENDING) {
      // 持续pending直到
    } else if (value.status === FULFILLED) {
      resolve(value.value);
    } else {
      reject(value.reason);
    }
    return;
  }
  const type = typeof value;
  if (value != null && (type === "object" || type === "function")) {
    value.then();
  }
}

interface IResolveFunction<T> {
  (value: T): any;
}

class PromiseAp<T> implements IPromiseAp<T> {
  private resolveQueue: IOnFulFilled[];
  public value: T;
  public reason;
  public status: TStatus;
  constructor(fn: (r: IResolveFunction<T>) => any) {
    this.status = PENDING;
    this.resolveQueue = [];
    const resolve: IResolveFunction<T> = value => {
      setTimeout(() => {
        if (this.status === PENDING) {
          this.status = FULFILLED;
          this.value = value;
          this.resolveQueue.forEach(onFulfilled => onFulfilled());
        }
      }, 0);
    };
    fn(resolve);
  }
  then(onFulfilled = value => value) {
    if (this.status === PENDING) {
      return new PromiseAp(resolve => {
        this.resolveQueue.push(() => {
          resolve(onFulfilled(this.value));
        });
      });
    }
    // onFulfilled(this.value);
    // return this;
  }
}

export default PromiseAp;
