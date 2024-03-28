import { Avatar, Divider, Space } from '@youknown/react-ui/src'
import { TbUser } from 'react-icons/tb'

export default () => {
  const picSrc = 'https://iph.href.lu/200x200'
  return (
    <div>
      <h1>Avatar</h1>
      <Divider />
      <Space size="large">
        <Avatar round size="small" src={picSrc} />
        <Avatar round size="medium" src={picSrc} />
        <Avatar round size="large" src={picSrc} />
      </Space>
      <Divider />
      <Space size="large">
        <Avatar size="small" src={picSrc} />
        <Avatar size="medium" src={picSrc} />
        <Avatar size="large" src={picSrc} />
      </Space>
      <Divider />
      <Avatar src={picSrc}>
        <TbUser size="20px" />
      </Avatar>
      <Divider />
      <Avatar src={picSrc}>Text</Avatar>
      <Divider />
      <Avatar badge="99+" src={picSrc} />
      <Divider />
      <Avatar.Group size="small">
        <Avatar round src={picSrc} />
        <Avatar round src={picSrc} />
        <Avatar round src={picSrc} />
        <Avatar round src={picSrc} />
        <Avatar round src={picSrc} />
      </Avatar.Group>
      <Divider />
      <Avatar.Group size="medium">
        <Avatar round src={picSrc} />
        <Avatar round src={picSrc} />
        <Avatar round src={picSrc} />
        <Avatar round src={picSrc} />
        <Avatar round src={picSrc} />
      </Avatar.Group>
      <Divider />
      <Avatar.Group size="large">
        <Avatar round src={picSrc} />
        <Avatar round src={picSrc} />
        <Avatar round src={picSrc} />
        <Avatar round src={picSrc} />
        <Avatar round src={picSrc} />
      </Avatar.Group>
    </div>
  )
}
