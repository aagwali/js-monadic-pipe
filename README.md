# Js-Monadic-Pipe

Sample application using Future from [Fluture](https://github.com/fluture-js/Fluture), Validation and Maybe from [monet.js](https://github.com/monet/monet.js/tree/master).
Entire app runs on [TypeScript](https://www.typescriptlang.org/).

### Problematic :

If your are familiar with functionnal programming you may have encounter the "Either" structure, even if you are not, you probably have been manipulating similar behaviors when using "Promises" for example.

Objective here is to build **a pipe with minimal code and maximal readability**, where all expressions are executed in a single formatted distributed Left/Right structure, to handle Error/Success.

This repo contains a sample application trying to achieve this goal.

##### Performed actions : 
  - Build a mandatory set of configuration keys from [dotEnv](https://www.npmjs.com/package/dotenv).
  - Get specific prop of an input object using configuration "REQUIRED_PROP".
  - Perform asynchronous directory reading of "REQUIRED_PROP" input value.
  - Perform asynchronous file reading of configuration "FILE_NAME" in directory ; if file doesn't exists, fallback on configuration "FILE_NAME_FALLBACK".
  - Returns specific file line using configuration "FILE_LINE".
  
### Description :
#### Main application flow :
  - Entry point is app.ts.
  - Application chains two computations : Validation > Future.
  - Computations are triggered by "fold" and "fork" methods wich act as exit points.
  - Errors/Continuation behaviour is handled with "chain" and "map" methods.
  - Fallback behaviour uses "mapRej" method.

#### Converting to the flow :
  - All asynchronous and failable expressions are safely executed in relevant Functor's contexes.
  - Pre-designed Functor's contexes are provided in monadic-api.ts to minimize boilerplate code in main business.
  
#### Formatting Outputs :
  - Pre-designed Functor are bounded to an Error/Success building business. 
  - Using monadic-api functions force registration of each potential failure in errors.ts.
  - Error building file act as documentation all potential failure.
  
#### Validating requirements :
  - Initial dotEnv/Config validation is enforce by a mandatory mapping in types.ts.
  - Logs can be added at any point of computation by adding ".map(log)" using "log" from utils.ts.
  
  
  

#### Error handling system is inspired by a great Scott Washlin Talk : [Railway Oriented Programming](https://vimeo.com/97344498).

#### Validation usage details can be found in this [article](https://tech.evojam.com/2016/04/26/practical-intro-to-monads-in-javascript-validation/), by JAKUB STROJEWSKI on evojam.

#### Basic Future understanding in this short Pr Frisby's [video](https://vimeo.com/106008027).

#### For a complete tour of js fuinctionnal thinking, you can follow this Pr Frisby's [eggHead course](https://egghead.io/courses/professor-frisby-introduces-composable-functional-javascript) (need an egghead account), or read his full [Guide](https://github.com/MostlyAdequate/mostly-adequate-guide).
