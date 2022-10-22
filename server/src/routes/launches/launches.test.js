const request = require("supertest")
const app = require("../../app")
const { mongooseConnect, mongooseDisconnect } = require("../../services/mongo")

describe('Setting up the server before testing the API', () => {
  beforeAll(async () => {
    await mongooseConnect()
  })

  afterAll(async () => {
    await mongooseDisconnect()
  })

  describe("Checking the /GET to get all the launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/launches")
        .expect(200)
        .expect("Content-Type", /json/)

    })
  })

  describe("Test /POST to post a new launch", () => {
    const completeLaunchWIthDate = {
      mission: "Derabail",
      rocket: "Konchady",
      target: "Bangalore",
      launchDate: "August 29, 2028"
    }
    const launchDataWithoutDate = {
      mission: "Derabail",
      rocket: "Konchady",
      target: "Bangalore",
    }
    const launchDataWithInvalidLaunchDate = {
      mission: "Derabail",
      rocket: "Konchady",
      target: "Bangalore",
      launchDate: "yippeeeeeeee"

    }
    test("It should return a status 201 success", async () => {


      const response = await request(app)
        .post("/launches")
        .send(completeLaunchWIthDate)
        .expect('Content-Type', /json/)
        .expect(201)

      const requestLaunchDate = new Date(completeLaunchWIthDate.launchDate).valueOf()
      const responseDate = new Date(response.body.launchDate).valueOf()

      expect(responseDate).toBe(requestLaunchDate)

      expect(response.body).toMatchObject(launchDataWithoutDate)

    })

    test("Test missing property error", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(401)

      expect(response.body).toStrictEqual({
        error: "Required input fields not provided"
      })
    })

    test("Test for invalid date", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithInvalidLaunchDate)
        .expect('Content-Type', /json/)
        .expect(401)

      expect(response.body).toStrictEqual({
        error: "Invalid date provided"
      })
    })
  })

})
