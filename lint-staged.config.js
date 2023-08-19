/**
 * glob syntax https://github.com/isaacs/node-glob#glob-primer
 */
module.exports = {
  '*.ts*(x)': [
    () => `yarn lint:ts`, //
    (filenames) => `prettier --write ${filenames.join(' ')}`,
  ],
  'src/!**!/!*.*(p|s|l)+(c|a|e)ss': [
    () => `yarn lint:style`, //
    (filenames) => `stylelint --fix ${filenames.join(' ')}`,
  ],
};
