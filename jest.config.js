const { defaults } = require( 'jest-config' );

module.exports = {
    bail: false,
    verbose: true,
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts']
};