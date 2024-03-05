import request from 'supertest';
import app from '../../index.js';

describe('POST /register', () => {
    it('should create a new user and return 200 status', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                firstName: 'Test',
                lastName: 'User',
                email: 'testuser@example.com',
                username: 'testuser',
                password: 'TestUser123!'
            })
            .expect(200);

        expect(res.body).toHaveProperty('email', 'testuser@example.com');
        expect(res.body).toHaveProperty('username', 'testuser');
    },10000);
});