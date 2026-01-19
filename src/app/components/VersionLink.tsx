import Link from 'next/link';
import packageJson from '../../../package.json';

// Version link component for bottom left of main frame
export function VersionLink() {
  return (
    <Link
      href="/version-history"
      className="absolute right-4 bottom-4 text-xs text-gray-500 hover:underline z-20"
      style={{ fontSize: '0.75rem' }}
      aria-label="Historial de versiones"
    >
      v{packageJson.version}
    </Link>
  );
}
