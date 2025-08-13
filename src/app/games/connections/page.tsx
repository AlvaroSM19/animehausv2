import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with localStorage usage
const ConnectionsGame = dynamic(() => import('../../../components/ConnectionsGame'), { ssr: false });

export default function ConnectionsPage() {
  return <ConnectionsGame />;
}
