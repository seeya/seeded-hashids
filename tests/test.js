const seededHashids = require('../seeded-hashids');
const assert = require('chai').assert;

const defaults = {
  scopes: [{
      scope: 'user',
      salt: 'abcd'
    },
    {
      scope: 'profile',
      salt: '1234'
    },
  ],
  charset: '1234567890abcdef',
  minOutputLength: 8,
  shuffleOutput: true,
  objectId: require('mongoose').Types.ObjectId, // Can also use require('mongodb').ObjectId
};

describe('when uninitialized', () => {

  it('should throw an error for .encode', () => {
    assert.throws(() => {
      seededHashids.encode();
    });
  });

  it('should throw an error for .encodeHex', () => {
    assert.throws(() => {
      seededHashids.encodeHex();
    });
  });

  it('should throw an error for .decode', () => {
    assert.throws(() => {
      seededHashids.decode();
    });
  });

  it('should throw an error for .decodeHex', () => {
    assert.throws(() => {
      seededHashids.decodeHex();
    });
  });

  it('should throw an error for .decodeObjectId', () => {
    assert.throws(() => {
      seededHashids.decodeObjectId();
    });
  });

});

describe('when initializing', () => {
  afterEach(() => {
    seededHashids.reset();
  });

  it('should not throw an error if reset', () => {
    assert.doesNotThrow(() => {
      seededHashids.reset();
    });
  });

  it('should throw an error if options object is invalid', () => {
    assert.throws(() => {
      seededHashids.initialize();
    });
    assert.throws(() => {
      seededHashids.initialize('');
    });
    assert.throws(() => {
      seededHashids.initialize(123);
    });
  });

  it('should throw an error if missing scopes', () => {
    assert.throws(() => {
      seededHashids.initialize({});
    });
    assert.throws(() => {
      seededHashids.initialize({
        scopes: []
      });
    });
  });

  it('should throw an error if scopes are invalid', () => {
    assert.throws(() => {
      seededHashids.initialize({
        scopes: [{
          scope: 'test',
          salt: 'salt'
        }, {
          scope: 123,
          salt: 'salt2'
        }]
      });
    });
    assert.throws(() => {
      seededHashids.initialize({
        scopes: [{
          scope: 'test',
          salt: 'salt'
        }, {
          scope: 'test2',
          salt: 555
        }]
      });
    });
  });

  it('should throw an error if there are duplicated scopes', () => {
    assert.throws(() => {
      seededHashids.initialize({
        scopes: [{
          scope: 'test',
          salt: 'salt'
        }, {
          scope: 'test',
          salt: 'salts'
        }]
      });
    });
  });

  it('should throw an error if there are duplicated salts', () => {
    assert.throws(() => {
      seededHashids.initialize({
        scopes: [{
          scope: 'test',
          salt: 'salt'
        }, {
          scope: 'test2',
          salt: 'salt'
        }]
      });
    });
  });

  it('should throw an error if invalid minOutputLength is passed', () => {
    assert.throws(() => {
      seededHashids.initialize({
        scopes: defaults.scopes,
        minOutputLength: -1
      });
    });
    assert.throws(() => {
      seededHashids.initialize({
        scopes: defaults.scopes,
        minOutputLength: ''
      });
    });
    assert.throws(() => {
      seededHashids.initialize({
        scopes: defaults.scopes,
        minOutputLength: {}
      });
    });
  });

  it('should throw an error if invalid charset is passed', () => {
    assert.throws(() => {
      seededHashids.initialize({
        scopes: defaults.scopes,
        charset: '1234567890'
      });
    });
    assert.throws(() => {
      seededHashids.initialize({
        scopes: defaults.scopes,
        charset: 1234567890
      });
    });
    assert.throws(() => {
      seededHashids.initialize({
        scopes: defaults.scopes,
        charset: '11223344556677889900'
      });
    });
    assert.throws(() => {
      seededHashids.initialize({
        scopes: defaults.scopes,
        charset: {}
      });
    });
  });

  it('should throw an error if invalid objectid is passed', () => {
    assert.throws(() => {
      seededHashids.initialize({
        scopes: defaults.scopes,
        objectId: ''
      });
    });
    assert.throws(() => {
      seededHashids.initialize({
        scopes: defaults.scopes,
        objectId: {}
      });
    });
    assert.throws(() => {
      seededHashids.initialize({
        scopes: defaults.scopes,
        objectId: function() {
          return null;
        }
      });
    });
    assert.throws(() => {
      seededHashids.initialize({
        scopes: defaults.scopes,
        objectId: function() {
          return '';
        }
      });
    });
  });

  it('should not throw an error if valid initialization without objectId', () => {
    assert.doesNotThrow(() => {
      delete defaults.objectId;
      seededHashids.initialize(defaults);
    });
  });

  it('should not throw an error if valid initialization with mongodb objectId', () => {
    assert.doesNotThrow(() => {
      defaults.objectId = require('mongodb').ObjectId;
      seededHashids.initialize(defaults);
    });
  });

  it('should not throw an error if valid initialization with mongoose objectId', () => {
    assert.doesNotThrow(() => {
      defaults.objectId = require('mongoose').Types.ObjectId;
      seededHashids.initialize(defaults);
    });
  });

  it('should throw an error if invalid shuffleFunction is passed', () => {
    assert.throws(() => {
      seededHashids.initialize({
        scopes: defaults.scopes,
        shuffleFunction: ''
      });
    });
    assert.throws(() => {
      seededHashids.initialize({
        scopes: defaults.scopes,
        shuffleFunction: {}
      });
    });
    assert.throws(() => {
      seededHashids.initialize({
        scopes: defaults.scopes,
        shuffleFunction: function() {
          return null;
        }
      });
    });
    assert.throws(() => {
      seededHashids.initialize({
        scopes: defaults.scopes,
        shuffleFunction: function() {
          return 123;
        }
      });
    });
  });

  it('should throw an error if invalid unshuffleFunction is passed', () => {
    assert.throws(() => {
      seededHashids.initialize({
        scopes: defaults.scopes,
        unshuffleFunction: ''
      });
    });
    assert.throws(() => {
      seededHashids.initialize({
        scopes: defaults.scopes,
        unshuffleFunction: {}
      });
    });
    assert.throws(() => {
      seededHashids.initialize({
        scopes: defaults.scopes,
        unshuffleFunction: function() {
          return null;
        }
      });
    });
    assert.throws(() => {
      seededHashids.initialize({
        scopes: defaults.scopes,
        unshuffleFunction: function() {
          return 123;
        }
      });
    });
  });

  it('should not throw an error if valid initialization with shuffle-seed', () => {
    assert.doesNotThrow(() => {
      let shuffle = function(inputString, seedString) {
        return require('shuffle-seed').shuffle(inputString.split(''), seedString).join('');
      };
      let unshuffle = function(inputString, seedString) {
        return require('shuffle-seed').unshuffle(inputString.split(''), seedString).join('');
      };
      defaults.shuffleFunction = shuffle;
      defaults.unshuffleFunction = unshuffle;
      seededHashids.initialize(defaults);
      delete defaults.shuffleFunction;
      delete defaults.unshuffleFunction;
    });
  });

});

