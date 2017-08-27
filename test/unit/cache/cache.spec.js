const sinon = require('sinon');
const {expect} = require('chai');

const cache = require('../../../server/lib/cache');

describe('Simple events cache', function () {

  beforeEach(function () {
    this.clock = sinon.useFakeTimers();
  });

  afterEach(function () {
    this.clock.restore();
  });

  it('Should set value to cache and get value', function () {
    const data = {name: "Event"};
    cache.set('KEY', data);
    const value = cache.get('KEY');

    expect(value).to.have.property('lastCache');
    expect(value).to.have.property('data');
    expect(value.data).to.deep.equal(data);
  });

  it('Should data in cache shoul be invalid after one hour', function () {
    const data = {name: "Event"};
    cache.set('KEY', data);
    const value = cache.get('KEY');
    expect(cache.isValid('KEY')).to.be.true;

    this.clock.tick(60 * 60 * 1000);

    expect(cache.isValid('KEY')).to.be.false;
  });

  it('Should clear cache', function () {
    const data = {name: "Event"};
    cache.set('KEY', data);
    const value = cache.get('KEY');
    expect(cache.isValid('KEY')).to.be.true;
    cache.clear();
    expect(cache.isValid('KEY')).to.be.false;
  });

});
