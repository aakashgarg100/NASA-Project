const request = require("supertest")
const app = require("../../app")

describe('Test GET /launches',() => {
    test("It should responsd with 200 success ", async () =>{
        const response = await request(app)
        .get("/launches")
        .expect('Content-Type',/json/)
        .expect(200)
    })
})


describe('Test POST /launch',() => {

    const completeLaunchData = {
        rocket:"NCC",
        target:"Kepler 2222",
        mission:"USSE",
        launchDate:"23 Jan,2023"
    }

    const launchDataWithoutDate = {
        rocket:"NCC",
        target:"Kepler 2222",
        mission:"USSE",
    }

    const launchDataWithInvalidDate = {
        rocket:"NCC",
        target:"Kepler 2222",
        mission:"USSE",
        launchDate:"hello"
    }

    test("It should responsd with 201 created ", async () =>{
        const response = await request(app)
        .post("/launches")
        .send(completeLaunchData)
        .expect('Content-Type',/json/)
        .expect(201)

        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(responseDate).toBe(requestDate)
        expect(response.body).toMatchObject(launchDataWithoutDate)
    })

    

    test("It should catch missing required properties ", async () =>{
        const response = await request(app)
        .post("/launches")
        .send(launchDataWithoutDate)
        .expect('Content-Type',/json/)
        .expect(400)

        expect(response.body).toStrictEqual({
            error:"Missing required launch property"
        })
    })

    test("It should catch invalid dates", async () =>{
        const response = await request(app)
        .post("/launches")
        .send(launchDataWithInvalidDate)
        .expect('Content-Type',/json/)
        .expect(400)

        expect(response.body).toStrictEqual({
            error:"Invalid launch date"
        })
    })
})