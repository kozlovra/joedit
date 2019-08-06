var tabCharacter = "  ";
var tabOffset = 2;

$(document).on('click', '#indent', function(e){
    e.preventDefault();
    var self = $(this);
    
    self.toggleClass('active');
    
    if(self.hasClass('active'))
    {
        tabCharacter = "\t";
        tabOffset = 1;
    }
    else
    {
        tabCharacter = "  ";
        tabOffset = 2;
    }
})

$(document).on('click', '#fullscreen', function(e){
    e.preventDefault();
    var self = $(this);
    
    self.toggleClass('active');
    self.parents('.editor-holder').toggleClass('fullscreen');
});

$(document).on('ready', function(){
    correctTextareaHight($('.editor'));
    hightlightSyntax();
    
    emmet.require('textarea').setup({
    pretty_break: true,
    use_tab: true
    });
});

$(document).on('ready load keyup keydown change click', '.editor', function(){
    correctTextareaHight($('.editor'));
    hightlightSyntax();
});

function correctTextareaHight(element)
{
  var self = $(element),
      outerHeight = self.outerHeight(),
      innerHeight = self.prop('scrollHeight'),
      borderTop = parseFloat(self.css("borderTopWidth")),
      borderBottom = parseFloat(self.css("borderBottomWidth")),
      combinedScrollHeight = innerHeight + borderTop + borderBottom;
  
  if(outerHeight < combinedScrollHeight )
  {
    self.height(combinedScrollHeight);
  }
}
function hightlightSyntax(){
    var me  = $('.editor');
    var content = me.val();
    var codeHolder = $('code');
    var escaped = escapeHtml(content);
    
    codeHolder.html(escaped);
    
    $('.syntax-highight').each(function(i, block) {
        hljs.highlightBlock(block);
    });
}

function escapeHtml(unsafe) {
    return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
}

$(document).delegate('.allow-tabs', 'keydown', function(e) {
    var keyCode = e.keyCode || e.which;

    if (keyCode == 9) {
        e.preventDefault();
        var start = $(this).get(0).selectionStart;
        var end = $(this).get(0).selectionEnd;

        $(this).val($(this).val().substring(0, start)
                                + tabCharacter
                                + $(this).val().substring(end));
        $(this).get(0).selectionStart =
        $(this).get(0).selectionEnd = start + tabOffset;
    }
});
;
function saveTextAsFile()
{
    var textToWrite = document.getElementById("inputTextToSave").value;
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
    {
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else
    {
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
}

function loadFileAsText()
{
    var fileToLoad = document.getElementById("fileToLoad").files[0];

    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) 
    {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        document.getElementById("inputTextToSave").value = textFromFileLoaded;
        correctTextareaHight($('.editor'));
        hightlightSyntax();
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
    $('.filename').val(fileToLoad.name);
    document.title = $('.filename').val() + sitename;
};