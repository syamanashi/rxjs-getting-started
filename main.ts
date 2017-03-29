import { Observable } from 'rxjs';

import { loadData, loadDataWithFetch } from './loader';

// get reference to the DOM element of the #output and #button ids:
let output = document.getElementById("output");
let button = document.getElementById("button");

// Observable.fromEvent() instructs RxJS to wire up an event handler on the button DOM element (e.g. button click event):
let click = Observable.fromEvent(button, "click");

function renderMovies(movies) {
    // loop through the resulting array:
    movies.forEach(m => {
        let div = document.createElement("div");
        div.innerText = m.title;
        output.appendChild(div);
    });
}

// use Observable.flatmap() to subscribe to the inner Observable returned by loadDataWithFetch()
click.flatMap(e => loadDataWithFetch("movies.json"))
    .subscribe(
    renderMovies,
    e => console.log(`error: ${e}`),
    () => console.log("complete")
    );

// call loadData directly on page load and subscribe to the returned Observable that loadData returns, passing in the completion handler of renderMovies:
let subscription = loadData("movies.json")
    .subscribe(
        renderMovies,
        e => console.log(`Caught loadDataWithFetch() error! 
            status: ${e.status}, 
            statusText: ${e.statusText},  
            url: ${e.url}
        `),
        () => console.log("Complete!")
    );
console.log(subscription);
subscription.unsubscribe();
console.log(subscription);
