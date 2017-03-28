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
function getMovies(url: string) {
    let xhr = new XMLHttpRequest();

    // handle the xhr 'load' event which is raised when the data arrives back from the web server.
    xhr.addEventListener("load", () => {
        let movies = JSON.parse(xhr.responseText);
        
        // loop through the resulting array:
        movies.forEach(m => {
            let div = document.createElement("div");
            div.innerText = m.title;
            output.appendChild(div);
        });
    });

    xhr.open("GET", url); // sets up the request type, location
    xhr.send(); // send the request asynchronously
}

click.subscribe(
    e => getMovies("movies.json"),
    e => console.log(`error: ${e}`),
    () => console.log("complete")
);
