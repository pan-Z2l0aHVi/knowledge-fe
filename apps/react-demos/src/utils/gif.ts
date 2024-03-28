export type OnFrame = (i: number, dataUrl: string, numFrames: number) => void
export async function parseGIFFrame(arrayBuffer: ArrayBuffer, onFrame: OnFrame) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', {
    // https://html.spec.whatwg.org/multipage/canvas.html#concept-canvas-will-read-frequently
    willReadFrequently: true
  }) as CanvasRenderingContext2D
  const { GifReader } = await import('omggif')
  const gifReader = new GifReader(new Uint8Array(arrayBuffer))
  const numFrames = gifReader.numFrames()
  canvas.width = gifReader.width
  canvas.height = gifReader.height

  let imageData = ctx.createImageData(canvas.width, canvas.height)
  let previousData = ctx.createImageData(canvas.width, canvas.height)

  const loadFrame = (i: number) => {
    const framePixels = new Uint8Array(canvas.width * canvas.height * 4)
    gifReader.decodeAndBlitFrameRGBA(i, framePixels)
    const { x, y, width, height, disposal } = gifReader.frameInfo(i)
    for (let row = 0; row < height; row++) {
      for (let column = 0; column < width; column++) {
        const indexOffset = 4 * (x + y * canvas.width)
        const j = indexOffset + 4 * (column + row * canvas.width)
        if (framePixels[j + 3]) {
          imageData.data[j + 0] = framePixels[j + 0]
          imageData.data[j + 1] = framePixels[j + 1]
          imageData.data[j + 2] = framePixels[j + 2]
          imageData.data[j + 3] = framePixels[j + 3]
        }
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.putImageData(imageData, 0, 0)

    switch (disposal) {
      case 2: // "Return to background", blank out the current frame
        ctx.clearRect(x, y, width, height)
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        break
      case 3: // "Restore to previous", copy previous data to current
        imageData = ctx.createImageData(canvas.width, canvas.height)
        imageData.data.set(previousData.data)
        break
      default:
        // 0 and 1, as well as 4+ modes = do-not-dispose, so cache frame
        previousData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        break
    }
    const dataUrl = canvas.toDataURL()
    onFrame(i, dataUrl, numFrames)

    if (i < numFrames - 1) {
      requestAnimationFrame(() => {
        loadFrame(i + 1)
      })
    }
  }

  loadFrame(0)
}
