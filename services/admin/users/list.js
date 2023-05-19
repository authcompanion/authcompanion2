export const listUsersHandler = async function (request, reply) {
  try {
    const { "page[number]": pageNumber = 1, "page[size]": pageSize = 10 } =
      request.query;

    // Convert the page number and size to integers
    const page = parseInt(pageNumber);
    const size = parseInt(pageSize);

    // Calculate the offset based on the page and size
    const offset = (page - 1) * size;

    // Fetch the user's uuid, name, email, active, created_at, updated_at attributes from the database
    const stmt = this.db.prepare(
      "SELECT uuid, name, email, active, created_at, updated_at FROM users LIMIT ? OFFSET ?"
    );
    const users = await stmt.all(size, offset);

    // For each user, prepare the server response
    const userAttributes = users.map((user) => {
      return {
        type: "users",
        id: user.uuid,
        attributes: {
          name: user.name,
          email: user.email,
          active: user.active,
          created: user.created_at,
          updated: user.updated_at,
        },
      };
    });

    // Fetch the total count of users
    const countStmt = this.db.prepare("SELECT COUNT(*) as count FROM users");
    const totalCount = await countStmt.get();

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount.count / size);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Prepare the pagination links
    const paginationLinks = {};

    if (hasNextPage) {
      paginationLinks.next = `${request.raw.url.split("?")[0]}?page[number]=${
        page + 1
      }&page[size]=${size}`;
    }

    if (hasPreviousPage) {
      paginationLinks.prev = `${request.raw.url.split("?")[0]}?page[number]=${
        page - 1
      }&page[size]=${size}`;
    }

    if (totalPages > 0) {
      paginationLinks.first = `${
        request.raw.url.split("?")[0]
      }?page[number]=1&page[size]=${size}`;
      paginationLinks.last = `${
        request.raw.url.split("?")[0]
      }?page[number]=${totalPages}&page[size]=${size}`;
    }

    // Send the server reply
    reply.statusCode = 200;
    return {
      data: userAttributes,
      links: paginationLinks,
    };
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
};
