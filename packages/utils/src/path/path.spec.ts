import { join, objToTree } from './'

describe('path join', () => {
  it('a,b,c => /a/b/c', () => {
    expect(join('a', 'b', 'c')).toBe('/a/b/c')
  })
  it('abc,xyz => /abc/xyz', () => {
    expect(join('abc', 'xyz')).toBe('/abc/xyz')
  })
  it('/q,w/,e,/r => /q/w/e/r', () => {
    expect(join('/q', 'w/', 'e', '/r')).toBe('/q/w/e/r')
  })
  it('/ab/c,x/y,z/ => /ab/c/x/y/z', () => {
    expect(join('/ab/c', 'x/y', 'z/')).toBe('/ab/c/x/y/z')
  })
})

describe('json to tree', () => {
  const obj = {
    a: 123,
    b: [7, 8, 9],
    c: {
      q: false,
      w: [
        {
          o: true
        }
      ],
      e: {
        x: 0,
        y: 'fff'
      }
    }
  }
  expect(objToTree(JSON.stringify(obj))).toEqual([
    {
      label: 'a: 123'
    },
    {
      label: 'b: ',
      children: [
        {
          label: '0: 7'
        },
        {
          label: '1: 8'
        },
        {
          label: '2: 9'
        },
        {
          label: 'length: 3'
        }
      ]
    },
    {
      label: 'c: ',
      children: [
        {
          label: 'q: false'
        },
        {
          label: 'w: ',
          children: [
            {
              label: '0: ',
              children: [
                {
                  label: 'o: true'
                }
              ]
            },
            {
              label: 'length: 1'
            }
          ]
        },
        {
          label: 'e: ',
          children: [
            {
              label: 'x: 0'
            },
            {
              label: 'y: fff'
            }
          ]
        }
      ]
    }
  ])
})
