import { Button, Divider, Dropdown, Space } from '@youknown/react-ui/src'
import { useState } from 'react'
import { TbCheckbox, TbChevronRight } from 'react-icons/tb'

export default () => {
  const [open, setOpen] = useState(false)
  const chevronIconEle = <TbChevronRight className="mr--4px text-16px" />
  return (
    <div>
      <h1>Dropdown</h1>
      <Divider />
      <Space>
        <Dropdown
          content={
            <Dropdown.Menu>
              <Dropdown.Item>Dropdown item 1</Dropdown.Item>
              <Dropdown.Item>Dropdown item 2</Dropdown.Item>
              <Dropdown.Item>Dropdown item 3</Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <Button>Hover me</Button>
        </Dropdown>
        <Dropdown
          trigger="click"
          content={
            <Dropdown.Menu>
              <Dropdown.Item>Dropdown item 1</Dropdown.Item>
              <Dropdown.Item>Dropdown item 2</Dropdown.Item>
              <Dropdown.Item>Dropdown item 3</Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <Button>Click me</Button>
        </Dropdown>
        <Dropdown
          trigger="manual"
          open={open}
          onOpenChange={setOpen}
          onClickOutside={() => {
            setOpen(false)
          }}
          content={
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  setOpen(false)
                }}
              >
                Dropdown item 1
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setOpen(false)
                }}
              >
                Dropdown item 2
              </Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <Button
            onClick={() => {
              setOpen(true)
            }}
          >
            Manual
          </Button>
        </Dropdown>
      </Space>
      <Divider />
      <Dropdown
        content={
          <Dropdown.Menu>
            <Dropdown.Item>Dropdown item 1</Dropdown.Item>
            <Dropdown.Item>Dropdown item 2</Dropdown.Item>
            <Dropdown.Item disabled>Dropdown item 3</Dropdown.Item>
            <Dropdown.Item>Dropdown item 4</Dropdown.Item>
          </Dropdown.Menu>
        }
      >
        <Button>Hover me</Button>
      </Dropdown>
      <Divider />
      <Space>
        <Dropdown
          content={
            <Dropdown.Menu closeAfterItemClick>
              <Dropdown.Item>Dropdown item 1</Dropdown.Item>
              <Dropdown.Item>Dropdown item 2</Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <Button>Close after click</Button>
        </Dropdown>
        <Dropdown
          content={
            <Dropdown.Menu>
              <Dropdown.Item closeAfterItemClick>It will close</Dropdown.Item>
              <Dropdown.Item>It won't close</Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <Button>Close after item click</Button>
        </Dropdown>
      </Space>
      <Divider />
      <Dropdown
        content={
          <Dropdown.Menu>
            <Dropdown.Title>Group 1</Dropdown.Title>
            <Dropdown.Item>Dropdown item 1</Dropdown.Item>
            <Dropdown.Item>Dropdown item 2</Dropdown.Item>
            <Divider size="small" />
            <Dropdown.Title>Group 2</Dropdown.Title>
            <Dropdown.Item>Dropdown item 1</Dropdown.Item>
            <Dropdown.Item>Dropdown item 2</Dropdown.Item>
          </Dropdown.Menu>
        }
      >
        <Button>Compose</Button>
      </Dropdown>
      <Divider />
      <Space>
        <Dropdown
          content={
            <Dropdown.Menu>
              <Dropdown.Item prefix={<TbCheckbox />}>Dropdown item 1</Dropdown.Item>
              <Dropdown.Item prefix={<TbCheckbox />}>Dropdown item 2</Dropdown.Item>
              <Dropdown.Item prefix={<TbCheckbox />}>Dropdown item 3</Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <Button>Prefix</Button>
        </Dropdown>
        <Dropdown
          content={
            <Dropdown.Menu>
              <Dropdown.Item suffix={chevronIconEle}>Dropdown item 1</Dropdown.Item>
              <Dropdown.Item suffix={chevronIconEle}>Dropdown item 2</Dropdown.Item>
              <Dropdown.Item suffix={chevronIconEle}>Dropdown item 3</Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <Button>Suffix</Button>
        </Dropdown>
      </Space>
      <Divider />
      <Dropdown
        content={
          <Dropdown.Menu>
            <Dropdown.Item closeAfterItemClick>Dropdown item 1</Dropdown.Item>
            <Dropdown
              appendTo={null}
              spacing={-2}
              placement="right-start"
              content={
                <Dropdown.Menu>
                  <Dropdown
                    appendTo={null}
                    spacing={-2}
                    placement="right-start"
                    content={
                      <Dropdown.Menu closeAfterItemClick>
                        <Dropdown.Item>Dropdown item 1</Dropdown.Item>
                        <Dropdown.Item>Dropdown item 2</Dropdown.Item>
                        <Dropdown.Item>Dropdown item 3</Dropdown.Item>
                        <Dropdown.Item>Dropdown item 4</Dropdown.Item>
                        <Dropdown.Item>Dropdown item 5</Dropdown.Item>
                        <Dropdown.Item>Dropdown item 6</Dropdown.Item>
                      </Dropdown.Menu>
                    }
                  >
                    <Dropdown.Item suffix={chevronIconEle}>Dropdown item 3</Dropdown.Item>
                  </Dropdown>
                  <Dropdown.Item closeAfterItemClick>Dropdown item 2</Dropdown.Item>
                  <Dropdown.Item closeAfterItemClick>Dropdown item 3</Dropdown.Item>
                  <Dropdown.Item closeAfterItemClick>Dropdown item 4</Dropdown.Item>
                </Dropdown.Menu>
              }
            >
              <Dropdown.Item suffix={chevronIconEle}>Dropdown item 2</Dropdown.Item>
            </Dropdown>
            <Dropdown.Item closeAfterItemClick>Dropdown item 3</Dropdown.Item>
            <Dropdown.Item closeAfterItemClick>Dropdown item 3</Dropdown.Item>
            <Dropdown.Item closeAfterItemClick>Dropdown item 4</Dropdown.Item>
          </Dropdown.Menu>
        }
      >
        <Button>Nested</Button>
      </Dropdown>
      <Divider />
      <Dropdown
        content={
          <Dropdown.Menu className="p-0!">
            <div className="p-16px">
              <div className="h-40px">Any thing...</div>
              <Button
                primary
                onClick={() => {
                  Dropdown.close()
                }}
              >
                Click me to close
              </Button>
            </div>
          </Dropdown.Menu>
        }
      >
        <Button>Hover me</Button>
      </Dropdown>
    </div>
  )
}
