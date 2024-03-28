import { Button, Checkbox, DatePicker, Divider, Form, Input, Radio, Select, Switch, Tabs } from '@youknown/react-ui/src'
import dayjs from 'dayjs'
import { useState } from 'react'

export default () => {
  const [layout, setLayout] = useState<'horizontal' | 'vertical' | 'inline'>('horizontal')

  const checkRequired = async (val: string) => {
    if (!val.length) {
      return Promise.reject('It is required')
    }
  }
  const checkNumbers = async (val: string) => {
    if (!/^[0-9]+$/.test(val)) {
      return Promise.reject('It can only numbers.')
    }
  }

  const form = Form.useForm({
    defaultState: {
      username: 'Initial username',
      pwd: '',
      retypePwd: '',
      system: 'windows',
      gender: 0,
      fruit: [1, 2],
      birthday: dayjs(null),
      switch: true
    },
    onFulfilled(values) {
      console.log('submit fulfilled', values)
    },
    onFailed(explainsMap) {
      console.log('submit failed', explainsMap)
    },
    onStateChange(source) {
      console.log('state changed: ', source, form.getState()[source.label])
    }
  })

  return (
    <div>
      <h1>Form</h1>
      <Divider />
      <Tabs
        type="segment"
        value={layout}
        onChange={setLayout}
        tabList={[
          { key: 'horizontal', name: 'Horizontal' },
          { key: 'vertical', name: 'Vertical' },
          { key: 'inline', name: 'Inline' }
        ]}
      />
      <Divider />
      <div className="m-w-640px">
        <Form form={form} layout={layout}>
          <Form.Field label="username" labelText="Username" validators={[checkRequired]}>
            <Input />
          </Form.Field>
          <Form.Field
            label="pwd"
            labelText="Password"
            validators={[
              checkRequired,
              checkNumbers,
              async val => {
                if (val && form.getState().retypePwd) {
                  form.validate('retypePwd')
                }
              }
            ]}
          >
            <Input type="password" />
          </Form.Field>
          <Form.Field
            label="retypePwd"
            labelText="Retype password"
            validators={[
              checkRequired,
              checkNumbers,
              async val => {
                const { pwd } = form.getState()
                if (val !== pwd) {
                  return Promise.reject('Two passwords are inconsistent.')
                }
              }
            ]}
          >
            <Input type="password" />
          </Form.Field>
          <Form.Field label="system" labelText="System">
            <Select
              menuList={[
                {
                  value: 'windows',
                  label: 'Windows'
                },
                {
                  value: 'macos',
                  label: 'MacOS'
                },
                {
                  value: 'android',
                  label: 'Android'
                },
                {
                  value: 'linux',
                  label: 'Linux'
                },
                {
                  value: 'ios',
                  label: 'iOS'
                }
              ]}
            ></Select>
          </Form.Field>
          <Form.Field label="gender" labelText="Gender">
            <Radio.Group>
              <Radio label={0}>A</Radio>
              <Radio label={1}>B</Radio>
              <Radio label={2}>C</Radio>
            </Radio.Group>
          </Form.Field>
          <Form.Field label="fruit" labelText="Fruit">
            <Checkbox.Group>
              <Checkbox label={0}>Apple</Checkbox>
              <Checkbox label={1}>Banana</Checkbox>
              <Checkbox label={2}>Pear</Checkbox>
            </Checkbox.Group>
          </Form.Field>
          <Form.Field label="birthday" labelText="Birthday">
            <DatePicker />
          </Form.Field>
          <Form.Field label="switch" labelText="Switch">
            <Switch />
          </Form.Field>
          <Form.Field labelText=" ">
            <Button primary type="submit">
              Submit
            </Button>
          </Form.Field>
        </Form>
      </div>
    </div>
  )
}
