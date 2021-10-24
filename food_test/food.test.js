const client = require('./client')('localhost', 8000)

describe('Food tests', () => {
    it('test runner works', () => {
        expect(1).toBe(1)
    })
})