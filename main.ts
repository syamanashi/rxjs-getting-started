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
    }).retryWhen(retryStrategy());
}

function retryStrategy() {
    // returns a function that takes an observable and returns an observable.
    // and When this function returns a value, the observable will retry the operation.
    return function (errors) {
        return errors
            .scan((accumulator, value) => {
                console.log(accumulator, value);
                return accumulator + 1;
            }, 10) // starting value for accumulator is set to 10
            .delay(1000);
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
click.flatMap(e => loadData("mmovies.json"))
    .subscribe(
    renderMovies,
    e => console.log(`error: ${e}`),
    () => console.log("complete")
    );

// call loadData directly on page load and subscribe to the returned Observable, passing in the completion handler of renderMovies:
// loadData("movies.json").subscribe(renderMovies);
