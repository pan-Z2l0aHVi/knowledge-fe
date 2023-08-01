import { Divider, Space, Upload } from '@youknown/react-ui/src'
import { delay } from '@youknown/utils/src'
import { ComponentProps, useState } from 'react'

type UploadFileList = Required<ComponentProps<typeof Upload>>['value']
export default () => {
	const [fileList, setFileList] = useState<UploadFileList>([])
	const [uploading, setUploading] = useState(false)
	return (
		<div className="p-24px">
			<h1>Upload</h1>
			<Divider />
			<Space>
				<Upload
					defaultValue={[]}
					action={async () => {
						await delay(2000)
						return 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
					}}
				/>
				<Upload
					circle
					defaultValue={[]}
					action={async () => {
						await delay(2000)
						return 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
					}}
				/>
			</Space>
			<Divider />
			<Space>
				<Upload disabled defaultValue={[]} />
			</Space>
			<Divider />
			<Space>
				<Upload
					value={fileList}
					onChange={setFileList}
					multiple
					action={async () => {
						setUploading(true)
						await delay(2000)
						setUploading(false)
						return 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
					}}
				>
					<ul className="min-w-80px min-h-80px m-0 p-0">
						{uploading
							? 'uploading...'
							: fileList.map(file => {
									return (
										<li key={file.uid} className="m-16px">
											{file.url}
										</li>
									)
							  })}
					</ul>
				</Upload>
			</Space>
		</div>
	)
}
