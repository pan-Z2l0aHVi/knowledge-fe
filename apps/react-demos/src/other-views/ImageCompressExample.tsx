import { compressImage } from '@youknown/img-wasm/src'

export default () => {
  return (
    <>
      <input
        type="file"
        onChange={e => {
          const [file] = e.target.files ?? []
          console.log('file before: ', file)
          if (file) {
            compressImage(file, 600, 300).then(res => {
              console.log('file after: ', res)
            })
          }
        }}
      />
    </>
  )
}
