const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Validate property name
  if (!name) {
    const messageText = 'Mohon isi nama buku';

    const response = h.response({
      status: 'fail',
      message: `Gagal menambahkan buku. ${messageText}`,
    });

    response.code(400);

    return response;
  }

  // Validate readPage & pageCount
  if (readPage > pageCount) {
    const messageText = 'readPage tidak boleh lebih besar dari pageCount';

    const response = h.response({
      status: 'fail',
      message: `Gagal menambahkan buku. ${messageText}`,
    });

    response.code(400);

    return response;
  }

  const id = nanoid(16);

  let finished = false;
  if (pageCount === readPage) {
    finished = true;
  }

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {bookId: id},
    });

    response.code(201);

    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);

  return response;
};

const getAllBooksHandler = (request, h) => {
  const {reading, finished, name} = request.query;

  // Search by reading status
  // reading === 1 -> reading: true
  // reading === 0 -> reading: false
  if (reading !== undefined) {
    if (reading === '1') {
      const dataBook = [];

      books.forEach((book) => {
        if (book.reading) {
          dataBook.push(book);
        }
      });

      const response = h.response({
        status: 'success',
        data: {books: dataBook},
      });

      response.code(200);

      return response;
    } else {
      const dataBook = [];

      books.forEach((book) => {
        if (!book.reading) {
          dataBook.push(book);
        }
      });

      const response = h.response({
        status: 'success',
        data: {books: dataBook},
      });

      response.code(200);

      return response;
    }
  }

  // Search by finished status
  // finished === 1 -> finished: true
  // finished === 0 -> finished: false
  if (finished !== undefined) {
    if (finished === '1') {
      const dataBook = [];

      books.forEach((book) => {
        if (book.finished) {
          dataBook.push(book);
        }
      });

      const response = h.response({
        status: 'success',
        data: {books: dataBook},
      });

      response.code(200);

      return response;
    } else {
      const dataBook = [];

      books.forEach((book) => {
        if (!book.finished) {
          dataBook.push(book);
        }
      });

      const response = h.response({
        status: 'success',
        data: {books: dataBook},
      });

      response.code(200);

      return response;
    }
  }

  // Search by name
  // books will check contains by name
  if (name !== undefined) {
    const dataBook = [];

    const searchByName = String(name).toLowerCase();

    books.forEach((book) => {
      const bookName = String(book.name).toLowerCase();

      if (bookName.includes(searchByName)) {
        dataBook.push(book);
      }
    });

    const response = h.response({
      status: 'success',
      data: {books: dataBook},
    });

    response.code(200);

    return response;
  }

  // Default no query params wil be return all books
  // Object will be formated as {id, name, publisher}
  const dataBook = books.map((book) => {
    const {id, publisher} = book;

    return {id, name: book.name, publisher};
  });

  const response = h.response({
    status: 'success',
    data: {books: dataBook},
  });

  response.code(200);

  return response;
};

const getBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const book = books.filter((book) => book.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {book},
    });

    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);

  return response;
};

const editBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Validate property name
  if (!name) {
    const messageText = 'Mohon isi nama buku';

    const response = h.response({
      status: 'fail',
      message: `Gagal memperbarui buku. ${messageText}`,
    });

    response.code(400);

    return response;
  }

  // Validate readPage & pageCount
  if (readPage > pageCount) {
    const messageText = 'readPage tidak boleh lebih besar dari pageCount';

    const response = h.response({
      status: 'fail',
      message: `Gagal memperbarui buku. ${messageText}`,
    });

    response.code(400);

    return response;
  }

  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);

    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);

  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);

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

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
