import { Button, Divider, Space, Switch, Tooltip } from '@youknown/react-ui/src'
import { TbCheck, TbSearch, TbX } from 'react-icons/tb'

export default () => {
  const cellStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
  return (
    <div>
      <h1>Tooltip</h1>
      <Divider />
      <div className="grid grid-cols-[repeat(3,160px)] grid-rows-[repeat(5,auto)] gap-12px justify-center justify-items-center">
        <Tooltip placement="top-start" title="Top start">
          <Button style={cellStyle}>Top start</Button>
        </Tooltip>
        <Tooltip placement="top" title="Top">
          <Button style={cellStyle}>Top</Button>
        </Tooltip>
        <Tooltip placement="top-end" title="Top end">
          <Button style={cellStyle}>Top end</Button>
        </Tooltip>
        <Tooltip placement="left-start" title="Left start">
          <Button style={cellStyle}>Left start</Button>
        </Tooltip>
        <div style={cellStyle}></div>
        <Tooltip placement="right-start" title="Right start">
          <Button style={cellStyle}>Right start</Button>
        </Tooltip>
        <Tooltip placement="left" title="Left">
          <Button style={cellStyle}>Left</Button>
        </Tooltip>
        <div style={cellStyle}></div>
        <Tooltip placement="right" title="Right">
          <Button style={cellStyle}>Right</Button>
        </Tooltip>
        <Tooltip placement="left-end" title="Left end">
          <Button style={cellStyle}>Left end</Button>
        </Tooltip>
        <div style={cellStyle}></div>
        <Tooltip placement="right-end" title="Right end">
          <Button style={cellStyle}>Right end</Button>
        </Tooltip>
        <Tooltip placement="bottom-start" title="Bottom start">
          <Button style={cellStyle}>Bottom start</Button>
        </Tooltip>
        <Tooltip placement="bottom" title="Bottom">
          <Button style={cellStyle}>Bottom</Button>
        </Tooltip>
        <Tooltip placement="bottom-end" title="Bottom end">
          <Button style={cellStyle}>Bottom end</Button>
        </Tooltip>
      </div>
      <Divider />
      <Space size="large">
        <Tooltip title="Icon tooltip">
          <Button circle>
            <TbSearch />
          </Button>
        </Tooltip>
        <Tooltip title="Button tooltip">
          <Button primary>Primary button</Button>
        </Tooltip>
        <Tooltip title="Switch tooltip">
          <Switch />
        </Tooltip>
        <Tooltip title="Tooltip">
          <span>Text or anything</span>
        </Tooltip>
      </Space>
      <Divider />
      <Space size="large">
        <Tooltip title="Dark tooltip">
          <Button>Dark</Button>
        </Tooltip>
        <Tooltip title="Light tooltip">
          <Button>Light</Button>
        </Tooltip>
      </Space>
      <Divider />
      <Space>
        <Tooltip title="Enabled">
          <Button prefixIcon={<TbCheck />}>Enabled</Button>
        </Tooltip>
        <Tooltip title="Disabled" disabled>
          <Button prefixIcon={<TbX />}>Disabled</Button>
        </Tooltip>
      </Space>
    </div>
  )
}
