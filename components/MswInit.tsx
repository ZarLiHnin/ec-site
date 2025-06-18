'use client'; // これがないとクライアントコンポーネントになりません

import { useEffect } from 'react';
import { worker } from '../mocks/browser';

export default function MswInit() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      worker.start();
    }
  }, []);

  return null;
}
