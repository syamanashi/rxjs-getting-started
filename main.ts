import { Observable } from 'rxjs';

// get reference to the DOM element of the #output and #button ids:
let output = document.getElementById("output");
let button = document.getElementById("button");

// Observable.fromEvent() instructs RxJS to wire up an event handler on the button DOM element (e.g. button click event):
let click = Observable.fromEvent(button, "click");

// Review XMLHttpRequest: 
//      https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
//      https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open
//      https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send
function loadData(url: string) {
    return Observable.create(observer => {

        let xhr = new XMLHttpRequest();

        // handle the xhr 'load' event which is raised when the data arrives back from the web server.
        xhr.addEventListener("load", () => {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                observer.next(data);
                observer.complete();
            } else {
                observer.error(xhr.statusText);
            }
        });

        xhr.open("GET", url); // sets up the request type, location
        xhr.send(); // send the request asynchronously
    }).retryWhen(retryStrategy({ attempts: 2, delay: 1500 }));
}

function loadDataWithFetch(url: string) {
    // As a promise only delivers a single value, we will create an observable that will produce a single value and then complete:
    // In this case, the promised is returned by invoking fetch(url).
    // The promise that the fetch(url) method produces is a promise that will deliver a response object (HTTPResonse with status code, response body, etc.).
    // Call the json() method on the response object with deserialize the JSON inside of the Observable.fromPromise() method.
    return Observable.fromPromise(fetch(url).then(r => r.json()));
}

function retryStrategy({ attempts = 4, delay = 1000 }) {
    // returns a function that takes an observable and returns an observable.
    // and When this function returns a value, the observable will retry the operation.
    return function (errors) {
        return errors
            .scan((accumulator, value) => {
                console.log(accumulator, value);
                return accumulator + 1;
            }, 0) // starting value for accumulator is set to 10
            .takeWhile(acc => acc < attempts) // return true if accumulator less than 4
            .delay(delay);
    }
}

function renderMovies(movies) {
    // loop through the resulting array:
    movies.forEach(m => {
        let div = document.createElement("div");
        div.innerText = m.title;
        output.appendChild(div);
    });
}

// use Observable.flatmap() to subscribe to the inner Observable returned by loadData()
click.flatMap(e => loadDataWithFetch("movies.json"))
    .subscribe(
    renderMovies,
    e => console.log(`error: ${e}`),
    () => console.log("complete")
    );

// call loadData directly on page load and subscribe to the returned Observable, passing in the completion handler of renderMovies:
loadData("movies.json").subscribe(renderMovies);
