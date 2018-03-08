<?php
	// VALUES FROM THE FORM
	$email		= $_REQUEST['email'];
	$fname		= $_REQUEST['fName'];
	$lname		= $_REQUEST['lName'];
	$message	= $_REQUEST['memo'];
	$guestCount	= $_REQUEST['guestCount'];
	$message = $message . "\n\nGuests coming: $guestCount";
	// ERROR & SECURITY CHECKS
	if ( ( !$email ) ||
		 ( strlen($_REQUEST['email']) > 200 ) ||
	     ( !preg_match("#^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$#", $email) )
       ) 
	{ 
		print "Error: Invalid E-Mail Address >>";
		exit; 
	} 
	if ( ( !$fname ) ||
		 ( strlen($fname) > 100 ) ||
		 ( preg_match("/[:=@\<\>]/", $fname) ) 
	   )
	{ 
		print "Error: Invalid Name"; 
		exit; 
	} 
	if ( ( !$lname ) ||
		 ( strlen($lname) > 100 ) ||
		 ( preg_match("/[:=@\<\>]/", $lname) ) 
	   )
	{ 
		print "Error: Invalid Name"; 
		exit; 
	} 
	if ( preg_match("#cc:#i", $message, $matches) )
	{ 
		print "Error: Found Invalid Header Field"; 
		exit; 
	} 
	if ( !$message )
	{
		print "Error: No Message"; 
		exit; 
	} 
	if (eregi("\r",$email) || eregi("\n",$email)){ 
		print "Error: Invalid E-Mail Address"; 
		exit; 
	} 
	if (FALSE) { 
		print "Error: You cannot send to an email address on the same domain."; 
		exit; 
	} 


	// CREATE THE EMAIL
	$headers	= "Content-Type: text/plain; charset=iso-8859-1\n";
	$headers	.= "From: $fname $lname <$email>\n";
	$recipient	= "rsvp@imanlovesdan.com";
	$subject	= "RSVP to The Wedding";
	$message	= wordwrap($message, 1024);

	// SEND THE EMAIL TO YOU
	mail($recipient, $subject, $message, $headers);

	// REDIRECT TO THE THANKS PAGE
	header("location: ../thankyou.html");
?>