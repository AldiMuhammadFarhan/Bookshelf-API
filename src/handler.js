const { nanoid } = require("nanoid");
const Books = require("./books");

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    } if (pageCount < readPage) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    };

    Books.push(newBook);
    const isSuccess = Books.filter((book) => book.id === id).length > 0;


    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            },
        });
        response.code(201);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;

};
const getAllBooksHandler = (request, h) => {

    const { name, reading, finished } = request.query;

    // const filterBooks = Books;

    // if (name !== undefined) {
    //     filterBooks = filterBooks.filter((data) => data.name.toLowerCase().includes(name.toLowerCase()));
    // }
    // if (reading !== undefined) {
    //     filterBooks = filterBooks.filter((data) => data.reading === (reading === 1));
    // }
    // if (finished !== undefined) {
    //     filterBooks = filterBooks.filter((data) => data.finished === (finished === 1));
    // }
    // const response = h.response({
    //     status: 'success',
    //     data: {
    //         books: filterBooks.map((data) => ({
    //             id: data.id,`
    //             name: data.name,
    //             publisher: data.publisher,
    //         }))
    //     },
    // });
    // response.code(200);
    // return response;
    if (name !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                books: Books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())).map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        // response.code(200);
        return response;
    }
    if (reading === '1') {
        const response = h.response({
            status: 'success',
            data: {
                books: Books.filter((book) => book.reading === true).map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        // response.code(200);
        return response;
    } else if (reading === '0') {
        const response = h.response({
            status: 'success',
            data: {
                books: Books.filter((book) => book.reading === false).map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        // response.code(200);
        return response;
    }
    if (finished === '1') {
        const response = h.response({
            status: 'success',
            data: {
                books: Books.filter((book) => book.finished === true).map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        // response.code(200);
        return response;
    } else if (finished === '0') {
        const response = h.response({
            status: 'success',
            data: {
                books: Books.filter((book) => book.finished === false).map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        // response.code(200);
        return response;
    }
    const response = h.response({
        status: 'success',
        data: {
            books: Books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    response.code(200);
    return response;
};
const getBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const book = Books.filter((data) => data.id === id)[0];
    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book
            },
        };
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};
const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    // const updatedAt = new Date().toISOString();

    const index = Books.findIndex((data) => data.id === id);

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    } if (pageCount < readPage) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    } if (index !== -1) {
        Books[index] = {
            ...Books[index],
            name, year, author, summary, publisher, pageCount, readPage, reading
        };
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    } else {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }
};
const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = Books.findIndex((book) => book.id === id);

    if (index !== -1) {
        Books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};


module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };