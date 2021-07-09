/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
// import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
// import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
// import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import LinkImage from '@ckeditor/ckeditor5-link/src/linkimage';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
// import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';

import Font from '@ckeditor/ckeditor5-font/src/font';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';

import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters';
// import SpecialCharactersEssentials from '@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials';
// import SpecialCharactersMathematical from '@ckeditor/ckeditor5-special-characters/src/specialcharactersmathematical';
// import SpecialCharactersText from '@ckeditor/ckeditor5-special-characters/src/specialcharacterstext';
// import SpecialCharactersArrows from '@ckeditor/ckeditor5-special-characters/src/specialcharactersarrows';
import {SpecialCharactersGVArrows, 
        SpecialCharactersGVEmojis, 
        SpecialCharactersGVMath, 
        SpecialCharactersGVText } from './specialchars';

//
// Custom GroupVine plugins
//

import GVDataProcessorPlugin from './data-proc/data-proc';
import GVClipboardPlugin from './clipboard/clipboard';
import UserAttribute from './user-attribute/user-attribute';
import InputAttribute from './inp-attribute/inp-attribute';
import EmailWidget from './email-widget/email-widget';

import Link from '@ckeditor/ckeditor5-link/src/link';
// import Link from './buttonlink/link';


export default class ClassicEditor extends ClassicEditorBase {}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
	Essentials,
        // UploadAdapter,
	Autoformat,
	Bold,
	Italic,
	Underline,
	BlockQuote,
	// CKFinder,
	// CloudServices,
	// EasyImage,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
        ImageResize,
	Indent,
        IndentBlock,
	Link,
	List,
        // MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,
	Font,

	SimpleUploadAdapter,
        Alignment,
        RemoveFormat,

        // GroupVine plugins
        GVDataProcessorPlugin,
        GVClipboardPlugin,
        UserAttribute,
        InputAttribute,
        EmailWidget,

        SpecialCharacters, 
        // SpecialCharactersEssentials, 
        SpecialCharactersGVEmojis,
        SpecialCharactersGVArrows,
        SpecialCharactersGVText,
        SpecialCharactersGVMath,

	TextTransformation
];

// Editor configuration.
ClassicEditor.defaultConfig = {
        fontSize: {
            options: [
                8,
                10,
                12,
                'default',
                16,
                18,
                20,
                24,
                28,
                32,
                40,
                50
            ]
        },

	toolbar: {
                // shouldNotGroupWhenFull : true,

		items: [
			'heading',
                        'fontSize', 
                        'fontFamily',
			'bold',
			'italic',
                        'underline',
			'|',
			'bulletedList',
			'numberedList',
                        'alignment',
			'|',
                        'gv-user-attribute',
                        'gv-email-widget',
                        'gv-input-attribute',
                        'fontColor', 'fontBackgroundColor',
			'insertTable',
			'|',
			'outdent',
			'blockQuote',
			'|',
			'link',
			'imageUpload',
     		        // 'mediaEmbed',
                        'specialCharacters',
                        'removeformat',
			'|',
			'undo',
			'redo'
		]
	},

	image: {
            styles: [
                'alignLeft', 'alignCenter', 'alignRight'
            ],

            // Configure the available image resize options.
            resizeOptions: [
                {
                    name: 'imageResize:original',
                    label: 'Original',
                    value: null
                },
                {
                    name: 'imageResize:50',
                    label: '50%',
                    value: '50'
                },
                {
                    name: 'imageResize:75',
                    label: '75%',
                    value: '75'
                }
            ],

            toolbar: [
                'imageStyle:alignLeft', 
                'imageStyle:alignCenter', 
                'imageStyle:alignRight',
                '|',
                'imageResize',
                '|',
                'toggleImageCaption',
                'imageTextAlternative',
                '|',
                'linkimage'
            ]

	},

	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		]
	},

        heading: {
            options: [
                // view.name and view.classes will apply to generated HTML; class will apply to heading in Editor dropdown
                { model: 'paragraph', title: 'Normal', class: 'ck-heading_paragraph' },

                { model: 'heading1', view: {name : 'h1', classes : 'gv-h1'}, 
                  title: 'Title', class: 'ck-heading_heading1 gv-heading1' },

                { model: 'heading2', view: {name : 'h2', classes : 'gv-h2'}, 
                  title: 'Section', class: 'ck-heading_heading2 gv-heading2' },

                { model: 'heading3', view: {name : 'h3', classes : 'gv-h3'}, 
                  title: 'Subsection', class: 'ck-heading_heading3 gv-heading3' }
            ]
        },

        fontFamily : {
            supportAllValues: true,
            options: [
		'default',
		'Arial, Helvetica, sans-serif',
                'Arial Black, Helvetica, sans-serif',
		'Courier New, Courier, monospace',
                'Comic Sans MS, Helvetica, sans-serif',
		'Georgia, serif',
                'Impact, Arial Black, Arial, sans-serif',
		'Lucida Sans Unicode, Lucida Grande, sans-serif',
		'Tahoma, Geneva, sans-serif',
		'Times New Roman, Times, serif',
		'Trebuchet MS, Helvetica, sans-serif',
                'Ubuntu, Arial, sans-serif',
                'Ubuntu Mono, Courier New, Courier, monospace',
		'Verdana, Geneva, sans-serif'
	    ]
        },


	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'en'
};
