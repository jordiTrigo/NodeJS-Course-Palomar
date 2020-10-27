const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve({id: 1, model: 'Model D', company: 'Tesla'});
        //reject(new Error('Exception occurred on trying to access the database!'));
    }, 4000);
});

myPromise
        .then(result => console.log(result))
        .catch(err => console.log(err.message));