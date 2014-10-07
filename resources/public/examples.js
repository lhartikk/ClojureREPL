var QSORT ="\
(defn qsort [[pivot & xs]]\n\
  (when pivot\n\
    (let [smaller #(< % pivot)]\n\
      (lazy-cat (qsort (filter smaller xs))\n\
        [pivot]\n\
        (qsort (remove smaller xs))))))\n\
\n\
\n\
(qsort [3 1 4 1 5 9 2 6])\n\
(qsort [2 7 1 5 9 2 6])\n\
"


var E1 =
"\
(defn is_div_3or5?[x]\n\
 (or\n\
  (zero? (mod x 3)) \n\
  (zero? (mod x 5)) \n\
  )\n\
)\n\
\n\
\n\
\n\
(reduce +\n\
  (filter is_div_3or5?\n\
    (range 1000)\n\
  )\n\
)\n\
"

var E2="\n\
(defn fib[a b]\n\
  (lazy-cat (cons a (fib b (+ a b)))\n\
  )\n\
)\n\
\n\
\n\
(reduce +\n\
  (filter even?\n\
    (take-while #(< % 4000000 ) (fib 1 1))\n\
  )\n\
)\n\
"

var TSERS =
"\
(defn tsers?[s]\n\
  (= s \"tsers\")\n\
)\n\
\n\
(map tsers?\n\
  (repeat 10 \"tsers\")\n\
)\n\
"

function qsort(){
    editor.setValue(QSORT, 1)
    compile()
}

function e1(){
    editor.setValue(E1, 1)
    compile()
}

function e2(){
    editor.setValue(E2, 1)
    compile()
}

function tsers(){
    editor.setValue(TSERS, 1)
    compile()
}
