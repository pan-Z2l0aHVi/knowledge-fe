import { Button, Card, Divider, Loading, Space } from '@youknown/react-ui/src'
import { useState } from 'react'
import { TbLoader } from 'react-icons/tb'

export default () => {
  const [spinning, setSpinning] = useState(true)
  return (
    <div>
      <h1>Loading</h1>
      <Divider />
      <Loading spinning />
      <Divider />
      <Space size="large">
        <Loading size="small" spinning />
        <Loading size="medium" spinning />
        <Loading size="large" spinning />
      </Space>
      <Divider />
      <Space size="large">
        <Loading bordered size="small" spinning />
        <Loading bordered size="medium" spinning />
        <Loading bordered size="large" spinning />
      </Space>
      <Divider />
      <Space size="large">
        <Loading icon={<TbLoader />} size="small" spinning />
        <Loading icon={<TbLoader />} size="medium" spinning />
        <Loading icon={<TbLoader />} size="large" spinning />
      </Space>
      <Divider />
      <Space direction="vertical">
        <Button
          onClick={() => {
            setSpinning(p => !p)
          }}
        >
          {spinning ? 'Cancel' : 'Start'} spinning
        </Button>
        <Space>
          <Loading spinning={spinning} />
          <Loading spinning={spinning}>
            <Card header="Loading wrapper">Content</Card>
          </Loading>
          <Loading bordered spinning={spinning}>
            <Card header="Bordered spinning">Content</Card>
          </Loading>
          <Loading icon={<TbLoader />} spinning={spinning}>
            <Card header="Custom spinning icon">Content</Card>
          </Loading>
        </Space>
      </Space>
      <Divider />
      <Loading description="Loading..." spinning>
        <Card header="Description">Content</Card>
      </Loading>
    </div>
  )
}
