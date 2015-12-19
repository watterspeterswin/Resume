/* -------------------------------------------------------
	 author: Peter Watters
	   date: 2015/12/19						 
------------------------------------------------------- */
//Constants
var ERROR_CLASS_CONST="err";

//Edit types
var regexDict = {};
regexDict["notBlank"] = /.*\S.*/;
regexDict["eMailAddress"] = /^[a-z0-9_.+-]+@[a-z0-9-]+\.[a-z0-9-.]+$/i;
regexDict["httpAddress"] = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

var errMsgDict = {};
errMsgDict["notBlank"] = "Please enter required data";
errMsgDict["eMailAddress"] = "This is not a valid email address";
errMsgDict["httpAddress"] = "This is not a valid web address";

/* ---------------------------------------------------------------------
clearAttribute(elmnt,attrib,val)
	purpose: This function removes a DOM attribute value
	 author: Peter Watters
	   date: 2015/12/19
	parameters: 
	            elmnt as domElement, element to remove attribute value
	            attrib as string, domElement attribute to remove value
				val as string, domElement attribute value to remove
	notes: 
	This is used for removing a class attribute from an element
------------------------------------------------------------------------- */
function clearAttribute(elmnt,attrib,val)
{
	var newVal = elmnt.getAttribute(attrib).replace(val,"").trim();
	elmnt.setAttribute(attrib,newVal);
}

/* ---------------------------------------------------------------------
setAttribute(elmnt,attrib,val)
	purpose: This function adds a DOM attribute value
	 author: Peter Watters
	   date: 2015/12/19
	parameters: 
	            elmnt as domElement, element to add attribute value
	            attrib as string, domElement attribute to add value
				val as string, domElement attribute value to add
	notes: 
	This is used for adding a class attribute to an element
------------------------------------------------------------------------- */
function setAttribute(elmnt,attrib,val)
{
	var curVal = elmnt.getAttribute(attrib).trim();
	//construct a regex to check to see if the attribute is already set
	var r = eval("/\\b"+val.toString()+"\\b/");
	if (r.test(curVal) == false) {
		var newVal = (curVal.length > 0) ? curVal + " " + val: val;
		elmnt.setAttribute(attrib,newVal);
	}
}

/* ---------------------------------------------------------------------
clearErr(elmnt)
	purpose: This function removes a DOM attribute value
	 author: Peter Watters
	   date: 2015/12/19
	parameters: 
	            elmnt as domElement, element to remove class 'err' value

	notes: 
	This is used for removing a class attribute 'err' from an element
------------------------------------------------------------------------- */
function clearErr(elmnt)
{
	clearAttribute(elmnt,"class",ERROR_CLASS_CONST)
}

/* ----------------------------------------------------------------------
displayErrMsg(show,msg)
	purpose: This function shows/hides an error message in
	         the form
	         
	 author: Peter Watters
	   date: 2015/12/19
	parameters: show as bool, if true display the errDisplay field
	            msg as string, message to display if show is true
	notes: errDisplay is the id of the form's error field
---------------------------------------------------------------------- */
function displayErrMsg(show,msg)
{
    var errDisp=document.getElementById("errDisplay");
	if (errDisp != null)
	{
		if (msg != null && show)
		{
			errDisp.innerHTML = msg;
		}
		var style="display:" +  ((show) ? "block;" : "none;");
		errDisp.setAttribute("style",style);
	}
}

/* -------------------------------------------------------
clearErrs()
	purpose: This function removes the error class and hides
	         the errDisplay field
	 author: Peter Watters
	   date: 2015/12/19
	parameters: None
	notes: 
------------------------------------------------------- */
function clearErrs()
{
	var errElements = document.getElementsByClassName(ERROR_CLASS_CONST);
	var len=errElements.length-1;
	// Work backward through the list. I found out the hard way that removing the class
	// from the elements screws up the list if you go forward.
	while(len > -1)
	{
		clearErr(errElements[len]);
		len--;
	}
	displayErrMsg(false,null);
}

/* ----------------------------------------------------------------------
validateField(elmnt,editType)
	purpose: This function takes the editType
		     and looks up a regular expression to 
			 use for editing the user imput.
			 If the regex test fails then it adds the 'err'
			 class to the field's parent.
			 
	 author: Peter Watters
	   date: 2015/12/19
	parameters: elmnt as domElement, input field to validate
	            editType as string, key into regexDict to find 
				a regex to use for validation
	notes: 
---------------------------------------------------------------------- */
function validateField(elmnt,editType)
{
	var retVal=true;
    var re=regexDict[editType];
	
	clearAttribute(elmnt.parentElement,"class",ERROR_CLASS_CONST);
	if (re != null && typeof(elmnt.value)=="string" ) {
		//Trim off trailing whitespace
		elmnt.value=elmnt.value.replace(/\s+$/,''); 
		if (re.test(elmnt.value)==false)
		{
			setAttribute(elmnt.parentElement,"class",ERROR_CLASS_CONST);
			retVal=false;
		}	
	}

	return retVal;
}

/* ----------------------------------------------------------------------
validateForm(ValidatedFormFields)
	purpose: This function is called when the submit button is pressed.
	         It handles all of the form validation and error highlighting
			 
	 author: Peter Watters
	   date: 2015/12/19
	parameters: This function takes a 2 dimensional array of strings. 
					-the first column is the id of the form field
					-the second column is the a key into regexDict 
				     that provides a regex to use for editing the field
	notes: puts focus on the first error it finds
---------------------------------------------------------------------- */
function validateForm(ValidatedFormFields)
{
	var retVal=true;
	var len=ValidatedFormFields.length;
	displayErrMsg(false,null);
	for (var i=0; i < len; i++)
	{   
		var e=document.getElementById(ValidatedFormFields[i][0]);
		if (e != null) 
		{
			if (false==validateField(e,ValidatedFormFields[i][1])) 
			{
				//set focus to the first field in error
				if (retVal) 
				{
					e.focus();
					var msg = errMsgDict[ValidatedFormFields[i][1]];
					if (msg == null || msg == undefined)
					{
						msg = "Please correct errors";
					}
					displayErrMsg(true,msg);
				}
				retVal=false;
			}		
		}
	}
	return retVal;
}

/* ----------------------------------------------------------------------
setOnChangeForValidatedFields(ValidatedFormFields)
	purpose: This function is called to set the onchange behavior
	         of validated fields on the form to clear the error
			 highlighting.
			 
	 author: Peter Watters
	   date: 2015/12/19
	parameters: This function takes a 2 dimensional array of strings. 
					-the first column is the id of the form field
					-the second column is the a key into regexDict 
				     that provides a regex to use for editing the field
---------------------------------------------------------------------- */
function setOnChangeForValidatedFields(ValidatedFormFields)
{
	var retVal=true;

	var len=ValidatedFormFields.length;
	
	for (var i=0; i < len; i++)
	{
		var e=document.getElementById(ValidatedFormFields[i][0]);
		if (e != null) {
			e.onchange=function() { clearErr(this.parentElement);}
		}
	}
	return retVal;
}

/* -------------------------------------------------------
printArticle()
	purpose: This function limits the printing of a page
	         to just the article.
	 author: Peter Watters
	   date: 2015/11/20
	parameters: None
	notes: 
------------------------------------------------------- */
function printArticle() 
{
	var printContents = document.getElementsByTagName("article");
	var originalContents = document.body.innerHTML;
	document.body.innerHTML = printContents[0].innerHTML;
	window.print();
	document.body.innerHTML = originalContents;
}