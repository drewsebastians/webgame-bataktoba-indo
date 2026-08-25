/** LearningResource generator — published lessons only. */

export function learningResource(lesson, baseUrl) {
  if (!lesson || lesson.publicationStatus !== "published") return null;
  const count = lesson.counts?.poolItems ?? 0;
  if (!lesson.slug || count === 0 || !Array.isArray(lesson.itemIds) || lesson.itemIds.length === 0)
    return null;
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: lesson.title,
    description: lesson.description,
    url: `${baseUrl}belajar/${lesson.slug}/`,
    inLanguage: "id",
    learningResourceType: "Lesson",
    educationalLevel: String(lesson.level ?? 1),
    timeRequired: `PT${lesson.estMinutes}M`,
    reviewStatus: lesson.reviewRollup,
    numberOfItems: count,
  };
}
