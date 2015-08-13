##################################################################
# CrossChxTravellingSalesman
##################################################################

The easiest way to run the project is to go to http://mttchrry.github.io/CrossChxTravellingSalesman/, but to run it locally, open the Zip, and navigate to it's directory in your command prompt and run "python -m http.server" (for any version of python 3.x) and then navigate a browser to "http://localhost:8000/"

This is a route problem solver, meant to show the shortest path between any two given points on a map where connections between points are directed and weighted.  When you pick a node, it becomes the destination, and is highlights red.  When you pick a new node, the last destination becomes the source and is highlited blue, with a green (means go!) line connecting them on the shortest route, if one is possible. If one is not possible, then all paths stay black. 

This is using a version of Djikstra's algorithm for a positive directed graph, starting from the source and pulling all vertices, shortest possible vertex first, until the selected destination is reached. 

##################################################################
# Learning points
##################################################################
Things I learned while using this and things that I got a little caught up on.  

1. D3.js as a whole was a new library for me to work with, and I dug through the link provided at https://github.com/mbostock/d3/wiki/Force-Layout for initial ideas and then searched around on google and stackoverflow.com for some specific examples, specifically for some directed line implementations. I found early that you could set the link distance with a function, but got very stuck getting the GUI to actually show.  The culprit was my lack of understanding of the importance of the Tick() method, getting called in the background.  But after that the library itself was pretty easy to work with. 

2. Honestly, creating a python Local host so I could access my files without getting the "Cross origin requests" error. Its be a while since I loaded a file locally besides script and .css files, and I had to re-download python on the machine I was working on to get a SimpleHTTPServer up and running, which took a little remembering/googleing.

3. This is more of a question, but why does the svg.selectAll("path") return "end" sometimes in my code? This stumped me a bit on getting the lines to color in for the shortest path. 

4. $.grep in jQuery to search through arrays is a neat little helper method.

5. How to use JSON.parse to copy objects fairly safely.

##################################################################
# Room for improvement on the finished product. 
##################################################################
Add a UI element to allow modifying the CSV. Use Cassandra or similar library that to add unit test. Make the circles and lines ko.observables so their color can be updated individually instead of going through all of them when updating colors. Use Bootstrap to make it friendly for different screen sizes and devices. 