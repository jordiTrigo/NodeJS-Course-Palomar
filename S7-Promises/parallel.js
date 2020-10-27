const myPromise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('Reading data from FaceBook...');
        resolve({friends: 100, likes: 200});
    }, 1000);
});

const myPromise2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('Reading data from Twitter...');
        resolve({friends: 3000, likes: 1000});
    }, 4000);
});

// Promise en paral.lel, cridem les dues promises ...


Promise.all([myPromise1, myPromise2])
    .then(result => console.log(result))
    .catch(err => console.log(err.message));

/*
Promise.race([myPromise1, myPromise2])
    .then(result => console.log(result))
    .catch(err => console.log(err.message));    
*/