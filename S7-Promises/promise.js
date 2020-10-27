function getCar(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Getting the car ' + id + ' from the database.');
            resolve({id: id, model: 'Model D', company: 'Tesla'});
        }, 3000);
    });
};

/* A partir del model del cotxe 23, anem a cercar característiques 
   d'aquest model de cotxe */

function getCaracteristiquesByModel(aModel){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Getting the characteristics of the model ' + aModel + ' from database.');
            resolve({speed: 200, seats: 5, size: '4*5'});
        }, 3000);        
    });
};

// Versió 1

//const myPromise = getCar(23);
//myPromise.then(myCar => console.log(myCar));

// Versió 2;
/*
const myPromise = getCar(23);
myPromise
    .then(myCar => getCaracteristiquesByModel(myCar.model))
    .then(myCharacteristicsByModel => console.log(myCharacteristicsByModel))
    .catch(err => console.log(err.message));
*/

// Versió 3: Utilitzem async/await

async function showModel() {
    try{
        const myCar = await getCar(23);
        const myCharactByModel = await getCaracteristiquesByModel(myCar.model);
        console.log(myCharactByModel);
    }
    catch(err){
        console.log(err.message);
    };
};

showModel();