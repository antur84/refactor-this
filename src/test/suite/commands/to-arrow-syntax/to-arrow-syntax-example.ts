class FuncToArrowExample {
  private complexMethodWithParamsAndArgs<T>(t: T) {
    return t;
  }
  simpleMethod() {
    const a = 1 + 1;
    return a;
  }

  arrowProperty = () => {};

  methodInClass() {
    this.complexMethodWithParamsAndArgs(10);
  }
}
function funcDeclaration() {
  var test = new FuncToArrowExample();
  test.simpleMethod();
}
