/*
 * Copyright 2016 Austin Lehman
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Page object is used with Binder to provided virtual page support
 * in web app. Extend Page and implement show() to create a new page.
 * @param PageId is a string with the page id. This is used in the URL
 * as /<PageId>. (Unique)
 * @param PageTitle is a string with a human readable title for the page.
 */
function Page (PageId, PageTitle) {
  BaseObj.call(this);
  this.id = '';
  this.title = '';

  // Manage scroll position.
  this.scrollPos = 0;

  if (isDef(PageId)) {
    this.id = PageId;
    this.title = PageTitle;
  }
}
Page.prototype = new BaseObj;

/**
 * Shows the content of the page. Override this method to implement
 * the construction of the page.
 * @param Bdr is the binder calling object.
 */
Page.prototype.show = function (Bdr) {
  throw ("Page.show(): Not implemented. Implement this method to handle on-show event.");
};

/**
 * This method is called by the Binder to update
 * the page scroll position.
 * @param Pos is an integer with the new scroll position.
 * @return this
 */
Page.prototype.onScroll = function (Pos) {
  this.scrollPos = Pos;
  return this;
};

Page.prototype.constructor = Page;

/**
 * Creates a new Binder object that manages virtual pages in
 * an app.
 * @param Selector is a jQuery selector to use as the page.
 */
function Binder (Selector) {
  BaseObj.call(this);

  // Selector
  this.selector = Selector;

  // Home page.
  this.homePage = undefined;

  // The current page name.
  this.currentPage = undefined;

  // Map to all pages. (PageId -> PageObj)
  this.pages = {};

  // Page data used for history pushState ...
  this.pageData = {};

  // History list. This is a list of objects with the following
  // properties.
  // id - The page id.
  // data - The data the page was called with.
  this.history = [];

  // Clear page setting. If set to true then when gotoPage is called the
  // current page html is replaced with a blank string until the new page
  // inserts the new content.
  this.clearPage = true;
}
Binder.prototype = new BaseObj;

/**
 * Initializes the Binder object and set's the home page.
 * @param HomePage is an instance of Page and is the home page.
 * @return this
 */
Binder.prototype.init = function (HomePage) {
  if (!isDef(HomePage)) { throw ("Binder.init(): Expecting parameter HomePage."); }
  this.homePage = HomePage;
  this.currentPage = HomePage;
  this.pageData = { page: HomePage.id };
  this.pages[HomePage.id] = HomePage;

  this.setNavigationHandlers();
  return this;
};

/**
 * This method is called by init and sets up the window
 * history back button handling.
 * @return this
 */
Binder.prototype.setNavigationHandlers = function () {
  var self = this;
  history.pushState(this.pageData, this.homePage.title, "/");
  window.onpopstate = function(event) {
    history.pushState(self.pageData, self.homePage.title, "/");
    return self.backOnePage();
  };
  return this;
};

/**
 * This method moves the Binder back to the previous page. It is
 * called by the back button handler when back is pressed but
 * can be called as well.
 * @return this
 */
Binder.prototype.backOnePage = function () {
  if (this.history[this.history.length - 1].id === this.homePage.id) {
    window.history.go(-2);
    return 1;
  } else {
      this.history.pop();                 // Remove current
      var backPageObj = this.history.pop();  // Remove previous because it will be added back.
      // Set the BackButton flag.
      if (isDef(backPageObj.data)) {
        backPageObj.data.BackButton = true;
      } else {
        backPageObj.data = { BackButton: true };
      }
      this.gotoPage(backPageObj.id, backPageObj.data);
  }
  return this;
};

/**
 * Adds the provided Page object to the Binder.
 * @param PageObj is an instance of Page object to add to the Binder.
 * @return this
 */
Binder.prototype.addPage = function (PageObj) {
  if (!isDef(PageObj)) { throw ("Binder.addPage(): Param PageObj is required."); }
  this.pages[PageObj.id] = PageObj;
  return this;
};

