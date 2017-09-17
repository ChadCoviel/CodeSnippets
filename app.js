const clipboard = require('electron');

//Initiate cross-module communication mediator
var pubsub = new PubSub();

//Right hand side of screen
var codeEditorModule = (function() {

	var editor = CodeMirror.fromTextArea(document.getElementById('codeSnippetText'), {
  	theme: "dracula",
  	scrollbarStyle: "null",
  	autofocus: true,
  	lineNumbers: true
	});
	editor.setSize(null,null);

	//cache DOM
	$el = $('#TopDiv');
	$save = $el.find('#save');
	$clear = $el.find('#clear');
	$description = $el.find('#description');
	$language = $el.find('#language');

	//Bind events
	pubsub.subscribe('edit',displaySnippet);
	$save.on('click',saveSnippet);
	$clear.on('click',clearValues);

	function saveSnippet() {
		pubsub.publish('Save', {
			code: editor.getValue(), 
			description: $description.val(),
			language: $language.val()
		});
		setEditorHighlighting();
	}

	function displaySnippet(data) {
		editor.setValue(data.code);
		$description.val(data.description);
		$language.val(data.language).trigger('change');
		setEditorHighlighting();
	}

	function clearValues() {
		editor.setValue("");
		$description.val("");
		$language.val("").trigger('change');
	}

	function setEditorHighlighting() {
		var mime;
		var lang = $language.val().toLowerCase();
		switch(lang) {
			case "javascript":
				mime = "javascript";
				break;
			case "java":
				mime = "text/x-java";
				break;
			case "c":
				mime = "text/x-csrc";
				break;
			case "c++":
				mime = "text/x-c++src";
				break;
			case "c#":
				mime = "text/x-csharp";
				break;
			case "objective-c":
				mime = "text/x-objectivec";
				break;
			case "php":
				mime = "text/x-php";
				break;
			case ".net":
				mime = "text/x-vb";
				break;
			case "scala":
				mime = "text/x-scala";
				break;
			case "matlab":
				mime = "text/x-octave";
				break;
			case "lisp":
				mime = "text/x-common-lisp";
				break;
			case "css":
				mime = "text/css";
				break;
			case "python":
				mime = "text/x-python";
				break;
			case "html":
				mime = "text/html";
				break;
			case "latex":
				mime = "text/x-stex";
				break;
			case "ruby":
				mime = "text/x-ruby";
				break;
			case "sql":
				mime = "text/x-sql";
				break;
			case "powershell":
				mime = "text/x-sh";
				break;
			case "swift":
				mime = "text/x-swift";
				break;
			case "fortran":
				mime = "text/x-fortran";
				break;
			case "pascal":
				mime = "text/x-pascal";
				break;
			case "assembly":
				mime = "text/x-gas";
				break;
			default:
		}
		editor.setOption("mode",mime);
	}

})();



//Left hand side of screen
var codeSnippetListModule = (function(){

	console.log(localStorage.getItem('codeSnippets'));
	var locData = localStorage.getItem('codeSnippets');
	var data = JSON.parse(locData || "[]");
	if (!data)
		codeSnippets = [];
	codeSnippets = data;
	var currentSnippets = codeSnippets;
	console.log(data);

	//cache necessary DOM elements
	$el = $('#TopDiv');
	$ul = $el.find('#codeSnippets');
	$li = $el.find('li');
	$search = $el.find('#search');
	template = $el.find('#code-snippets-template').html();

	//Bind events
	pubsub.subscribe('Save',addToList);
	$ul.delegate('#delete','click',deleteCodeSnippet);
	$ul.delegate('#copy','click',copyCodeSnippet);
	$ul.delegate('#edit','click',editCodeSnippet);
	$search.keyup(updateCurrentSnippets);

	//Convert to html and display
	render();

	function render() {
		$ul.html(Mustache.render(template,{codeSnippets: currentSnippets}));
	}

	function addToList(data) {
	 	var code = data.code || "";
	 	var description = data.description || "";
	 	var language = data.language || "";
	 	var date = new Date();

	 	if(checkIfSaved(data)) 
	 		return;
	 	else if (code.length > 0) {
	 		if (description.length < 1)
	 			description = "code snippet";
	 		codeSnippets.unshift({
	 			code: code,
	 			description: description,
	 			language: language,
	 			date: date
	 		});
	 		updateCurrentSnippets();
			saveData();
			render();
	 	}
	 	else
	 		alert('Please enter some code to save');
	}

	function checkIfSaved(data) {
		var saved = false;
		for (var i = 0; i < codeSnippets.length; i++) {
			if(codeSnippets[i].description == data.description && codeSnippets[i].language == data.language) {
				saved = true;
				codeSnippets[i].code = data.code;
				codeSnippets[i].date = new Date();
				updateCurrentSnippets();
				break;
			}
		}
		return saved;
	}

	function updateCurrentSnippets() {
		var input = $search.val();
		if (input == "") {
			currentSnippets = codeSnippets;
			render();
			return;
		}
		currentSnippets = codeSnippets.filter(function(snippet) {
			var string = snippet.description + " " + snippet.language + " " + snippet.code;
			return string.toLowerCase().includes(input);
		});
		render();
	}

	function deleteCodeSnippet(event) {
		event.stopPropagation();
		var i = $ul.find('li').index($(event.target).closest('li')); 
    var remove;
    codeSnippets.find( function(element,index) {
    	if (element == currentSnippets[i])
    		remove = index;
    	return element == currentSnippets[i];
    });
    codeSnippets.splice(remove,1);
    updateCurrentSnippets();
    saveData();
    render();
    return false;
	}

	function copyCodeSnippet(event) {
		event.stopPropagation();
		var i = $ul.find('li').index($(event.target).closest('li'));
    clipboard.writeText(currentSnippets[i].code)
    render();
    return false;
	}

	function editCodeSnippet(event) {
		var i = $ul.find('li').index($(event.target).closest('li'));
    pubsub.publish('edit',currentSnippets[i]);
    render();
    return false;
	}

	function saveData() {
  		localStorage.setItem('codeSnippets',JSON.stringify(codeSnippets));
	}

})();