import { Observable } from 'rxjs';

// Review XMLHttpRequest: 
//      https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
//      https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open
//      https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send
export function loadData(url: string) {
    return Observable.create(observer => {

        let xhr = new XMLHttpRequest();

        let onLoad = () => {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                observer.next(data);
                observer.complete();
            } else {
                observer.error(xhr.statusText);
            }
        };

        // handle the xhr 'load' event which is raised when the data arrives back from the web server.
        xhr.addEventListener("load", onLoad);

        xhr.open("GET", url); // sets up the request type, location
        xhr.send(); // send the request asynchronously

        // this code will execute when someone invokes the unsubscribe() method:
        return () => {
            console.log("cleanup");
            xhr.removeEventListener("load", onLoad);
            xhr.abort();
        }

    }).retryWhen(retryStrategy({ attempts: 2, delay: 1500 }));
}

export function loadDataWithFetch(url: string) {
    // As a promise only delivers a single value, we will create an observable that will produce a single value and then complete:
    // In this case, the promised is returned by invoking fetch(url).
    // The promise that the fetch(url) method produces is a promise that will deliver a response object (HTTPResonse with status code, response body, etc.).
    // Call the json() method on the response object with deserialize the JSON inside of the Observable.fromPromise() method.
    return Observable.defer(() => {
        return Observable.fromPromise(fetch(url).then(r =>  {
            // Check response object's status code to ensure success before returning.
            if (r.status === 200) {
                // Produce a promise that will resolve with the deserialized information received from the web server.  Note: if you return an object from a method that I pass into .then(), and that object is not a promise, then the runtime will wrap that result into a promise that resolves successfully.
                return r.json();
            } else {
                // Introduce an error into the application that can be handled.  Note: using a thrown exception can escape the rxjs pipeline and truly become an uncaught exception.
                return Promise.reject(r);
            }
        })); // Note: Do not use retryWhen() for this ^^^ Observable.fromPromise() as it will not fire additional fetch() invocations.
    }).retryWhen(retryStrategy()); // Retries the deferred Observable which forces subsequent fetch() invocations.
}

function retryStrategy({ attempts = 4, delay = 1000 } = {}) {
    // returns a function that takes an observable and returns an observable.
    // and When this function returns a value, the observable will retry the operation.
    return function (errors) {
        return errors
            .scan((accumulator, value) => {
                accumulator += 1;
                if (accumulator < attempts) {
                    return accumulator; // return accumulated value
                } else {
                    throw new Error(value);
                }
            }, 0) // starting value for accumulator is set to 10
            .delay(delay);
    }
}