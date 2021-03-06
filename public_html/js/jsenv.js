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

var $global, $ic9env, $ic9;

/** Set $global. */
$global = this;

/** Set the global $ic9env flag. */
$ic9env = false;

/** Set the global $ic9 object. */
$ic9 = {
  platform: "mobile",     // For native app use mobile-native-app.
};

/**
 * Sets a default value where none is set already. This
 * is useful in functions with optional parameters.
 * @param Variable is a var to check.
 * @param Value is the default value for the variable.
 * @returns The provided var.
 */
function setDef(Variable, Value) {
    Variable = Variable !== undefined ? Variable : Value;
    if (Variable === null) { Variable = Value; }
    return Variable;
}

/**
 * Checks to see if the passed variable is defined. This
 * is useful when requiring function parameters.
 * @param Variable is a variable to check.
 * @returns A boolean with true for defined and false
 * for undefined.
 */
function isDef(Variable) {
    if (Variable === undefined) { return false; }
    return true;
}

/**
 * Wrapper to check if a var is an array.
 * @param Variable is the var to check.
 * @returns A boolean with true if it's an array
 * and false if not.
 */
function isArr(Variable) {
    if (Array.isArray(Variable)) { return true; }
    return false;
}

/**
 * Checks to see if the provided variable is an Object.
 * @param Variable is a variable to check.
 * @returns A boolean with true for an Object and false for not.
 */
function isObj(Variable) {
    return Variable instanceof Object;
}

/**
 * Checks to see if a string starts with another string.
 * @param string is a string to check.
 * @param prefix is the prefix to check for.
 * @returns A boolean with true for starts with and false for not.
 */
function startsWith(string, prefix) {
    return string.slice(0, prefix.length) === prefix;
}

/**
 * Checks to see if an array or an object contains the provided
 * string. In the event of an object it will look for the key.
 * @param Haystack is an Array or Object to search.
 * @param Needle is a String to look for.
 * @returns {Boolean} True if found or false if not.
 */
function contains(Haystack, Needle) {
    if (Array.isArray(Haystack)) { return (Haystack.indexOf(Needle) > -1); }
    return Haystack.hasOwnProperty(Needle);
}

/**
 * Checks to see if the provided value is a string object.
 * @param Value is an object to check.
 * @returns {Boolean} True for is string and false for not.
 */
function isString(Value) {
    return typeof Value === 'string' || Value instanceof String;
}

/**
 * Checks to see if the provided value is a number object.
 * @param Value is an object to check.
 * @returns {Boolean} True for is number and false for not.
 */
function isNumber(Value) {
    return typeof Value === 'number' && isFinite(Value);
}

/**
 * Checks to see if the provided value is a boolean object.
 * @param Value is an object to check.
 * @returns {Boolean} True for is boolean and false for not.
 */
function isBool(Value) {
    return typeof Value === 'boolean' || Value instanceof Boolean;
}

/**
 * Checks to see if the provided value is a function.
 * @param Value is an object to check.
 * @returns {Boolean} True for is function and false if not.
 */
function isFunct(Value) {
    return typeof Value === 'function';
}

/**
 * Base object is a minimal ic9 object with a check to ensure current scope
 * isn't global and with a jstr method.
 * @constructor
 */
function BaseObj() {
    if (this === $global) { throw ("Attepmt to instantiate in global scope."); }
}

/*
 * Assert methods for testing cases.
 */
/**
 * Assert boolean.
 * @param Value is an object to test.
 * @throws An exception if not true.
 */
function assert(Value) {
    if (Value !== true) { throw ("assert(): Assertion exception."); }
}

/**
 * Asserts the provided value is a string.
 * @param Value is an object to test.
 * @throws An exception if not a string.
 */
function assertString(Value) {
    if (!(typeof Value === "string")) { throw ("assertString(): Assertion exception, not a string."); }
}

/**
 * Asserts the provided value is a boolean.
 * @param Value is an object to test.
 * @throws An exception if not a boolean.
 */
function assertBool(Value) {
    if (!(typeof Value === "boolean")) { throw ("assertBool(): Assertion exception, not a boolean."); }
}

/**
 * Asserts the provided value is a number.
 * @param Value is an object to test.
 * @throws An exception if not a number.
 */
function assertNumber(Value) {
    if (!(typeof Value === "number")) { throw ("assertNumber(): Assertion exception, not a number."); }
}

/**
 * Asserts the provided value is an integer.
 * @param Value is an object to test.
 * @throws An exception if not an integer.
 */
function assertInt(Value) {
    if (!(Number.isInteger(Value))) { throw ("assertInt(): Assertion exception, not an integer."); }
}

