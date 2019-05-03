# Js-Monadic-Pipe

Sample application using Future from [Fluture](https://github.com/fluture-js/Fluture), Validation and Maybe from [monet.js](https://github.com/monet/monet.js/tree/master).
Entire app runs on [TypeScript](https://www.typescriptlang.org/).


##### Performed actions : 
  - Build a mandatory set of configuration keys from [dotEnv](https://www.npmjs.com/package/dotenv).
  - Get specific prop of an input object using configuration "REQUIRED_PROP".
  - Perform asynchronous directory reading of "REQUIRED_PROP" input value.
  - Perform asynchronous file reading of configuration "FILE_NAME" in directory ; if file doesn't exists, fallback on configuration "FILE_NAME_FALLBACK".
  - Returns specific line using configuration "FILE_LINE".

#### Error handling system is inspired by Railroad Oriented Programming [Talk](https://vimeo.com/97344498) of Scott Washlin

#### Validation Usage implementation [details](https://tech.evojam.com/2016/04/26/practical-intro-to-monads-in-javascript-validation/)
