import { useFetch } from '@youknown/react-hook/src'
import { Button } from '@youknown/react-ui/src'
import { uuid } from '@youknown/utils/src'

let reqID = 0
const mockRequest = () =>
  new Promise<{
    id: number
    content: string
  }>(resolve => {
    const duration = Math.random() * 3000
    const currentID = ++reqID
    setTimeout(() => {
      const res = {
        id: currentID,
        content: uuid()
      }
      console.log(`${currentID}---${res.content}`)
      resolve(res)
    }, duration)
  })

export default () => {
  const { data, loading, run: do_fetch } = useFetch(mockRequest)
  return (
    <>
      <Button onClick={do_fetch}>Request</Button>
      <div className="pt-24px">{loading ? <div>loading...</div> : <div>{data?.content}</div>}</div>
    </>
  )
}