describe('when initialized', () => {

  before(() => {
    seededHashids.reset();
    seededHashids.initialize(defaults);
  });

  it('should throw an error for .initialize', () => {
    assert.throws(() => {
      seededHashids.initialize();
    });
  });

  it('should get the same value for .isInitialized', () => {
    seededHashids.reset();
    assert.deepEqual(false, seededHashids.isInitialized());
    seededHashids.initialize(defaults);
    assert.deepEqual(true, seededHashids.isInitialized());
  });

  it('should get the same value for .getScopes', () => {
    assert.deepEqual(Object.keys(defaults.scopes), Object.keys(seededHashids.getScopes()));
  });

  it('should get the same value for .getCharset', () => {
    assert.deepEqual(defaults.charset, seededHashids.getCharset());
  });

  it('should get the same value for .getMinOutputLength', () => {
    assert.deepEqual(defaults.minOutputLength, seededHashids.getMinOutputLength());
  });

  it('should get the same value for .getShuffleOutput', () => {
    assert.deepEqual(defaults.shuffleOutput, seededHashids.getShuffleOutput());
  });

  it('should get the same value for .getObjectId', () => {
    assert.deepEqual(defaults.objectId, seededHashids.getObjectId());
  });

  describe('when using .encode', () => {

    it('should throw an error if missing / invalid scope', () => {
      assert.throws(() => {
        seededHashids.encode('fake', 123);
      });
      assert.throws(() => {
        seededHashids.encode({}, 123);
      });
      assert.throws(() => {
        seededHashids.encode(123, 123);
      });
    });

    it('should throw an error if invalid data', () => {
      assert.throws(() => {
        seededHashids.encode('user', {});
      });
      assert.throws(() => {
        seededHashids.encode('user', 'fake');
      });
      assert.throws(() => {
        seededHashids.encode('user', -1);
      });
      assert.throws(() => {
        seededHashids.encode('user', []);
      });
      assert.throws(() => {
        seededHashids.encode('user', [123, 'abc']);
      });
      assert.throws(() => {
        seededHashids.encode('user');
      });
    });

    it('should throw an error if invalid seed', () => {
      assert.throws(() => {
        seededHashids.encode('user', 123, {});
      });
      assert.throws(() => {
        seededHashids.encode('user', 123, 123);
      });
    });

    it('should throw an error if data too big be encoded', () => {
      assert.throws(() => {
        seededHashids.encode('user', 999999999999999999999);
      });
    });

  });

  describe('when using .encodeHex', () => {

    it('should throw an error if missing / invalid scope', () => {
      assert.throws(() => {
        seededHashids.encodeHex('fake', 'abcdef1234567890');
      });
      assert.throws(() => {
        seededHashids.encodeHex({}, 'abcdef1234567890');
      });
      assert.throws(() => {
        seededHashids.encodeHex(123, 'abcdef1234567890');
      });
    });

    it('should throw an error if invalid data', () => {
      assert.throws(() => {
        seededHashids.encodeHex('user', {});
      });
      assert.throws(() => {
        seededHashids.encodeHex('user', 'fake');
      });
      assert.throws(() => {
        seededHashids.encodeHex('user', -1);
      });
      assert.throws(() => {
        seededHashids.encodeHex('user', 123);
      });
    });

    it('should throw an error if invalid seed', () => {
      assert.throws(() => {
        seededHashids.encodeHex('user', 'abcdef1234567890', {});
      });
      assert.throws(() => {
        seededHashids.encodeHex('user', 'abcdef1234567890', 123);
      });
    });

  });

  describe('when using .decode', () => {

    it('should throw an error if missing / invalid scope', () => {
      assert.throws(() => {
        seededHashids.decode('fake', 'hash');
      });
      assert.throws(() => {
        seededHashids.decode({}, 'hash');
      });
      assert.throws(() => {
        seededHashids.decode(123, 'hash');
      });
    });

    it('should throw an error if invalid data', () => {
      assert.throws(() => {
        seededHashids.decode('user', {});
      });
      assert.throws(() => {
        seededHashids.decode('user', 123);
      });
    });

    it('should throw an error if invalid seed', () => {
      assert.throws(() => {
        seededHashids.decode('user', 'hash', {});
      });
      assert.throws(() => {
        seededHashids.decode('user', 'hash', 123);
      });
    });

  });

  describe('when using .decodeHex', () => {

    it('should throw an error if missing / invalid scope', () => {
      assert.throws(() => {
        seededHashids.decodeHex('fake', 'hash');
      });
      assert.throws(() => {
        seededHashids.decodeHex({}, 'hash');
      });
      assert.throws(() => {
        seededHashids.decodeHex(123, 'hash');
      });
    });

    it('should throw an error if invalid data', () => {
      assert.throws(() => {
        seededHashids.decodeHex('user', {});
      });
      assert.throws(() => {
        seededHashids.decodeHex('user', 123);
      });
    });

    it('should throw an error if invalid seed', () => {
      assert.throws(() => {
        seededHashids.decodeHex('user', 'hash', {});
      });
      assert.throws(() => {
        seededHashids.decodeHex('user', 'hash', 123);
      });
    });

  });

  describe('when using .decodeObjectId', () => {

    it('should throw an error if missing / invalid scope', () => {
      assert.throws(() => {
        seededHashids.decodeObjectId('fake', 'hash');
      });
      assert.throws(() => {
        seededHashids.decodeObjectId({}, 'hash');
      });
      assert.throws(() => {
        seededHashids.decodeObjectId(123, 'hash');
      });
    });

    it('should throw an error if invalid data', () => {
      assert.throws(() => {
        seededHashids.decodeObjectId('user', {});
      });
      assert.throws(() => {
        seededHashids.decodeObjectId('user', 123);
      });
    });

    it('should throw an error if invalid seed', () => {
      assert.throws(() => {
        seededHashids.decodeObjectId('user', 'hash', {});
      });
      assert.throws(() => {
        seededHashids.decodeObjectId('user', 'hash', 123);
      });
    });

  });

});

