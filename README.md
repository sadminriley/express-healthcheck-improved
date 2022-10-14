# express-healthcheck-improved
Super-simple healthcheck middleware for express, but improved with a UTC formatted time output.

Based on the original express-healthcheck found at github.com/lennym/express-healthcheck


## Installation

```
npm install express-healthcheck-improved
```

## Usage

```
app.use('/healthcheck', require('express-healthcheck-improved')());
```

This will respond with a JSON payload of `{ "uptime": [uptime in UTC formatted output }` and a 200 status code.

The healthy response can be customised by passing in a custom `healthy` method.

```
app.use('/healthcheck', require('express-healthcheck-improved')({
    healthy: function () {
        return { everything: 'is ok' };
    }
}));
```

You can optionally provide a test method which will be executed to establish the health of the application.

This function can either throw, return an error, or call a callback with an error. Functions with an arity of 0 will expect a return, functions with an arity of 1 will expect a callback.

```
app.use('/healthcheck', require('express-healthcheck-improved')({
    test: function () {
        throw new Error('Application is not running');
    }
}));
```

```
app.use('/healthcheck', require('express-healthcheck-improved')({
    test: function () {
        return { state: 'unhealthy' };
    }
}));
```

```
app.use('/healthcheck', require('express-healthcheck-improved')({
    test: function (callback) {
        callback({ state: 'unhealthy' });
    }
}));
```
