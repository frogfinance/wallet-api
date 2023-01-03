export const chunksParser = body => {
  return body
    .replace(/^(\w{1,3})\r\n/, '') // replace header chunks info
    .replace(/\r\n(\w{1,3})\r\n/, '') // replace in-body chunks info
    .replace(/(\r\n0\r\n\r\n)$/, ''); // replace end chunks info
};