describe('when initialized without objectId', () => {

  before(() => {
    seededHashids.reset();
    let temp = defaults.objectId;
    delete defaults.objectId;
    seededHashids.initialize(defaults);
    defaults.objectId = temp;
  });

  it('should throw an error for .initialize', () => {
    assert.throws(() => {
      seededHashids.initialize();
    });
  });

  it('should throw an error for .decodeObjectId', () => {
    assert.throws(() => {
      seededHashids.decodeObjectId('user', 'hash');
    });
  });

  it('should get the same value for .getScopes', () => {
    assert.deepEqual(Object.keys(defaults.scopes), Object.keys(seededHashids.getScopes()));
  });

  it('should get the same value for .getCharset', () => {
    assert.deepEqual(defaults.charset, seededHashids.getCharset());
  });

  it('should get the same value for .getMinOutputLength', () => {
    assert.deepEqual(defaults.minOutputLength, seededHashids.getMinOutputLength());
  });

  it('should get the same value for .getShuffleOutput', () => {
    assert.deepEqual(defaults.shuffleOutput, seededHashids.getShuffleOutput());
  });

  it('should get the same value for .getObjectId', () => {
    assert.equal(null, seededHashids.getObjectId());
  });

  it('should get a function for .getShuffleFunction', () => {
    assert.equal('function', typeof seededHashids.getShuffleFunction());
  });

  it('should get a function for .getUnshuffleFunction', () => {
    assert.equal('function', typeof seededHashids.getUnshuffleFunction());
  });

});

