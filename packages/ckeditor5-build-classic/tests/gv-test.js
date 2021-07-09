//
// Initial test content
//

const initContent = `
<style> 
        img {
            max-width: 100%;
        }
        
        .gv-h1, .gv-h3 {
            color: #6947ff;
            background-color: white;
        }
        .gv-h1 {
            text-align: center;
         }

        .gv-h2 {
            color: white;
            background-color: #fff200;
            padding: 5px 10px;
        }

        .gv-heading1, .gv-heading3 {
            color: #6947ff !important;
            background-color: white !important;
        }

        .gv-heading2 {
            color: white !important;
            background-color: #fff200 !important;
        }

    .ck.ck-dropdown .ck-button.ck-dropdown__button .ck-button__label {
      width: 5.5em;
    }
    .ck.ck-dropdown.ck-heading-dropdown .ck-dropdown__panel .ck-list__item {
      min-width: 10em;
    }

    .ck.ck-dropdown .ck-dropdown__arrow {
      display:none;
    }

    .ck-font-size-dropdown .ck-dropdown__panel,
    .ck-font-family-dropdown .ck-dropdown__panel,
    .widgetsDropdown .ck-dropdown__panel,
    .personalizeDropdown .ck-dropdown__panel {
      max-height: 250px;
      overflow-y: auto;
      overflow-x: hidden;
    }
  </style>

  <div id="content">

    Hello there <img src="http://metaimg.localhost.test:8098/attribute/firstname">,

    <p>
      <img src="http://metaimg.localhost.test:8098/ew/count?ewid=36">
    </p>

    <p>
      <img src="http://metaimg.localhost.test:8098/ew/text?ewid=48">
    </p>

    <!--
      <span class="placeholder">{First name}</span>
      <span class="placeholder">{Last name}</span>
    -->

    <div class="image image_resized" style="width:52.55%;">
       <img src="https://www.groupvine.com/assets/img/groupvine2_rgb.png">
    </div>

    <div class="gv-input-attribute" data-type="optedout"></div>

    <div class="gv-input-attribute" data-type="optedout"></div>

    <h2 class="gv-h2">
      DB: Here's the main heading
    </h2>

    <h4>
        <strong>Attributes</strong>
    </h4>

    <figure class="table">
      <table>
        <tbody>
          <tr>
            <td>
              <div class="gv-input-attribute" data-type="list">here's the inp attribute</div>
            </td>
            <td>
              Some text after
            </td>
          </tr>
        </tbody>
      </table>
    </figure>

    <div class="gv-input-attribute" data-type="group"></div>
    <div class="gv-input-attribute" data-type="email"></div>
    <div class="gv-input-attribute" data-type="mobilenumber"></div>
    <div class="gv-input-attribute" data-type="mobileservice"></div>
    <div class="gv-input-attribute" data-type="textingmode"></div>
    <div class="gv-input-attribute" data-type="list"></div>

  </div>
`;

//
// Code
//

// Set content
document.getElementById('editor').innerHTML = initContent;


// Create editor
ClassicEditor.create( document.querySelector( '#editor' ), {
    debugLevel: 10,

    userAttribute: {
        metaImgBaseUrl : 'http://metaimg.localhost.test:8098'
    },
    emailWidget: {
        assignEwId : function(type, cb) { 
            cb({ewId: 123});
        },
        createEwDialog : function(cb) {
            cb({ewType: 'ew/testname', ewId: 123});
        }
    }

}).then( editor => {

    window.editor = editor;
    console.log( "STARTED" );

    // This setData() method doesn't honor the CSS styling, so
    // instead, set content using innerHTML before creating editor.
    //   editor.setData(initContent);

    const modelDocument = editor.model.document;

    function updatePreview() {
        let content = editor.getData();
        // console.log("New content: ", content);
        document.getElementById('preview').innerHTML = content;
    }

    modelDocument.on( 'change:data',  ev => {
        updatePreview();
    });

    // Set initial content
    setTimeout( () => {
        updatePreview();
    }, 100);

    CKEditorInspector.attach( editor );

}).catch( err => {
    console.error( err.stack );
});


