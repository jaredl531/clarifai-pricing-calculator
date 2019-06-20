// Hard-coded values based on Clarifai's pricing model
var clarifaiPricing = {
	"freeImages": 10000,
	"freeOps": 5000,
	"freeConcepts": 10,
	"regularOpCost": 0.0012,
	"customOpCost": 0.0032,
	"conceptCost": 0.46,
	"inputCost": 0.0008
}


/* Function to update costs dynamically
	Args:
		None
*/
function updateCosts() {
	var monthlyPublicCalls, monthlyCustomCalls, monthlyCustomConcepts, monthlyCustomImages, monthlySearchCalls, monthlySearchImages;
	var totalImages, totalOperations, totalConcepts;
	var monthlyPaidPublicCalls, monthlyPaidSearchCalls, monthlyPaidCustomCalls, monthlyPaidConcepts;
	var monthlyCost = 0;
	
	// First make sure DIVs are displayed, otherwise those fields should say zero

	// PUBLIC PREDICTS
	if(document.getElementById("PublicPredictFields").style.display == "block") {
		monthlyPublicCalls = getNumWithoutCommas(document.getElementById("monthlyPublicCalls").value);
	}
	else {
		monthlyPublicCalls = 0;
	}
	
	// CUSTOM TRAINING
	if(document.getElementById("CustomTrainingFields").style.display == "block") {
		monthlyCustomCalls = getNumWithoutCommas(document.getElementById("monthlyCustomCalls").value);
		monthlyCustomConcepts = getNumWithoutCommas(document.getElementById("monthlyCustomConcepts").value);
		monthlyCustomImages = getNumWithoutCommas(document.getElementById("monthlyCustomImages").value);
	}
	else {
		monthlyCustomCalls = 0;
		monthlyCustomConcepts = 0;
		monthlyCustomImages = 0;
	}
	
  // VISUAL SEARCH
	if(document.getElementById("VisualSearchFields").style.display == "block") {
		monthlySearchCalls = getNumWithoutCommas(document.getElementById("monthlySearchCalls").value);
		monthlySearchImages = getNumWithoutCommas(document.getElementById("monthlySearchImages").value);
	}
	else {
		monthlySearchCalls = 0;
		monthlySearchImages = 0;
	}	
	
	
	// Now do all the fun Math!
	
	// INPUTS
	totalImages = monthlyCustomImages + monthlySearchImages;
	
	// Operations
	if(totalImages > clarifaiPricing["freeOps"]) {
		document.getElementById("TotalImageFreeUploads").innerHTML = formatWithCommas(clarifaiPricing["freeOps"]);
		document.getElementById("TotalImagePaidUploads").innerHTML = formatWithCommas(totalImages - clarifaiPricing["freeOps"]);
		document.getElementById("OneTimeCostTotal").innerHTML = "$" + formatWithCommas(((totalImages - clarifaiPricing["freeOps"]) * clarifaiPricing["regularOpCost"]).toFixed(2));
		formatRow("TotalImagePaidUploads", "highlight");
	}
	else {
		document.getElementById("TotalImageFreeUploads").innerHTML = formatWithCommas(totalImages);
		document.getElementById("TotalImagePaidUploads").innerHTML = 0;
		document.getElementById("OneTimeCostTotal").innerHTML = "$0.00";
		formatRow("TotalImagePaidUploads", "clear");
	}
	
	// Storage
	
	if(totalImages > clarifaiPricing["freeImages"]) {
		document.getElementById("MonthlyImagesFreeSmall").innerHTML = formatWithCommas(clarifaiPricing["freeImages"]);
		document.getElementById("MonthlyImagesPaidSmall").innerHTML = formatWithCommas(totalImages - clarifaiPricing["freeImages"]);
		monthlyCost += ((totalImages - clarifaiPricing["freeImages"]) * clarifaiPricing["inputCost"]);
		formatRow("MonthlyImagesPaidSmall", "highlight");
	}
	else {
		document.getElementById("MonthlyImagesFreeSmall").innerHTML = formatWithCommas(totalImages);
		document.getElementById("MonthlyImagesPaidSmall").innerHTML = 0;
		formatRow("MonthlyImagesPaidSmall", "clear");
	}
	
	// OPERATIONS
	totalOperations = monthlyPublicCalls + monthlyCustomCalls + monthlySearchCalls;
	
	if(totalOperations > clarifaiPricing["freeOps"]) {
	  totalPaidOperations = totalOperations - clarifaiPricing["freeOps"];
	  	
		document.getElementById("MonthlyOperationsFreeSmall").innerHTML = formatWithCommas(clarifaiPricing["freeOps"]);
		
		// Public Predictions first
		if(monthlyPublicCalls > clarifaiPricing["freeOps"]) {
			monthlyPaidPublicCalls = monthlyPublicCalls - clarifaiPricing["freeOps"];
		}
		else {
			if(monthlyPublicCalls >= totalPaidOperations)
				monthlyPaidPublicCalls = monthlyPublicCalls - totalPaidOperations;
			else
				monthlyPaidPublicCalls = monthlyPublicCalls;
		}
		
		document.getElementById("MonthlyPredictPaidSmall").innerHTML = formatWithCommas(monthlyPaidPublicCalls);
		monthlyCost += (monthlyPaidPublicCalls * clarifaiPricing["regularOpCost"]);
		
		// Highlighting
		if(monthlyPaidPublicCalls > 0)
			formatRow("MonthlyPredictPaidSmall", "highlight");
		else
			formatRow("MonthlyPredictPaidSmall", "clear");
		
		// Then Searches
		if(totalPaidOperations - monthlyPaidPublicCalls > 0) {
			if(monthlySearchCalls >= (totalPaidOperations - monthlyPaidPublicCalls))
				monthlyPaidSearchCalls = totalPaidOperations - monthlyPaidPublicCalls;
			else
				monthlyPaidSearchCalls = monthlySearchCalls;
				
			if(monthlyPaidSearchCalls > 0)
				formatRow("MonthlySearchPaidSmall", "highlight");
		}
		else {
			monthlyPaidSearchCalls = 0;
			formatRow("MonthlySearchPaidSmall", "clear");
		}
		
		document.getElementById("MonthlySearchPaidSmall").innerHTML = formatWithCommas(monthlyPaidSearchCalls);
		monthlyCost += (monthlyPaidSearchCalls * clarifaiPricing["regularOpCost"]);
		
		// Then Custom Predictions
		if(totalPaidOperations - monthlyPaidPublicCalls - monthlyPaidSearchCalls > 0) {
			if(monthlyCustomCalls >= (totalPaidOperations - monthlyPaidPublicCalls - monthlyPaidSearchCalls))
				monthlyPaidCustomCalls = totalPaidOperations - monthlyPaidPublicCalls - monthlyPaidSearchCalls;
			else
				monthlyPaidCustomCalls = monthlyCustomCalls;
				
			if(monthlyPaidCustomCalls > 0)
				formatRow("MonthlyCustomPredictPaidSmall", "highlight");
		}
		else {
			monthlyPaidCustomCalls = 0;
			formatRow("MonthlyCustomPredictPaidSmall", "clear");
		}
		
		document.getElementById("MonthlyCustomPredictPaidSmall").innerHTML = formatWithCommas(monthlyPaidCustomCalls);
		monthlyCost += (monthlyPaidCustomCalls * clarifaiPricing["customOpCost"]);
	}
	
	else {
		// Paid operations are zero - need to clear out all the highlighting and zero out the other numbers
		document.getElementById("MonthlyOperationsFreeSmall").innerHTML = formatWithCommas(totalOperations);
		
		document.getElementById("MonthlyPredictPaidSmall").innerHTML = 0;
		document.getElementById("MonthlyCustomPredictPaidSmall").innerHTML = 0;
		document.getElementById("MonthlySearchPaidSmall").innerHTML = 0;
		
		formatRow("MonthlyPredictPaidSmall", "clear");
		formatRow("MonthlyCustomPredictPaidSmall", "clear");
		formatRow("MonthlySearchPaidSmall", "clear");
	}
	
	// CONCEPTS
	if(monthlyCustomConcepts > clarifaiPricing["freeConcepts"]) {
		monthlyPaidConcepts = monthlyCustomConcepts - clarifaiPricing["freeConcepts"];
		
		document.getElementById("MonthlyConceptsFreeSmall").innerHTML = clarifaiPricing["freeConcepts"].toString();
		document.getElementById("MonthlyConceptsPaidSmall").innerHTML = formatWithCommas(monthlyPaidConcepts);
		monthlyCost += (monthlyPaidConcepts * clarifaiPricing["conceptCost"]);
		formatRow("MonthlyConceptsPaidSmall", "highlight");
	}
	else {
		document.getElementById("MonthlyConceptsFreeSmall").innerHTML = monthlyCustomConcepts;
		document.getElementById("MonthlyConceptsPaidSmall").innerHTML = "0";
		formatRow("MonthlyConceptsPaidSmall", "clear");
	}
	  	
	// And finally, update Monthly Cost
	document.getElementById("MonthlyCostTotal").innerHTML = "$" + formatWithCommas(monthlyCost.toFixed(2));

}


