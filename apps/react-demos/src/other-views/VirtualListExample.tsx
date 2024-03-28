import AutoSizer from 'react-virtualized-auto-sizer'
import type { ListChildComponentProps } from 'react-window'
import { FixedSizeList } from 'react-window'

export default () => {
  const data = Array.from({ length: 10000 }, (_, index) => `Item ${index + 1}`)

  const renderRow = ({ index, style }: ListChildComponentProps) => {
    const row = data[index]
    return (
      <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
        {row}
      </div>
    )
  }

  return (
    <>
      <AutoSizer>
        {({ height, width }) => {
          return (
            <FixedSizeList width={width} height={height} itemCount={data.length} itemSize={35}>
              {renderRow}
            </FixedSizeList>
          )
        }}
      </AutoSizer>
    </>
  )
}
