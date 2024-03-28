import { Button, Divider, Image, Space } from '@youknown/react-ui/src'

export default () => {
  const picSrc = 'https://iph.href.lu/879x400'
  return (
    <div>
      <h1>Image</h1>
      <Divider />
      <Image canPreview previewSrc={picSrc} src={picSrc} width="300px" />
      <Divider />
      <Image canPreview previewSrc={picSrc} src={picSrc} width="300px" minZoom={0.5} maxZoom={2} />
      <Divider />
      <Image canPreview previewSrc={picSrc} toolbarVisible={false} src={picSrc} width="300px" />
      <Divider />
      <Image src={picSrc} width="300px" />
      <Divider />
      <Space>
        <Button
          onClick={() => {
            Image.preview({
              url: picSrc
            })
          }}
        >
          Preview image
        </Button>
        <Button
          onClick={() => {
            Image.preview({
              url: picSrc,
              toolbarVisible: false
            })
          }}
        >
          Preview image without toolbar
        </Button>
      </Space>
      <Divider />
      <Space>
        <input
          type="file"
          accept="image/*"
          onChange={e => {
            const [file] = e.target.files ?? []
            Image.crop({
              file,
              onCrop(result) {
                console.log('clip result: ', result)
              }
            })
          }}
        />
      </Space>
      <Divider />
    </div>
  )
}
