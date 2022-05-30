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
        const res = await await request(app).post(`/books`).send({
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


describe("GET /books/:isbn", function(){
    test("Get specific book", async function(){
        const res = await request(app).get(`/books/${bookISBN}`)
        expect(res.body.book.isbn).toBe(bookISBN);
    })
});

describe("PUT /books/:isbn", function(){
    test("Update book", async function(){
        const res = await request(app).put(`/books/${bookISBN}`)).setEncoding({
            isbn: "987654321",
            amazon_url:"https://lucky.com",
            author:"Lucky",
            language:"japanese",
            pages: 100,
            publisher:"Tai",
            title:"new title",
            year: 1997
        });
        expect(res.body.book.author).toBe("Lucky")
    })
})

describe("DELETE /books/:isbn", function(){
    test("Delete book", async function(){
        const res = await request(app).delete(`/books/${bookISBN}`)
        expect(res.body).toEqual({message: "Book deleted"});
    });
});
