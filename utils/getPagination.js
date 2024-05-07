export const getPaginatedPayload = (dataArray, page, limit, totalItems) => {
	const totalPages = Math.ceil(totalItems / limit);

	const payload = {
		page,
		limit,
		totalPages,
		previousPage: page > 1,
		nextPage: page < totalPages,
		totalItems,
		currentPageItems: dataArray.length,
		data: dataArray,
	};
	return payload;
};
