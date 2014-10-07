var FONT_VERTICAL_SIZE = 20
var FONT_HORIZONTAL_SIZE = 10
var EDITOR_TOP = 80
var EDITOR_LEFT = 43
var STATUS_BAR_TOP = 40
var DONE_TYPING_INTERVAL = 300

var editor = ace.edit("editor");
editor.setTheme("ace/theme/solarized_dark");
editor.getSession().setMode("ace/mode/clojure");
editor.getSession().setTabSize(2);
editor.setHighlightActiveLine(false)
editor.focus();
editor.gotoLine(10, 0, false);
editor.commands.bindKeys({"ctrl-l":null});
editor.setShowPrintMargin(false);

var StatusBar = ace.require("ace/ext/statusbar").StatusBar;

var statusBar = new StatusBar(editor, document.getElementById("statusBar"));

function setEditorHeight() {
    windowheight = $(window).height()
    editorheight = windowheight - (windowheight % FONT_VERTICAL_SIZE) - EDITOR_TOP - STATUS_BAR_TOP
    $('#editor').css('height', editorheight + 'px')
}

function setErrorBarWidth() {
    windowWidth = $(window).width()
    errorBarWidth = windowWidth - 170
    $('#errorBar').css('width', errorBarWidth + 'px')
}

function align_horizontal(amount) {
    var cursorRow = editor.getCursorPosition()['row']
    var result = $("#results > [row$='" + cursorRow + "']")
    if(result.length > 0){
        var old = result.css('left')
        result.css('left', (parseFloat(old.replace(/px/,""))+FONT_HORIZONTAL_SIZE * amount)+"px")
    }
}

function align_vertical(amount) {
    var cursorRow = editor.getCursorPosition()['row']
    $("#results").children().each(function(i,data) {
        var row = data.getAttribute('row')
        if(row >= cursorRow) {
            var result = $("#results > [row$='" + row + "']")
            var old_pos = result.css('top')
            var new_pos = (parseFloat(old_pos.replace(/px/,""))+FONT_VERTICAL_SIZE * amount)
            var row = result.attr('row');
            result.css('top', new_pos+"px")
            result.attr('row', row + 1)
        }
    })
}

editor.on("change", function(e) {
    if(editor.getValue().trim().length == 0) {
        $('#results').empty();
        $('#errorText').empty();
        return;
    }

    if(e["data"]["action"] == "insertText") {
        var len = e["data"]["text"].length;
        align_horizontal(len);
    }
    else if(e["data"]["action"] == "removeText") {
        var len = e["data"]["text"].length;
        align_horizontal(-len);
    }
    else if(e["data"]["action"] == "removeLines") {
        var len = e["data"]["lines"].length;
        align_vertical(-len);
    }


})


var typingTimer;
var doneTypingInterval = DONE_TYPING_INTERVAL;

$('#editor').keyup(function(){
    clearTimeout(typingTimer);
    if ($('#editor').val) {
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    }
});

function doneTyping () {
    compile()
}

function createExpression(locations){
  if(locations[0] == 'parse-error'){
    return locations[1]
  }
  return "[" + editor.getValue() + "]"
}

function compile() {
    var code = editor.getValue()
    var locations = parser.get_print_locations(code)
    var delta = editor.getFirstVisibleRow()

    if(locations.length == 0){
        return;
    }

    var expr = createExpression(locations)
    var lineIndent = editor.session.getLength().toString().length

    $.get(
        "/eval.json?",
        {expr : expr},
        function(data) {

            if(data['error']){
                $('#errorText').val(data['message'])
                return
            }
            $('#errorText').val("")
            var results = parser.parse_vector(data['result'].replace(/[a-zA-Z0-9_'|#']*\//g, ""));
            $('#results').empty();
            results.forEach(function(result, i) {
                jQuery('<div/>', {
                    class: 'info',
                    text: result,
                    row: locations[i][1]
                 })
                .css('left', EDITOR_LEFT + (locations[i][0] + lineIndent) * FONT_HORIZONTAL_SIZE + 'px')
                .css('top',  EDITOR_TOP + (locations[i][1] - delta) * FONT_VERTICAL_SIZE + 'px')
                .css('width', result.length * FONT_HORIZONTAL_SIZE)
                .appendTo('#results');
            });
        }
    );
}

function setContent() {
    var route = document.URL.split("/").pop()
    console.log(route)
    switch(route) {
      case "qsort":
          qsort()
      case "e1":
          e1()
      case "e2":
          e2()
      case "tsers":
          tsers()
    }
}

$( document ).ready(function() {
    $('#qsort').click(qsort);
    $('#e1').click(e1);
    $('#e2').click(e2);
    $('#tsers').click(tsers);
    setEditorHeight()
    setErrorBarWidth()
    setContent()
    $(window).resize(setEditorHeight);
    $(window).resize(setErrorBarWidth)
});
