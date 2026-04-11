import '@testing-library/jest-dom';
// Mock IntersectionObserver
const mockIntersectionObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

window.IntersectionObserver = mockIntersectionObserver as any;
