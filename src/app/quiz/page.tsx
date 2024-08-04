'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { useQuiz } from '@/lib/useQuiz';

export default function Quiz() {
  const quiz = useQuiz();

  return (
    <main className="w-full h-full flex flex-col items-center justify-center gap-y-4 p-24">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          quiz.onNext();
        }}
      >
        <div className="w-full max-w-screen-sm md:max-w-screen-md border bg-white border-slate-200 rounded-md p-8 space-y-8">
          {quiz.loading ? (
            <Spinner size="large" />
          ) : quiz.error != null ? (
            <p className="text-black text-xl">Error while loading quiz</p>
          ) : (
            <>
              <div className="flex flex-1 justify-end text-black">
                <p className="font-bold">
                  {quiz.number}/{quiz.total}
                </p>
              </div>
              <p className="text-black text-xl font-semibold">
                {quiz.currentQuestion?.question}
              </p>
              <RadioGroup
                onValueChange={(value) => quiz.setSelected(value)}
                className="grid grid-cols-2 gap-4"
              >
                {quiz.currentQuestion?.options.map((option) => (
                  <Label
                    key={option}
                    className={cn(
                      'bg-muted rounded-md p-4 text-center transition-colors border',
                      'hover:bg-accent hover:text-accent-foreground cursor-pointer',
                      'border-gray-400',
                      quiz.selected === option &&
                        'border-primary bg-primary/20',
                      quiz.selected === option &&
                        quiz.isCorrectAnswer === true &&
                        'border-secondary bg-secondary/20',
                      quiz.selected === option &&
                        quiz.isCorrectAnswer === false &&
                        'border-destructive bg-destructive/20',
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
                  disabled={quiz.selected == null}
                  size="lg"
                >
                  {quiz.isCorrectAnswer === true ? 'Continue' : 'Submit'}
                </Button>
              </div>
            </>
          )}
        </div>
      </form>
    </main>
  );
}
