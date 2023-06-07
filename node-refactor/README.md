# NodeJS Refactor

You have been provided with these database models and migrations, as well as the `listingController.js` file which includes a single "update" function. The rest of the project has been lost for unknown reasons, but someone from the team assures that they saw it working "fine" before.

Your objectives are:

1. Build a web API that exposes this functionality as an endpoint. 
2. Add a new endpoint to the web API to create steps in bulk, for a given listing, by submitting a CSV file with the following header fields: 
    
    ```
    flowId, name, step, listingFlow
    ```

Bear in mind that soon, more functionalities will need to be implemented, so it is expected that the code is readable, robust, and maintainable. 

If you feel that there are further important improvements that you cannot implement due to time constraints, you can propose them in writing with a description of how you would approach them.