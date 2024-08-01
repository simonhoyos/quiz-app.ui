'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { useFetch } from '@/lib/useFetch';

type Question = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};

export default function Quiz() {
  const [selected, setSelected] = React.useState<string | undefined>();

  const { error, loading, data } = useFetch<Question[]>('quiz.json');

  return (
    <main className="w-full h-full flex flex-col items-center justify-center gap-y-4 p-24">
      <div className="w-full max-w-screen-sm md:max-w-screen-md border bg-white border-slate-200 rounded-md p-8 space-y-8">
        {loading ? (
          <Spinner size="large" />
        ) : error != null ? (
          <p className="text-black text-xl">Error while loading quiz</p>
        ) : (
          <>
            <p className="text-black text-xl font-semibold">
              {data?.at(0)?.question}
            </p>
            <RadioGroup
              onValueChange={(value) => setSelected(value)}
              className="grid grid-cols-2 gap-4"
            >
              {data?.at(0)?.options.map((option) => (
                <Label
                  key={option}
                  className={cn(
                    'bg-muted rounded-md p-4 text-center transition-colors',
                    'hover:bg-accent hover:text-accent-foreground cursor-pointer',
                    selected === option
                      ? 'border border-primary'
                      : 'border border-gray-400',
                  )}
                >
                  <RadioGroupItem
                    value={option}
                    id={option}
                    className="sr-only"
                  />
                  <span>{option}</span>
                </Label>
              ))}
            </RadioGroup>

            <div className="flex flex-1 justify-end gap-x-4">
              <Button
                type="submit"
                disabled={selected == null}
                size="lg"
              >
                Submit
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
