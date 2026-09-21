let tail: Promise<void> = Promise.resolve();

/** Runs async work one at a time (FIFO) to avoid heavy parallel CPU work (e.g. Sharp). */
export function runSerialized<T>(task: () => Promise<T>): Promise<T> {
  const run = tail.then(task, task);
  tail = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}
