# curl -X POST http://localhost:3000/auth/login -d '{"username": "adri", "password": "mdp"}' -H "Content-Type: application/json"

# curl http://localhost:3000/document/profile -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkcmkiLCJpYXQiOjE2MzIxMzgxODIsImV4cCI6MTYzMjE0NTM4Mn0.bvpo7ZyOKVK1eq4pKBvAJ5LxhfDHNGY9F3o-MCl05CQ"
curl http://localhost:3000/document/a1148f0f-edc5-42f0-8519-3dbb41eeedd8 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkcmkiLCJpYXQiOjE2MzIxMzgxODIsImV4cCI6MTYzMjE0NTM4Mn0.bvpo7ZyOKVK1eq4pKBvAJ5LxhfDHNGY9F3o-MCl05CQ"
