module.exports = [
  {
    mode: 'production',
    target: 'web',
    entry: {
      index: './index.js'
    },
    output: {
      filename: 'guld-git-remote.min.js',
      path: __dirname,
      library: 'guldGitRemote',
      libraryTarget: 'var'
    }
  }
]
