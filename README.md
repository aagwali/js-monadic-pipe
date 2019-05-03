# Js-Monadic-Pipe

Sample application using Future from [Fluture](https://github.com/fluture-js/Fluture), Validation and Maybe from [monet.js](https://github.com/monet/monet.js/tree/master).
Entire app runs on [TypeScript](https://www.typescriptlang.org/).


##### Performed actions : 
  - Build a mandatory set of configuration keys from [dotEnv](https://www.npmjs.com/package/dotenv).
  - Get specific prop of an input object using configuration "REQUIRED_PROP".
  - Perform asynchronous directory reading of "REQUIRED_PROP" input value.
  - Perform asynchronous file reading of configuration "FILE_NAME" in directory ; if file doesn't exists, fallback on configuration "FILE_NAME_FALLBACK".
  - Returns specific file line using configuration "FILE_LINE".
  
#### Description :
  - Entry point is app.ts.
  - App chains two computations : Validation > Future.
  - Functions "fold" and "fork" trigger each computation and act as exit points.
  - Exit points are formatted with Success/Error builders.
  - Continuation behaviour is handled with "chain" and "map".
  - All asynchronous and failable expressions are safely executed in relevant Functor's contexes.
  - Pre-designed Functor's contexes are provided in monadic-api.ts to minimize boilerplate code in main business.
  - Using monadic-api force registration of each potential failure in error building system.
  - Initial dotEnv/Config validation is enforce by a mandatory mapping in types.ts.
  - Logs can be added at any point of computation by adding ".map(log)" using "log" from utils.ts.
  
  
  

#### Error handling system is inspired by a great Scott Washlin Talk : [Railway Oriented Programming](https://vimeo.com/97344498).

#### Validation usage details can be found in this [article](https://tech.evojam.com/2016/04/26/practical-intro-to-monads-in-javascript-validation/), by JAKUB STROJEWSKI on evojam.

#### Basic Future understanding in this short Pr Frisby's [video](https://vimeo.com/106008027).

#### For a complete tour of js fuinctionnal thinking, you can follow this Pr Frisby's [eggHead course](https://egghead.io/courses/professor-frisby-introduces-composable-functional-javascript) (need an egghead account), or read his full [Guide](https://github.com/MostlyAdequate/mostly-adequate-guide).
