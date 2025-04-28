import { asc, count, like } from "drizzle-orm";

export const listUsersHandler = async function (request, reply) {
  // Parse and validate pagination parameters
  const currentPage = Math.max(Number(request.query["page[number]"] || 1, 1));
  const itemsPerPage = Math.min(Math.max(Number(request.query["page[size]"] || 10), 1), 100);
  const emailFilter = request.query["search[email]"]?.trim();

  // Build base query
  const baseQuery = this.db
    .select({
      uuid: this.users.uuid,
      name: this.users.name,
      email: this.users.email,
      metadata: this.users.metadata,
      appdata: this.users.appdata,
      active: this.users.active,
      isAdmin: this.users.isAdmin,
      created_at: this.users.created_at,
      updated_at: this.users.updated_at,
    })
    .from(this.users)
    .orderBy(asc(this.users.created_at));

  // Apply email filter if present
  if (emailFilter) {
    baseQuery.where(like(this.users.email, `%${emailFilter}%`));
  }

  // Get paginated results
  const users = await baseQuery.limit(itemsPerPage).offset((currentPage - 1) * itemsPerPage);

  // Get total count
  const totalResult = await this.db
    .select({ count: count() })
    .from(this.users)
    .where(emailFilter ? like(this.users.email, `%${emailFilter}%`) : undefined);

  const totalItems = Number(totalResult[0]?.count || 0);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Build pagination links
  const buildLink = (page) => {
    const url = new URL(request.raw.url, `${request.protocol}://${request.hostname}`);
    url.searchParams.set("page[number]", page);
    url.searchParams.set("page[size]", itemsPerPage);
    if (emailFilter) url.searchParams.set("search[email]", emailFilter);
    return url.pathname + url.search;
  };

  const links = {
    first: buildLink(1),
    last: buildLink(totalPages),
    ...(currentPage > 1 && { prev: buildLink(currentPage - 1) }),
    ...(currentPage < totalPages && { next: buildLink(currentPage + 1) }),
  };

  // Format response
  reply.code(200);
  return {
    data: users.map((user) => ({
      type: "users",
      id: user.uuid,
      attributes: {
        name: user.name,
        email: user.email,
        metadata: user.metadata || {},
        appdata: user.appdata || {},
        active: Boolean(user.active),
        isAdmin: Boolean(user.isAdmin),
        created: user.created_at,
        updated: user.updated_at,
      },
    })),
    meta: {
      pagination: {
        current: currentPage,
        total: totalItems,
        pages: totalPages,
        size: itemsPerPage,
      },
    },
    links,
  };
};
