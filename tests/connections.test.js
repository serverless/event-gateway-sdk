const SDK = require('../lib/index')
const sinon = require('sinon')

describe('create', () => {
  test('should create a connection', async () => {
    const fetch = sinon.stub()
    fetch.returns(
      Promise.resolve({
        status: 201,
        json: () => Promise.resolve({ connectionId: 'testID', type: 'awskinesis' })
      })
    )

    const sdk = new SDK({ url: 'localhost', fetch })
    const connection = await sdk.createConnection({ type: 'awskinesis' })

    expect(connection).toEqual({ connectionId: 'testID', type: 'awskinesis' })
    expect(fetch.lastCall.args[0]).toEqual('http://localhost:4002/v1/spaces/default/connections')
    expect(fetch.lastCall.args[1].method).toEqual('POST')
  })

  test('should throw an error if status code other than 201', async () => {
    const fetch = sinon.stub()
    fetch.returns(
      Promise.resolve({
        status: 500,
        json: () => Promise.resolve({ errors: [{ message: 'error response' }] })
      })
    )

    const sdk = new SDK({ url: 'localhost', fetch })

    try {
      await sdk.createConnection({ type: 'awskinesis' })
    } catch (err) {
      expect(err).toEqual(new Error(`Failed to create the connection due the error: error response`))
    }
  })

  test('should throw an error if error response not JSON', async () => {
    const fetch = sinon.stub()
    fetch.returns(
      Promise.resolve({
        status: 500,
        json: () => Promise.resolve('not json')
      })
    )

    const sdk = new SDK({ url: 'localhost', fetch })

    try {
      await sdk.createConnection({ type: 'awskinesis' })
    } catch (err) {
      expect(err).toEqual(new Error(`Failed to create the connection and couldn't parse error body.`))
    }
  })
})

describe('update', () => {
  test('should update a connection', async () => {
    const fetch = sinon.stub()
    fetch.returns(
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ connectionId: 'testID', type: 'awskinesis' })
      })
    )

    const sdk = new SDK({ url: 'localhost', fetch })
    const connection = await sdk.updateConnection({ connectionId: 'testID', type: 'awskinesis' })

    expect(connection).toEqual({ connectionId: 'testID', type: 'awskinesis' })
    expect(fetch.lastCall.args[0]).toEqual('http://localhost:4002/v1/spaces/default/connections/testID')
    expect(fetch.lastCall.args[1].method).toEqual('PUT')
  })

  test('should throw an error if status code other than 200', async () => {
    const fetch = sinon.stub()
    fetch.returns(
      Promise.resolve({
        status: 500,
        json: () => Promise.resolve({ errors: [{ message: 'error response' }] })
      })
    )

    const sdk = new SDK({ url: 'localhost', fetch })

    try {
      await sdk.updateConnection({ connectionId: 'testID', type: 'awskinesis' })
    } catch (err) {
      expect(err).toEqual(new Error(`Failed to update the connection testID due the error: error response`))
    }
  })

  test('should throw an error if error response not JSON', async () => {
    const fetch = sinon.stub()
    fetch.returns(
      Promise.resolve({
        status: 500,
        json: () => Promise.resolve('not json')
      })
    )

    const sdk = new SDK({ url: 'localhost', fetch })

    try {
      await sdk.updateConnection({ connectionId: 'testID', type: 'awskinesis' })
    } catch (err) {
      expect(err).toEqual(new Error(`Failed to update the connection testID and couldn't parse error body.`))
    }
  })
})

describe('delete', () => {
  test('should delete a connection', async () => {
    const fetch = sinon.stub()
    fetch.returns(Promise.resolve({ status: 204 }))

    const sdk = new SDK({ url: 'localhost', fetch })
    await sdk.deleteConnection({ connectionId: 'testID' })

    expect(fetch.lastCall.args[0]).toEqual('http://localhost:4002/v1/spaces/default/connections/testID')
    expect(fetch.lastCall.args[1].method).toEqual('DELETE')
  })

  test('should throw an error if status code other than 204', async () => {
    const fetch = sinon.stub()
    fetch.returns(
      Promise.resolve({
        status: 500,
        json: () => Promise.resolve({ errors: [{ message: 'error response' }] })
      })
    )

    const sdk = new SDK({ url: 'localhost', fetch })

    try {
      await sdk.deleteConnection({ connectionId: 'testID' })
    } catch (err) {
      expect(err).toEqual(new Error(`Failed to delete the connection testID due the error: error response`))
    }
  })

  test('should throw an error if error response not JSON', async () => {
    const fetch = sinon.stub()
    fetch.returns(
      Promise.resolve({
        status: 500,
        json: () => Promise.resolve('not json')
      })
    )

    const sdk = new SDK({ url: 'localhost', fetch })

    try {
      await sdk.deleteConnection({ connectionId: 'testID' })
    } catch (err) {
      expect(err).toEqual(new Error(`Failed to delete the connection testID and couldn't parse error body.`))
    }
  })
})

describe('list', () => {
  test('should return list', async () => {
    const fetch = sinon.stub()
    fetch.returns(
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ connections: [{ connectionId: 'a' }, { connectionId: 'b' }] })
      })
    )

    const sdk = new SDK({ url: 'localhost', fetch })
    const connections = await sdk.listConnections()

    expect(connections).toEqual([{ connectionId: 'a' }, { connectionId: 'b' }])
    expect(fetch.lastCall.args[0]).toEqual('http://localhost:4002/v1/spaces/default/connections?')
  })

  test('should throw an error if status code other than 200', async () => {
    const fetch = sinon.stub()
    fetch.returns(
      Promise.resolve({
        status: 500,
        json: () => Promise.resolve({ errors: [{ message: 'error response' }] })
      })
    )

    const sdk = new SDK({ url: 'localhost', fetch })
    try {
      await sdk.listConnections()
    } catch (err) {
      expect(err).toEqual(new Error(`Failed to fetch the connection list due the error: error response`))
    }
  })

  test('should throw an error if error response not JSON', async () => {
    const fetch = sinon.stub()
    fetch.returns(
      Promise.resolve({
        status: 500,
        json: () => Promise.resolve('not json')
      })
    )

    const sdk = new SDK({ url: 'localhost', fetch })
    try {
      await sdk.listConnections()
    } catch (err) {
      expect(err).toEqual(new Error(`Failed to fetch the connection list and couldn't parse error body.`))
    }
  })
})
