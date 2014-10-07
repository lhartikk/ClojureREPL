(ns clojurerepl.server
  (:use compojure.core)
  (:require [compojure.route :as route]
            [noir.util.middleware :as nm]
            [ring.adapter.jetty :as jetty]
            [ring.util.response :as resp]
            [clojurerepl.views.eval :as eval]))



(def app-routes
  [
   (GET "/" [] (resp/file-response "index.html" {:root "resources/public"}))
   (GET "/eval.json" [:as {args :params}] (eval/eval-json (args :expr) (args :jsonp)))
   (route/resources "/")
   (route/not-found (resp/file-response "index.html" {:root "resources/public"}))
   ])

(def app (nm/app-handler app-routes))

(defn -main [port]
  (jetty/run-jetty app {:port (Long. port) :join? false}))
