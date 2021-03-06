import PromiseAp from '../src/promise';

describe('Promise basic Function Test',() => {
    test('1. then should call async functions and get value from then', (done) => {
        (new PromiseAp((resolve) => {
            setTimeout(() => {
                resolve('haha');
            }, 100);
        })).then(value => {
            expect(value).toBe('haha');
            done();
        });
    });
    test('2. then should call sync functions and get value from then', done => {
        (new PromiseAp(resolve => {
            resolve('haha');
        })).then(value => {
            expect(value).toBe('haha');
            done();
        });
    });
    test('3. resolve can be runned only once', done => {
        new PromiseAp((resolve, reject) => {
            resolve("3");
            resolve("3.1");
        }).then(value => {
            expect(value).toBe('3');
            done();
        });
    });
    test('4. can be chained with then', done => {
        new PromiseAp((resolve, reject) => {
            resolve("4");
        })
        .then(data => {
            expect(data).toBe('4');
            return "4.1";
        })
        .then(data => {
            expect(data).toBe('4.1');
            done()
        });
    });
    test('5. supports empty params for function then', done => {
        new PromiseAp((resolve, reject) => {
            resolve("5");
        })
        .then(data => {
            expect(data).toBe('5');
            return "5.1";
        })
        .then()
        .then(data => {
            expect(data).toBe('5.1');
            done();
        });
    });
    // test('6. should be able to pass the result then function from plain object', done => {
    //     new PromiseAp((resolve, reject) => {
    //       resolve("6");
    //     })
    //     .then(data => {
    //         expect(data).toBe('6');
    //         return {
    //             then(r) {
    //                 r("6.1");
    //             }
    //         };
    //     })
    //     .then(data => {
    //         expect(data).toBe('6.1');
    //         done();
    //     });
    // })
});