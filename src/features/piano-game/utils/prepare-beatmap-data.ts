export const prepareBeatmapData = (
  rawBeatmap: Uint8Array<ArrayBufferLike>
): string => {
  const decoder = new TextDecoder('utf-8')

  // BG

  // AUDIO

  return decoder.decode(rawBeatmap)
}
