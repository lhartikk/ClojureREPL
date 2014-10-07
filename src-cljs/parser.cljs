(ns parser
 (:require
 [clojure.string :as string]
 [cljs.reader :as reader])
  )


(defn cat_two_first[array]
  (conj (rest (rest array)) (clojure.string/join [(first array) (second array)] ))
)

(defn comment?[c]
  (contains? #{";"} (str c))
  )

(defn skippable-char?[c]
  (contains? #{" " "\n"} (str c))
  )

(defn special-char?[c]
  (contains? #{" " "\n" "(" ")" ""} (str c) )
 )


(defn handlews[array]
  (let [first-char (str (first (first array)))]

   (if (skippable-char? first-char)
    (cat_two_first array)
    array
    )
  )
)

(defn parse-error [last-found]
  ["parse-error" (reduce str last-found)]
  )

(defn handle-comment[seen left]
     (cond
     (empty? left) [seen left]
     (= (str (first left)) "\n") [seen left]
     :else
     (handle-comment (str seen " ") (subs left 1))
   )
)

(defn parse-req[seen left found parenthesis]
     (let [
       next-char (str (first left))
       new-parenthesis (cond
            (= "(" next-char) (inc parenthesis)
            (= ")" next-char) (dec parenthesis)
             :else parenthesis
              )]
      (cond
       (comment? next-char)
         (let[temp (handle-comment seen left)] (parse-req (first temp) (second temp) found new-parenthesis) )
       (skippable-char? next-char) (parse-req (str seen next-char) (subs left 1) found new-parenthesis)
       (and (zero? parenthesis) (not (special-char? next-char)))
         (parse-error (take 4 left))
       (and (zero? parenthesis) (not (empty? seen)))
         (parse-req "" left  (conj found seen) parenthesis)
       (empty? left)
         (if (zero? parenthesis) found (parse-error (take 4 left)))
         :else
         (parse-req (str seen next-char) (subs left 1) found new-parenthesis)
       )
     )
   )

(defn parse[string]
   (let[result (parse-req "" string [] 0) ]
   (cond
    (= (first result) "parse-error") result
    :else
    (handlews result)
    )
  )
)

(defn find-location-req[left x y]
   (let [next-char (str (first left))]
   (cond
    (empty? left) [x y]
    (=  next-char "\n") (find-location-req (rest left) 0 (inc y))
    :else
     (find-location-req (rest left) (inc x) y)
    )
   )
)

(defn find-location[string]
  (find-location-req  string 0 0)
   )


(defn strip-it[lines]
(cond
   (nil? lines) ""
   (zero? (count (clojure.string/trim (last lines)))) (strip-it (butlast lines))
 :else
   (reduce #(str %1 "\n" %2) lines)
  )
)

(defn strip[string]
  (strip-it (clojure.string/split string #"\n")))

(defn locations-req[left locations currentY]
   (cond
    (empty? left) locations
    :else
    (let [newY (+ currentY (second (find-location (first left)))) ]
    (locations-req
     (rest left)
     (conj locations (map + [0 currentY] (find-location (strip (first left)))))
      newY
     )
    )
   )
 )

(defn  ^:export get_print_locations[string]
  (clj->js
   (if
    (= (first (parse string)) "parse-error") (parse string)
      (locations-req (parse string) [] 0)
   )
 )
)

(defn ^:export parse_vector[string]
  (clj->js
    (map str
      (reader/read-string string)
    )
  )
)
