import { Observable, Observer} from 'rxjs';

let numbers = [1, 5, 10];

// create a simple Observable datasource from the array.
let source = Observable.from(numbers);

// Simpler way to build an observer:
//      Invoke the Observable.subscribe() method without a class in a more simple approach:
//      Note: the complete handler does not receive any parameters, we need to use the ()
source.subscribe(
    value => console.log(`value: ${value}`),
    e => console.log(`error: ${e}`),
    () => console.log("complete")
);
