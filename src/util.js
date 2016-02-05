import Fuse from 'fuse.js'

export function getValuesForKey (key, item) {
  const keys = key.split('.')
  let results = [item]
  keys.forEach(_key => {
    const tmp = []
    results.forEach(result => {
      if (result) {
        if (result instanceof Array) {
          result.forEach(res => {
            tmp.push(res[_key])
          })
        } else {
          tmp.push(result[_key])
        }
      }
    })

    results = tmp
  })

  return results.filter(r => typeof r === 'string')
}

export function searchStrings (strings, term, caseSensitive, fuzzy) {
  try {
    if (fuzzy) {
      const fuse = new Fuse(strings.map(s => { return {id: s} }), { keys: ['id'], id: 'id', caseSensitive })
      return fuse.search(term).length
    }
    return strings.some(value => {
      try {
        if (!caseSensitive) {
          value = value.toLowerCase()
        }
        if (value && value.search(term) !== -1) {
          return true
        }
        return false
      } catch (e) {
        return false
      }
    })
  } catch (e) {
    return false
  }
}

export function createFilter (term, keys, caseSensitive, fuzzy) {
  return (item) => {
    if (term === '') { return true }

    if (!caseSensitive) {
      term = term.toLowerCase()
    }

    const terms = term.split(' ')

    return terms.every(term => {
      if (keys) {
        if (typeof keys === 'string') {
          keys = [keys]
        }

        // allow search in specific fields with the syntax `field:search`
        let currentKeys
        if (term.indexOf(':') > -1) {
          const searchedField = term.split(':')[0]
          term = term.split(':')[1]
          currentKeys = keys.filter(key => key.indexOf(searchedField) > -1)
        } else {
          currentKeys = keys
        }

        return currentKeys.find(key => {
          const values = getValuesForKey(key, item)
          return searchStrings(values, term, caseSensitive, fuzzy)
        })
      } else {
        return searchStrings([item], term, caseSensitive, fuzzy)
      }
    })
  }
}
