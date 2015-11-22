function printArticle() 
{
	var printContents = document.getElementsByTagName("article");
	var originalContents = document.body.innerHTML;
	document.body.innerHTML = printContents[0].innerHTML;
	window.print();
	document.body.innerHTML = originalContents;
}