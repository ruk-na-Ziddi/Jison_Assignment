/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex

%%
" "                   return 'SPACE';
"ram"                 return 'NAME';
"sita"                return 'NAME';
"likes"               return 'TYPE';
"hates"               return 'TYPE';
"tea"                 return 'CHOICE';
"coffee"              return 'CHOICE';
"butter"              return 'CHOICE';
"cheese"              return 'CHOICE';
"biscuits"            return 'CHOICE';
"also"                return 'ALSO';
"."                   return 'DOT';
<<EOF>>               return 'EOF';
\n                    return 'NEWLINE';
/lex

%{
    var list = [];
%}

%start language

%% /* language grammar */

language : expression EOF{return list;}
        ;

expression : sentence
        | expression NEWLINE sentence
        ;

sentence  :NAME SPACE TYPE SPACE CHOICE DOT
        {list.push({"NAME":$1, "TYPE":$3, "CHOICE":$5})}
        | NAME SPACE TYPE SPACE NAME DOT
        {list.push({"NAME":$1, "TYPE":$3, "CHOICE":$5})}
        | NAME SPACE ALSO SPACE TYPE SPACE CHOICE DOT
        {list.push({"NAME":$1, "ALSO":$3, "TYPE":$5 ,"CHOICE":$7})}
        | NAME SPACE ALSO SPACE TYPE SPACE NAME DOT
        {list.push({"NAME":$1, "ALSO":$3, "TYPE":$5 ,"CHOICE":$7})}
        ;