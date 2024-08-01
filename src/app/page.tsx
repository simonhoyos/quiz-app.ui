import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <header className="w-full h-full flex flex-col items-center justify-center gap-y-4">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-black text-4xl font-bold tracking-tight sm:text-6xl">
            Quizzes to prepare for your next technical interview
          </h1>
          <p className="text-black mt-6 text-lg leading-8">
            Ready to take your first quiz?
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              asChild
              variant="default"
            >
              <Link href="/quiz">Get started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
