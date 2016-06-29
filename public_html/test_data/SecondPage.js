function SecondPage () {
  // Calls parent constructor and sets the PageId and PageName.
  Page.call(this, "secondPage", "The Second Page");
  // Loads the SecondPage template async.
  $templates.load("test_data/templates/SecondPage.html");
}
SecondPage.prototype = new Page;

SecondPage.prototype.show = function (Bdr, Data) {
  if (isDef(Data)) { console.log("callingPage: " + Data.callingPage); }

  // Data to provide to template.
  var data = {
    title: "The Second Page!",
    description: "We are now at the second page."
  };

  // Set page data built from template and data.
  Bdr.replace($templates.get("test_data/templates/SecondPage.html", data));

  // Since we are now on the second page let's call head to load
  // the third page async if not already loaded.
  head.load('test_data/ThirdPage.js', function () {
    // If the binder doesn't already contain it, add a new ThirdPage object.
    if (!Bdr.pages.contains('thirdPage')) {
      Bdr.addPage(new ThirdPage());
    }
  });

  // Set button event handler.
  $('#SecondPageNextButton').on('click', function (e) {
    Bdr.gotoPage('thirdPage');
  });

  // Updates the scroll posotion and attaches the scroll update handler.
  // This is all that is needed to manage the scrolled position within
  // the page. This needs to be called once all content is written to
  // the page.
  Bdr.updateScrollPosition();
};

SecondPage.prototype.constructor = SecondPage;
