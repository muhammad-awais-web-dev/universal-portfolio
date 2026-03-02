// Wrapper around revalidateTag that works in both Route Handlers and Server Actions.
// Next.js 15 types require a second "profile" arg (experimental cacheLife feature),
// but the 2-arg form only works inside Server Actions with dynamicIO enabled.
// Route Handlers should call the classic 1-arg form.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { revalidateTag: _revalidateTag, revalidatePath: _revalidatePath } = require('next/cache') as {
  revalidateTag: (tag: string) => void;
  revalidatePath: (path: string, type?: 'page' | 'layout') => void;
};

export function invalidateTag(tag: string): void {
  _revalidateTag(tag);
  if (tag === 'portfolio') {
    _revalidatePath('/', 'page');
    _revalidatePath('/projects', 'page');
    _revalidatePath('/projects/[slug]', 'page');
    _revalidatePath('/experience', 'page');
    _revalidatePath('/experience/[id]', 'page');
    _revalidatePath('/education', 'page');
    _revalidatePath('/education/[id]', 'page');
    _revalidatePath('/certifications', 'page');
    _revalidatePath('/certifications/[id]', 'page');
  }
}
