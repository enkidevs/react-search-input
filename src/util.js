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
        } else if (result && typeof result.get === 'function') {
          tmp.push(result.get(_key))
        } else {
          tmp.push(result[_key])
        }
      }
    })

    results = tmp
  })

  return results.filter(r => typeof r === 'string' || typeof r === 'number')
}

export function searchStrings (strings, term, caseSensitive, fuzzy) {
  strings = strings.map(e => e.toString())

  try {
    if (fuzzy) {
      if (typeof strings.toJS === 'function') {
        strings = strings.toJS()
      }
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

    if (!keys) {
      return terms.every(term => searchStrings([item], term, caseSensitive, fuzzy))
    }

    if (typeof keys === 'string') {
      keys = [keys]
    }

    return terms.every(term => {
      // allow search in specific fields with the syntax `field:search`
      let currentKeys
      if (term.indexOf(':') > -1) {
        const searchedField = term.split(':')[0]
        term = term.split(':')[1]
        currentKeys = keys.filter(key => key.toLowerCase().indexOf(searchedField) > -1)
      } else {
        currentKeys = keys
      }

      return currentKeys.find(key => {
        const values = getValuesForKey(key, item)
        return searchStrings(values, term, caseSensitive, fuzzy)
      })
    })
  }
}
