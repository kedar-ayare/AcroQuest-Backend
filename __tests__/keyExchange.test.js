const request = require('supertest')
const app = require('../index')


describe('GET /', () => {
    it('should return Server Public Key', async () => {
        const res = await request(app).get('/keys/');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({success: true, publicKey: process.env.RSA__Public_Key});
    });
});
