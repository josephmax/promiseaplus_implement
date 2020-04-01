export interface IThenable<T = any> {
  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: (value?: T) => TResult1 | IThenable<TResult1>,
    onRejected?: (reason: any) => TResult2 | IThenable<TResult2>
  ): IThenable<TResult1 | TResult2>;
}

export function isFn(fn: any): boolean {
  return typeof fn === 'function';
}

export function isThenable(target: any): target is IThenable {
  return target && target.then && isFn(target.then);
}