/**
 * Asserts the provided value is null.
 * @param Value is an object to test.
 * @throws An exception if not null.
 */
function assertNull(Value) {
    if (Value !== null) { throw ("assertNull(): Assertion exception, not null."); }
}

/**
 * Asserts the provided value is a function.
 * @param Value is an object to test.
 * @throws An exception if not a function.
 */
function assertFunction(Value) {
    if (typeof Value !== "function") { throw ("assertFunct(): Assertion exception, not a function."); }
}

/**
 * Asserts the provided value is an object.
 * @param Value is an object to test.
 * @throws An exception if not an object.
 */
function assertObject(Value) {
    if (!(typeof Value === "object")) { throw ("assertObject(): Assertion exception, not an object."); }
}

/**
 * Asserts the provided value is an array.
 * @param Value is an object to test.
 * @throws An exception if not an array.
 */
function assertArray(Value) {
    if (!Array.isArray(Value)) { throw ("assertArray(): Assertion exception, not an array."); }
}

/**
 * Turns any object or variable into a JSON string representation.
 * @param Jobj Is a Javascript object to turn into a JSON string.
 * @param Pretty Is a boolean with true for pretty print and false
 * for not. (Optional) (Default is true.)
 * @param Indent Is an integer with the number of tab indentations
 * to start with. This only applies if Pretty === true. (Optional)
 * (Default is 0.)
 */
function jStringify(Jobj, Pretty, Indent) {
    var rstr = "", count = 0, key, tstr = "", i, tres;
    //Jobj = setDef(Jobj, {});
    Jobj = setDef(Jobj, null);
    Pretty = setDef(Pretty, true);
    Indent = setDef(Indent, 0);
    if (Jobj === null) {
        if (Pretty === true) { jIndent(Indent); }
        rstr += "null";
    } else if (isArr(Jobj)) {
      for (i = 0; i < Jobj.length; i += 1) {
        if (Jobj[i] !== undefined) {
          if (i > 0) { tstr += ","; }
          if (Pretty === true && i > 0) { tstr += "\n"; }
          if (Pretty === true && isArr(Jobj[i]) === false && isObj(Jobj[i]) === false && typeof(Jobj[i]) !== "object") { tstr += jIndent(Indent + 1); }
          tstr += jStringify(Jobj[i], Pretty, Indent + 1);
          count += 1;
        }
      }
      if (Pretty === true && count > 0) {
        rstr += jIndent(Indent) + "[\n";
        rstr += tstr;
        if (tstr.trim() !== "") { rstr += "\n"; }
        rstr += jIndent(Indent) + "]";
      } else {
        rstr += "[" + tstr + "]"
      }
    } else if (isObj(Jobj) || typeof(Jobj) === "object") {
      for (key in Jobj) {
        if (Jobj.hasOwnProperty(key) && Jobj[key] !== undefined) {
          if (count > 0) { tstr += ","; }
          if (Pretty === true && count > 0) { tstr += "\n"; }
          tstr += jIndent(Indent + 1) + "\"" + key + "\":";
          tres = jStringify(Jobj[key], Pretty, Indent + 1);
          if (Pretty === true && startsWith(tres, "[]") === false && startsWith(tres, "{}") === false && (isArr(Jobj[key]) || ((isObj(Jobj[key]) || typeof(Jobj[key]) === "object") && Jobj[key] !== null))) { tstr += "\n"; }
          tstr += tres;
          count += 1;
        }
      }
      if (Pretty === true && count > 0) {
        rstr += jIndent(Indent) + "{\n";
        rstr += tstr;
        if (tstr.trim() !== "") { rstr += "\n"; }
        rstr += jIndent(Indent) + "}";
      } else {
        rstr += "{" + tstr + "}"
      }
    } else if (isNumber(Jobj) || isBool(Jobj)) {
      if (Pretty === true) { jIndent(Indent); }
      rstr += "" + Jobj;
    } else {
      rstr += "\"" + Jobj.escapeJson() + "\"";
    }
    return rstr;
}

/**
 * Parses the JSON string and returns a Javascript object.
 * @param Str Is a JSON encoded string.
 * @returns A plain old Javascript object.
 */
function jParse(Str) {
    var robj = JSON.parse(Str);
    return robj;
}

/**
 * Returns a string of tabs with the number equal to the integer
 * provided as an argument.
 * @param Indent Is an integer with the number of tab spaces to indent.
 * @returns A string with tab characters.
 */
function jIndent(Indent) {
    Indent = setDef(Indent, 0);
    var istr = "";
    for (var i = 0; i < Indent; i += 1) { istr += "\t"; }
    return istr;
}

