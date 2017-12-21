
//Batch Runner Script

// ***  Line 8 is user configurable  ***  (you can set the number of calls in a batch AND the total number of calls that you want to make)
//Instantiate Your Settings for the batch runner
//first parameter is the number of calls in a batch
//second parameter is the total number of calls requested
var somestats = new ConcurrencyStats(3,9);

//Now, the rest of the code....

//Setup the Concurrency Stats general object
function ConcurrencyStats(limit,totaltasks){
    this.limit = limit;
    this.totaltasks = totaltasks;
    this.runcount = 0;
}

//instanstiate something to hold all of the promises we are making
var promise = [];

//Define a function that does something that takes time (i.e. a 3000 timeout)
var callATask = function(tasknumber) {
    
        //assign a promise result to this callATask function
        promise[tasknumber]= new Promise(function(resolve,reject) {

            //Do something that takes some time to prove that this whole thing works asynchronously
            //Setting a timeout for 3 seconds, and then resolve with a message of the task
            setTimeout(function(){
                resolve('Hello there, task ' + tasknumber + ' is finishing up.');
            },3000);

        }); //end of this promise instance (remember these are stored in the promise array)

}; //end of callATask


//Batch runner function, this runs the calls in batches and updates the instantiated stats object
function batchRunner(stats) {
 
    //needed to keep track of stuff
    var promisereference = [];

    //Run a for loop to call the tasks allowable in the first batch (up to the batch limit defined by line 8) 
    for(i=stats.runcount;i<stats.runcount + stats.limit;i++){ 
        
        //make a call to a task
        callATask(i);

        //update the task reference string (this is used to pass the correct relevant promise references to the Promises.all call)
        promisereference = promisereference.concat(promise[i]);
    }
     
    //Use the Promise.all call to decide whether your batch finished (or not)
    //Promise.all([promise[1],promise[2],promise[3]]).then(resolve => {
    Promise.all(promisereference).then(resolve => {

        //update the runcount tally based the batch completing
        stats.runcount = stats.runcount + stats.limit;
        
        //console the received resolution array (represents each calls message)
        console.log(resolve);

        //console the total calls made so far information
        console.log('Total Calls Made is: ' + stats.runcount);

        //Make another batch of calls if that next batch is within the operating specs of the original call parameters
        //if the next run will exceed the total amount of tasks requested, the next call will not be made
        if(stats.runcount+stats.limit<=stats.totaltasks) {
            //Call the batchrunner again
            batchRunner(somestats);
        }

        },
        reject => {

        //put any promise rejection routine stuff you want to run in this place

    }); //End of Promise.all clause


}//end of testRunner function



// Okay, this is the only line in the script that needs to be called to fire the entire chain of events...
//You are calling the batchRunner with the 'somestats' instantiation of the ConcurrencyStats object 
batchRunner(somestats);