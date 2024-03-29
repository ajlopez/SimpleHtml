
var tags = ["html", "head", "body", "header", "footer",
                           "p", "div", "span", "table", "tr", "td",
                           "ul", "ol", "li", "center", "dd", "dl",
                           "dt", "i", "b", "em", "strong", "title", "label",
                           "pre", "script", "style", "a", "form", "textarea",
                           "select", "option", "article", "section", "code",
                           "abbr", "acronym", "address", "bdo", "address",
                           "big", "tt", "small", "blockquote", "button",
                           "caption", "dfn", "cite", "code", "samp", "kbd",
                           "var", "colgroup", "del", "ins", "dir", "fieldset",
                           "legend", "frameset", "iframe", "noframes",
                           "noscript", "object", "optgroup", "q","sub", "sup",
                           "thead", "tfoot", "tbody"
                           , // added tags
                           "h1", "h2", "h3", "h4", "h5", "h6"                           
                           , // single tags
                           "meta", "br", "hr",
                              "link", "input", "img",
                              "base", "col", "frame",
                              "param"
                           ];

var inputTags = ["text", "password", "checkbox",
                              "radio", "submit"];                           

for (var n in tags) {
    var name = tags[n];
    
    exports[name] = makeTag(name);
}

var input = exports['input'];

for (var n in inputTags) {
    var name = inputTags[n];
    exports[name] = makeInputTag(name);
}

exports.comment = function() {
    var result = "<!--";
    
    if (arguments)
        for (var n in arguments)
            result += arguments[n];
    
    result += "-->";
    
    return result;
}

exports.exportsTo = function(target) {
    for (var n in tags) {
        var name = tags[n];
    
        target[name] = this[name];
    }

    for (var n in inputTags) {
        var name = inputTags[n];
    
        target[name] = this[name];
    }
    
    target['comment'] = this['comment'];
}

function makeInputTag(name) {
    return function() {
        if (!arguments || arguments.length == 0)
            return input({ type: name });
        return input({type:name}, arguments);
    }
}

function makeTag(name) {
    return function() {
        if (!arguments || arguments.length == 0)
            return "<" + name + " />";
        
        var result = "<" + name;
        
        processAttributes(arguments);
        
        var closed = false;
                
        processContent(arguments);
        
        if (closed)
            result += "</" + name + ">";
        else
            result += " />";
            
        return result;
        
        function processAttributes(args) {
            var argument;

            for (var n in args) {
                argument = args[n];
                
                if (isArray(argument)) {
                    processAttributes(argument);
                    continue;
                }
                
                if (typeof argument != "object")
                    continue;
                    
                for (var sname in argument) {
                    result += " " + sname + "='" + argument[sname] + "'";
                }
            }
        }
        
        function isArray(obj)
        {
            if (obj == null || typeof obj == 'string')
                return false;
            return Array.isArray(obj) || obj['0'];
        }
        
        function processContent(args) {
            for (var n in args) {
                argument = args[n];

                if (isArray(argument)) {
                    processContent(argument);
                    continue;
                }
                
                if (argument == null || typeof argument == "object")
                    continue;
                    
                if (!closed) {
                    result += ">";
                    closed = true;
                }
                    
                result += argument;
            }
        }
    };
}