/**
 * Sends the binder to a new page by the page ID provided. If the page
 * navigation is triggered by the back button, then the current page (not
 * next page) will retain it's position. If not triggered by the back button
 * then the current page will have it's position set to 0. This is so when
 * clicking the back button the binder will make an attempt along with the page
 * calling updateScrollPosition() to return the user to the spot they were at
 * in the previous page.
 * @param PageId is a string with the page to navigate to.
 * @param Data is a JS object with parameters to pass through to the show()
 * function. It may also contain the BackButton boolean indicating it was called
 * when a user clicked the browser back button.
 * button caused the navigation and false if not.
 * @return this
 */
Binder.prototype.gotoPage = function(PageId, Data) {
  if (!isDef(PageId) || PageId.trim() === "") { throw ("Binder.gotoPage(): Parameter PageId is missing or blank."); }
  if (!this.pages.contains(PageId)) { throw ("Binder.gotoPage(): Provided PageId '" + PageId + "' not found in binder."); }

  if (isDef(this.pages[PageId].show) && typeof this.pages[PageId].show === "function") {
    // If clearPage is set to true, first clear the current content.
    if (this.clearPage === true) {
      this.replace("");
    }

    // Set browser location to default.
    history.replaceState(this.pageData, this.homePage.title, "/");

    // Set page info.
    if (PageId === this.homePage.id) {
      this.history = [];
    }
    this.history.push( { id: PageId, data: Data } );

    // Remove current scroll handler.
    $(document).off('scroll');

    // Set current page.
    this.currentPage = this.pages[PageId];

    // If this was triggered by back button, then remove the back button flag.
    // Else reset scrollPos of page.
    if (isDef(Data) && isDef(Data.BackButton) && Data.BackButton === true) {
      Data.BackButton = false;
    } else {
      this.currentPage.scrollPos = 0;
    }

    // Show the page.
    this.currentPage.show(this, Data);
  } else {
    throw ("Binder.gotoPage(): Page '" + PageId + "' show() method not found.");
  }
  return this;
};

Binder.prototype.setQueryString = function (UrlQueryString) {
  if (isDef(UrlQueryString)) {
    history.replaceState(this.pageData, this.homePage.title, UrlQueryString);
  }
};

/**
 * Called by the page once it's show method has completed any
 * writing to the page to update the scroll tracking and
 * attach the scroll handler.
 * @return this
 */
Binder.prototype.updateScrollPosition = function () {
  var cpage = this.currentPage;
  var imgLoaded = false;
  var self = this;

  // Create a new hidden div with generated ID to wait for the load.
  var did = uuid.get();

  // Wait for images.
  $(this.selector).waitForImages(function () {
    imgLoaded = true;
  });

  // Wait for images and div available.
  var appint = setInterval(function(){
      if ($('#' + did).length > 0 && imgLoaded) {
          $('#' + did).remove();
          clearInterval(appint);

          $(document).scrollTop(cpage.scrollPos);
          self.registerScrollHandler();
      }
  }, 100);

  $(this.selector).append("<div id='" + did + "' style='display: none;'></div>");
  return this;
};

/**
 * Registers the document scroll handler to the current page. This method
 * is called by updateScrollPosition() once the content in the page has loaded.
 * @return this.
 */
Binder.prototype.registerScrollHandler = function () {
  var cpage = this.currentPage;
  $(document).scroll(function () {
      var pos = $(document).scrollTop();
      cpage.onScroll(pos);
    });
  return this;
};

/**
 * Replaces the current page contents with the HTML content provided. This is
 * generally meant to be called the the Page when shown in order to set it's
 * page content.
 * @param Content is a string with the HTML content to set.
 * @return this
 */
Binder.prototype.replace = function (Content) {
  $(this.selector).replaceWith("<div id='" + this.selector.replace('#', '') + "'>" + Content + "</div>");
  return this;
};

Binder.prototype.constructor = Binder;
