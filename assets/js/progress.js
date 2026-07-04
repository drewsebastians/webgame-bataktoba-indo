const KEY = "batakTobaGameProgress";

const initial = {
  answered: 0,
  correct: 0,
  known: [],
  review: [],
  lastMode: "meaning",
};

export function getProgress() {
  try {
    return { ...initial, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return { ...initial };
  }
}

export function saveProgress(next) {
  localStorage.setItem(KEY, JSON.stringify({ ...getProgress(), ...next }));
}

export function recordAnswer(isCorrect, mode) {
  const progress = getProgress();
  saveProgress({
    answered: progress.answered + 1,
    correct: progress.correct + (isCorrect ? 1 : 0),
    lastMode: mode,
  });
}

export function markFlashcard(id, bucket) {
  const progress = getProgress();
  const known = new Set(progress.known);
  const review = new Set(progress.review);
  known.delete(id);
  review.delete(id);
  if (bucket === "known") known.add(id);
  if (bucket === "review") review.add(id);
  saveProgress({ known: [...known], review: [...review] });
}

