import { Divider, Space, Tag } from '@youknown/react-ui/src'

export default () => {
  return (
    <div>
      <h1>Tag</h1>
      <Divider />
      <Space>
        <Tag>Basic</Tag>
        <Tag round>Round</Tag>
        <Tag bordered>Round</Tag>
        <Tag bordered round>
          Round
        </Tag>
      </Space>
      <Divider />
      <Space>
        <Tag size="small">Small</Tag>
        <Tag size="medium">Medium</Tag>
        <Tag size="large">Large</Tag>
      </Space>
      <Divider />
      <Space>
        <Tag closable>Closable</Tag>
        <Tag
          closable
          onClose={() =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve()
              }, 2000)
            })
          }
        >
          Async close
        </Tag>
      </Space>
    </div>
  )
}
