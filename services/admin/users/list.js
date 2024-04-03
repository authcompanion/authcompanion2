import { asc, count, like } from "drizzle-orm";

export const listUsersHandler = async function (request, reply) {
  try {
    const { "page[number]": pageNumber = 1, "page[size]": pageSize = 10, "search[email]": searchEmail } = request.query;

    // Convert the page number and size to integers
    const page = parseInt(pageNumber);
    const size = parseInt(pageSize);

    const userList = await this.db
      .select()
      .from(this.users)
      .where(searchEmail ? like(this.users.email, `%${searchEmail}%`) : null)
      .orderBy(asc(this.users.id))
      .limit(size)
      .offset((page - 1) * size);

    // Prepare the response data
    const userAttributes = userList.map((user) => {
      return {
        type: "users",
        id: user.uuid,
        attributes: {
          name: user.name,
          email: user.email,
          metadata: user.metadata,
          app: user.appdata,
          active: user.active,
          isAdmin: user.isAdmin,
          created: user.created_at,
          updated: user.updated_at,
        },
      };
    });
    // Count total users
    const totalCountResult = await this.db
      .select({ count: count() })
      .from(this.users)
      .where(searchEmail ? like(this.users.email, `%${searchEmail}%`) : null);

    const totalCount = totalCountResult[0].count;

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / size);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Prepare the pagination links
    const paginationLinks = {};

    if (hasNextPage) {
      paginationLinks.next = `${request.raw.url.split("?")[0]}?page[number]=${page + 1}&page[size]=${size}`;
    }

    if (hasPreviousPage) {
      paginationLinks.prev = `${request.raw.url.split("?")[0]}?page[number]=${page - 1}&page[size]=${size}`;
    }

    if (totalPages > 0) {
      paginationLinks.first = `${request.raw.url.split("?")[0]}?page[number]=1&page[size]=${size}`;
      paginationLinks.last = `${request.raw.url.split("?")[0]}?page[number]=${totalPages}&page[size]=${size}`;
    }

    // Send the server reply
    reply.statusCode = 200;
    return {
      data: userAttributes,
      links: paginationLinks,
    };
  } catch (err) {
    throw err;
  }
};
