<template>
	<!-- 	<div>
		<p>{{message}}</p>
		<quill-editor v-model="content" ref="quillEditorA" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)">
		</quill-editor>
		<div class="content ql-editor" v-html="content"></div>
	</div> -->
	<div>
		<quill-editor v-model="rt.detail"></quill-editor>
	</div>
</template>
<script>
export default {
	name: 'RichText',
	data() {
		return {
			// content: '<h2>I am Example A</h2>',
			editorOption: {
				theme: 'snow'
			}
		};
	},
	props: {
		rt: { // 父组件的定义数据对象
			required: true
		},
	}
}

</script>
