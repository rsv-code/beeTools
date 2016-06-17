function myObjOutter() {
  myObj.call(this);
  this.color = "blue";
}
myObjOutter.prototype = new myObj;

myObjOutter.prototype.setColor = function (Color) {
  this.color = Color;
};

myObjOutter.prototype.constructor = myObjOutter;
