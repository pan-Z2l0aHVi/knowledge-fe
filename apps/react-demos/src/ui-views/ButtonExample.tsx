import { Button, Divider, Space, Tooltip } from '@youknown/react-ui/src'
import { TbSearch, TbUpload } from 'react-icons/tb'

export default () => {
  return (
    <div>
      <h1>Button</h1>
      <Divider />
      <Space>
        <Button>Click me</Button>
        <Button primary>Primary</Button>
        <Button text>Text</Button>
        <Button round>Round</Button>
        <Tooltip title="square button">
          <Button square>
            <TbSearch />
          </Button>
        </Tooltip>
        <Tooltip title="square primary button">
          <Button square primary>
            <TbSearch />
          </Button>
        </Tooltip>
        <Tooltip title="circle button">
          <Button circle>
            <TbSearch />
          </Button>
        </Tooltip>
        <Tooltip title="circle primary button">
          <Button circle primary>
            <TbSearch />
          </Button>
        </Tooltip>
      </Space>
      <Divider />
      <Space>
        <Button size="small">Small</Button>
        <Button size="medium">medium</Button>
        <Button size="large">Large</Button>
      </Space>
      <Divider />
      <Space>
        <Button loading>Loading</Button>
        <Button primary loading>
          Loading
        </Button>
        <Button round loading>
          Loading
        </Button>
        <Button circle loading>
          <TbSearch />
        </Button>
      </Space>
      <Divider />
      <Button loading>Loading</Button>
      <Divider />
      <Space>
        <Button disabled>Disabled</Button>
        <Button disabled primary>
          Disabled Primary
        </Button>
        <Button disabled text>
          Disabled Text
        </Button>
      </Space>
      <Divider />
      <Space>
        <Button prefixIcon={<TbUpload />}>Prefix icon button</Button>
        <Button prefixIcon={<TbUpload />} primary>
          Prefix icon primary button
        </Button>
        <Button prefixIcon={<TbUpload />} loading>
          Prefix icon loading button
        </Button>
      </Space>
      <Divider />
      <Space>
        <Button suffixIcon={<TbSearch />}>Suffix icon button</Button>
        <Button suffixIcon={<TbSearch />} primary>
          Suffix icon primary button
        </Button>
        <Button suffixIcon={<TbSearch />} loading>
          Suffix icon loading button
        </Button>
      </Space>
    </div>
  )
}
