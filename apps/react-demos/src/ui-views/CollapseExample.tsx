import { Button, Collapse, Divider } from '@youknown/react-ui/src'
import { useState } from 'react'

export default () => {
  const [controlledActives, setControlledActives] = useState<(string | number)[]>([1])
  const [customHeaderExpand, setCustomHeaderExpand] = useState<boolean>(false)
  return (
    <div>
      <h1>Collapse</h1>
      <Divider />
      <Collapse defaultActives={['1']} onChange={console.log}>
        <Collapse.Panel itemKey="1" title="Panel title1">
          <div className="p-8px color-#999">
            <p>Basic collapse</p>
          </div>
        </Collapse.Panel>
        <Collapse.Panel itemKey="2" title="Panel title2">
          <div className="p-8px color-#999">
            <p>Basic collapse</p>
          </div>
        </Collapse.Panel>
        <Collapse.Panel itemKey="3" title="Panel title3">
          <div className="p-8px color-#999">
            <p>Basic collapse</p>
          </div>
        </Collapse.Panel>
      </Collapse>
      <Divider />
      <Collapse accordion>
        <Collapse.Panel itemKey="1" title="Panel title1">
          <div className="p-8px color-#999">
            <p>Accordion collapse</p>
          </div>
        </Collapse.Panel>
        <Collapse.Panel itemKey="2" title="Panel title2">
          <div className="p-8px color-#999">
            <p>Accordion collapse</p>
          </div>
        </Collapse.Panel>
        <Collapse.Panel itemKey="3" title="Panel title3">
          <div className="p-8px color-#999">
            <p>Accordion collapse</p>
          </div>
        </Collapse.Panel>
      </Collapse>
      <Divider />
      <Collapse actives={controlledActives} onChange={setControlledActives}>
        <Collapse.Panel itemKey={1} title="Panel title1">
          <div className="p-8px color-#999">
            <p>Controlled collapse</p>
          </div>
        </Collapse.Panel>
        <Collapse.Panel itemKey={2} title="Panel title2">
          <div className="p-8px color-#999">
            <p>Controlled collapse</p>
          </div>
        </Collapse.Panel>
        <Collapse.Panel itemKey={3} title="Panel title3">
          <div className="p-8px color-#999">
            <p>Controlled collapse</p>
          </div>
        </Collapse.Panel>
      </Collapse>
      <Divider />
      <Collapse.Panel
        bordered={false}
        custom={
          <Button
            onClick={() => {
              setCustomHeaderExpand(p => !p)
            }}
          >
            Toggle collapse
          </Button>
        }
        expand={customHeaderExpand}
      >
        <div className="p-8px color-#999">
          <p>
            min-height: 0px !important; max-height: none !important; height: 0px !important; visibility: hidden
            !important; overflow: hidden !important; position: absolute !important; z-index: -1000 !important; top: 0px
            !important; right: 0px !important; border-width: 0px; box-sizing: border-box; font-family: -apple-system,
            BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica
            Neue", sans-serif; font-size: 14px; font-style: normal; font-weight: 400; letter-spacing: normal;
            line-height: 23.1px; padding: 0px 4px; tab-size: 8; text-indent: 0px; text-rendering: auto; text-transform:
            none; width: 240px; word-break: normal;
          </p>
        </div>
      </Collapse.Panel>
    </div>
  )
}
