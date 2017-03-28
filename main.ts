import { Observable } from 'rxjs';

// get reference to the DOM element of the #circle id:
let circle = document.getElementById("circle");

// Observable.fromEvent() instructs RxJS to wire up an event handler on a DOM element (e.g. button click event):
let source = Observable.fromEvent(document, "mousemove")
                       .map((e : MouseEvent) => {
                           return {
                               x: e.clientX,
                               y: e.clientY
                           }
                       })
                       .filter(value => value.x < 500)
                       .delay(300);

function onNext(value) {
    // console.log(value.x + ' x ' + value.y);
    circle.style.left = value.x + 'px';
    circle.style.top = value.y + 'px';
}

source.subscribe(
    onNext,
    e => console.log(`error: ${e}`),
    () => console.log("complete")
);
