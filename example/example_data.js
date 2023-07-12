let example_data = {
	blocks: [
		{
			type: "header",
			data: {
				text: "Example: @juratbek/editorjs-quiz",
				level: 3,
			},
		},
		{
			type: "paragraph",
			data: {
				text: "This is an example of using EditorJs, with @juratbek/editorjs-quiz package",
			},
		},
		{
			type: "delimiter",
		},
		{
			type: "quiz",
			data: {
				"variants": [
					{
						"value": 0,
						"text": "Helo"
					},
					{
						"value": 1,
						"text": "Hi"
					},
					{
						"value": 2,
						"text": "Good morning"
					}
				],
				"answers": [1],
				"type": "singleSelect"
			}
		}
	],
};
