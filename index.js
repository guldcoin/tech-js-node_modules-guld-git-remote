const path = require('path')
const { branches } = require('guld-user')
const { getConfig, writeConfig, unsetConfig, getConfigPath } = require('guld-git-config')
const { getGitDir } = require('guld-git-path')
const { getHostURL } = require('guld-git-host')
const { getFS } = require('guld-fs')
const _union = require('lodash.union')
var fs

async function deleteRemote (rname, scope = 'local') {
  fs = fs || await getFS()
  if (rname) {
    await unsetConfig(`remote "${rname}"`, scope)
    fs.rimraf(path.join(await getGitDir(await getConfigPath(scope)), 'refs', 'remotes', rname))
  } else {
    var cfg = await getConfig(scope)
    Object.keys(cfg).filter(l => l.startsWith('remote')).forEach(l => delete cfg[l])
    await writeConfig(cfg, scope)
    return fs.rimraf(path.join(await getGitDir(await getConfigPath(scope)), 'refs', 'remotes'))
  }
}

async function addRemote (rname, slug, rurl, protocol = 'ssh', scope = 'local') {
  var cfg = await getConfig(scope)
  async function addRname (rname) {
    var remote = await createRemote(rname, slug, rurl, protocol)
    if (cfg.hasOwnProperty(`remote "${rname}"`)) {
      cfg[`remote "${rname}"`].pushurl = cfg[`remote "${rname}"`].pushurl || []
      remote[`remote "${rname}"`].pushurl = remote[`remote "${rname}"`].pushurl || []
      var allr = _union([cfg[`remote "${rname}"`].url, ...cfg[`remote "${rname}"`].pushurl],
        [remote[`remote "${rname}"`].url, ...remote[`remote "${rname}"`].pushurl])
      remote[`remote "${rname}"`].url = allr[0]
      remote[`remote "${rname}"`].pushurl = allr
    }
    cfg[`remote "${rname}"`] = remote[`remote "${rname}"`]
  }
  if (rname) await addRname(rname)
  else {
    var bs = await branches()
    for (var b in bs) {
      await addRname(bs[b])
    }
  }
  return writeConfig(cfg, scope)
}

async function createRemote (rname, slug, rurl, protocol = 'ssh') {
  var remote = {}
  remote[`remote "${rname}"`] = {
    fetch: `+refs/heads/*:refs/remotes/${rname}/*`
  }
  var urls = await getHostURL(rname, slug, rurl, protocol)
  if (Array.isArray(urls)) {
    var url = urls.shift()
    remote[`remote "${rname}"`]['url'] = url
    remote[`remote "${rname}"`]['pushurl'] = [url]
    if (urls.length > 0) {
      // remote[`remote "${rname}"`]['pushurl'] = []
      urls.forEach(u => {
        remote[`remote "${rname}"`]['pushurl'].push(u)
      })
    }
  } else {
    remote[`remote "${rname}"`]['url'] = urls
  }
  return remote
}

module.exports = {
  deleteRemote: deleteRemote,
  addRemote: addRemote,
  createRemote: createRemote
}
