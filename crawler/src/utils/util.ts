interface Result {
  result: boolean;
  errMsg?: string;
  data: any;
}

export const getResponseData = (data: any, errMsg?: string): Result => {
  if (errMsg) {
    return {
      result: false,
      errMsg,
      data,
    };
  } else {
    return {
      result: true,
      data,
    };
  }
};