describe('when encoding and decoding with shuffle', () => {

  before(() => {
    seededHashids.reset();
    seededHashids.initialize(defaults);
  });

  it('should run .encode and .decode for number correctly without seed', () => {
    let number = 12345678;
    let encoded = seededHashids.encode('user', number);
    let decoded = seededHashids.decode('user', encoded);
    assert.deepEqual(number, decoded);
  });

  it('should run .encode and .decode for number correctly with seed', () => {
    let number = 12345678;
    let seed = 'someseed';
    let encoded = seededHashids.encode('user', number, seed);
    let decoded = seededHashids.decode('user', encoded, seed);
    assert.deepEqual(number, decoded);
  });

  it('should run .encode and .decode for number correctly with a wrong seed', () => {
    let number = 12345678;
    let seed = 'someseed';
    let wrongSeed = 'wrongseed';
    let encoded = seededHashids.encode('user', number, seed);
    let decoded = seededHashids.decode('user', encoded, wrongSeed);
    assert.notDeepEqual(number, decoded);
  });
  
  it('should run .encode and .decode for array of numbers correctly without seed', () => {
    let numbers = [1,2,3,4,5,6,7,8];
    let encoded = seededHashids.encode('user', numbers);
    let decoded = seededHashids.decode('user', encoded);
    assert.deepEqual(numbers, decoded);
  });

  it('should run .encode and .decode for array of numbers correctly with seed', () => {
    let numbers = [1,2,3,4,5,6,7,8];
    let seed = 'someseed';
    let encoded = seededHashids.encode('user', numbers, seed);
    let decoded = seededHashids.decode('user', encoded, seed);
    assert.deepEqual(numbers, decoded);
  });

  it('should run .encode and .decode for array of numbers correctly with a wrong seed', () => {
    let numbers = [1,2,3,4,5,6,7,8];
    let seed = 'someseed';
    let wrongSeed = 'wrongseed';
    let encoded = seededHashids.encode('user', numbers, seed);
    let decoded = seededHashids.decode('user', encoded, wrongSeed);
    assert.notDeepEqual(numbers, decoded);
  });

  it('should run .encodeHex and .decodeHex correctly without seed', () => {
    let hex = 'abcdef1234567890';
    let encoded = seededHashids.encodeHex('user', hex);
    let decoded = seededHashids.decodeHex('user', encoded);
    assert.deepEqual(hex, decoded);
  });

  it('should run .encodeHex and .decodeHex correctly with seed', () => {
    let hex = 'abcdef1234567890';
    let seed = 'someseed';
    let encoded = seededHashids.encodeHex('user', hex, seed);
    let decoded = seededHashids.decodeHex('user', encoded, seed);
    assert.deepEqual(hex, decoded);
  });

  it('should run .encodeHex and .decodeHex correctly with a wrong seed', () => {
    let hex = 'abcdef1234567890';
    let seed = 'someseed';
    let wrongSeed = 'wrongseed';
    let encoded = seededHashids.encodeHex('user', hex, seed);
    let decoded = seededHashids.decodeHex('user', encoded, wrongSeed);
    assert.notDeepEqual(hex, decoded);
  });

  it('should run .encodeHex and .decodeObjectId correctly without seed', () => {
    let hex = 'abcdef1234567890abcdef12';
    let encoded = seededHashids.encodeHex('user', hex);
    let decoded = seededHashids.decodeObjectId('user', encoded);
    decoded = decoded.toString()
    assert.deepEqual(hex, decoded);
  });

  it('should run .encodeHex and .decodeObjectId correctly with seed', () => {
    let hex = 'abcdef1234567890abcdef12';
    let seed = 'someseed';
    let encoded = seededHashids.encodeHex('user', hex, seed);
    let decoded = seededHashids.decodeObjectId('user', encoded, seed);
    decoded = decoded.toString()
    assert.deepEqual(hex, decoded);
  });

  it('should run .encodeHex and .decodeObjectId correctly with a wrong seed', () => {
    let hex = 'abcdef1234567890abcdef12';
    let seed = 'someseed';
    let wrongSeed = 'wrongseed';
    let encoded = seededHashids.encodeHex('user', hex, seed);
    let decoded = seededHashids.decodeObjectId('user', encoded, wrongSeed);
    assert.notDeepEqual(hex, decoded);
  });

  it('should return NaN when .decode with an invalid hashid without seed', () => {
    let hashid = 'fakehashid';
    let decoded = seededHashids.decode('user', hashid);
    assert.deepEqual(NaN, decoded);
  });

  it('should return NaN when .decode with an invalid hashid with seed', () => {
    let hashid = 'fakehashid';
    let seed = 'someseed';
    let decoded = seededHashids.decode('user', hashid, seed);
    assert.deepEqual(NaN, decoded);
  });

  it('should return an empty string when .decodeHex with an invalid hashid without seed', () => {
    let hashid = 'fakehashid';
    let decoded = seededHashids.decodeHex('user', hashid);
    assert.deepEqual('', decoded);
  });

  it('should return an empty string when .decodeHex with an invalid hashid with seed', () => {
    let hashid = 'fakehashid';
    let seed = 'someseed';
    let decoded = seededHashids.decodeHex('user', hashid, seed);
    assert.deepEqual('', decoded);
  });

  it('should return null when .decodeObjectId with an invalid hashid without seed', () => {
    let hex = 'abcdef1234567890';
    let encoded = seededHashids.encodeHex('user', hex);
    let decoded = seededHashids.decodeObjectId('user', encoded);
    assert.deepEqual(null, decoded);
  });

  it('should return null when .decodeObjectId with an invalid hashid with seed', () => {
    let hex = 'abcdef1234567890';
    let seed = 'someseed';
    let encoded = seededHashids.encodeHex('user', hex, seed);
    let decoded = seededHashids.decodeObjectId('user', encoded, seed);
    assert.deepEqual(null, decoded);
  });

});

