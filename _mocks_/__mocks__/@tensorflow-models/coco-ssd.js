export const load = jest.fn(() =>
  Promise.resolve({
    detect: jest.fn(() => Promise.resolve([])),
  })
);