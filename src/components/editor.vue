<template>
    <textarea :id="id" :value="value"></textarea>
</template>
<script>
// Import TinyMCE
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/modern/theme';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/code';
import 'tinymce/plugins/table';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/colorpicker';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/media';

const INIT = 0;
const CHANGED = 2;
var EDITOR = null;
export default {
    props: {
        value: {
            type: String,
            required: true
        },
        accept: {
            default: 'image/jpeg, image/png, image/gif',
            type: String
        },
        setting: {}
    },
    watch: {
        value: function(val) {
            // console.log('init ' + val)
            if (this.status == INIT || tinymce.activeEditor.getContent() != val) {
                tinymce.activeEditor.setContent(val);
            }
            this.status = CHANGED
        }
    },
    data: function() {
        return {
            status: INIT,
            id: 'editor-' + new Date().getMilliseconds(),
        }
    },
    methods: {},
    mounted: function() {
        const _this = this;
        const setting = {
            selector: '#' + _this.id,
            init_instance_callback: function(editor) {
                EDITOR = editor;
                // console.log("Editor: " + editor.id + " is now initialized.");
                editor.on('input change undo redo', () => {
                    var content = editor.getContent()
                    _this.$emit('input', content);
                });
            },
            language_url: "/static/langs/zh_CN.js",
            skin_url: "/static/skins/lightgray",
            menubar: false,
            forced_root_block:false,
            valid_children : "+body[style]",
            toolbar: 'styleselect | fontselect | formatselect | fontsizeselect | forecolor backcolor | bold italic underline strikethrough | image  media | table | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | preview removeformat  hr | paste code  link | undo redo | fullscreen ',
            plugins: ' paste importcss image code table advlist fullscreen link   media lists textcolor colorpicker hr preview ',
            // Image
            imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
            images_upload_handler: function(blobInfo, success, failure) {
                console.log(blobInfo.blob().type);
                console.log(_this.accept.indexOf(blobInfo.blob().type));
                if (blobInfo.blob().size > _this.$store.state.maxSize * 1024 * 1024) {
                    failure('文件体积过大')
                }
                if (_this.accept.indexOf(blobInfo.blob().type) >= 0) {
                    uploadPic()
                } else {
                    failure('图片格式错误')
                }

                function uploadPic() {
                    let formData = new FormData()
                    // 服务端接收文件的参数名，文件数据，文件名
                    formData.append('file', blobInfo.blob(), blobInfo.filename())
                    _this.$http(_this.$api.Upload,'save',{data: formData}).then( res => {
                        success(_this.$api.StaticResource + res.data.result.url) // 返回图片地址
                    }).catch( msg => {
                       failure(msg)
                    })
                }
            }

        };
        Object.assign(setting, _this.setting)
        tinymce.init(setting);
    },
    beforeDestroy: function() {
        tinymce.get(this.id).destroy();
    }
}

</script>
