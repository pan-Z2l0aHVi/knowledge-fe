import { Motion, Progress } from '@youknown/react-ui/src'

import { useUIStore } from '@/stores'

export default function PageProgress() {
  const percent = useUIStore(state => state.progress_percent)
  const progress_visible = useUIStore(state => state.progress_visible)
  return (
    <Motion.Fade in={progress_visible} mountOnEnter unmountOnExit>
      <div className="fixed top-0 left-0 z-25 w-screen">
        <Progress format={null} size="small" percent={percent} />
      </div>
    </Motion.Fade>
  )
}
