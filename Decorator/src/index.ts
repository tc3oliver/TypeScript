function catchError(msg: string) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const fn = descriptor.value;
    descriptor.value = function () {
      try {
        fn();
      } catch (e) {
        console.log(msg);
      }
    };
  };
}

const userInfo: any = undefined

class Test {
  @catchError('userInfo.name no found')
  getName() {
    return userInfo.name
  }
}

(new Test()).getName()