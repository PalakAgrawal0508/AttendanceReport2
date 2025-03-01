export const getBranches = async () => {
	return [
		{
			$project: {
				branch: "$branch",
				batch: "$batch",
			},
		},
		{
			$group: {
				_id: {
					branch: "$branch",
					batch: "$batch",
				},
			},
		},
	];
};
