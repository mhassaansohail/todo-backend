# Todo-Backend
Refactor Phase1:

Tasks​:

Refactor the code to adapt following features from 12 Factor Apps.
Codebase
Dependencies
Config

Create services to move the logic away from controllers:

- A declared type for sending data objects to services.
- The same type will be used by Services to return the data back to the controllers.


Abstract away ORM model and create a physical store like APIs using repository pattern with interface for stores and their concrete implementation utilizing ORM models:

- Repository pattern is an added layer of abstraction that separates out data access from business logic.
- 

Implement Google Auth for login, using google nodejs client.
Expectations​
Controllers will only be used for passing and receiving data from services and should be as lean as possible.
Use standard pagination options as input for pagination and paginatedCollections as output.
Understand the above mentioned concepts of 12 factor apps.
Develop a good understanding of OAuth2 with Google.
Make sure the store API's are similar to actual physical stores, 
Use DI to inject repository interfaces directly in services.