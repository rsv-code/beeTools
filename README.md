# BeeTools
BeeTools is a minimal collection of browser tools. The goal is to provide a
base set of tools needed to create simple structured web applications without
giant frameworks. BeeTools is less of a framework and more of a set of libraries
to get you going on a web app. It includes existing common tools such as head
and jQuery.

BeeTools was built as a starting point for client web applications running
from [Ic9](https://github.com/ic9/ic9) but only the example server requires Ic9.

## Features
* Dynamic JS/CSS loading. Lazy loading.
* Browser feature identification.
* Common JS tools.
* Templating and template caching.
* Page Management via Binder.
* Handling of back button and previous page position.

## Packaged Tools/Dependencies
The following tools/dependencies are included in this repository. Their licenses
are either included as a file within the directory or are in the top of the
file itself.

* [HeadJS](http://headjs.com/)
* [jQuery](https://jquery.com/)
* [Bootstrap 3](http://getbootstrap.com/)
* [Handlebars](http://handlebarsjs.com/)
* [waitForImages](https://github.com/alexanderdickson/waitForImages)

## The Example
If you'd just like to browse the code a bit I'd start with the
[index.html](https://github.com/rsv-code/beeTools/blob/master/public_html/index.html)  file. The rest of the client code can be found within the test_data directory.

To actually run the example you'll need an installation of [Java 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
or later for Nashorn and [Ic9](https://github.com/ic9/ic9).

Launch the server:
```
$shell> ic9 test/server.js
[info] Server is up and hosting resources at http://localhost:8080/.
```

Then point your browser to http://localhost:8080/.


## Author
Austin Lehman - [lehman.austin@gmail.com](mailto:lehman.austin@gmail.com)

## License
Unless otherwise stated all other code is licensed under the BSD 3-Clause License. (LICENSE)
