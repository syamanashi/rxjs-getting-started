import { Observable, Observer} from 'rxjs';

let numbers = [1, 5, 10];

// create a simple Observable datasource from the array.
let source = Observable.from(numbers);

class MyObserver implements Observer<number> {

    // observable invokes 'next(value)' on the observer when there is a value to produce:
    next(value) {
        console.log(`value: ${value}`);
    }

    // if the observable encounters an error, the observable object will invoke the error(e) message on the observer.
    error(e) {
        console.log(`error: ${e}`);
    }

    // if the observable knows that it has exhausted the datasource, it's produced all the values that it can, it will invoke the complete() method.
    //      Note: not every observable datasource can complete().  Some observable datasources might last forever, or at least, as long as a page is loaded in the browser.
    //      (eg. a listener to mouse click events and producing a stream of data based on those click events)
    complete() {
        console.log("complete");
    }

}

// Instatiate the observer and pass the observer object to the observable.subscribe() method.
source.subscribe(new MyObserver());

// You can have multiple subscribers to a single observable:
source.subscribe(new MyObserver());
