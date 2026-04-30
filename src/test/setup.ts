import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Create an actual class to mock IntersectionObserver for framer-motion
class IntersectionObserverMock {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() { return []; }
  unobserve() {}
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
window.IntersectionObserver = IntersectionObserverMock as any;