/*
 * Extended native types.
 */

/**
 * Shortcut for defining new member methods for any object. This
 * will add the function to the prototype.
 * <br><br>
 * Standard way:
 * <br>
 * MyObj.prototype.someFunct = function () { console.log("something"); };
 * <br><br>
 * Using shortcut:
 * <br>
 * MyObj.p("someFunct", function () { console.log("something"); };
 */
Function.prototype.p = function (MemberName, FunctionInstance) {
    this.prototype[MemberName] = FunctionInstance;
    return this;
};

/**
 * Add object contains method. This method works for both JS objects
 * and arrays.
 * @param Needle is the item to check for.
 * @return A boolean with true for contains and false for not.
 */
Object.defineProperty(Object.prototype, 'contains', {
    value : function (Needle) {
        if (Array.isArray(this)) { return (this.indexOf(Needle) > -1); }
        return this.hasOwnProperty(Needle);
    },
    writable: true,
    enumerable: false
});

/**
 * Mixin method takes the source object and
 * combines it into the current object.
 * @param Source is the source object to mix in.
 * @return Object instance.
 */
Object.defineProperty(Object.prototype, 'mixin', {
    value : function (Source) {
        var prop;
        for (prop in Source) {
            if (Source.hasOwnProperty(prop)) {
                this[prop] = Source[prop];
            }
        }
        return this;
    },
    writable: true,
    enumerable: false
});

/*jslint forin:true */
/**
 * Creates a string with a JSON representation of the object.
 * @param Pretty is a boolean with true for pretty print and false for not.
 * @param ShowMeths is a boolean with true for show methods and false for not.
 * @return A string of the object in JSON format.
 */
Object.defineProperty(Object.prototype, 'jstr', {
    value : function (Pretty, ShowMeths) {
        var ret = "", mth;
        Pretty = setDef(Pretty, true);
        ret = jStringify(this, Pretty);
        if (ShowMeths) {
            ret += "\n";
            for (mth in this) {
                if (isFunct(this[mth])) {
                    ret += "Method: " + mth + "\n";
                }
            }
        }
        return ret;
    },
    writable: true,
    enumerable: false
});
/*jslint forin:false */

/**
 * Gets the number of properties in the object.
 * @return An int with the number of properties.
 */
Object.defineProperty(Object.prototype, 'length', {
    value : function () {
        var cnt = 0, key;
        for (key in this) {
            if (isFunct(this[key]) === false) {
                cnt += 1;
            }
        }
        return cnt;
    },
    writable: true,
    enumerable: false
});

/**
 * Add contains member to Strig prototype.
 * @param Str is a String to test for.
 * @return A boolean with true for contains and false for not.
 */
Object.defineProperty(String.prototype, 'contains', {
    value : function (Str) {
        return this.indexOf(Str) !== -1;
    },
    writable: true,
    enumerable: false
});

/**
 * Escapes special chars for packaging in a JSON string.
 * @return A string with escaped characters.
 */
Object.defineProperty(String.prototype, 'escapeJson', {
    value : function () {
        return this
        .replace(/[\"]/g, '\\"')
        .replace(/[\/]/g, '\\/')
        .replace(/[\b]/g, '\\b')
        .replace(/[\f]/g, '\\f')
        .replace(/[\n]/g, '\\n')
        .replace(/[\r]/g, '\\r')
        .replace(/[\t]/g, '\\t')
      ;
    },
    writable: true,
    enumerable: false
});

/**
 * Gets the item at the specified index. This
 * can be used from Java as an accessor to get
 * an item at the index.
 * @param Index is the index to get the item at.
 * @return A Javascript object at the index.
 */
Array.prototype.get = function (Index) {
    return this[Index];
};

/**
 * Generic JS exception.
 * @param Message is a string with the exception message.
 * @param Name is a string with the exception name. (Optional)
 */
function Exception(Message, Name) {
    BaseObj.call(this);
    this.message = setDef(Message, "");
    this.name = setDef(Name, "");
}
Exception.prototype = new BaseObj();
Exception.prototype.constructor = Exception;

/**
 * Browser uuid.get() function.
 */
var uuid = {
  get: function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
  },
}

// Get and set $ic9.platform. (mobile-native-app, mobile, desktop)
if ($ic9.platform !== "mobile-native-app") {
  if (window.innerWidth <= 800 && window.innerHeight <= 600) { $ic9.platform = "mobile";}
  else { $ic9.platform = "desktop"; }
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))$ic9.platform='mobile'})(navigator.userAgent||navigator.vendor||window.opera);
}
