import { Observable } from 'rxjs';

import { loadData, loadDataWithFetch} from './loader';

/*
let source = Observable.create(observer => {
    observer.next(1);
    observer.next(2);
    observer.error('Stop!');
    // throw new Error("Stop!"); // throws unhandled exception
    observer.next(3);
    observer.complete();
});
*/

let source = Observable.merge(
    Observable.of(1),
    Observable.from([2, 3, 4]),
    Observable.throw(new Error("Stop!")),
    Observable.of(5)
);

source.subscribe(
    value => console.log(`value: ${value}`),
    error => console.log(`error: ${error}`),
    () => console.log("complete"),
);

/*
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

// use Observable.flatmap() to subscribe to the inner Observable returned by loadData()
click.flatMap(e => loadDataWithFetch("movies.json"))
    .subscribe(
    renderMovies,
    e => console.log(`error: ${e}`),
    () => console.log("complete")
    );

// call loadData directly on page load and subscribe to the returned Observable, passing in the completion handler of renderMovies:
loadData("movies.json").subscribe(renderMovies);
*/
