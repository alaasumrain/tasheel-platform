/**
 * Helper function to convert Next.js searchParams to URLSearchParams
 */
export function convertSearchParamsToURLSearchParams(
	searchParams: { [key: string]: string | string[] | undefined }
): URLSearchParams {
	const urlSearchParams = new URLSearchParams();

	Object.entries(searchParams).forEach(([key, value]) => {
		if (value) {
			if (Array.isArray(value)) {
				value.forEach((v) => urlSearchParams.append(key, v));
			} else {
				urlSearchParams.set(key, value);
			}
		}
	});

	return urlSearchParams;
}

