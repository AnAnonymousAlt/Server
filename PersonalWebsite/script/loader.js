var inpreview = false;

window.onload = function() {
  var url = '/resource/resume.pdf';
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/script/pdf.worker.js';
  // load thumbanil
  var loadingTask = pdfjsLib.getDocument(url);
  loadingTask.promise.then(function(pdf) {
    pdf.getPage(1).then(function(page) {
      var viewport = page.getViewport({scale: 0.3 });
      var canvas = document.getElementById('resume-canvas');
      var context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      var renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      page.render(renderContext);
    });
  });

  // initialize preview div
  document.getElementById("previewdiv").style.cssText = "display: none; float: left; background-color: blue; width: 1000";
  // load preview
  loadingTask = pdfjsLib.getDocument(url);
  loadingTask.promise.then(function(pdf) {
    pdf.getPage(1).then(function(page) {
      var viewport = page.getViewport({scale: 1.5 });
      var canvas = document.getElementById('previewcanvas');
      var context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      var renderContext = {
      canvasContext: context,
      viewport: viewport,
      };
      page.render(renderContext);
    });
  });
  inpreview = false;

  // get intro text file
  fetch("/text/introduction.txt")
  .then(response => response.text())
  .then((data) => {
    var introtext = data.split("\n");
    var i = 0;
    while (i < introtext.length) {
      var node = document.createElement("P");
      if (i == 0) {
        node.style.cssText = "font-size: 20px;"
      }
      node.textContent = introtext[i];
      document.getElementById("introtextdiv").appendChild(node);
      i++;
    }
  });

  // load projects
  fetch("/text/projects.txt")
  .then(response => response.text())
  .then((data) => {
    var introtext = data.split("\n");
    var i = 0;
    var newproj = true;
    var pnode = document.createElement("P");
    pnode.style.cssText = "text-indent: 20px;";
    newproj = false;
    var pi = 0; // project i
    var div = document.getElementById("projecttextdiv");
    // read text
    while (i < introtext.length) {
      // end of a project
      if (introtext[i] == "") {
        pi = 0;
        i++;
        div.appendChild(pnode);
        div.appendChild(this.document.createElement("br"));
        continue;
      }
      // new paragraph
      if (pi == 0) {
        pnode = document.createElement("P");
        pnode.style.cssText = "text-indent: 20px;";
      }
      var linenode; // new line
      // link
      if (introtext[i].includes("http")) {
        linenode = this.document.createElement("a");
        linenode.href = introtext[i];
        linenode.text = introtext[i];
        pi++, i++;
        div.appendChild(linenode);
        div.appendChild(this.document.createElement("br"));
        continue;
      }
      // text
      else linenode = this.document.createElement("span");
      if (pi == 0) // name of project
        linenode.style.cssText = "font-size: 20px;"
      linenode.textContent = introtext[i];
      div.appendChild(linenode);
      div.appendChild(this.document.createElement("br"));
      pi++, i++;
    }
  });
  document.getElementById("previewtext").style.cssText = "color: blue;    text-decoration: underline;";
}// onload end

// preview button
var hidestyle = "display: none; float: left; background-color: white; width: 1000; height: 1000; font-size: 20px;";
var showstyle = "display: block; float: left; background-color: white; width: 1000; height: 1000; font-size: 20px;";

function previewfunc() {
  if (inpreview) {
    document.getElementById("previewdiv").style.cssText = hidestyle;
    document.getElementById("resume-canvas").style.cssText = "";
    document.getElementById("previewtext").innerHTML = "preview";
    document.getElementById("previewtext").style.cssText = "color: blue;    text-decoration: underline;";
    inpreview = false;
  }
  else {
    document.getElementById("previewdiv").style.cssText = showstyle;
    document.getElementById("resume-canvas").style.cssText = "display: none;";
    document.getElementById("previewtext").innerHTML = "cancel";
    document.getElementById("previewtext").style.cssText = "color: blue;    text-decoration: underline;";
    inpreview = true;
  }
}
