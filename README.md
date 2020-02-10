mydigitalstructure-sdk-nodejs-module
====================================

node module for mydigitalstucture.cloud

Makes it easy to init your node app onto the mydigitalstructure.cloud platform / API and send requests.

http://docs.mydigitalstructure.com/gettingstarted_nodejs

npm install mydigitalstucture

mydigitalstructure 2.0.0
------------------------

This latest version of the nodejs module has been upgraded to use the same patterns as the Javascript library for the browser.

Methods;

Controller:

- mydigitalstructure.add({name:, note:, code:});
- mydigitalstructure.invoke(name, parameters for controller, data for controller);

Data:

- mydigitalstructure.set({scope:, context:, name:, value:});
- mydigitalstructure.get({scope:, context:, name:});

Cloud:

- mydigitalstructure.save({object:, data:, callback:});
- mydigitalstructure.retrieve({object:, data:, callback:});
- mydigitalstructure.invoke({object:, data:, callback:});
