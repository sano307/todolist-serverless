import * as auth from "./auth"
// @ponicode
describe("auth.handler", () => {
    test("0", async () => {
        await auth.handler({})
    })

    test("1", async () => {
        await auth.handler(undefined)
    })
})
