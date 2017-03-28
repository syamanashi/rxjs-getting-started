import { Observable} from 'rxjs';

let numbers = [1, 5, 10];

// Create an observable using the Observable.create() method, passing in a function that takes as a parameter an Observer object. 
//      This approach allows the Observable to interact with an Observer directly:

// Make this oberservable asynchonous using setTimeout.
//      Most observables are asynchonous, producing a stream of data over time:
//      They deliver data in the future, or when some specific event occurs, like a mouse click event.
let source = Observable.create(observer => {
    
    let index = 0;

    // create a function that invokes observer.next(value) and passes in numbers[index].
    let produceValue = () => {

        // next passes a value to the observer, then immediately increments index:
        observer.next(numbers[index++]);

        if (index < numbers.length) {
            setTimeout(produceValue, 2000);
        } else {
            observer.complete();
        }
    }
    produceValue();

});

// NOTE: The observer is simply an object that waits for data to be produced from the observable, and provides the logic to react to the data that is arriving.
// Simpler way to build an observer:
//      Invoke the Observable.subscribe() method without a class in a more simple approach:
//      Note: the complete handler does not receive any parameters, we need to use the ()
source.subscribe(
    value => console.log(`value: ${value}`),
    e => console.log(`error: ${e}`),
    () => console.log("complete")
);
