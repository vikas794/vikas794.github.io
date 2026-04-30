import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver for motion/react whileInView
const IntersectionObserverMock = vi.fn(function () {
  return {
    disconnect: vi.fn(),
    observe: vi.fn(),
    takeRecords: vi.fn(),
    unobserve: vi.fn(),
  };
});

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