describe('when encoding and decoding without shuffle', () => {

  before(() => {
    seededHashids.reset();
    defaults.shuffleOutput = false;
    seededHashids.initialize(defaults);
    defaults.shuffleOutput = true;
  });

  it('should run .encode and .decode for number correctly without seed', () => {
    let number = 12345678;
    let encoded = seededHashids.encode('user', number);
    let decoded = seededHashids.decode('user', encoded);
    assert.deepEqual(number, decoded);
  });

  it('should run .encode and .decode for number correctly with seed', () => {
    let number = 12345678;
    let seed = 'someseed';
    let encoded = seededHashids.encode('user', number, seed);
    let decoded = seededHashids.decode('user', encoded, seed);
    assert.deepEqual(number, decoded);
  });

  it('should run .encode and .decode for number correctly with a wrong seed', () => {
    let number = 12345678;
    let seed = 'someseed';
    let wrongSeed = 'wrongseed';
    let encoded = seededHashids.encode('user', number, seed);
    let decoded = seededHashids.decode('user', encoded, wrongSeed);
    assert.notDeepEqual(number, decoded);
  });
  
  it('should run .encode and .decode for array of numbers correctly without seed', () => {
    let numbers = [1,2,3,4,5,6,7,8];
    let encoded = seededHashids.encode('user', numbers);
    let decoded = seededHashids.decode('user', encoded);
    assert.deepEqual(numbers, decoded);
  });

  it('should run .encode and .decode for array of numbers correctly with seed', () => {
    let numbers = [1,2,3,4,5,6,7,8];
    let seed = 'someseed';
    let encoded = seededHashids.encode('user', numbers, seed);
    let decoded = seededHashids.decode('user', encoded, seed);
    assert.deepEqual(numbers, decoded);
  });

  it('should run .encode and .decode for array of numbers correctly with a wrong seed', () => {
    let numbers = [1,2,3,4,5,6,7,8];
    let seed = 'someseed';
    let wrongSeed = 'wrongseed';
    let encoded = seededHashids.encode('user', numbers, seed);
    let decoded = seededHashids.decode('user', encoded, wrongSeed);
    assert.notDeepEqual(numbers, decoded);
  });

  it('should run .encodeHex and .decodeHex correctly without seed', () => {
    let hex = 'abcdef1234567890';
    let encoded = seededHashids.encodeHex('user', hex);
    let decoded = seededHashids.decodeHex('user', encoded);
    assert.deepEqual(hex, decoded);
  });

  it('should run .encodeHex and .decodeHex correctly with seed', () => {
    let hex = 'abcdef1234567890';
    let seed = 'someseed';
    let encoded = seededHashids.encodeHex('user', hex, seed);
    let decoded = seededHashids.decodeHex('user', encoded, seed);
    assert.deepEqual(hex, decoded);
  });

  it('should run .encodeHex and .decodeHex correctly with a wrong seed', () => {
    let hex = 'abcdef1234567890';
    let seed = 'someseed';
    let wrongSeed = 'wrongseed';
    let encoded = seededHashids.encodeHex('user', hex, seed);
    let decoded = seededHashids.decodeHex('user', encoded, wrongSeed);
    assert.notDeepEqual(hex, decoded);
  });

  it('should run .encodeHex and .decodeObjectId correctly without seed', () => {
    let hex = 'abcdef1234567890abcdef12';
    let encoded = seededHashids.encodeHex('user', hex);
    let decoded = seededHashids.decodeObjectId('user', encoded);
    decoded = decoded.toString()
    assert.deepEqual(hex, decoded);
  });

  it('should run .encodeHex and .decodeObjectId correctly with seed', () => {
    let hex = 'abcdef1234567890abcdef12';
    let seed = 'someseed';
    let encoded = seededHashids.encodeHex('user', hex, seed);
    let decoded = seededHashids.decodeObjectId('user', encoded, seed);
    decoded = decoded.toString()
    assert.deepEqual(hex, decoded);
  });

  it('should run .encodeHex and .decodeObjectId correctly with a wrong seed', () => {
    let hex = 'abcdef1234567890abcdef12';
    let seed = 'someseed';
    let wrongSeed = 'wrongseed';
    let encoded = seededHashids.encodeHex('user', hex, seed);
    let decoded = seededHashids.decodeObjectId('user', encoded, wrongSeed);
    decoded = decoded.toString()
    assert.notDeepEqual(hex, decoded);
  });

  it('should return NaN when .decode with an invalid hashid without seed', () => {
    let hashid = 'fakehashid';
    let decoded = seededHashids.decode('user', hashid);
    assert.deepEqual(NaN, decoded);
  });

  it('should return NaN when .decode with an invalid hashid with seed', () => {
    let hashid = 'fakehashid';
    let seed = 'someseed';
    let decoded = seededHashids.decode('user', hashid, seed);
    assert.deepEqual(NaN, decoded);
  });

  it('should return an empty string when .decodeHex with an invalid hashid without seed', () => {
    let hashid = 'fakehashid';
    let decoded = seededHashids.decodeHex('user', hashid);
    assert.deepEqual('', decoded);
  });

  it('should return an empty string when .decodeHex with an invalid hashid with seed', () => {
    let hashid = 'fakehashid';
    let seed = 'someseed';
    let decoded = seededHashids.decodeHex('user', hashid, seed);
    assert.deepEqual('', decoded);
  });

  it('should return null when .decodeObjectId with an invalid hashid without seed', () => {
    let hex = 'abcdef1234567890';
    let encoded = seededHashids.encodeHex('user', hex);
    let decoded = seededHashids.decodeObjectId('user', encoded);
    assert.deepEqual(null, decoded);
  });

  it('should return null when .decodeObjectId with an invalid hashid with seed', () => {
    let hex = 'abcdef1234567890';
    let seed = 'someseed';
    let encoded = seededHashids.encodeHex('user', hex, seed);
    let decoded = seededHashids.decodeObjectId('user', encoded, seed);
    assert.deepEqual(null, decoded);
  });

});