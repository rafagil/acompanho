# Acompanho
Acompanho (reads "Acompaño") is a simple RSS Reader made with the MEAN Stack (MongoDB, Express.js, Angular and Node.js).
Any suggestions are welcome!

# Install Instructions
You will need node.js, bower and gulp to build/run the app.
Download node.js from http://www.nodejs.org

and install the other tools using the bundled npm:

```shell
$ npm install bower gulp
```

Then, execute (in the app folder):
```shell
$ npm install
$ bower install
```

Then, start the app using:
```shell
$ gulp serve
```

# Configuring database
Acompanho needs a mongodb database, and its configuration is "hardcoded" on the app.js file.
Future releases will have a better solution for that.
