const { danger, warn } = require('danger')

const doesIncludeTests = danger.git.modified_files.reduce((accum, file) => {
  if (file.match(/\.test\.js|-test\.js/)) accum = true
  return accum
}, false)

if (!doesIncludeTests) {
  warn('No tests included in commit.')
}

const doesIncludeDocs = danger.git.modified_files.reduce((accum, file) => {
  if (file.match(/.+\.md/)) accum = true
  return accum
}, false)

if (!doesIncludeDocs) {
  warn('No doc changes included in commit.')
}
