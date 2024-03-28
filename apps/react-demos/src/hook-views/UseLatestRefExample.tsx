import { useLatestRef } from '@youknown/react-hook'
import { useEffect, useState } from 'react'

export default () => {
  const [count, setCount] = useState(0)
  const countRef = useLatestRef(count)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('count', count) // 一直为 0
      console.log('countRef.current)', countRef.current) // 最新count
    }, 2000)
    return () => clearInterval(interval)
  }, [])
  return (
    <>
      <button onClick={() => setCount(p => p + 1)}>Increase</button>
      <div>Count: {count}</div>
    </>
  )
}
