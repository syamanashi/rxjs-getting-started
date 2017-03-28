import { Observable} from 'rxjs';

let numbers = [1, 5, 10];

// Create an observable using the Observable.create() method, passing in a function that takes as a parameter an Observer object. 
//      This approach allows the Observable to interact with an Observer directly:
let source = Observable.create(observer => {
    
    for (let n of numbers) {
        
        // if (n === 5) {
        //     observer.error("Something went wrong!");
        // }
        
        observer.next(n);
    }

    observer.complete();

});

// Simpler way to build an observer:
//      Invoke the Observable.subscribe() method without a class in a more simple approach:
//      Note: the complete handler does not receive any parameters, we need to use the ()
source.subscribe(
    value => console.log(`value: ${value}`),
    e => console.log(`error: ${e}`),
    () => console.log("complete")
);
