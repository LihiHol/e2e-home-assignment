# app/utils/pagination.py

def parse_pagination(limit: int = 10, page: int = 1) -> tuple[int, int]:

    # Returns (limit, skip) values for Mongo queries using skip and limit
    # limit - number of items per page
    # page  - current page number (starting from 1)

    if limit <= 0:
        limit = 10
    if page <= 0:
        page = 1
    skip = (page - 1) * limit
    return limit, skip
