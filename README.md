mydigitalstructure-sdk-nodejs-module
====================================

node module for mydigitalstucture.cloud

Makes it easy to init your node app onto the mydigitalstructure.cloud platform / API and send requests.

> http://docs.mydigitalstructure.com/gettingstarted_nodejs

> npm install mydigitalstucture

mydigitalstructure nodejs Module Version 2.0.0
----------------------------------------------

This latest version of the nodejs module has been upgraded to use the same patterns as the Javascript library for the browser.

**Methods;**

Controller:
- mydigitalstructure.add({name:, note:, code:});
- mydigitalstructure.invoke(name, parameters for controller, data for controller);

<!-- end of the list -->

Data:
- mydigitalstructure.set({scope:, context:, name:, value:});
- mydigitalstructure.get({scope:, context:, name:});

<!-- end of the list -->

Cloud:
- mydigitalstructure.cloud.save({object:, data:, callback:});
- mydigitalstructure.cloud.retrieve({object:, data:, callback:});
- mydigitalstructure.cloud.invoke({object:, data:, callback:});

<!-- end of the list -->