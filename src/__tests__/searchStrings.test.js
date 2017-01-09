/* globals test expect */
import { searchStrings } from '../util'

test('should return true if the term is in the strings', () => {
  const res = searchStrings(['foobar', 'bar'], 'foo')
  expect(res).toBe(true)
})

test('should return false if the term isn\'t in the strings', () => {
  const res = searchStrings(['barbaz', 'bar'], 'foo')
  expect(res).toBe(false)
})

test('should return false if the term is in the strings but doesn\'t have the right case', () => {
  const res = searchStrings(['foobaz', 'bar'], 'Foo')
  expect(res).toBe(false)
})
