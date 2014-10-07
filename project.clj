(defproject clojurerepl "0.1.0-SNAPSHOT"
  :description "ClojureRepl"
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/clojurescript "0.0-2356"]
                 [lib-noir "0.8.1"]
                 [compojure "1.1.6"]
                 [ring-server "0.3.1"]
                 [commons-lang/commons-lang "2.5"]
                 [clojail "1.0.6"]]
  :min-lein-version "2.0.0"
  :uberjar-name "clojurerepl-standalone.jar"
  :plugins [[lein-ring "0.8.10"] [lein-cljsbuild "1.0.3"]]
  :cljsbuild {
    :jvm-opts ^:replace ["-Xmx1024m" "-server"]
    :builds [{:source-paths ["src-cljs"]
              :compiler {:output-to "resources/public/parser.js"
                          :optimizations :advanced
                         }}]}
  :jvm-opts ["-Djava.security.policy=example.policy" "-Xmx1024M"]
  :ring {
         :handler clojurerepl.server/app :port 8801})


