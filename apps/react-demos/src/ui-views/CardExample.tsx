import { Card, Divider, Loading } from '@youknown/react-ui/src'

export default () => {
  return (
    <>
      <h1>Card</h1>
      <Divider />
      <Card bordered header="Basic card" footer="Footer">
        Content
      </Card>
      <Divider />
      <Card bordered header="Header" cover={<img src="https://iph.href.lu/200x160" />}>
        Content
      </Card>
      <Divider />
      <Card
        bordered
        header={
          <div className="color-purple p-24px">
            <strong>Custom header</strong>
          </div>
        }
        footer={
          <div className="bg-#eee p-24px rd-b-6px">
            <span>Custom footer</span>
          </div>
        }
      >
        Content
      </Card>
      <Divider />
      <Card header="No border" footer="Footer">
        Content
      </Card>
      <Divider />
      <Card shadow header="Shadow card">
        Content
      </Card>
      <Divider />
      <Loading spinning>
        <Card shadow header="Loading card">
          Content
        </Card>
      </Loading>
      <Divider />
    </>
  )
}
