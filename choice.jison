/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex

%%
" "                   return 'SPACE';
"ram"                 return 'NAME';
"likes"               return 'TYPE';
"hates"               return 'TYPE';
"tea"                 return 'CHOICE';
"coffee"              return 'CHOICE';
"butter"              return 'CHOICE';
"cheese"              return 'CHOICE';
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
        ;