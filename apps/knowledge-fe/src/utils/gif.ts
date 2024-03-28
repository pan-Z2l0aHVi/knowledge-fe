export type OnFrame = (i: number, data_url: string, num_frames: number) => void
export async function parse_gif_frame(array_buffer: ArrayBuffer, on_frame: OnFrame) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', {
    // https://html.spec.whatwg.org/multipage/canvas.html#concept-canvas-will-read-frequently
    willReadFrequently: true
  }) as CanvasRenderingContext2D
  const { GifReader } = await import('omggif')
  const gif_reader = new GifReader(new Uint8Array(array_buffer))
  const num_frames = gif_reader.numFrames()
  canvas.width = gif_reader.width
  canvas.height = gif_reader.height

  let image_data = ctx.createImageData(canvas.width, canvas.height)
  let previous_data = ctx.createImageData(canvas.width, canvas.height)

  const load_frame = (i: number) => {
    const frame_pixels = new Uint8Array(canvas.width * canvas.height * 4)
    gif_reader.decodeAndBlitFrameRGBA(i, frame_pixels)
    const { x, y, width, height, disposal } = gif_reader.frameInfo(i)
    for (let row = 0; row < height; row++) {
      for (let column = 0; column < width; column++) {
        const index_offset = 4 * (x + y * canvas.width)
        const j = index_offset + 4 * (column + row * canvas.width)
        if (frame_pixels[j + 3]) {
          image_data.data[j + 0] = frame_pixels[j + 0]
          image_data.data[j + 1] = frame_pixels[j + 1]
          image_data.data[j + 2] = frame_pixels[j + 2]
          image_data.data[j + 3] = frame_pixels[j + 3]
        }
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.putImageData(image_data, 0, 0)

    switch (disposal) {
      case 2: // "Return to background", blank out the current frame
        ctx.clearRect(x, y, width, height)
        image_data = ctx.getImageData(0, 0, canvas.width, canvas.height)
        break
      case 3: // "Restore to previous", copy previous data to current
        image_data = ctx.createImageData(canvas.width, canvas.height)
        image_data.data.set(previous_data.data)
        break
      default:
        // 0 and 1, as well as 4+ modes = do-not-dispose, so cache frame
        previous_data = ctx.getImageData(0, 0, canvas.width, canvas.height)
        break
    }
    const data_url = canvas.toDataURL()
    on_frame(i, data_url, num_frames)

    if (i < num_frames - 1) {
      requestAnimationFrame(() => {
        load_frame(i + 1)
      })
    }
  }

  load_frame(0)
}
