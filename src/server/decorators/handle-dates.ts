
export function HandleDates(dateProps: string[]) {
  return function (target, propName) {
    console.log('dateProps', dateProps);
    let _val = target[propName];
    const descriptor = {
      get() {
        return _val;
      },
      set(val) {
        _val = val;
      }
    };

    dateProps.map(prop => {
      Object.defineProperty(target, prop, descriptor)
    });
  }
}

