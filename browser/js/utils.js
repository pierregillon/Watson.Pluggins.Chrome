function highlight(range, color) {
    var span = document.createElement('SPAN');
    span.appendChild(range.extractContents());
    span.style.background = color;
    range.insertNode(span);
}