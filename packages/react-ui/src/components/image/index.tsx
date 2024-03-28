import { crop } from './crop'
import { Image as _Image } from './Image'
import { ImageCropper } from './ImageCropper'
import { ImagePreview } from './ImagePreview'
import { preview } from './preview'

interface ImageCommand {
  preview: typeof preview
  ImagePreview: typeof ImagePreview
  crop: typeof crop
  ImageCropper: typeof ImageCropper
}
export const Image = _Image as typeof _Image & ImageCommand
Image.preview = preview
Image.ImagePreview = ImagePreview
Image.crop = crop
Image.ImageCropper = ImageCropper