/* Helper function to highlight or make costing rows transparent
  	Args:
			id - the id of the field whose number changed
			operation - highlight or clear
*/
function formatRow(id, operation) {
	//var td_elem = document.getElementById(id).parentElement;
	
	if(operation == "highlight")
		document.getElementById(id).style.backgroundColor = "yellow";
	else if(operation == "clear")
		document.getElementById(id).style.backgroundColor = "transparent";
}


/* Helper function to remove commas from a number 

  Args:
		value - Number to be edited
	Return:
		A number without any characters
*/
function getNumWithoutCommas(value) {
	var val = value.replace(/,/g, "");
	
	if(val.toString().length > 0)
		return parseInt(val);
	else
		return 0;
}


/* Function to show or hide some fields based on an initial checkbox 

	Args:
		divField - the Div to show or hide
		checkbox - DOM checkbox that determines this
*/
function ShowHideDiv(divField, checkbox) {
	if(document.getElementById(checkbox.id).checked)
		document.getElementById(divField).style.display = "block";
	else
		document.getElementById(divField).style.display = "none";
}


/* Function to automatically add commas to a number

	Args:
		value - The value without commas
	Return:
		A numeric string with commas
*/
function formatWithCommas(value) {
	var parts = value.toString().split(".");
	parts[0] = parts[0].replace(/,/gi, ""); // remove existing commas
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	return parts.join(".");
}

