/* eslint-env node, mocha */
const assert = require('chai').assert
const { getConfig } = require('guld-git-config')
const { createRemote, deleteRemote, addRemote } = require('./index.js')

describe('get-git-remote', function () {
  it('createRemote', async function () {
    var cfg = await createRemote('guld', 'test-repo', 'github')
    assert.equal(cfg['remote "guld"'].fetch, '+refs/heads/*:refs/remotes/guld/*')
    assert.equal(cfg['remote "guld"'].url, 'https://github.com/guldcoin/test-repo.git')
  })
  it('createRemote all', async function () {
    var cfg = await createRemote('guld', 'test-repo')
    assert.equal(cfg['remote "guld"'].fetch, '+refs/heads/*:refs/remotes/guld/*')
    assert.equal(cfg['remote "guld"'].url, 'https://bitbucket.org/guld/test-repo.git')
    assert.equal(cfg['remote "guld"'].pushurl[0], 'https://github.com/guldcoin/test-repo.git')
    assert.equal(cfg['remote "guld"'].pushurl[1], 'https://gitlab.com/guld/test-repo.git')
  })
  it('addRemote', async function () {
    await addRemote('guld')
    var cfg = await getConfig('local')
    assert.equal(cfg['remote "guld"'].fetch, '+refs/heads/*:refs/remotes/guld/*')
    assert.equal(cfg['remote "guld"'].url, 'https://bitbucket.org/guld/tech-js-node_modules-guld-git-remote.git')
    assert.equal(cfg['remote "guld"'].pushurl[0], 'https://github.com/guldcoin/tech-js-node_modules-guld-git-remote.git')
    assert.equal(cfg['remote "guld"'].pushurl[1], 'https://gitlab.com/guld/tech-js-node_modules-guld-git-remote.git')
  })
  it('deleteRemote', async function () {
    await deleteRemote('guld')
    var cfg = await getConfig('local')
    assert.notExists(cfg['remote "guld"'])
  })
  it('addRemote all', async function () {
    await addRemote()
    var cfg = await getConfig('local')
    assert.equal(cfg['remote "guld"'].fetch, '+refs/heads/*:refs/remotes/guld/*')
    assert.equal(cfg['remote "guld"'].url, 'https://bitbucket.org/guld/tech-js-node_modules-guld-git-remote.git')
    assert.equal(cfg['remote "guld"'].pushurl[0], 'https://github.com/guldcoin/tech-js-node_modules-guld-git-remote.git')
    assert.equal(cfg['remote "guld"'].pushurl[1], 'https://gitlab.com/guld/tech-js-node_modules-guld-git-remote.git')
    assert.equal(cfg[`remote "isysd"`].fetch, '+refs/heads/*:refs/remotes/isysd/*')
    assert.equal(cfg[`remote "isysd"`].url, 'https://bitbucket.org/isysd/tech-js-node_modules-guld-git-remote.git')
    assert.equal(cfg[`remote "isysd"`].pushurl[0], 'https://github.com/isysd/tech-js-node_modules-guld-git-remote.git')
    assert.equal(cfg[`remote "isysd"`].pushurl[1], 'https://gitlab.com/isysd/tech-js-node_modules-guld-git-remote.git')
  })
  it('deleteRemote all', async function () {
    await deleteRemote()
    var cfg = await getConfig('local')
    assert.notExists(cfg['remote "guld"'])
    assert.notExists(cfg['remote "isysd"'])
  })
})
