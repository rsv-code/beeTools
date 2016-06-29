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
 * Creates a new TemplateMgr object. This object handles fetching and caching of
 * handlebars templates.
 */
function TemplateMgr () {
  BaseObj.call(this);
  this.cached = {};
}
TemplateMgr.prototype = new BaseObj;

/**
 * Gets a HTML string with the path to the handlebars template and
 * the provided data JS object. If the template is already cached
 * from a previous call or loaded with the load function it uses the
 * cache. If not it will make a synchronous call to get the template.
 * @param Path is a string with the path to the template file.
 * @param Data is a JS object with the data to use with the template.
 * @return A string with the HTML content.
 */
TemplateMgr.prototype.get = function (Path, Data) {
  if (!isDef(Path)) { throw ("TemplateMgr.get(): Expecting parameter Path."); }
  if (!this.cached.contains(Path)) {
    var dres = $.ajax({
      type: "GET",
      url: Path,
      data: "",
      async: false,
      dataType: "text"
    }).responseText;
    this.cached[Path] = Handlebars.compile(dres);
    console.warn("Template '" + Path + "' needed to be loaded synchronously.");
  }
  return this.cached[Path](Data);
};

/**
 * Loads a template asynchronously.
 * @param Path is a string with the path to the template file.
 * @param OnSuccess is a function to call once finished.
 * @param OnError is a function to call on error.
 */
TemplateMgr.prototype.load = function (Path, OnSuccess, OnError) {
  if (!isDef(Path)) { throw ("TemplateMgr.load(): Expecting parameter Path."); }
  if (!this.cached.contains(Path)) {
    var self = this;
    $.ajax({
      type: "GET",
      url: Path,
      data: "",
      success: function (Data) {
        // Add template.
        try {
          self.cached[Path] = Handlebars.compile(Data);
          if (OnSuccess) {
            OnSuccess();
          }
        } catch (e) {
          if (OnError) { OnError(e); }
        }
      },
      error: function(xhr, textStatus, e) {
        if (OnError) { OnError(e); }
      },
      dataType: "text"
    });
  } else {
    if (OnSuccess) {
      OnSuccess();
    }
  }
};

TemplateMgr.prototype.constructor = TemplateMgr;
