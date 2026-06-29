const badgeColors = [
  // Red
  "bg-red-50 text-red-700 border-red-200",
  "bg-red-100 text-red-800 border-red-300",
  "bg-red-200 text-red-900 border-red-400",

  // Orange
  "bg-orange-50 text-orange-700 border-orange-200",
  "bg-orange-100 text-orange-800 border-orange-300",
  "bg-orange-200 text-orange-900 border-orange-400",

  // Amber
  "bg-amber-50 text-amber-700 border-amber-200",
  "bg-amber-100 text-amber-800 border-amber-300",
  "bg-amber-200 text-amber-900 border-amber-400",

  // Yellow
  "bg-yellow-50 text-yellow-700 border-yellow-200",
  "bg-yellow-100 text-yellow-800 border-yellow-300",
  "bg-yellow-200 text-yellow-900 border-yellow-400",

  // Lime
  "bg-lime-50 text-lime-700 border-lime-200",
  "bg-lime-100 text-lime-800 border-lime-300",
  "bg-lime-200 text-lime-900 border-lime-400",

  // Green
  "bg-green-50 text-green-700 border-green-200",
  "bg-green-100 text-green-800 border-green-300",
  "bg-green-200 text-green-900 border-green-400",

  // Emerald
  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "bg-emerald-100 text-emerald-800 border-emerald-300",
  "bg-emerald-200 text-emerald-900 border-emerald-400",

  // Teal
  "bg-teal-50 text-teal-700 border-teal-200",
  "bg-teal-100 text-teal-800 border-teal-300",
  "bg-teal-200 text-teal-900 border-teal-400",

  // Cyan
  "bg-cyan-50 text-cyan-700 border-cyan-200",
  "bg-cyan-100 text-cyan-800 border-cyan-300",
  "bg-cyan-200 text-cyan-900 border-cyan-400",

  // Sky
  "bg-sky-50 text-sky-700 border-sky-200",
  "bg-sky-100 text-sky-800 border-sky-300",
  "bg-sky-200 text-sky-900 border-sky-400",

  // Blue
  "bg-blue-50 text-blue-700 border-blue-200",
  "bg-blue-100 text-blue-800 border-blue-300",
  "bg-blue-200 text-blue-900 border-blue-400",

  // Indigo
  "bg-indigo-50 text-indigo-700 border-indigo-200",
  "bg-indigo-100 text-indigo-800 border-indigo-300",
  "bg-indigo-200 text-indigo-900 border-indigo-400",

  // Violet
  "bg-violet-50 text-violet-700 border-violet-200",
  "bg-violet-100 text-violet-800 border-violet-300",
  "bg-violet-200 text-violet-900 border-violet-400",

  // Purple
  "bg-purple-50 text-purple-700 border-purple-200",
  "bg-purple-100 text-purple-800 border-purple-300",
  "bg-purple-200 text-purple-900 border-purple-400",

  // Fuchsia
  "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300",
  "bg-fuchsia-200 text-fuchsia-900 border-fuchsia-400",

  // Pink
  "bg-pink-50 text-pink-700 border-pink-200",
  "bg-pink-100 text-pink-800 border-pink-300",
  "bg-pink-200 text-pink-900 border-pink-400",

  // Rose
  "bg-rose-50 text-rose-700 border-rose-200",
  "bg-rose-100 text-rose-800 border-rose-300",
  "bg-rose-200 text-rose-900 border-rose-400",

  // Slate
  "bg-slate-50 text-slate-700 border-slate-200",
  "bg-slate-100 text-slate-800 border-slate-300",
  "bg-slate-200 text-slate-900 border-slate-400",

  // Zinc
  "bg-zinc-50 text-zinc-700 border-zinc-200",
  "bg-zinc-100 text-zinc-800 border-zinc-300",
  "bg-zinc-200 text-zinc-900 border-zinc-400",

  // Neutral
  "bg-neutral-50 text-neutral-700 border-neutral-200",
  "bg-neutral-100 text-neutral-800 border-neutral-300",
  "bg-neutral-200 text-neutral-900 border-neutral-400",

  // Stone
  "bg-stone-50 text-stone-700 border-stone-200",
  "bg-stone-100 text-stone-800 border-stone-300",
  "bg-stone-200 text-stone-900 border-stone-400",

  // Gray
  "bg-gray-50 text-gray-700 border-gray-200",
  "bg-gray-100 text-gray-800 border-gray-300",
  "bg-gray-200 text-gray-900 border-gray-400",
]

export function randomColorByString(string: string) {
  if (!string.length) return badgeColors[badgeColors.length - 1]

  let hash = 0
  for (let i = 0; i < string?.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  return badgeColors[Math.abs(hash) % badgeColors.length]
}
