function ThirdPage () {
  // Calls parent constructor and sets the PageId and PageName.
  Page.call(this, "thirdPage", "The Third Page");
  // Loads the ThirdPage template async.
  $templates.load("test_data/templates/ThirdPage.html");
}
ThirdPage.prototype = new Page;

ThirdPage.prototype.show = function (Bdr) {
  // Make remote call and on success run handleDataRequest.
  var self = this;
  $.getJSON("dataRequest", function (Data) {
    self.handleDataResult(Bdr, Data);
  });
};

ThirdPage.prototype.handleDataResult = function (Bdr, Data) {
  // Data to provide to template.
  var data = {
    title: "The Third Page!",
    description: "This one makes a data request for some user data and presents it."
  };

  // Add result from our call.
  data.mixin(Data);

  // Set page data built from template and data.
  Bdr.replace($templates.get("test_data/templates/ThirdPage.html", data));

  // Set button event handler.
  $('#HomePageButton').on('click', function (e) {
    Bdr.gotoPage('homePage');
  });
  $('#SecondPageButton').on('click', function (e) {
    Bdr.gotoPage('secondPage');
  });

  // Updates the scroll posotion and attaches the scroll update handler.
  // This is all that is needed to manage the scrolled position within
  // the page. This needs to be called once all content is written to
  // the page.
  Bdr.updateScrollPosition();
};

ThirdPage.prototype.constructor = ThirdPage;
