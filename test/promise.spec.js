import PromiseAp from '../src/promise';

describe('Promise basic Function Test',() => {
    test('then should call async functions and get value from then', (done) => {
        (new PromiseAp((resolve) => {
            setTimeout(() => {
                resolve('haha');
            }, 100);
        })).then(value => {
            expect(value).toBe('haha');
            done();
        });
    });
    test('then should call sync functions and get value from then', done => {
        (new PromiseAp(resolve => {
            resolve('haha');
        })).then(value => {
            expect(value).toBe('haha');
            done();
        });
    });
});