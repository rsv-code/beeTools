#!/usr/bin/ic9
/*
 * Copyright (c) 2016 Austin Lehman.
 * Distributed under the BSD 3-Clause License.
 * (See accompanying file LICENSE or copy at https://github.com/rsv-code/jsd)
 */

// Include a few needed items ...
include("net/HttpServer.js");
include("io/file.js");

/**
 * Server constructor.
 */
function SimpleHttpServer() {
  // Bind to all interfaces on port 8080.
  HttpServer.call(this, "0.0.0.0", 8080);
  console.info("Server is up and hosting resources at http://localhost:8080/.");
}
SimpleHttpServer.prototype = new HttpServer();

/**
 * Handle function is called when there is a request
 * to the interface.
 * @param req is the HTTP request object.
 * @param res is the HTTP response object.
 */
SimpleHttpServer.prototype.handle = function (req, res)
{
  // Default page to index.html.
  if (req.request === "/") {
    req.request = "index.html";
  }

  // If /dataRequest, generate the the object and set the content to
  // the JSON string representation.
  if (req.request === "/dataRequest") {
    res.println(this.getDataResponse().jstr());
  }
  else if (file.exists("public_html/" + req.request)) {
    // Server anything from public_html folder.
    res.write(file.readBinary("public_html/" + req.request));
  }
  // Can't find what you're looking for.
  else {
    // No script found, just print the about text file.
    res.setStatus(404);
    res.println("404 Not Found: " + req.request);
    console.log("Couldn't find resource '" + req.request + "'.");
  }
};

/**
 * Creates the data request object and returns it ...
 * @return A JS object with the response.
 */
SimpleHttpServer.prototype.getDataResponse = function () {
  return {
    handle: "rsv-code",
    city: "Roseville, CA, USA",
    favOs: "Ubuntu",
    favColor: "Blue",
    favBand: "Queen",
    quote: "When deep space exploration ramps up, it'll be the corporations that name everything, the IBM Stellar Sphere, the Microsoft Galaxy, Planet Starbucks."
  };
};

SimpleHttpServer.prototype.constructor = SimpleHttpServer;

// Create an instance of the server and start it. The start() function
// blocks forever ...
var sv = new SimpleHttpServer();
sv.start();
