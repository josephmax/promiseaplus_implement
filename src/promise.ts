
type TStatus = 'pending' | 'fulfilled' | 'rejected';

interface IException {}

interface IThenable<T> {
    then<R> (onFulfilled?: (value: T) => R, onRejected?: (IException) => R): IThenable<R>
}

interface IPromiseAp<T> extends IThenable<T> {
    status: TStatus;
    value: T;
    reason: IException;
}

interface IPromiseApConstructor<T> {
    (fn): T; 
}

interface IOnFulFilled<T = any, P = any> {
    (value: T): IPromiseAp<P>;
}

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class PromiseAp<T> implements IPromiseAp<T> {
    private resolveQueue: IOnFulFilled[];
    value;
    reason;
    status: TStatus;
    constructor(fn) {
        this.status = PENDING;
        this.resolveQueue = [];
        const resolve = (value) => {
            setTimeout(() => {
                this.status = FULFILLED;
                this.resolveQueue.forEach((thenable) => thenable(value));
            }, 0);
        }
        const rejected = (reason) => {
            this.status = REJECTED;
            this.resolveQueue[0](reason)
        }
        fn(resolve, rejected);
    }
    then(onFulfilled) {
        if (this.status === PENDING) {
            this.resolveQueue.push(onFulfilled);
            return this;
        }
        onFulfilled(this.value);
        return this;
    }
}

export default PromiseAp;