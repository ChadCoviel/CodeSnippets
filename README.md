# CodeSnippets

This is an app built using Electron that allows you to save code snippets in one place. The embedded CodeMirror module provides the syntax highlighting and I set it up to accomodate the most popular languages. There are many more but these are the ones that I currently have setup.:

* Java 
* Javascript
* HTML
* CSS
* Python
* Ruby
* .NET
* SQL
* C
* C++
* C#
* Swift
* Assembly
* PHP
* Fortran
* Objective-C
* MATLAB
* Powershell
* Pascal
* Lisp
* Scala
* LaTeX

It'll be tedious to add all of them so I am putting that off for now.

Each code snippet can have a description for easier reference later on. The list on the left provides a search bar at the top to quickly find a snippet by keyword. The search looks through the code, description, and language of each snippet for the keyword. The combination of description and language constitute the unique identifier for each snippet (i.e. two snippets can have the same description but be in different languages). Currently the storage is done using the localStorage API because I don't expect to be saving that much data so that should be enough for now...

## Future Plans/Changes

* Add the ability to sort the list of snippets by date, description, and language
* Improve the visual presentation. The current dracula theme is nice but I think css can make things look even better.
* Add some keyboard shortcuts for quicksorting without manually clicking the buttons. Shortcuts for autofocusing specific elements would also be nice.
* Many more once they come to mind...
