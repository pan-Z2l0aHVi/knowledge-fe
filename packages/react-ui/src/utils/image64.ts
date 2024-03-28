interface CropImageParams {
  file: File
  x: number
  y: number
  width: number
  height: number
}

export function cropImageToBase64({ file, x, y, width, height }: CropImageParams): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return reject('Canvas context not supported.')
    }
    const image = new Image()
    const reader = new FileReader()
    reader.onload = e => {
      if (e.target && typeof e.target.result === 'string') {
        image.src = e.target.result
      }
    }
    reader.readAsDataURL(file)

    image.onload = () => {
      canvas.width = width
      canvas.height = height
      ctx.drawImage(image, x, y, width, height, 0, 0, width, height)
      const croppedBase64 = canvas.toDataURL(file.type)
      resolve(croppedBase64)
    }
    image.onerror = () => {
      reject('Failed to load the image.')
    }
  })
}
