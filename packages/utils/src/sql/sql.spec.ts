import { createSQL, SQL } from './'

describe('CRUD', () => {
  it('can get instance', () => {
    const sql = new SQL()
    const sqlInstance = { sql: '' }
    expect(sql).toEqual(sqlInstance)
    expect(createSQL()).toEqual(sqlInstance)
    expect(SQL.create()).toEqual(sqlInstance)
  })

  it('can create', () => {
    const sql = new SQL()
    expect(
      sql
        .createTable('user.profile', [
          'id INT NOT NULL AUTO_INCREMENT',
          'nickname VARCHAR(40)',
          'gender INT NOT NULL',
          'phone INT'
        ])
        .end()
    ).toBe(
      'CREATE TABLE user.profile (id INT NOT NULL AUTO_INCREMENT, nickname VARCHAR(40), gender INT NOT NULL, phone INT);'
    )
  })

  it('can read', () => {
    const sql = new SQL()
    expect(sql.select('*').from('user.profile').where().equal('id', 123).end()).toBe(
      'SELECT * FROM user.profile WHERE id = 123;'
    )
  })

  it('can update', () => {
    const sql = new SQL()
    expect(
      sql
        .update('user.profile')
        .set({
          nickname: 'tom',
          phone: '10086',
          gender: 'female'
        })
        .end()
    ).toBe('UPDATE user.profile SET nickname = tom, phone = 10086, gender = female;')
  })

  it('can delete', () => {
    const sql = new SQL()
    expect(sql.delete().from('user.profile').where().equal('id', 123).end()).toBe(
      'DELETE FROM user.profile WHERE id = 123;'
    )
  })
})
