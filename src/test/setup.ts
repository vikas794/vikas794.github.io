import '@testing-library/jest-dom';

// Mock IntersectionObserver
const mockIntersectionObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};
global.IntersectionObserver = mockIntersectionObserver as any;
