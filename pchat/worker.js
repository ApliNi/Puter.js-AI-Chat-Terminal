
import hljs from 'https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/+esm';
import Katex from 'https://cdn.jsdelivr.net/npm/katex@0.16.27/+esm';
import { Marked } from 'https://cdn.jsdelivr.net/npm/marked@17.0.1/+esm';
import { markedHighlight } from 'https://cdn.jsdelivr.net/npm/marked-highlight@2.2.3/+esm';
import markedKatex from 'https://cdn.jsdelivr.net/npm/marked-katex-extension@5.1.6/+esm';

(async () => {

	const marked = new Marked(
		markedHighlight({
			emptyLangClass: 'hljs',
			langPrefix: 'hljs language-',
			highlight(code, lang, info) {
				const language = hljs.getLanguage(lang) ? lang : 'plaintext';
				return hljs.highlight(code, { language }).value;
			}
		})
	);

	marked.setOptions({
		breaks: true,
		gfm: true,
	});

	marked.use(markedKatex({ throwOnError: false, nonStandard: true }));

	self.addEventListener('message', (event) => {
		// 主线程发送的数据通过 event.data 访问
		const { type, data, id } = event.data;

		const send = (data) => {
			self.postMessage({ type, data, id });
		};

		// 渲染 Markdown
		if (type === 'renderMarkdown') {
			const html = marked.parse(data);
			send(html);
		}
		
	});

	self.postMessage({ type: 'init', data: null, id: 0 });

})();
