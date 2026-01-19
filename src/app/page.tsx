'use client';

import QuizApp from './QuizApp';
import Link from 'next/link';
import packageJson from '../../package.json';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <QuizApp />
    </div>
  );
}
