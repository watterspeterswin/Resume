function printSection(SectionID) 
{
	var printContents = document.getElementById(SectionID).innerHTML;
	var originalContents = document.body.innerHTML;
	document.body.innerHTML = printContents;
	window.print();
	document.body.innerHTML = originalContents;
}