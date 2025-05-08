const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig();
  config.resolver.sourceExts.push('cjs', 'jsx');
  return config;
})();
