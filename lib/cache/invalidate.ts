// Wrapper around revalidateTag that works in both Route Handlers and Server Actions.
// Next.js 15 types require a second "profile" arg (experimental cacheLife feature),
// but the 2-arg form only works inside Server Actions with dynamicIO enabled.
// Route Handlers should call the classic 1-arg form.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { revalidateTag: _revalidateTag } = require('next/cache') as {
  revalidateTag: (tag: string) => void;
};

export function invalidateTag(tag: string): void {
  _revalidateTag(tag);
}
