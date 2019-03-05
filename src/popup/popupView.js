export default function PopupView() {
    var self = this;

    let reportFactButton = document.getElementById('saveFakeNews');
    let noTextSelected = document.getElementById('noTextSelected');
    let selectedText = document.getElementById('selectedText');
    let fact = document.getElementById('fact');
    let source = document.getElementById('source');
    let reportButtonOriginalText = reportFactButton.textContent;

    self.onReportButtonClick = function(callback) {
        reportFactButton.onclick = callback; 
    };

    self.showFactContext = function(context) {
        selectedText.innerText = context.fact.wording;
        fact.style.display = "visible";
        noTextSelected.style.display = 'none';
        source.innerText = "Source : " + context.url.middleTrim(40);
    
        if (context.conflict) {
            showError("Your selection contains fact already reported. Please adjust you selection to new fact.");
            reportFactButton.disabled = true;
        }
        else {
            reportFactButton.disabled = false;
        }
    }
    
    self.showError = function(error) {
        document.getElementById("error").innerText = error;
    }
    
    self.showSuccess = function(message) {
        document.getElementById("success").innerText = message;
    }
    
    self.showNoSelectionInformation = function() {
        fact.style.display = "none";
        noTextSelected.style.display = 'visible';
        reportFactButton.disabled = true;
    }
    
    self.loading = function() {
        reportFactButton.textContent = "...";
        reportFactButton.disabled = true;
    }
    
    self.loaded = function() {
        reportFactButton.textContent = reportButtonOriginalText;
        reportFactButton.disabled = false;
    }
    
    self.disableReportButton = function() {
        reportFactButton.disabled = true;
    }
}