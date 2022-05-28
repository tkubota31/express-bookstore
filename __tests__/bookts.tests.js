process.env.NODE_ENV = "test"
const db = require("../db")
const app = require("../app")
const request = require("supertest")

let bookISBN;

beforeEach(async() =>{
    let result = await db.query(
        `INSERT INTO books
        (isbn, amazon_url, author, language, pages, publisher, title, year)
        VALUES('1234567','https://amazon.com/lucky','Taioh','Japanese','50','Publisheeerrs','test book', 2020)
        RETURNING isbn`);

    bookISBN = result.rows[0].isbn
});

afterEach(async () =>{
    await db.query(`DELETE FROM books`);
});

afterAll(async () =>{
    await db.end()
});

describe("POST /books", function (){
    test("Create new book", async function(){
        const res = await (await request(app).post(`/books`)).send({
            isbn: '987654',
            amazon_url: 'https://amazon.com',
            author: "kaia",
            language: "english",
            pages: 98,
            publisher: "unch",
            title: "any title",
            year: 2000
        });
        expect(res.body.book).toHaveProperty("isbn");
    });
})
