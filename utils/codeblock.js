'use strict';

module.exports = function codeBlock(contents) {
	return `\`\`\`
${contents}
\`\`\``;
};
