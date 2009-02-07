/**
 * Function to extend a class from a superclass.
 *
 * To use, simply define the constructor, then just after the constructor,
 * call this. Ie:
 *
 *     function RootClass() {
 *     }
 *
 *     function SubClass() {
 *       SubClass.superclass.constructor();
 *     }
 *     extend(RootClass, SubClass);
 *
 * There you go! =o)
 */
function extend(superclass, subclass) {
  function Dummy() {}

  Dummy.prototype = superclass.prototype;
  subclass.prototype = new Dummy();
  subclass.prototype.constructor = subclass;
  subclass.superclass = superclass;
  subclass.superproto = superclass.prototype;
}
