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
"."                   return 'DOT';
<<EOF>>               return 'EOF';
\n                    return 'NEWLINE';
/lex

%{
    var get_tuples = function(){
        var final = {};
        for(var i = 0; i < arguments.length; i++){
            final[Object.keys(arguments[i])[0]] = arguments[i][Object.keys(arguments[i])[0]]
        }
        return final;
    }
%}

%start language

%% /* language grammar */

language : expression EOF{ return $1;}
        ;

expression : sentence
        {$$ = {"expression": [$1]}}
        | expression NEWLINE sentence
        {$$ = {"expression": [$1,$3]};}
        ;

sentence  :NAME_token SPACE TYPE_token SPACE CHOICE_token DOT
        {$$ = {"sentence":get_tuples($1,$3,$5)}}
        ;

NAME_token   :NAME 
    {$$ = {"NAME": yytext};}
       ;

TYPE_token   :TYPE
    {$$ = {"TYPE": yytext};}
        ;

CHOICE_token  :CHOICE
    {$$ = {"CHOICE": yytext};}
        ;
