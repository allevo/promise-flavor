'use strict'

function _autoPromise(tree, res) {
  const toBeDone = tree.keys.filter(k => {
    if (res.hasOwnProperty(k)) return false

    return tree.tasks[k].deps.reduce((s, dep) => {
      s &= res.hasOwnProperty(dep)
      return s
    }, true)
  })
  if (toBeDone.length === 0) {
    if (tree.keys.length !== Object.keys(res).length) return Promise.reject(new Error('Tree cannot be resolved'))
    return Promise.resolve(res)
  }

  const promises = toBeDone.map(k => {
    return tree.tasks[k].func(res)
      .then(r => { return {key: k, result: r} })
  })

  return Promise.all(promises)
    .then(r => {
      for (var i=0; i < r.length; i++) res[r[i].key] = r[i].result
      return _autoPromise(tree, res)
    })
}

function normalizeTree(tree) {
  const keys = Object.keys(tree)
  const t = { keys: keys, tasks: {} }
  for (var i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (tree[key] instanceof Function) {
      t.tasks[key] = {
        func: tree[key],
        deps: [],
      }
      continue
    }
    if (tree[key] instanceof Array) {
      t.tasks[key] = {
        func: tree[key][tree[key].length - 1],
        deps: tree[key].slice(0, -1),
      }
      continue
    }
    return Promise.reject(new Error('Tree is malformed'))
  }

  return Promise.resolve(t)
}

function autoPromise(tree) {
  return normalizeTree(tree)
    .then(tree => {
      return _autoPromise(tree, {})
    })
}

module.exports = autoPromise
