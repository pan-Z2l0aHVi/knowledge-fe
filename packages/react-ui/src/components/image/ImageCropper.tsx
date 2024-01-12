import './image-cropper.scss'

import { base64ToFile } from 'file64'
import {
	Dispatch,
	ForwardedRef,
	forwardRef,
	ReactNode,
	SetStateAction,
	useCallback,
	useImperativeHandle,
	useMemo,
	useRef,
	useState
} from 'react'
import Cropper from 'react-easy-crop'
import { useTranslation } from 'react-i18next'
import {
	TbCrop,
	TbRefreshDot,
	TbRotate,
	TbRotateClockwise,
	TbViewportNarrow,
	TbViewportWide,
	TbZoomIn,
	TbZoomOut
} from 'react-icons/tb'

import { UI_PREFIX } from '../../constants'
import { cropImageToBase64 } from '../../utils/image64'
import Button from '../button'
import Card from '../card'
import CloseIcon from '../close-icon'
import Overlay from '../overlay'
import Slider from '../slider'
import Space from '../space'
import Tooltip from '../tooltip'

import type { Area, Point } from 'react-easy-crop'
interface ImageCropperProps {
	file: File
	title?: ReactNode
	open?: boolean
	onClose?: () => void
	onCrop?: (result: File) => void
	onCancel?: () => void
	initialAspectRatio?: number
	aspectRatioFixed?: boolean
	cropShape?: 'rect' | 'round'
	showGrid?: boolean
	minZoom?: number
	maxZoom?: number
}
interface ImageCropperRef {
	rotate: Dispatch<SetStateAction<number>>
	scale: Dispatch<SetStateAction<number>>
	changeAspectRatio: Dispatch<SetStateAction<number>>
	reset: () => void
	cancel: () => void
	crop: () => Promise<void>
}
function ImageCropper(props: ImageCropperProps, ref: ForwardedRef<ImageCropperRef>) {
	const { t } = useTranslation()
	const {
		title = t('react_ui.title.crop'),
		open,
		onClose,
		file,
		onCrop,
		onCancel,
		initialAspectRatio = 4 / 3,
		aspectRatioFixed = false,
		cropShape = 'rect',
		showGrid = true,
		minZoom = 1,
		maxZoom = 4
	} = props

	const src = useMemo(() => file && window.URL.createObjectURL(file), [file])
	const initialCrop = { x: 0, y: 0 }
	const initialArea = {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	}
	const [aspectRatio, setAspectRatio] = useState(initialAspectRatio)
	const [crop, setCrop] = useState<Point>(initialCrop)
	const [rotation, setRotation] = useState(0)
	const [zoom, setZoom] = useState(1)
	const cropPixelsRef = useRef<Area>(initialArea)
	const [loading, setLoading] = useState(false)

	const onCropComplete = (_: Area, areaPixels: Area) => {
		cropPixelsRef.current = areaPixels
	}

	const prefixCls = `${UI_PREFIX}-image-cropper`

	const handleReset = useCallback(() => {
		setRotation(0)
		setZoom(1)
		setAspectRatio(initialAspectRatio)
	}, [initialAspectRatio])

	const handleCancel = useCallback(() => {
		onCancel?.()
		onClose?.()
	}, [onCancel, onClose])

	const handleCrop = useCallback(async () => {
		setLoading(true)
		try {
			const base64 = await cropImageToBase64({ file, ...cropPixelsRef.current })
			const result = await base64ToFile(base64, file.name)
			onCrop?.(result)
			onClose?.()
		} catch (error) {
			console.error('Crop error: ', error)
		} finally {
			setLoading(false)
		}
	}, [file, onClose, onCrop])

	useImperativeHandle(ref, () => ({
		rotate: setRotation,
		scale: setZoom,
		changeAspectRatio: setAspectRatio,
		reset: handleReset,
		cancel: handleCancel,
		crop: handleCrop
	}))

	const operatorBar = (
		<div className={`${prefixCls}-operator-bar`}>
			<Space size="large" align="center">
				<Tooltip title={t('react_ui.rotate_counterclockwise')}>
					<Button circle text disabled={rotation <= -180}>
						<TbRotate size={18} onClick={() => setRotation(p => p - 1)} />
					</Button>
				</Tooltip>
				<Slider
					tooltipFormatter={val => `${Math.round(val)}°`}
					min={-180}
					max={180}
					value={rotation}
					onChange={setRotation}
				/>
				<Tooltip title={t('react_ui.rotate_clockwise')}>
					<Button circle text disabled={rotation >= 180}>
						<TbRotateClockwise size={18} onClick={() => setRotation(p => p + 1)} />
					</Button>
				</Tooltip>
			</Space>

			<Space size="large" align="center">
				<Tooltip title={t('react_ui.zoom.out')}>
					<Button circle text disabled={zoom <= minZoom}>
						<TbZoomOut size={18} onClick={() => setZoom(p => Math.max(minZoom, p - 0.1))} />
					</Button>
				</Tooltip>
				<Slider
					tooltipFormatter={val => val.toFixed(1)}
					min={minZoom}
					max={maxZoom}
					value={zoom}
					onChange={setZoom}
				/>
				<Tooltip title={t('react_ui.zoom.in')}>
					<Button circle text disabled={zoom >= maxZoom}>
						<TbZoomIn size={18} onClick={() => setZoom(p => Math.min(maxZoom, p + 0.1))} />
					</Button>
				</Tooltip>
			</Space>

			{aspectRatioFixed || (
				<Space size="large" align="center">
					<Tooltip title={t('react_ui.narrower')}>
						<Button circle text disabled={aspectRatio <= 0.25}>
							<TbViewportNarrow size={18} onClick={() => setAspectRatio(p => p - 0.01)} />
						</Button>
					</Tooltip>
					<Slider
						tooltipFormatter={val => val.toFixed(2)}
						min={0.25}
						max={4}
						value={aspectRatio}
						onChange={setAspectRatio}
					/>
					<Tooltip title={t('react_ui.wider')}>
						<Button circle text disabled={aspectRatio >= 4}>
							<TbViewportWide size={18} onClick={() => setAspectRatio(p => p + 0.01)} />
						</Button>
					</Tooltip>
				</Space>
			)}
		</div>
	)

	const header = (
		<div className={`${prefixCls}-header`}>
			<strong className={`${prefixCls}-header-title`}>{title}</strong>
			<CloseIcon className={`${prefixCls}-close-icon`} onClick={handleCancel} />
		</div>
	)

	const footer = (
		<div className={`${prefixCls}-footer`}>
			{operatorBar}
			<div className={`${prefixCls}-footer-bottom`}>
				<Button prefixIcon={<TbRefreshDot size={18} />} onClick={handleReset}>
					{t('react_ui.reset.text')}
				</Button>
				<Button prefixIcon={<TbCrop size={18} />} primary loading={loading} onClick={handleCrop}>
					{t('react_ui.accomplish')}
				</Button>
			</div>
		</div>
	)

	return (
		<Overlay unmountOnExit open={open} onCancel={handleCancel}>
			<Card className={`${prefixCls}-card`} shadow header={header} footer={footer}>
				<div className={`${prefixCls}-content`}>
					<Cropper
						classes={{ containerClassName: `${prefixCls}-container` }}
						image={src}
						cropShape={cropShape}
						showGrid={showGrid}
						minZoom={minZoom}
						maxZoom={maxZoom}
						aspect={aspectRatio}
						rotation={rotation}
						onRotationChange={setRotation}
						zoom={zoom}
						onZoomChange={setZoom}
						crop={crop}
						onCropChange={setCrop}
						onCropComplete={onCropComplete}
					/>
				</div>
			</Card>
		</Overlay>
	)
}
ImageCropper.displayName = 'ImageCropper'
export default forwardRef(ImageCropper)
