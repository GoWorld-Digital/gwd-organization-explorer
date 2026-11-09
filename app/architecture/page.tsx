import type { Metadata } from 'next';
import Link from 'next/link';
import Explorer from '../../components/Explorer';
import '../globals.css';
export const metadata: Metadata = { title: 'Organization, capabilities & simulations — GWD' };
export default function ArchitecturePage() {
  return <div className="architecture-shell"><Link className="return-to-genesis" href="/">← Return to the GWD universe</Link><Explorer /></div>;
}
