function HomePage () {
  // Calls parent constructor and sets the PageId and PageName.
  Page.call(this, "homePage", "Home Page");
  // Loads the HomePage template async.
  $templates.load("test_data/templates/HomePage.html");
}
HomePage.prototype = new Page;

/**
 * Called by the Binder when gotoPage is called for this page.
 * @param Bdr is the Binder instance.
 */
HomePage.prototype.show = function (Bdr) {
  // Data to provide to template.
  var data = {
    title: "Home Page!",
    description: "Here's the content of the home page. Below is a button to navigate to the next page."
  };

  // Set page data built from template and data.
  Bdr.replace($templates.get("test_data/templates/HomePage.html", data));

  // Set button event handler.
  $('#HomeNextPageButton').on('click', function (e) {
    Bdr.gotoPage('secondPage');
  });
};

HomePage.prototype.constructor = HomePage;
