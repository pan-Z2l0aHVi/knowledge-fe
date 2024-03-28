export default function uuid(): string {
  return window.URL.createObjectURL(new Blob()).slice(-36)
}
