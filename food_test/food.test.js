const client = require('./client')('localhost', 8000)

/**
 * Food is represented by a json with a following format
 * {'name':'name of the food', 'calories': 10 }
 * When a food is created it will get a randomly generated id 
 * and a food becomes
 * {'name':'name of the food', 'calories': 10, 'id': 'abcd1234' }
 */

describe('Food tests', () => {
    it('test runner works', () => {
        expect(1).toBe(1)
    })

    it("api/food doesn't have name attribute", async () => {
        const endpoint = "/api/food"
        const postbody = {"calories" : "10"}

        const response = await client.post(endpoint, postbody)

        expect(response.code).toBe(400)
    })

    it("api/food negative calories", async () => {
        const endpoint = "/api/food"
        const postbody = {"name" : "hamburger", "calories" : "-1200"}

        const response = await client.post(endpoint, postbody)

        expect(response.code).toBe(400)
    })

    it("api/food get contains everything", async () => {
        //only returns 200 if there are items already so I create one. DOn't know if this is right but the test itself is logically correct
        const endpoint = "/api/food"
        const postbody = {"name" : "foodItemtoGet", "calories" : 50}

        await client.post(endpoint, postbody)

        const response = await client.get(endpoint)
        expect(response.code).toBe(200)
    })

    it("get api/food/id returns 200", async () => {
        //create item
        const endpoint = "/api/food"
        const postbody = {"name" : "hamburgerToGetWith200", "calories" : 1100}

        const postresponsebody = await client.post(endpoint, postbody)

        //Jsonify responsebody to get id
        const item = JSON.parse(postresponsebody.body)
        const path = endpoint + "/" + item.id

        const response = await client.get(path)
        expect(response.code).toBe(200)
    })

    //own tests
    it("item can be deleted", async () => {
        const endpoint = "/api/food"
        const postbody = {"name" : "foodItemToBeDeleted", "calories" : 50}

        const response = await client.post(endpoint, postbody)
        const item = JSON.parse(response.body)

        const path = endpoint + "/" + item.id
        console.log(path)

        await client.delete(path)
        expect(response.code).toBe(201)
    })

    it("api/food can be created", async () => {
        const endpoint = "/api/food"
        const postbody = {"name" : "hamburger", "calories" : 1200}

        const response = await client.post(endpoint, postbody)

        //apparently 201 is the response for succesfull creation
        expect(response.code).toBe(201)

        //delete it
        const item = JSON.parse(response.body)

        const path = endpoint + "/" + item.id
        await client.delete(path)
    })
})