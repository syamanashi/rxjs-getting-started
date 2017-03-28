import { Observable } from 'rxjs';

// Observable.fromEvent() instructs RxJS to wire up an event handler on a DOM element (e.g. button click event):
let source = Observable.fromEvent(document, "mousemove")
                       .map((e : MouseEvent) => {
                           return {
                               x: e.clientX,
                               y: e.clientY
                           }
                       });

source.subscribe(
    value => console.log(value),
    e => console.log(`error: ${e}`),
    () => console.log("complete")
);
