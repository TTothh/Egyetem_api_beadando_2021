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

    it("1. api/food doesn't have name attribute", async () => {
        const endpoint = "/api/food"
        const postbody = {"calories" : "10"}

        const response = await client.post(endpoint, postbody)

        expect(response.code).toBe(400)
    })

    it("2. api/food negative calories", async () => {
        const endpoint = "/api/food"
        const postbody = {"name" : "hamburger", "calories" : "-1200"}

        const response = await client.post(endpoint, postbody)

        expect(response.code).toBe(400)
    })

    it("3. api/food get contains everything", async () => {
        //only returns 200 if there are items already so I create one. Don't know if this is right but the test itself is logically correct
        const endpoint = "/api/food"
        const postbody = {"name" : "foodItemtoGet", "calories" : 50}

        await client.post(endpoint, postbody)

        const response = await client.get(endpoint)

        const item = JSON.parse(response.body)
        const path = endpoint + "/" + item.id

        expect(response.code).toBe(200)
        await client.delete(path)
    })

    it("4. get api/food/id returns 200", async () => {
        //create item
        const endpoint = "/api/food"
        const postbody = {"name" : "hamburgerToGetWith200", "calories" : 1100}

        const postresponsebody = await client.post(endpoint, postbody)

        //Jsonify responsebody to get id
        const item = JSON.parse(postresponsebody.body)
        const path = endpoint + "/" + item.id

        const response = await client.get(path)
        expect(response.code).toBe(200)

        await client.delete(path)
    })

    it("5. 404 code on wrong id", async () => {
        //create item
        const endpoint = "/api/food"
        const postbody = {"name": "hamburgerToGetWith200", "calories": 1100}

        const postresponsebody = await client.post(endpoint, postbody)

        //Jsonify responsebody to get id
        const item = JSON.parse(postresponsebody.body)
        const wrongid = "asd"
        const wrongpath = endpoint + "/" + wrongid

        const response = await client.get(wrongpath)
        expect(response.code).toBe(404)

        const path = endpoint + "/" + item.id
        await client.delete(path)
    })

    it("6. modifying item works", async () => {
        //create an item
        const endpoint = "/api/food"
        const origFood = {"name": "hamburgerToBeModified", "calories": 1200}
        const modifiedFood = {"name": "hamburgerIsModified", "calories": 69}

        const created = await client.post(endpoint, origFood)

        const item = JSON.parse(created.body)
        const path = endpoint + "/" + item.id

        const modification = await client.put(path, modifiedFood)
        const modified = await client.get(path)

        expect(modification.code).toBe(200)
        expect(modified.code).toBe(200)

        await client.delete(path)
    })

    it("7. put returns 404 on wrong id", async () => {
        //create an item
        const endpoint = "/api/food"
        const origFood = {"name": "hamburgerToBeModified", "calories": 1200}
        const modifiedFood = {"name": "hamburgerIsModified", "calories": 69}

        const created = await client.post(endpoint, origFood)

        const item = JSON.parse(created.body)
        const path =
        const wrongid = "asd"
        const wrongpath = endpoint + "/" + wrongid

        const modification = await client.put(wrongpath, modifiedFood)
        const modified = await client.get(wrongpath)

        expect(modification.code).toBe(404)

        await client.delete(path)
    })

    it("8. delete actually deletes item", async () => {
        //create an item
        const endpoint = "/api/food"
        const food = {"name": "hamburgerToBeDeleted", "calories": 1200}

        const created = await client.post(endpoint, food)

        const item = JSON.parse(created.body)
        const path = endpoint + "/" + item.id

        const deletion = await client.delete(path)

        expect(deletion.code).toBe(204)

        await client.delete(path)
    })

    it("9. delete returns 404 on wrong id", async () => {
        //create an item
        const endpoint = "/api/food"
        const food = {"name": "hamburgerToBeDeleted", "calories": 1200}

        const created = await client.post(endpoint, food)

        const item = JSON.parse(created.body)
        const path = endpoint + "/" + item.id

        const wrongid = 'asdd'
        const wrongpath = endpoint + "/" + wrongid

        const deletion = await client.delete(wrongpath)

        expect(deletion.code).toBe(404)

        await client.delete(path)
    })

    it("10. put returns 400 on Id mismatch", async () => {
        //create an item
        const endpoint = "/api/food"
        const origFood = {"name": "hamburgerToBeModified", "calories": 1200}

        const created = await client.post(endpoint, origFood)

        const item = JSON.parse(created.body)
        const wrongid = "asd"
        const path = endpoint + "/" + wrongid

        const modifiedFood = {"name": "hamburgerIsModified", "calories": 69, "id" : item.id}

        const modification = await client.put(path, modifiedFood)

        expect(modification.code).toBe(400)

        await client.delete(path)
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

        //apparently 201 is the response for successful creation
        expect(response.code).toBe(201)

        //delete it
        const item = JSON.parse(response.body)

        const path = endpoint + "/" + item.id
        await client.delete(path)
    })
})