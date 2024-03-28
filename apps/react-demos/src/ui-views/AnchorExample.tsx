import { Anchor, Divider } from '@youknown/react-ui/src'

export default () => {
  return (
    <div>
      <h1>Anchor</h1>
      <Divider />
      <Anchor
        className="fixed top-100px right-16px bg-bg-0"
        items={[
          {
            labelledby: 'h2',
            content: 'heading 2'
          },
          {
            labelledby: 'h22',
            content: 'heading 22',
            children: [
              {
                labelledby: 'h3',
                content: 'heading 3'
              },
              {
                labelledby: 'h33',
                content: 'heading 33'
              }
            ]
          },
          {
            labelledby: 'h222',
            content: 'heading 222'
          }
        ]}
      />
      <section>
        <h2 aria-labelledby="h2">h2</h2>
        <div className="h-400px"></div>
      </section>
      <section>
        <h2 aria-labelledby="h22">h22</h2>
        <div className="h-400px"></div>
      </section>
      <section>
        <h3 aria-labelledby="h3">h3</h3>
        <div className="h-600px"></div>
      </section>
      <section>
        <h3 aria-labelledby="h33">h33</h3>
        <div className="h-300px"></div>
      </section>
      <section>
        <h2 aria-labelledby="h222">h222</h2>
        <div className="h-300px"></div>
      </section>
    </div>
  )
}
