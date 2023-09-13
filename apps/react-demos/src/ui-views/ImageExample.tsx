import { Button, Divider, Image, Space } from '@youknown/react-ui/src'

export default () => {
	const picSrc = 'https://iph.href.lu/879x400'
	return (
		<div className="p-24px">
			<h1>Image</h1>
			<Divider />
			<Image src={picSrc} width="300px" />
			<Divider />
			<Image src={picSrc} width="300px" scaleRange={[0.5, 1, 2]} />
			<Divider />
			<Image toolbarVisible={false} src={picSrc} width="300px" />
			<Divider />
			<Image previewDisabled src={picSrc} width="300px" />
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
		</div>
	)
}
