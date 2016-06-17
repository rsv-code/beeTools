function myObj () {
  BaseObj.call(this);
  this.name = 'austin';
}
myObj.prototype = new BaseObj;

myObj.prototype.getName = function () {
  return this.name;
};

myObj.prototype.constructor = myObj;
