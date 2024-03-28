import { ContextMenu, Dropdown } from '@youknown/react-ui/src'

export default () => {
  const { onContextMenu, contextMenuProps, closeContextMenu } = ContextMenu.useContextMenu()
  return (
    <>
      <div className="flex justify-center items-center w-200px h-160px" onContextMenu={onContextMenu}>
        Right click menu
      </div>
      <ContextMenu {...contextMenuProps}>
        <Dropdown.Menu closeAfterItemClick closeDropdown={closeContextMenu}>
          <Dropdown.Item onClick={() => history.back()}>Back</Dropdown.Item>
          <Dropdown.Item onClick={() => history.forward()}>Forward</Dropdown.Item>
          <Dropdown.Item closeAfterItemClick={false}>Won't close</Dropdown.Item>
          <Dropdown.Item onClick={closeContextMenu}>Close</Dropdown.Item>
        </Dropdown.Menu>
      </ContextMenu>
    </>
  )
}
