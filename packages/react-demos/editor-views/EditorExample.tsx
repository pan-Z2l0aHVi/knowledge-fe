import React from 'react'
import Editor from '@youknown/react-editor/src'
import { Button } from '@youknown/react-ui/src'

export default () => {
	const editor = Editor.useEditor({
		content: `<h2>
		Hi there,
	  </h2>
	  <p>
		this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
	  </p>
	  <ul>
		<li>
		  That’s a bullet list with one …
		</li>
		<li>
		  … or two list items.
		</li>
	  </ul>
	  <p>
		Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
	  </p>
	  <pre><code class="language-css">body {
  display: none;
}</code></pre>
	  <p>
		I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
	  </p>
	  <blockquote>
		Wow, that’s amazing. Good work, boy! 👏
		<br />
		— Mom
	  </blockquote>
	  <table>
		  <tbody>
			<tr>
			  <th>Name</th>
			  <th colspan="3">Description</th>
			</tr>
			<tr>
			  <td>Cyndi Lauper</td>
			  <td>singer</td>
			  <td>songwriter</td>
			  <td>actress</td>
			</tr>
		  </tbody>
		</table>
		</h2>
	  <p>
		this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
	  </p>
	  <ul>
		<li>
		  That’s a bullet list with one …
		</li>
		<li>
		  … or two list items.
		</li>
	  </ul>
	  <p>
		Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
	  </p>
	  <pre><code class="language-css">body {
  display: none;
}</code></pre>
	  <p>
		I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
	  </p>
	  <blockquote>
		Wow, that’s amazing. Good work, boy! 👏
		<br />
		— Mom
	  </blockquote>
	  <table>
		  <tbody>
			<tr>
			  <th>Name</th>
			  <th colspan="3">Description</th>
			</tr>
			<tr>
			  <td>Cyndi Lauper</td>
			  <td>singer</td>
			  <td>songwriter</td>
			  <td>actress</td>
			</tr>
		  </tbody>
		</table>
	`
	})

	if (!editor) return null

	return (
		<div className="editor-page" style={{}}>
			<div
				className="header-bar"
				style={{
					height: 64,
					borderBottom: '1px solid 1px solid var(--g-bd-line)',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: '0 32px',
					position: 'sticky',
					top: 0,
					background: 'var(--g-bg-0)',
					zIndex: 10
				}}
			>
				<h1>文档</h1>
				<Button disabled={editor.isEmpty} primary>
					保存
				</Button>
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<div
					style={{
						position: 'sticky',
						top: 64,
						background: 'var(--g-bg-0)',
						zIndex: 30,
						display: 'flex',
						justifyContent: 'center',
						width: '100%',
						paddingBottom: 8,
						borderBottom: '1px solid var(--g-bd-line)'
					}}
				>
					<div
						style={{
							padding: 4,
							background: 'var(--g-bg-2)',
							border: '1px solid var(--g-bd-line)',
							borderRadius: 8
						}}
					>
						<Editor.Toolbar editor={editor}></Editor.Toolbar>
					</div>
				</div>
				<div style={{ margin: '0 auto', width: 750, paddingTop: 48 }}>
					<Editor.Content editor={editor}></Editor.Content>
				</div>
			</div>
		</div>
	)
}
